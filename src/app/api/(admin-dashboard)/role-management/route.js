import dbConnect from "@/server/lib/dbConnect";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  softDeleteRole,
  restoreRole,
  getDeletedRoles,
  hardDeleteRole,
  getRolesByCurrentUser,
} from "@/server/Controllers/Dashboard/roleController";
import { NextResponse } from "next/server";

// GET: Fetch roles, single role, or deleted roles
export async function GET(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
    case "getAllRoles":
      return await getAllRoles(request);
    case "getRolesByCurrentUser":
      return await getRolesByCurrentUser(request);
    case "getRoleById":
      return await getRoleById(request, {
        params: { id: url.searchParams.get("id") },
      });
    case "getDeletedRoles":
      return await getDeletedRoles(request);
    case "getRolesByCurrentUser":
      return await getRolesByCurrentUser(request);
    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}

// POST: Create a role or restore a deleted role or hard delete
export async function POST(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
    case "createRole":
      return await createRole(request);
    case "restoreRole":
      return await restoreRole(request);
    case "hardDeleteRole":
      return await hardDeleteRole(request);
    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}

// PUT: Update a role or soft delete
export async function PUT(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
    case "updateRole":
      return await updateRole(request);
    case "softDeleteRole":
      return await softDeleteRole(request);
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
