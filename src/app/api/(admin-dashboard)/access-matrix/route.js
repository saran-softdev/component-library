import {
  createAccessMatrix,
  updateAccessMatrix,
  getAccessMatrixForPmsAdmin,
  getAccessPermissionsForRole,
  getAccessPermissionsForRoleOrName,
  updateAccessMatrixForAbac,
} from "@/server/Controllers/Dashboard/AccessMatrixController";
import dbConnect from "@/server/lib/dbConnect";

import { NextResponse } from "next/server";

// GET: Fetch organizations, single organization, or deleted organizations
export async function GET(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
    case "getAccessMatrixForPmsAdmin":
      return await getAccessMatrixForPmsAdmin(request);
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
    case "createAccessMatrix":
      return await createAccessMatrix(request);
    case "updateAccessMatrix":
      return await updateAccessMatrix(request);
    case "updateAccessMatrixForAbac":
      return await updateAccessMatrixForAbac(request);
    case "getAccessPermissionsForRole":
      return await getAccessPermissionsForRole(request);
    case "getAccessPermissionsForRoleOrName":
      return await getAccessPermissionsForRoleOrName(request);
    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}
