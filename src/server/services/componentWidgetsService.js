// 📁 /server/Services/componentWidgetsService.js
import AccessMatrix from "@/server/models/Dashboard/accessMatrixModel";
import SidebarItem from "@/server/models/Dashboard/sidebarModel";
import DynamicComponents from "@/server/models/Dashboard/dynamicComponentsModel";
import { Types } from "mongoose";

export const getComponentAccessForPathnameService = async (data) => {
  const { pathname, userId, roleId, organizationId } = data;

  if (!pathname) {
    throw new Error("Pathname is required");
  }

  if (
    !userId ||
    !Types.ObjectId.isValid(userId) ||
    !Types.ObjectId.isValid(roleId) ||
    !Types.ObjectId.isValid(organizationId)
  ) {
    throw new Error("Valid userId, roleId and organizationId are required");
  }

  // Find the sidebar/module for this pathname
  const moduleDoc = await SidebarItem.findOne({
    href: pathname,
    isDeleted: { $ne: true }
  });

  if (!moduleDoc) {
    throw new Error("No module found for this pathname");
  }

  // Try ABAC (user-specific)
  let accessMatrix = await AccessMatrix.findOne({
    userId: new Types.ObjectId(userId),
    isDeleted: { $ne: true }
  });

  // Fallback to RBAC (role + org)
  if (!accessMatrix) {
    accessMatrix = await AccessMatrix.findOne({
      userId: null,
      roleId: new Types.ObjectId(roleId),
      organizationId: new Types.ObjectId(organizationId),
      isDeleted: { $ne: true }
    });

    // Fallback to RBAC (role only)
    if (!accessMatrix) {
      accessMatrix = await AccessMatrix.findOne({
        userId: null,
        roleId: new Types.ObjectId(roleId),
        isDeleted: { $ne: true }
      });
    }
  }

  if (!accessMatrix) {
    throw new Error("No access matrix found for user");
  }

  // Check if the user has permission for this module
  const permission = accessMatrix.permissions.find(
    (perm) => perm.module.toString() === moduleDoc._id.toString()
  );

  if (!permission) {
    throw new Error("Forbidden: No access to this module");
  }

  // Fetch the full DynamicComponents documents for the component IDs
  let componentsData = [];
  if (permission.components && permission.components.length > 0) {
    componentsData = await DynamicComponents.find({
      _id: { $in: permission.components },
      isDeleted: { $ne: true }
    });
  }

  // Map to only the required fields
  const filteredComponents = componentsData.map((comp) => ({
    componentName: comp.componentName,
    description: comp.description,
    status: comp.status
  }));

  return {
    message: "Access granted",
    components: filteredComponents
  };
};
