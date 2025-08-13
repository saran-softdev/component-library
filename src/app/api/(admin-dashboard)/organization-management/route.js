import {
  getAllOrganizations,
  createOrganization,
  getOrganizationById,
  updateOrganization,
  softDeleteOrganization,
  restoreOrganization,
  getDeletedOrganizations,
  hardDeleteOrganization
} from "@/server/controllers/Dashboard/organizationController";
import dbConnect from "@/server/lib/dbConnect";

import { NextResponse } from "next/server";

// GET: Fetch organizations, single organization, or deleted organizations
export async function GET(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
    case "getAllOrganizations":
      return await getAllOrganizations(request);
    case "getOrganizationById":
      return await getOrganizationById(request, {
        params: { id: url.searchParams.get("id") }
      });
    case "getDeletedOrganizations":
      return await getDeletedOrganizations(request);
    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}

// POST: Create an organization or restore a deleted organization or hard delete
export async function POST(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
    case "createOrganization":
      return await createOrganization(request);
    case "restoreOrganization":
      return await restoreOrganization(request);
    case "hardDeleteOrganization":
      return await hardDeleteOrganization(request);
    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}

// PUT: Update an organization or soft delete
export async function PUT(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
    case "updateOrganization":
      return await updateOrganization(request);
    case "softDeleteOrganization":
      return await softDeleteOrganization(request);
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
