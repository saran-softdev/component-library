import dbConnect from "@/server/lib/dbConnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/utils/authOptions";
import {
  createAccessMatrixService,
  updateAccessMatrixService,
  getAllAccessMatricesService,
  getAccessMatrixForPmsAdminService,
  getAccessPermissionsForRoleService,
  getAccessPermissionsForRoleOrNameService,
  updateAccessMatrixForAbacService
} from "@/server/services/accessMatrixService";

// Create an access matrix
export async function createAccessMatrix(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const result = await createAccessMatrixService(body);

    return NextResponse.json(
      {
        message: result.message,
        matrix: result.matrix
      },
      { status: result.status }
    );
  } catch (error) {
    console.error("❌ Create Access Matrix Error:", error);
    return NextResponse.json(
      {
        message: "Error creating/updating access matrix",
        error: error.message
      },
      { status: 500 }
    );
  }
}

//helo test

// Update an access matrix
export async function updateAccessMatrix(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const matrix = await updateAccessMatrixService(body);

    return NextResponse.json(
      {
        message: "Access matrix updated successfully",
        matrix: matrix
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Update Access Matrix Error:", error);
    return NextResponse.json(
      {
        message: "Error updating access matrix",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Update an access matrix for ABAC
export async function updateAccessMatrixForAbac(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const matrix = await updateAccessMatrixForAbacService(body);
    return NextResponse.json(
      {
        message: "ABAC access matrix updated successfully",
        matrix: matrix
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Update ABAC Access Matrix Error:", error);
    return NextResponse.json(
      {
        message: "Error updating ABAC access matrix",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get all access matrices
export async function getAllAccessMatrices() {
  await dbConnect();
  try {
    const matrices = await getAllAccessMatricesService();
    return NextResponse.json(
      {
        message: "Access matrices retrieved successfully",
        matrices
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get All Access Matrices Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving access matrices",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get all sidebar items and roles created by a PMS Admin
export async function getAccessMatrixForPmsAdmin(request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const result = await getAccessMatrixForPmsAdminService(session.user.id);

    return NextResponse.json(
      {
        message: "Roles and sidebar items retrieved successfully",
        roles: result.roles,
        sidebarItems: result.sidebarItems
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Access Matrix for PMS Admin Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving data for PMS Admin",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get all sidebar items and roles created by a Hotel Owner
export async function getAccessMatrixForHotelOwner(request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const result = await getAccessMatrixForHotelOwnerService(session.user.id);

    return NextResponse.json(
      {
        message:
          "Roles and sidebar items retrieved successfully for Hotel Owner",
        roles: result.roles,
        sidebarItems: result.sidebarItems
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Access Matrix for Hotel Owner Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving data for Hotel Owner",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get access permissions for a specific role
export async function getAccessPermissionsForRole(request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { roleId } = body;

    const result = await getAccessPermissionsForRoleService(
      roleId,
      session.user.id,
      session.user.organizationId
    );

    return NextResponse.json(
      {
        message: "Access permissions retrieved successfully for role",
        role: result.role,
        permissions: result.permissions
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Access Permissions for Role Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving access permissions for role",
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function getAccessPermissionsForRoleOrName(request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }
    const body = await request.json();
    const { roleId, userId, organizationId } = body;
    const result = await getAccessPermissionsForRoleOrNameService(
      roleId,
      userId,
      organizationId
    );
    return NextResponse.json(
      {
        message: "Access permissions retrieved successfully for user or role",
        role: result.role,
        permissions: result.permissions
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Access Permissions for User or Role Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving access permissions for user or role",
        error: error.message
      },
      { status: 500 }
    );
  }
}
