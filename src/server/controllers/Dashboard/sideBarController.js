import SidebarItem from "@/server/models/Dashboard/sidebarModel";
import dbConnect from "@/server/lib/dbConnect";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import AccessMatrix from "@/server/models/Dashboard/accessMatrixModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/utils/authOptions";

// Get all sidebar items allowed for a user (by userId or role+org fallback)
export async function getAllSidebarItemsByUser(request) {
  await dbConnect();

  try {
    console.log("Connecting to DB and fetching session...");
    const session = await getServerSession(authOptions);
    console.log("Session fetched:", JSON.stringify(session));

    if (!session || !session.user || !session.user.id) {
      console.warn("Authentication failed: Missing session or user info.");
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const roleId = session.user.roleId;
    const organizationId = session.user.organizationId;

    console.log("userId:", userId);
    console.log("roleId:", roleId);
    console.log("organizationId:", organizationId);

    console.log(
      "Validations:",
      "userId:",
      Types.ObjectId.isValid(userId),
      "roleId:",
      Types.ObjectId.isValid(roleId),
      "organizationId:",
      Types.ObjectId.isValid(organizationId)
    );

    if (
      !userId ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(roleId) ||
      !Types.ObjectId.isValid(organizationId)
    ) {
      console.error("Invalid ObjectId(s) detected.");
      return NextResponse.json(
        { message: "Valid userId, roleId and organizationId are required" },
        { status: 400 }
      );
    }

    // First try ABAC (user-specific access matrix)
    console.log("Looking for ABAC AccessMatrix (by userId)...");
    let accessMatrix = await AccessMatrix.findOne({
      userId: new Types.ObjectId(userId),
      isDeleted: { $ne: true }
    });
    console.log("ABAC result:", accessMatrix ? "Found" : "Not Found");

    // If no user-specific matrix found, try RBAC (role-based access matrix)
    if (!accessMatrix) {
      console.log("Trying fallback RBAC (by roleId + organizationId)...");

      // Enhanced query with debugging
      const rbacQuery = {
        userId: null,
        roleId: new Types.ObjectId(roleId),
        organizationId: new Types.ObjectId(organizationId),
        isDeleted: { $ne: true }
      };

      console.log("RBAC Query:", JSON.stringify(rbacQuery));

      accessMatrix = await AccessMatrix.findOne(rbacQuery);
      console.log("RBAC result:", accessMatrix ? "Found" : "Not Found");

      // If still not found, try alternative approaches
      if (!accessMatrix) {
        console.log("Trying RBAC without organizationId constraint...");

        // Try finding by roleId only (in case organizationId mismatch)
        const alternativeMatrix = await AccessMatrix.findOne({
          userId: null,
          roleId: new Types.ObjectId(roleId),
          isDeleted: { $ne: true }
        });

        if (alternativeMatrix) {
          console.log("Found alternative matrix by roleId only");
          console.log(
            "Matrix organizationId:",
            alternativeMatrix.organizationId
          );
          console.log("Session organizationId:", organizationId);

          // You can either use this matrix or log a warning about ID mismatch
          accessMatrix = alternativeMatrix;
        }
      }
    }

    if (!accessMatrix) {
      console.warn("No access matrix found for user.");

      // Log all available access matrices for debugging
      const allMatrices = await AccessMatrix.find({
        $or: [
          { userId: new Types.ObjectId(userId) },
          { roleId: new Types.ObjectId(roleId) }
        ],
        isDeleted: { $ne: true }
      }).select("userId roleId organizationId matrixType");

      console.log(
        "Available matrices for this user/role:",
        JSON.stringify(allMatrices, null, 2)
      );

      return NextResponse.json(
        {
          message: "No access matrix found for user",
          debug: {
            userId,
            roleId,
            organizationId,
            availableMatrices: allMatrices
          }
        },
        { status: 404 }
      );
    }

    // Check if permissions array exists and is valid
    if (!Array.isArray(accessMatrix.permissions)) {
      console.warn(
        "Access matrix found but permissions array is missing or invalid."
      );
      return NextResponse.json(
        {
          message: "Invalid permissions structure in access matrix",
          debug: {
            matrixId: accessMatrix._id,
            permissionsType: typeof accessMatrix.permissions,
            permissionsValue: accessMatrix.permissions
          }
        },
        { status: 500 }
      );
    }

    const allowedSidebarIds = accessMatrix.permissions
      .map((p) => p.module)
      .filter(Boolean);

    if (!allowedSidebarIds.length) {
      console.warn("User has no allowed sidebar modules.");
      return NextResponse.json(
        {
          message: "No allowed sidebar items for user",
          sidebars: [],
          debug: {
            matrixId: accessMatrix._id,
            permissionsCount: accessMatrix.permissions.length
          }
        },
        { status: 200 }
      );
    }

    console.log("Fetching allowed SidebarItem documents from DB...");
    const sidebars = await SidebarItem.find({
      _id: { $in: allowedSidebarIds.map((id) => new Types.ObjectId(id)) },
      isDeleted: { $ne: true }
    })
      .sort({ order: 1 })
      .select("sidebarName name href icon children order");

    console.log("Sidebar items found:", sidebars.length);

    const filteredSidebars = sidebars.map((item) => ({
      sidebarName: item.sidebarName,
      name: item.name,
      href: item.href,
      icon: item.icon,
      children: item.children,
      order: item.order
    }));

    console.log("Filtered sidebars ready to send:", filteredSidebars.length);

    return NextResponse.json(
      {
        message: "Allowed sidebars for user retrieved successfully",
        sidebars: filteredSidebars,
        debug: {
          matrixType: accessMatrix.matrixType,
          matrixId: accessMatrix._id,
          totalPermissions: accessMatrix.permissions.length,
          allowedModules: allowedSidebarIds.length
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getAllSidebarItemsByUser:", error);
    return NextResponse.json(
      {
        message: "Error retrieving allowed sidebars for user",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Create a new sidebar
export async function createSidebarItem(request) {
  await dbConnect();

  try {
    // Read the JSON data from the request body
    const body = await request.json();
    const { sidebarName, name, href, icon, children, order } = body;

    // Validate that all required fields are provided
    if (!sidebarName || !name || !href) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: sidebarName, name and href are required."
        },
        { status: 400 }
      );
    }

    // Validate children items if they exist
    if (children && Array.isArray(children)) {
      for (const child of children) {
        if (!child.name || !child.href) {
          return NextResponse.json(
            {
              message: "Each child item must have name and href fields."
            },
            { status: 400 }
          );
        }
      }
    }

    // Create a new SidebarItem document
    const newSidebarItem = new SidebarItem({
      sidebarName,
      name,
      href,
      icon,
      children,
      order: order !== undefined ? order : 0
    });

    const savedSidebarItem = await newSidebarItem.save();

    return NextResponse.json(
      {
        message: "Sidebar created successfully",
        sidebar: savedSidebarItem
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Error:", error);
    return NextResponse.json(
      {
        message: "Error creating sidebar",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get all sidebars, sorted by 'order' ascending
export async function getAllSidebarItems(request) {
  await dbConnect();

  try {
    // Sort by 'order' ascending
    const sidebars = await SidebarItem.find({ isDeleted: { $ne: true } }).sort({
      order: 1
    });

    return NextResponse.json(
      {
        message: "Sidebars retrieved successfully",
        sidebars
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get All Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving sidebars",
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function getAllSidebarItemsNoFilter(request) {
  await dbConnect();

  try {
    // This bypasses the pre-hook filter by explicitly querying all records
    const sidebars = await SidebarItem.find({}).sort({ order: 1 });

    return NextResponse.json(
      {
        message: "All sidebars retrieved (including deleted)",
        sidebars
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get All (No Filter) Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving all sidebars",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get a specific sidebar by ID
export async function getSidebarItemById(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid sidebar ID is required" },
        { status: 400 }
      );
    }

    const sidebar = await SidebarItem.findById(id);

    if (!sidebar) {
      return NextResponse.json(
        { message: "Sidebar not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Sidebar retrieved successfully",
        sidebar
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get By ID Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving sidebar",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Update a sidebar
export async function updateSidebarItem(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { id, sidebarName, name, href, icon, children, order } = body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid sidebar ID is required" },
        { status: 400 }
      );
    }

    const updateData = {};
    if (sidebarName) updateData.sidebarName = sidebarName;
    if (name) updateData.name = name;
    if (href) updateData.href = href;
    if (icon !== undefined) updateData.icon = icon;
    if (children !== undefined) updateData.children = children;
    if (order !== undefined) updateData.order = order;

    const updatedSidebar = await SidebarItem.findByIdAndUpdate(id, updateData, {
      new: true
    });

    if (!updatedSidebar) {
      return NextResponse.json(
        { message: "Sidebar not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Sidebar updated successfully",
        sidebar: updatedSidebar
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json(
      {
        message: "Error updating sidebar",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Add a child item to a sidebar
export async function addChildItem(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { id, child } = body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid sidebar ID is required" },
        { status: 400 }
      );
    }

    if (!child || !child.name || !child.href) {
      return NextResponse.json(
        { message: "Child item must have name and href fields" },
        { status: 400 }
      );
    }

    const sidebar = await SidebarItem.findById(id);
    if (!sidebar) {
      return NextResponse.json(
        { message: "Sidebar not found" },
        { status: 404 }
      );
    }

    // Initialize children array if it doesn't exist
    if (!sidebar.children) {
      sidebar.children = [];
    }

    sidebar.children.push(child);
    const updatedSidebar = await sidebar.save();

    return NextResponse.json(
      {
        message: "Child item added to sidebar successfully",
        sidebar: updatedSidebar
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Add Child Error:", error);
    return NextResponse.json(
      {
        message: "Error adding child item to sidebar",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Update a specific child item in the sidebar
export async function updateChildItem(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { id, childId, updatedChild } = body;

    if (!id || !Types.ObjectId.isValid(id) || !childId) {
      return NextResponse.json(
        { message: "Valid sidebar ID and childId are required" },
        { status: 400 }
      );
    }

    const sidebar = await SidebarItem.findById(id);
    if (!sidebar) {
      return NextResponse.json(
        { message: "Sidebar not found" },
        { status: 404 }
      );
    }

    // Check if children array exists
    if (!sidebar.children || !Array.isArray(sidebar.children)) {
      return NextResponse.json(
        { message: "No children items found in this sidebar" },
        { status: 404 }
      );
    }

    // Find the child index in the array
    const childIndex = sidebar.children.findIndex(
      (child) => child._id.toString() === childId
    );

    if (childIndex === -1) {
      return NextResponse.json(
        { message: "Child item not found in sidebar" },
        { status: 404 }
      );
    }

    // Update the child
    if (updatedChild.name)
      sidebar.children[childIndex].name = updatedChild.name;
    if (updatedChild.href)
      sidebar.children[childIndex].href = updatedChild.href;

    const updatedSidebar = await sidebar.save();

    return NextResponse.json(
      {
        message: "Sidebar child item updated successfully",
        sidebar: updatedSidebar
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Child Error:", error);
    return NextResponse.json(
      {
        message: "Error updating sidebar child item",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Soft delete a sidebar
export async function softDeleteSidebarItem(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { id, userId } = body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid sidebar ID is required" },
        { status: 400 }
      );
    }

    const sidebar = await SidebarItem.findById(id);
    if (!sidebar) {
      return NextResponse.json(
        { message: "Sidebar not found" },
        { status: 404 }
      );
    }

    // Apply soft delete
    sidebar.isDeleted = true;
    sidebar.deletedAt = new Date();
    sidebar.deletedBy = userId || null;

    const updatedSidebar = await sidebar.save();

    return NextResponse.json(
      {
        message: "Sidebar deleted successfully",
        sidebar: updatedSidebar
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Soft Delete Error:", error);
    return NextResponse.json(
      {
        message: "Error deleting sidebar",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Restore a soft deleted sidebar
export async function restoreSidebarItem(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { id } = body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid sidebar ID is required" },
        { status: 400 }
      );
    }

    const sidebar = await SidebarItem.findOne({ _id: id, isDeleted: true });
    if (!sidebar) {
      return NextResponse.json(
        { message: "Deleted sidebar not found" },
        { status: 404 }
      );
    }

    // Restore the sidebar
    sidebar.isDeleted = false;
    sidebar.deletedAt = null;
    sidebar.deletedBy = null;

    const updatedSidebar = await sidebar.save();

    return NextResponse.json(
      {
        message: "Sidebar restored successfully",
        sidebar: updatedSidebar
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Restore Error:", error);
    return NextResponse.json(
      {
        message: "Error restoring sidebar",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get all soft deleted sidebars
export async function getDeletedSidebarItems() {
  await dbConnect();

  try {
    // Find all soft deleted sidebars
    const sidebars = await SidebarItem.find({
      isDeleted: true
    });

    return NextResponse.json(
      {
        message: "Deleted sidebars retrieved successfully",
        sidebars
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Deleted Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving deleted sidebars",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Hard delete a sidebar (use with caution)
export async function hardDeleteSidebarItem(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { id } = body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid sidebar ID is required" },
        { status: 400 }
      );
    }

    const result = await SidebarItem.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { message: "Sidebar not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Sidebar permanently deleted"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Hard Delete Error:", error);
    return NextResponse.json(
      {
        message: "Error permanently deleting sidebar",
        error: error.message
      },
      { status: 500 }
    );
  }
}
