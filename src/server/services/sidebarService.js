// 📁 /server/Services/sidebarService.js
import SidebarItem from "@/server/models/Dashboard/sidebarModel";
import AccessMatrix from "@/server/models/Dashboard/accessMatrixModel";
import { Types } from "mongoose";

export const getAllSidebarItemsByUserService = async (
  userId,
  roleId,
  organizationId
) => {
  if (
    !userId ||
    !Types.ObjectId.isValid(userId) ||
    !Types.ObjectId.isValid(roleId) ||
    !Types.ObjectId.isValid(organizationId)
  ) {
    throw new Error("Valid userId, roleId and organizationId are required");
  }

  // First try ABAC (user-specific access matrix)
  let accessMatrix = await AccessMatrix.findOne({
    userId: new Types.ObjectId(userId),
    isDeleted: { $ne: true }
  });

  // If no user-specific matrix found, try RBAC (role-based access matrix)
  if (!accessMatrix) {
    // Enhanced query with debugging
    const rbacQuery = {
      userId: null,
      roleId: new Types.ObjectId(roleId),
      organizationId: new Types.ObjectId(organizationId),
      isDeleted: { $ne: true }
    };

    accessMatrix = await AccessMatrix.findOne(rbacQuery);

    // If still not found, try alternative approaches
    if (!accessMatrix) {
      // Try finding by roleId only (in case organizationId mismatch)
      const alternativeMatrix = await AccessMatrix.findOne({
        userId: null,
        roleId: new Types.ObjectId(roleId),
        isDeleted: { $ne: true }
      });

      if (alternativeMatrix) {
        accessMatrix = alternativeMatrix;
      }
    }
  }

  if (!accessMatrix) {
    // Log all available access matrices for debugging
    const allMatrices = await AccessMatrix.find({
      $or: [
        { userId: new Types.ObjectId(userId) },
        { roleId: new Types.ObjectId(roleId) }
      ],
      isDeleted: { $ne: true }
    }).select("userId roleId organizationId matrixType");

    throw new Error("No access matrix found for user");
  }

  // Check if permissions array exists and is valid
  if (!Array.isArray(accessMatrix.permissions)) {
    throw new Error("Invalid permissions structure in access matrix");
  }

  const allowedSidebarIds = accessMatrix.permissions
    .map((p) => p.module)
    .filter(Boolean);

  if (!allowedSidebarIds.length) {
    return {
      sidebars: [],
      debug: {
        matrixId: accessMatrix._id,
        permissionsCount: accessMatrix.permissions.length
      }
    };
  }

  const sidebars = await SidebarItem.find({
    _id: { $in: allowedSidebarIds.map((id) => new Types.ObjectId(id)) },
    isDeleted: { $ne: true }
  })
    .sort({ order: 1 })
    .select("sidebarName name href icon children order");

  const filteredSidebars = sidebars.map((item) => ({
    sidebarName: item.sidebarName,
    name: item.name,
    href: item.href,
    icon: item.icon,
    children: item.children,
    order: item.order
  }));

  return {
    sidebars: filteredSidebars,
    debug: {
      matrixType: accessMatrix.matrixType,
      matrixId: accessMatrix._id,
      totalPermissions: accessMatrix.permissions.length,
      allowedModules: allowedSidebarIds.length
    }
  };
};

export const createSidebarItemService = async (data) => {
  const { sidebarName, name, href, icon, children, order } = data;

  // Validate that all required fields are provided
  if (!sidebarName || !name || !href) {
    throw new Error(
      "Missing required fields: sidebarName, name and href are required."
    );
  }

  // Validate children items if they exist
  if (children && Array.isArray(children)) {
    for (const child of children) {
      if (!child.name || !child.href) {
        throw new Error("Each child item must have name and href fields.");
      }
    }
  }

  // Create a new SidebarItem document
  const newSidebarItem = new SidebarItem({
    sidebarName,
    name,
    href,
    icon,
    children,
    order: order !== undefined ? order : 0
  });

  const savedSidebarItem = await newSidebarItem.save();
  return savedSidebarItem;
};

export const getAllSidebarItemsService = async () => {
  // Sort by 'order' ascending
  const sidebars = await SidebarItem.find({ isDeleted: { $ne: true } }).sort({
    order: 1
  });
  return sidebars;
};

