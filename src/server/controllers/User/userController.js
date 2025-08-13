import {
  createUserByPmsAdminService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  softDeleteUserService,
  restoreUserService,
  getDeletedUsersService,
  hardDeleteUserService,
  getAllStaffsForHotelOwnerService,
  createStaffForHotelOwnerService,
  getStaffByNameService,
  userManagementSoftDeleteUserService,
  userManagementRestoreUserService,
  userManagementGetDeletedUsersService,
  userManagementHardDeleteUserService
} from "@/server/services/userService";

import { getServerSession } from "next-auth";
import { authOptions } from "@/server/utils/authOptions";
import { NextResponse } from "next/server";

export async function getStaffByName(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized access - No session" },
        { status: 401 }
      );
    }

    const { organizationId } = session.user;
    if (!organizationId) {
      return NextResponse.json(
        { message: "Missing organizationId" },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const search = url.searchParams.get("staff-name");

    if (!search) {
      return NextResponse.json(
        { message: "Search term is required" },
        { status: 400 }
      );
    }

    const users = await getStaffByNameService(organizationId, search);
    return NextResponse.json(
      { message: "Users fetched successfully", users },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to search staff", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ Create User
export async function createUserByPmsAdmin(request) {
  try {
    console.log("createUserByPmsAdmin Controller");

    const body = await request.json();
    const user = await createUserByPmsAdminService(body);
    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create user", error: error.message },
      { status: 400 }
    );
  }
}

// ✅ Create Staff for Hotel Owner
export async function createStaffForHotelOwner(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized access - No session" },
        { status: 401 }
      );
    }

    console.log("session", session);
    const { organizationId, id: createdBy } = session.user;
    if (!organizationId) {
      return NextResponse.json(
        { message: "Missing organizationId for hotel-owner" },
        { status: 400 }
      );
    }
    const body = await request.json();
    const user = await createStaffForHotelOwnerService(
      body,
      organizationId,
      createdBy
    );
    return NextResponse.json(
      { message: "Staff created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create staff", error: error.message },
      { status: 400 }
    );
  }
}

// ✅ Get All Users for Hotel Owner
export async function getAllStaffsForHotelOwner(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized access - No session" },
        { status: 401 }
      );
    }
    const { organizationId } = session.user;
    if (!organizationId) {
      return NextResponse.json(
        { message: "Missing organizationId for hotel-owner" },
        { status: 400 }
      );
    }
    const users = await getAllStaffsForHotelOwnerService(organizationId);
    return NextResponse.json(
      { message: "Hotel owner users retrieved successfully", users },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get hotel owner users", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get All Users
export async function getAllUsers(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized access - No session" },
        { status: 401 }
      );
    }

    const sessionUserId = session.user.id;
    // Only fetch users created by the session user
    const users = await getAllUsersService(sessionUserId);
    return NextResponse.json(
      { message: "Users retrieved successfully", users },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get users", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get User By ID
export async function getUserById(request, { params }) {
  try {
    const { id } = params;
    const user = await getUserByIdService(id);
    return NextResponse.json(
      { message: "User retrieved successfully", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get user", error: error.message },
      { status: error.message === "User not found" ? 404 : 400 }
    );
  }
}

// ✅ Update User
export async function updateUser(request) {
  try {
    const body = await request.json();
    const { id, updatedBy, ...updateData } = body;
    const user = await updateUserService(id, updateData, updatedBy);
    return NextResponse.json(
      { message: "User updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update user", error: error.message },
      { status: 400 }
    );
  }
}

// ✅ Soft Delete User
export async function softDeleteUser(request) {
  try {
    const body = await request.json();
    const { id, deletedBy } = body;
    const user = await softDeleteUserService(id, deletedBy);
    return NextResponse.json(
      { message: "User deleted successfully", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete user", error: error.message },
      { status: 400 }
    );
  }
}

// ✅ Restore User
export async function restoreUser(request) {
  try {
    const body = await request.json();
    const { id, restoredBy } = body;
    const user = await restoreUserService(id, restoredBy);
    return NextResponse.json(
      { message: "User restored successfully", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to restore user", error: error.message },
      { status: error.message === "Deleted user not found" ? 404 : 400 }
    );
  }
}

// ✅ Get Deleted Users
export async function getDeletedUsers(request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionOrgId = session?.user?.organizationId;
    const url = new URL(request.url);
    const queryOrgId = url.searchParams.get("organizationId");
    const orgId = queryOrgId || sessionOrgId;

    const users = await getDeletedUsersService(orgId);
    return NextResponse.json(
      { message: "Deleted users retrieved successfully", users },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get deleted users", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ Hard Delete User
export async function hardDeleteUser(request) {
  try {
    const body = await request.json();
    const { id } = body;
    await hardDeleteUserService(id);
    return NextResponse.json(
      { message: "User permanently deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to permanently delete user", error: error.message },
      { status: 400 }
    );
  }
}

// ✅ Soft Delete User
export async function userManagementSoftDeleteUser(request) {
  try {
    const body = await request.json();
    const { id, deletedBy } = body;

    const user = await userManagementSoftDeleteUserService(id, deletedBy);
    return NextResponse.json(
      { message: "User deleted successfully", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete user", error: error.message },
      { status: 400 }
    );
  }
}

// ✅ Restore User
export async function userManagementRestoreUser(request) {
  try {
    const body = await request.json();
    const { id, restoredBy } = body;

    const user = await userManagementRestoreUserService(id, restoredBy);
    return NextResponse.json(
      { message: "User restored successfully", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to restore user", error: error.message },
      { status: error.message === "Deleted user not found" ? 404 : 400 }
    );
  }
}

// ✅ Get Deleted Users (no org filter)
export async function userManagementGetDeletedUsers() {
  try {
    const users = await userManagementGetDeletedUsersService();
    return NextResponse.json(
      { message: "Deleted users retrieved successfully", users },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get deleted users", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ Hard Delete User
export async function userManagementHardDeleteUser(request) {
  try {
    const body = await request.json();
    const { id } = body;

    await userManagementHardDeleteUserService(id);
    return NextResponse.json(
      { message: "User permanently deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to permanently delete user", error: error.message },
      { status: 400 }
    );
  }
}
