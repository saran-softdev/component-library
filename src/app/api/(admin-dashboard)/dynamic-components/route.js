import { NextResponse } from "next/server";
import dbConnect from "@/server/lib/dbConnect";
import {
  createComponent,
  getAllComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
  restoreComponent
} from "@/server/controllers/Dashboard/dynamicComponentsController";

// GET: Fetch components, single component, or specific queries
export async function GET(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
    case "getAllComponents":
      return await getAllComponents(request);
    case "getComponentById":
      return await getComponentById(request, {
        params: { id: url.searchParams.get("id") }
      });
    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}

// POST: Create a component or restore a deleted component
export async function POST(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
    case "createComponent":
      return await createComponent(request);
    case "restoreComponent":
      return await restoreComponent(request, {
        params: { id: url.searchParams.get("id") }
      });
    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}

// PUT: Update a component
export async function PUT(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
    case "updateComponent":
      return await updateComponent(request, {
        params: { id: url.searchParams.get("id") }
      });
    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}

// DELETE: Soft delete a component
export async function DELETE(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
    case "deleteComponent":
      return await deleteComponent(request, {
        params: { id: url.searchParams.get("id") }
      });
    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}