export const getAllSidebarItemsNoFilterService = async () => {
  // This bypasses the pre-hook filter by explicitly querying all records
  const sidebars = await SidebarItem.find({}).sort({ order: 1 });
  return sidebars;
};

export const getSidebarItemByIdService = async (id) => {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid sidebar ID is required");
  }

  const sidebar = await SidebarItem.findById(id);

  if (!sidebar) {
    throw new Error("Sidebar not found");
  }

  return sidebar;
};

export const updateSidebarItemService = async (data) => {
  const { id, sidebarName, name, href, icon, children, order } = data;

  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid sidebar ID is required");
  }

  const updateData = {};
  if (sidebarName) updateData.sidebarName = sidebarName;
  if (name) updateData.name = name;
  if (href) updateData.href = href;
  if (icon !== undefined) updateData.icon = icon;
  if (children !== undefined) updateData.children = children;
  if (order !== undefined) updateData.order = order;

  const updatedSidebar = await SidebarItem.findByIdAndUpdate(id, updateData, {
    new: true
  });

  if (!updatedSidebar) {
    throw new Error("Sidebar not found");
  }

  return updatedSidebar;
};

export const addChildItemService = async (data) => {
  const { id, child } = data;

  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid sidebar ID is required");
  }

  if (!child || !child.name || !child.href) {
    throw new Error("Child item must have name and href fields");
  }

  const sidebar = await SidebarItem.findById(id);
  if (!sidebar) {
    throw new Error("Sidebar not found");
  }

  // Initialize children array if it doesn't exist
  if (!sidebar.children) {
    sidebar.children = [];
  }

  sidebar.children.push(child);
  const updatedSidebar = await sidebar.save();
  return updatedSidebar;
};

export const updateChildItemService = async (data) => {
  const { id, childId, updatedChild } = data;

  if (!id || !Types.ObjectId.isValid(id) || !childId) {
    throw new Error("Valid sidebar ID and childId are required");
  }

  const sidebar = await SidebarItem.findById(id);
  if (!sidebar) {
    throw new Error("Sidebar not found");
  }

  // Check if children array exists
  if (!sidebar.children || !Array.isArray(sidebar.children)) {
    throw new Error("No children items found in this sidebar");
  }

  // Find the child index in the array
  const childIndex = sidebar.children.findIndex(
    (child) => child._id.toString() === childId
  );

  if (childIndex === -1) {
    throw new Error("Child item not found in sidebar");
  }

  // Update the child
  if (updatedChild.name) sidebar.children[childIndex].name = updatedChild.name;
  if (updatedChild.href) sidebar.children[childIndex].href = updatedChild.href;

  const updatedSidebar = await sidebar.save();
  return updatedSidebar;
};

export const softDeleteSidebarItemService = async (id, userId) => {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid sidebar ID is required");
  }

  const sidebar = await SidebarItem.findById(id);
  if (!sidebar) {
    throw new Error("Sidebar not found");
  }

  // Apply soft delete
  sidebar.isDeleted = true;
  sidebar.deletedAt = new Date();
  sidebar.deletedBy = userId || null;

  const updatedSidebar = await sidebar.save();
  return updatedSidebar;
};

export const restoreSidebarItemService = async (id) => {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid sidebar ID is required");
  }

  const sidebar = await SidebarItem.findOne({ _id: id, isDeleted: true });
  if (!sidebar) {
    throw new Error("Deleted sidebar not found");
  }

  // Restore the sidebar
  sidebar.isDeleted = false;
  sidebar.deletedAt = null;
  sidebar.deletedBy = null;

  const updatedSidebar = await sidebar.save();
  return updatedSidebar;
};

export const getDeletedSidebarItemsService = async () => {
  // Find all soft deleted sidebars
  const sidebars = await SidebarItem.find({
    isDeleted: true
  });
  return sidebars;
};

export const hardDeleteSidebarItemService = async (id) => {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid sidebar ID is required");
  }

  const result = await SidebarItem.findByIdAndDelete(id);

  if (!result) {
    throw new Error("Sidebar not found");
  }

  return true;
};
