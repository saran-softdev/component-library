import {
  createUserByPmsAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  restoreUser,
  getDeletedUsers,
  hardDeleteUser,
  createStaffForHotelOwner,
  getStaffByName,
  getAllStaffsForHotelOwner,
  userManagementGetDeletedUsers,
  userManagementSoftDeleteUser,
  userManagementHardDeleteUser,
  userManagementRestoreUser
} from "@/server/controllers/User/userController";
import dbConnect from "@/server/lib/dbConnect";
import { NextResponse } from "next/server";

// GET: Fetch users, single user, or deleted users
export async function GET(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
    case "getAllUsers":
      return await getAllUsers(request);
    case "getStaffByName":
      return await getStaffByName(request);
    case "getAllStaffsForHotelOwner":
      return await getAllStaffsForHotelOwner(request);
    case "getUserById":
      return await getUserById(request, {
        params: { id: url.searchParams.get("id") }
      });
    case "getDeletedUsers":
      return await getDeletedUsers(request);
    case "userManagementGetDeletedUsers":
      return await userManagementGetDeletedUsers(request);
    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}

// POST: Create a user or restore a deleted user or hard delete
export async function POST(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
    case "createUserByPmsAdmin":
      return await createUserByPmsAdmin(request);
    case "createStaffForHotelOwner":
      return await createStaffForHotelOwner(request);
    case "restoreUser":
      return await restoreUser(request);
    case "hardDeleteUser":
      return await hardDeleteUser(request);
    case "userManagementRestoreUser":
      return await userManagementRestoreUser(request);
    case "userManagementHardDeleteUser":
      return await userManagementHardDeleteUser(request);
    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}

// PUT: Update a user or soft delete
export async function PUT(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
    case "updateUser":
      return await updateUser(request);
    case "softDeleteUser":
      return await softDeleteUser(request);
    case "userManagementSoftDeleteUser":
      return await userManagementSoftDeleteUser(request);
    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}

// DELETE: Not used, as soft/hard delete is handled via POST/PUT
export async function DELETE(request) {
  await dbConnect();

  // Only allow pmsAdmin by default
  // const roleCheck = await checkRole(["pmsAdmin"])(request);
  // if (!roleCheck.success) {
  //   return roleCheck.response;
  // }

  // No direct delete action
  return new Response("Invalid action", { status: 400 });
}
