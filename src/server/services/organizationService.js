// 📁 /server/Services/organizationService.js
import Organization from "@/server/models/organizationModal";
import AccessMatrixModel from "@/server/models/Dashboard/accessMatrixModel";
import { Types } from "mongoose";

// Hardcoded or configurable roleId (based on your context)
const TARGET_ROLE_ID = "68906f5b7d4d0f0b380ea6c8";

export const createOrganizationService = async (data) => {
  const { organizationId, createdBy } = data;

  if (!organizationId) {
    throw new Error("Missing required field: organizationId is required.");
  }

  const existingOrganization = await Organization.findOne({ organizationId });

  if (existingOrganization) {
    throw new Error("Organization already exists");
  }

  const newOrganization = new Organization({
    organizationId,
    createdBy: createdBy || null
  });

  const savedOrganization = await newOrganization.save();

  // ⏭️ Update the specific AccessMatrix by roleId
  const updatedAccessMatrix = await AccessMatrixModel.findOneAndUpdate(
    {
      roleId: TARGET_ROLE_ID,
      isDeleted: false
    },
    {
      $addToSet: {
        organizationId: savedOrganization._id
      }
    },
    { new: true }
  );

  return {
    organization: savedOrganization,
    accessMatrixUpdated: !!updatedAccessMatrix
  };
};

export const getAllOrganizationsService = async () => {
  const organizations = await Organization.find();
  return organizations;
};

export const getOrganizationByIdService = async (id) => {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid organization ID is required");
  }

  const organization = await Organization.findById(id);

  if (!organization) {
    throw new Error("Organization not found");
  }

  return organization;
};

export const updateOrganizationService = async (data) => {
  const { id, organizationId, updatedBy } = data;

  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid organization ID is required");
  }

  const updateData = {};
  if (organizationId) updateData.organizationId = organizationId;
  if (updatedBy) updateData.updatedBy = updatedBy;

  const updatedOrganization = await Organization.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true
    }
  );

  if (!updatedOrganization) {
    throw new Error("Organization not found");
  }

  return updatedOrganization;
};

export const softDeleteOrganizationService = async (id, deletedBy) => {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid organization ID is required");
  }

  const organization = await Organization.findById(id);

  if (!organization) {
    throw new Error("Organization not found");
  }

  // Apply soft delete
  const updatedOrganization = await Organization.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: deletedBy || null
    },
    { new: true }
  );

  return updatedOrganization;
};

export const restoreOrganizationService = async (id, restoredBy) => {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid organization ID is required");
  }

  // Update the restored organization with the restoredBy information
  const updatedData = {
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    restoredAt: new Date(),
    restoredBy: restoredBy || null
  };

  // Use the static method from the model
  const restoredOrganization = await Organization.findOneAndUpdate(
    { _id: id, isDeleted: true },
    updatedData,
    { new: true }
  );

  if (!restoredOrganization) {
    throw new Error("Deleted organization not found");
  }

  return restoredOrganization;
};

export const getDeletedOrganizationsService = async () => {
  // Explicitly query for deleted organizations
  const deletedOrganizations = await Organization.find({ isDeleted: true });
  return deletedOrganizations;
};

export const hardDeleteOrganizationService = async (id) => {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("Valid organization ID is required");
  }

  const result = await Organization.hardDelete(id);

  if (!result) {
    throw new Error("Organization not found");
  }

  return true;
};
