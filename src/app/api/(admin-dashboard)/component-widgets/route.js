import { NextResponse } from "next/server";
import dbConnect from "@/server/lib/dbConnect";
import { getComponentAccessForPathname } from "@/server/controllers/Dashboard/componentWidgetsController";

// GET: Fetch components, single component, or specific queries
export async function GET(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  switch (action) {
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
    case "getComponentAccessForPathname":
      return await getComponentAccessForPathname(request);

    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}
