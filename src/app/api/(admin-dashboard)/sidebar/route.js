import {
  getAllSidebarItemsByUser,
  getAllSidebarItems,
  getSidebarItemById,
  updateSidebarItem,
  softDeleteSidebarItem,
  restoreSidebarItem,
  getDeletedSidebarItems,
  hardDeleteSidebarItem,
  addChildItem,
  updateChildItem,
  getAllSidebarItemsNoFilter,
  createSidebarItem
} from "@/server/controllers/Dashboard/sideBarController";
import dbConnect from "@/server/lib/dbConnect";

export async function GET(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  // // Get the allowed roles for this action
  // const allowedRoles = SIDEBAR_PERMISSIONS[action] || ["pmsAdmin"];

  // // Check if user has the required role
  // const roleCheck = await checkRole(allowedRoles)(request);
  // if (!roleCheck.success) {
  //   return roleCheck.response;
  // }

  // If authorized, proceed with the action
  switch (action) {
    case "getAllSidebarItems":
      return await getAllSidebarItems();
    case "getAllSidebarItemsNoFilter":
      return await getAllSidebarItemsNoFilter();
    case "getAllSidebarItemsByUser":
      return await getAllSidebarItemsByUser(request);
    case "getSidebarItemById":
      return await getSidebarItemById(request, {
        params: { id: url.searchParams.get("id") }
      });
    case "getDeletedSidebarItems":
      return await getDeletedSidebarItems();
    default:
      return new Response("Invalid action", { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  // Get the allowed roles for this action
  // const allowedRoles = SIDEBAR_PERMISSIONS[action] || ["pmsAdmin"];

  // Check if user has the required role
  // const roleCheck = await checkRole(allowedRoles)(request);
  // if (!roleCheck.success) {
  //   return roleCheck.response;
  // }

  // If authorized, proceed with the action
  switch (action) {
    case "createSidebarItem":
      return await createSidebarItem(request);
    case "addChildItem":
      return await addChildItem(request);
    case "restoreSidebarItem":
      return await restoreSidebarItem(request);
    case "hardDeleteSidebarItem":
      return await hardDeleteSidebarItem(request);
    default:
      return new Response("Invalid action", { status: 400 });
  }
}

export async function PUT(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  // Get the allowed roles for this action
  const allowedRoles = SIDEBAR_PERMISSIONS[action] || ["pmsAdmin"];

  // Check if user has the required role
  const roleCheck = await checkRole(allowedRoles)(request);
  if (!roleCheck.success) {
    return roleCheck.response;
  }

  // If authorized, proceed with the action
  switch (action) {
    case "updateSidebarItem":
      return await updateSidebarItem(request);
    case "updateChildItem":
      return await updateChildItem(request);
    case "softDeleteSidebarItem":
      return await softDeleteSidebarItem(request);
    default:
      return new Response("Invalid action", { status: 400 });
  }
}

export async function DELETE(request) {
  await dbConnect();

  const url = new URL(request.url);
  const action = url.searchParams.get("controllerName");

  // For DELETE, only allow pmsAdmin by default
  const roleCheck = await checkRole(["pmsAdmin"])(request);
  if (!roleCheck.success) {
    return roleCheck.response;
  }

  // No specific sidebar delete actions needed as we use softDelete/hardDelete via POST/PUT
  return new Response("Invalid action", { status: 400 });
}
