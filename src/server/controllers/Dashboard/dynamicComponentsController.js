import DynamicComponents from "../../models/Dashboard/dynamicComponentsModel";
import SidebarItem from "../../models/Dashboard/sidebarModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../utils/authOptions";
import dbConnect from "@/server/lib/dbConnect";
import { NextResponse } from "next/server";

// Create a new dynamic component
export async function createComponent(request) {
  await dbConnect();

  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Read the JSON data from the request body
    const body = await request.json();
    const { componentName, description, status, usageLocation } = body;

    // Validate required fields
    if (!componentName) {
      return NextResponse.json(
        { message: "Component name is required" },
        { status: 400 }
      );
    }

    // Check if component with same name already exists
    const existingComponent = await DynamicComponents.findOne({
      componentName,
      isDeleted: false
    });

    if (existingComponent) {
      return NextResponse.json(
        { message: "Component with this name already exists" },
        { status: 409 }
      );
    }

    // Normalize usageLocation (treat empty string as null)
    const normalizedUsageLocation = usageLocation === "" ? null : usageLocation;

    // Create new component
    const newComponent = await DynamicComponents.create({
      componentName,
      description: description || "",
      status: status || "active",
      usageLocation: normalizedUsageLocation || null,
      createdBy: session.user.id
    });

    return NextResponse.json(
      {
        message: "Component created successfully",
        component: newComponent
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Component Error:", error);
    return NextResponse.json(
      {
        message: "Error creating component",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get all dynamic components
export async function getAllComponents(request) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");

    const query = { isDeleted: false };

    // Apply status filter if provided
    if (status) {
      query.status = status;
    }

    // Apply search if provided
    if (search) {
      query.$or = [
        { componentName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const components = await DynamicComponents.find(query)
      .sort({ createdAt: -1 })
      .populate([
        { path: "createdBy", select: "name email" },
        { path: "updatedBy", select: "name email" },
        { path: "usageLocation" }
      ]);

    // Transform usageLocation to just the name (or sidebarName > name), fetch if not populated
    const transformedComponents = await Promise.all(
      components.map(async (component) => {
        let usageLocationDisplay = "-";
        const usageLocation = component.usageLocation;
        if (usageLocation) {
          if (
            typeof usageLocation === "object" &&
            (usageLocation.sidebarName || usageLocation.name)
          ) {
            if (usageLocation.sidebarName && usageLocation.name) {
              usageLocationDisplay = `${usageLocation.sidebarName} > ${usageLocation.name}`;
            } else if (usageLocation.name) {
              usageLocationDisplay = usageLocation.name;
            }
          } else if (
            typeof usageLocation === "string" ||
            typeof usageLocation === "object"
          ) {
            // If not populated, fetch from SidebarItem
            try {
              const sidebar = await SidebarItem.findById(usageLocation).lean();
              if (sidebar) {
                if (sidebar.sidebarName && sidebar.name) {
                  usageLocationDisplay = `${sidebar.sidebarName} > ${sidebar.name}`;
                } else if (sidebar.name) {
                  usageLocationDisplay = sidebar.name;
                }
              }
            } catch (e) {
              // ignore error, keep usageLocationDisplay as '-'
            }
          }
        }
        const usageLocationId =
          usageLocation && typeof usageLocation === "object"
            ? usageLocation._id || null
            : usageLocation || null;
        const obj = component.toObject();
        return {
          ...obj,
          usageLocationId,
          usageLocationDisplay
        };
      })
    );

    return NextResponse.json(
      {
        message: "Components retrieved successfully",
        count: transformedComponents.length,
        components: transformedComponents
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get All Components Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving components",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get a single dynamic component by ID
export async function getComponentById(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Component ID is required" },
        { status: 400 }
      );
    }

    const component = await DynamicComponents.findOne({
      _id: id,
      isDeleted: false
    }).populate([
      { path: "createdBy", select: "name email" },
      { path: "updatedBy", select: "name email" }
    ]);

    if (!component) {
      return NextResponse.json(
        { message: "Component not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Component retrieved successfully",
        component
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Component Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving component",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Update a dynamic component
export async function updateComponent(request, { params }) {
  await dbConnect();

  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { componentName, description, status, usageLocation } = body;
    const normalizedUsageLocation = usageLocation === "" ? null : usageLocation;

    if (!id) {
      return NextResponse.json(
        { message: "Component ID is required" },
        { status: 400 }
      );
    }

    // Check if component exists
    const existingComponent = await DynamicComponents.findOne({
      _id: id,
      isDeleted: false
    });

    if (!existingComponent) {
      return NextResponse.json(
        { message: "Component not found" },
        { status: 404 }
      );
    }

    // If changing name, check if name already exists
    if (componentName && componentName !== existingComponent.componentName) {
      const duplicateComponent = await DynamicComponents.findOne({
        componentName,
        _id: { $ne: id },
        isDeleted: false
      });

      if (duplicateComponent) {
        return NextResponse.json(
          { message: "Component with this name already exists" },
          { status: 409 }
        );
      }
    }

    // Update component
    const updatedComponent = await DynamicComponents.findByIdAndUpdate(
      id,
      {
        ...(componentName && { componentName }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(usageLocation !== undefined && {
          usageLocation: normalizedUsageLocation
        }),
        updatedBy: session.user.id
      },
      { new: true }
    ).populate([
      { path: "createdBy", select: "name email" },
      { path: "updatedBy", select: "name email" }
    ]);

    return NextResponse.json(
      {
        message: "Component updated successfully",
        component: updatedComponent
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Component Error:", error);
    return NextResponse.json(
      {
        message: "Error updating component",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Soft delete a dynamic component
export async function deleteComponent(request, { params }) {
  await dbConnect();
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Component ID is required" },
        { status: 400 }
      );
    }

    // Check if component exists
    const component = await DynamicComponents.findOne({
      _id: id,
      isDeleted: false
    });

    if (!component) {
      return NextResponse.json(
        { message: "Component not found" },
        { status: 404 }
      );
    }

    // Soft delete the component
    await DynamicComponents.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: session.user.id
    });

    return NextResponse.json(
      { message: "Component deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Component Error:", error);
    return NextResponse.json(
      {
        message: "Error deleting component",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Restore a deleted dynamic component
export async function restoreComponent(request, { params }) {
  await dbConnect();

  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Component ID is required" },
        { status: 400 }
      );
    }

    // Check if component exists and is deleted
    const component = await DynamicComponents.findOne({
      _id: id,
      isDeleted: true
    });

    if (!component) {
      return NextResponse.json(
        { message: "Deleted component not found" },
        { status: 404 }
      );
    }

    // Check if there's now a component with the same name that's not deleted
    const duplicateComponent = await DynamicComponents.findOne({
      componentName: component.componentName,
      _id: { $ne: id },
      isDeleted: false
    });

    if (duplicateComponent) {
      return NextResponse.json(
        {
          message: "Cannot restore: A component with this name already exists"
        },
        { status: 409 }
      );
    }

    // Restore the component
    const restoredComponent = await DynamicComponents.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        restoredAt: new Date(),
        restoredBy: session.user.id
      },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "Component restored successfully",
        component: restoredComponent
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Restore Component Error:", error);
    return NextResponse.json(
      {
        message: "Error restoring component",
        error: error.message
      },
      { status: 500 }
    );
  }
}
