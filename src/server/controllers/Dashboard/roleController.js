import Role from "@/server/models/roleModel";
import dbConnect from "@/server/lib/dbConnect";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/server/utils/authOptions";

// Create a new role
export async function createRole(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);
    const { roleName } = body;
    console.log("session", session);

    // Validate required field
    if (!roleName) {
      return NextResponse.json(
        { message: "Missing required field: roleName is required." },
        { status: 400 }
      );
    }

    const existingRole = await Role.findOne({ roleName });

    if (existingRole) {
      return NextResponse.json(
        { message: "Role already exists" },
        { status: 409 }
      );
    }

    // Create new role with optional organizationId
    const newRole = new Role({
      roleName,
      createdBy: session?.user?.id || null
    });

    const savedRole = await newRole.save();

    return NextResponse.json(
      {
        message: "Role created successfully",
        role: savedRole
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Role Error:", error);
    return NextResponse.json(
      {
        message: "Error creating role",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get all roles
export async function getAllRoles(request) {
  await dbConnect();

  try {
    const roles = await Role.find();

    return NextResponse.json(
      {
        message: "Roles retrieved successfully",
        roles
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get All Roles Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving roles",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get roles created by the current session user
export async function getRolesByCurrentUser(request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find roles where createdBy matches the session user id
    const roles = await Role.find({ createdBy: session.user.id });

    return NextResponse.json(
      {
        message: "Roles retrieved successfully",
        roles
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Roles By Current User Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving roles",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get a specific role by ID
export async function getRoleById(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid role ID is required" },
        { status: 400 }
      );
    }

    const role = await Role.findById(id);

    if (!role) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Role retrieved successfully",
        role
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Role By ID Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving role",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Update a role
export async function updateRole(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);
    const { id, roleName } = body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid role ID is required" },
        { status: 400 }
      );
    }

    const updateData = {};
    if (roleName) updateData.roleName = roleName;
    if (session?.user?.id) updateData.updatedBy = session.user.id;

    const updatedRole = await Role.findByIdAndUpdate(id, updateData, {
      new: true
    });

    if (!updatedRole) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Role updated successfully",
        role: updatedRole
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Role Error:", error);
    return NextResponse.json(
      {
        message: "Error updating role",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Soft delete a role
export async function softDeleteRole(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);
    const { id } = body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid role ID is required" },
        { status: 400 }
      );
    }

    const role = await Role.findById(id);

    if (!role) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    // Apply soft delete
    const updatedRole = await Role.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: session?.user?.id || null
      },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "Role deleted successfully",
        role: updatedRole
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Soft Delete Role Error:", error);
    return NextResponse.json(
      {
        message: "Error deleting role",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Restore a soft deleted role
export async function restoreRole(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);
    const { id } = body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid role ID is required" },
        { status: 400 }
      );
    }

    // Use the static method we added to the model to properly restore the role
    const restoredRole = await Role.restoreRole(id, session?.user?.id || null);

    if (!restoredRole) {
      return NextResponse.json(
        { message: "Deleted role not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Role restored successfully",
        role: restoredRole
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Restore Role Error:", error);
    return NextResponse.json(
      {
        message: "Error restoring role",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get all deleted roles
export async function getDeletedRoles(request) {
  await dbConnect();

  try {
    // Explicitly query for deleted roles
    const deletedRoles = await Role.find({ isDeleted: true });

    return NextResponse.json(
      {
        message: "Deleted roles retrieved successfully",
        roles: deletedRoles
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Deleted Roles Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving deleted roles",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Hard delete a role (use with caution)
export async function hardDeleteRole(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { id } = body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid role ID is required" },
        { status: 400 }
      );
    }

    const result = await Role.hardDelete(id);

    if (!result) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Role permanently deleted"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Hard Delete Role Error:", error);
    return NextResponse.json(
      {
        message: "Error permanently deleting role",
        error: error.message
      },
      { status: 500 }
    );
  }
}
