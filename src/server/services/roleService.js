// 📁 /server/Services/roleService.js
import Role from "@/server/models/roleModel";
import { Types } from "mongoose";

export const createRoleService = async (data) => {
  const { roleName, createdBy } = data;

  // Validate required field
  if (!roleName) {
    throw new Error("Missing required field: roleName is required.");
  }

  const existingRole = await Role.findOne({ roleName });

  if (existingRole) {
    throw new Error("Role already exists");
  }

  // Create new role with optional organizationId
  const newRole = new Role({
    roleName,
    createdBy: createdBy || null
  });

  const savedRole = await newRole.save();
  return savedRole;
};

export const getAllRolesService = async () => {
  const roles = await Role.find();
  return roles;
};

export const getRolesByCurrentUserService = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Find roles where createdBy matches the session user id
  const roles = await Role.find({ createdBy: userId });
  return roles;
};

export const getRoleByIdService = async (id) => {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid role ID is required");
  }

  const role = await Role.findById(id);

  if (!role) {
    throw new Error("Role not found");
  }

  return role;
};

export const updateRoleService = async (data) => {
  const { id, roleName, updatedBy } = data;

  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid role ID is required");
  }

  const updateData = {};
  if (roleName) updateData.roleName = roleName;
  if (updatedBy) updateData.updatedBy = updatedBy;

  const updatedRole = await Role.findByIdAndUpdate(id, updateData, {
    new: true
  });

  if (!updatedRole) {
    throw new Error("Role not found");
  }

  return updatedRole;
};

export const softDeleteRoleService = async (id, deletedBy) => {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid role ID is required");
  }

  const role = await Role.findById(id);

  if (!role) {
    throw new Error("Role not found");
  }

  // Apply soft delete
  const updatedRole = await Role.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: deletedBy || null
    },
    { new: true }
  );

  return updatedRole;
};

export const restoreRoleService = async (id, restoredBy) => {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid role ID is required");
  }

  // Use the static method we added to the model to properly restore the role
  const restoredRole = await Role.restoreRole(id, restoredBy || null);

  if (!restoredRole) {
    throw new Error("Deleted role not found");
  }

  return restoredRole;
};

export const getDeletedRolesService = async () => {
  // Explicitly query for deleted roles
  const deletedRoles = await Role.find({ isDeleted: true });
  return deletedRoles;
};

export const hardDeleteRoleService = async (id) => {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid role ID is required");
  }

  const result = await Role.hardDelete(id);

  if (!result) {
    throw new Error("Role not found");
  }

  return true;
};
