// 📁 /server/Services/accessMatrixService.js
import AccessMatrix from "@/server/models/Dashboard/accessMatrixModel";
import SidebarItem from "@/server/models/Dashboard/sidebarModel";
import Role from "@/server/models/roleModel";
import Organization from "@/server/models/organizationModal";
import DynamicComponents from "@/server/models/Dashboard/dynamicComponentsModel";
import { Types } from "mongoose";

// Helper function to compare two permission arrays
function comparePermissions(existingPermissions, newPermissions) {
  // Create maps for easy lookup
  const existingMap = new Map();
  existingPermissions.forEach((perm) => {
    existingMap.set(perm.module.toString(), perm);
  });

  // Check if there are any new permissions or changes in existing ones
  for (const newPerm of newPermissions) {
    const moduleId = newPerm.module.toString();
    const existingPerm = existingMap.get(moduleId);

    if (!existingPerm) {
      // New permission found
      return true;
    }

    // Compare access levels
    const existingAccess = existingPerm.accessLevel;
    const newAccess = newPerm.accessLevel;

    if (
      existingAccess.create !== newAccess.create ||
      existingAccess.read !== newAccess.read ||
      existingAccess.update !== newAccess.update ||
      existingAccess.delete !== newAccess.delete
    ) {
      return true;
    }

    // Compare components arrays
    const existingComponents = existingPerm.components || [];
    const newComponents = newPerm.components || [];

    if (existingComponents.length !== newComponents.length) {
      return true;
    }

    // Check if component arrays have same elements
    const existingCompIds = existingComponents.map((c) => c.toString()).sort();
    const newCompIds = newComponents.map((c) => c.toString()).sort();

    for (let i = 0; i < existingCompIds.length; i++) {
      if (existingCompIds[i] !== newCompIds[i]) {
        return true;
      }
    }
  }

  return false;
}

// Helper function to merge permissions (update existing + add new)
function mergePermissions(existingPermissions, newPermissions) {
  const merged = [...existingPermissions];
  const existingMap = new Map();

  // Create map of existing permissions for quick lookup
  existingPermissions.forEach((perm, index) => {
    existingMap.set(perm.module.toString(), index);
  });

  // Process new permissions
  newPermissions.forEach((newPerm) => {
    const moduleId = newPerm.module.toString();
    const existingIndex = existingMap.get(moduleId);

    if (existingIndex !== undefined) {
      // Update existing permission
      merged[existingIndex] = {
        ...merged[existingIndex],
        accessLevel: newPerm.accessLevel,
        components: newPerm.components || []
      };
    } else {
      // Add new permission
      merged.push(newPerm);
    }
  });

  return merged;
}

export const createAccessMatrixService = async (data) => {
  const { roleId, userId, organizationId, permissions } = data;

  if (
    !roleId ||
    !organizationId ||
    !permissions ||
    !Array.isArray(permissions)
  ) {
    throw new Error(
      "roleId, organizationId, and permissions (array) are required."
    );
  }

  if (
    !Types.ObjectId.isValid(roleId) ||
    !Types.ObjectId.isValid(organizationId)
  ) {
    throw new Error("Invalid roleId, or organizationId");
  }

  const role = await Role.findById(roleId);
  if (!role) {
    throw new Error("Role not found");
  }

  const org = await Organization.findById(organizationId);
  if (!org) {
    throw new Error("Organization not found");
  }

  for (const p of permissions) {
    if (!p.module || !Types.ObjectId.isValid(p.module)) {
      throw new Error("Each permission.module must be a valid SidebarItem ID");
    }

    const sidebarItem = await SidebarItem.findById(p.module);
    if (!sidebarItem) {
      throw new Error(`SidebarItem not found for module: ${p.module}`);
    }
  }

  // 🔍 Log processed permissions before saving
  const formattedPermissions = permissions.map((p, idx) => {
    const entry = {
      module: p.module,
      accessLevel: p.accessLevel,
      components: Array.isArray(p.components) ? p.components : []
    };
    return entry;
  });

  let existingMatrix;
  let savedMatrix;
  let isHotelOwner = role.roleName.toLowerCase() === "hotel-owner";
  let hasPermissionChanges = false;
  let wasExistingMatrix = false;

  if (isHotelOwner) {
    // Special handling for hotel-owner role
    // Find existing record by roleId only (not organizationId)
    existingMatrix = await AccessMatrix.findOne({
      roleId,
      userId,
      isDeleted: { $ne: true }
    });

    if (existingMatrix) {
      wasExistingMatrix = true;

      // Check if organizationId already exists in array
      const orgExists = existingMatrix.organizationId.some(
        (orgId) => orgId.toString() === organizationId.toString()
      );

      // Add organizationId to array if not exists
      if (!orgExists) {
        existingMatrix.organizationId.push(organizationId);
      }

      // Compare permissions to detect changes
      hasPermissionChanges = comparePermissions(
        existingMatrix.permissions,
        formattedPermissions
      );

      if (hasPermissionChanges) {
        // Update permissions with new/changed ones
        existingMatrix.permissions = mergePermissions(
          existingMatrix.permissions,
          formattedPermissions
        );
        existingMatrix.updatedAt = new Date();
        savedMatrix = await existingMatrix.save();
      } else {
        // No permission changes, just save if org was added
        if (!orgExists) {
          existingMatrix.updatedAt = new Date();
          savedMatrix = await existingMatrix.save();
        } else {
          savedMatrix = existingMatrix;
        }
      }
    } else {
      // Create new record for hotel-owner
      const newMatrix = new AccessMatrix({
        roleId,
        userId,
        organizationId: [organizationId], // Store as array
        permissions: formattedPermissions
      });

      savedMatrix = await newMatrix.save();
    }
  } else {
    // Standard handling for other roles
    existingMatrix = await AccessMatrix.findOne({
      roleId,
      userId,
      organizationId: { $in: [organizationId] }, // Search in array
      isDeleted: { $ne: true }
    });

    if (existingMatrix) {
      existingMatrix.permissions = formattedPermissions;
      existingMatrix.updatedAt = new Date();

      savedMatrix = await existingMatrix.save();
    } else {
      const newMatrix = new AccessMatrix({
        roleId,
        userId,
        organizationId: [organizationId], // Store as array for consistency
        permissions: formattedPermissions
      });

      savedMatrix = await newMatrix.save();
    }
  }

  await savedMatrix.populate([
    { path: "roleId", select: "roleName" },
    { path: "userId", select: "firstName lastName email" },
    { path: "organizationId", select: "name" },
    { path: "permissions.module", select: "name sidebarName" }
  ]);

  // Determine appropriate success message
  let message;
  let status;

  if (isHotelOwner) {
    if (wasExistingMatrix) {
      if (hasPermissionChanges) {
        message = "Hotel-owner access matrix updated with new permissions";
      } else {
        message = "Organization added to hotel-owner access matrix";
      }
      status = 200;
    } else {
      message = "Hotel-owner access matrix created successfully";
      status = 201;
    }
  } else {
    message = existingMatrix
      ? "Access matrix updated successfully"
      : "Access matrix created successfully";
    status = existingMatrix ? 200 : 201;
  }

  return { message, matrix: savedMatrix, status };
};

export const updateAccessMatrixService = async (data) => {
  const { roleId, userId, organizationId, permissions } = data;

  if (
    !roleId ||
    !organizationId ||
    !permissions ||
    !Array.isArray(permissions)
  ) {
    throw new Error(
      "roleId, organizationId, and permissions (array) are required."
    );
  }

  if (
    !Types.ObjectId.isValid(roleId) ||
    !Types.ObjectId.isValid(organizationId)
  ) {
    throw new Error("Invalid roleId, or organizationId");
  }

  const role = await Role.findById(roleId);
  if (!role) {
    throw new Error("Role not found");
  }

  const org = await Organization.findById(organizationId);
  if (!org) {
    throw new Error("Organization not found");
  }

  // Validate all modules exist
  for (const p of permissions) {
    if (!p.module || !Types.ObjectId.isValid(p.module)) {
      throw new Error("Each permission.module must be a valid SidebarItem ID");
    }

    const sidebarItem = await SidebarItem.findById(p.module);
    if (!sidebarItem) {
      throw new Error(`SidebarItem not found for module: ${p.module}`);
    }
  }

  // Format permissions
  const formattedPermissions = permissions.map((p) => ({
    module: p.module,
    accessLevel: p.accessLevel,
    components: Array.isArray(p.components) ? p.components : []
  }));

  let existingMatrix;
  let savedMatrix;
  const isHotelOwner = role.roleName.toLowerCase() === "hotel-owner";

  if (isHotelOwner) {
    // Special handling for hotel-owner role
    existingMatrix = await AccessMatrix.findOne({
      roleId,
      userId,
      isDeleted: { $ne: true }
    });
  } else {
    // Standard handling for other roles
    existingMatrix = await AccessMatrix.findOne({
      roleId,
      userId,
      organizationId: { $in: [organizationId] },
      isDeleted: { $ne: true }
    });
  }

  if (!existingMatrix) {
    throw new Error("Access matrix not found for update");
  }

  // Update the existing matrix
  if (isHotelOwner) {
    // For hotel-owner, ensure organizationId is in array
    const orgExists = existingMatrix.organizationId.some(
      (orgId) => orgId.toString() === organizationId.toString()
    );

    if (!orgExists) {
      existingMatrix.organizationId.push(organizationId);
    }

    // Update permissions - replace existing permissions with new ones
    existingMatrix.permissions = formattedPermissions;
  } else {
    // For other roles, simply update permissions
    existingMatrix.permissions = formattedPermissions;
  }

  existingMatrix.updatedAt = new Date();
  savedMatrix = await existingMatrix.save();

  await savedMatrix.populate([
    { path: "roleId", select: "roleName" },
    { path: "userId", select: "firstName lastName email" },
    { path: "organizationId", select: "name" },
    { path: "permissions.module", select: "name sidebarName" }
  ]);

  return savedMatrix;
};

export const updateAccessMatrixForAbacService = async (data) => {
  const { roleId, userId, organizationId, permissions } = data;

  if (
    !roleId ||
    !organizationId ||
    !permissions ||
    !Array.isArray(permissions)
  ) {
    console.error("Validation error: Missing or invalid parameters.");
    throw new Error(
      "roleId, organizationId, and permissions (array) are required."
    );
  }

  if (
    !Types.ObjectId.isValid(roleId) ||
    !Types.ObjectId.isValid(organizationId)
  ) {
    console.error("Validation error: Invalid roleId or organizationId");
    throw new Error("Invalid roleId, or organizationId");
  }

  const role = await Role.findById(roleId);
  if (!role) {
    throw new Error("Role not found");
  }

  const org = await Organization.findById(organizationId);
  if (!org) {
    throw new Error("Organization not found");
  }

  for (const p of permissions) {
    if (!p.module || !Types.ObjectId.isValid(p.module)) {
      console.error("Invalid module ID in permission:", p);
      throw new Error("Each permission.module must be a valid SidebarItem ID");
    }
    const sidebarItem = await SidebarItem.findById(p.module);
    if (!sidebarItem) {
      throw new Error(`SidebarItem not found for module: ${p.module}`);
    }
  }

  const formattedPermissions = permissions.map((p) => ({
    module: p.module,
    accessLevel: p.accessLevel,
    components: Array.isArray(p.components) ? p.components : []
  }));

  // 1. Fetch RBAC matrix for this org/role (userId: null)
  const rbacMatrix = await AccessMatrix.findOne({
    roleId,
    userId: null,
    organizationId: { $in: [organizationId] },
    isDeleted: { $ne: true }
  });

  // 2. Compare permissions
  let hasChanges = true;
  if (rbacMatrix) {
    hasChanges = comparePermissions(
      rbacMatrix.permissions,
      formattedPermissions
    );
    console.log("Comparison result (RBAC vs frontend):", hasChanges);
  } else {
    console.log(
      "No RBAC matrix found for this org/role, treating as changes present."
    );
  }

  // 3. If no changes, return early
  if (!hasChanges) {
    return {
      message:
        "No changes detected between backend and frontend permissions. No update performed.",
      status: 200
    };
  }

  // 4. Check if a user-specific (ABAC) matrix already exists
  let abacMatrix = await AccessMatrix.findOne({
    roleId,
    userId,
    organizationId: { $in: [organizationId] },
    isDeleted: { $ne: true }
  });

  let savedMatrix;
  if (abacMatrix) {
    // Update existing ABAC matrix
    abacMatrix.permissions = formattedPermissions;
    abacMatrix.updatedAt = new Date();
    savedMatrix = await abacMatrix.save();
  } else {
    // Create new ABAC matrix for this user
    const newMatrix = new AccessMatrix({
      roleId,
      userId,
      matrixType: "ABAC",
      organizationId: [organizationId],
      permissions: formattedPermissions
    });
    savedMatrix = await newMatrix.save();
  }

  await savedMatrix.populate([
    { path: "roleId", select: "roleName" },
    { path: "userId", select: "firstName lastName email" },
    { path: "organizationId", select: "name" },
    { path: "permissions.module", select: "name sidebarName" }
  ]);

  return {
    message: "ABAC access matrix updated for user.",
    matrix: savedMatrix,
    status: 200
  };
};

export const getAllAccessMatricesService = async () => {
  const matrices = await AccessMatrix.find();
  return matrices;
};

export const getAccessMatrixForPmsAdminService = async (userId) => {
  const roles = await Role.find({
    createdBy: userId,
    isDeleted: { $ne: true }
  }).lean();

  const sidebarItems = await SidebarItem.find({
    isDeleted: { $ne: true }
  })
    .lean()
    .sort({ order: 1 }); // 🔹 Ascending sort by sidebarName

  const dynamicComponents = await DynamicComponents.find({
    isDeleted: { $ne: true }
  }).lean();

  // Prepare roles
  const filteredRoles = roles.map((role) => ({
    _id: role._id,
    roleName: role.roleName
  }));

  // Map sidebar items with matching dynamic components
  const filteredSidebarItems = sidebarItems.map((item) => {
    const matchingComponents = dynamicComponents.filter(
      (dc) => dc.usageLocation?.toString() === item._id.toString()
    );

    const formattedComponents = matchingComponents.map((dc) => ({
      _id: dc._id,
      componentName: dc.componentName,
      description: dc.description,
      status: dc.status
    }));

    return {
      _id: item._id,
      sidebarName: item.sidebarName,
      name: item.name,
      icon: item.icon,
      order: item.order,
      children: item.children,
      dynamicComponents: formattedComponents
    };
  });

  return {
    roles: filteredRoles,
    sidebarItems: filteredSidebarItems
  };
};

export const getAccessPermissionsForRoleService = async (
  roleId,
  userId,
  organizationId
) => {
  if (!roleId) {
    throw new Error("roleId is required");
  }

  if (!Types.ObjectId.isValid(roleId)) {
    throw new Error("Invalid roleId");
  }

  // Verify the role exists and was created by the current user
  const role = await Role.findOne({
    _id: roleId,
    createdBy: userId,
    isDeleted: { $ne: true }
  });

  if (!role) {
    throw new Error("Role not found or access denied");
  }

  // Get sidebar items and dynamic components
  const sidebarItems = await SidebarItem.find({
    isDeleted: { $ne: true }
  })
    .sort({ order: 1 })
    .lean();

  const dynamicComponents = await DynamicComponents.find({
    isDeleted: { $ne: true }
  }).lean();

  // Special handling for hotel-owner role
  let accessMatrices;
  const isHotelOwner = role.roleName.toLowerCase() === "hotel-owner";

  if (isHotelOwner) {
    // For hotel-owner, get the single record regardless of organizationId
    accessMatrices = await AccessMatrix.find({
      roleId: roleId,
      isDeleted: { $ne: true }
    })
      .populate([
        { path: "roleId", select: "roleName" },
        { path: "permissions.module", select: "name sidebarName" },
        {
          path: "permissions.components",
          select: "componentName description status"
        }
      ])
      .lean();
  } else {
    // For other roles, filter by organization
    if (!organizationId) {
      throw new Error("User organization not found");
    }

    accessMatrices = await AccessMatrix.find({
      roleId: roleId,
      organizationId: { $in: [organizationId] },
      isDeleted: { $ne: true }
    })
      .populate([
        { path: "roleId", select: "roleName" },
        { path: "permissions.module", select: "name sidebarName" },
        {
          path: "permissions.components",
          select: "componentName description status"
        }
      ])
      .lean();
  }

  // Create permission map for this role
  const permissionMap = {};
  accessMatrices.forEach((matrix) => {
    matrix.permissions.forEach((perm) => {
      const moduleId = perm.module?._id;
      if (moduleId) {
        permissionMap[moduleId] = perm.accessLevel;
      }

      // Map component permissions if they exist
      if (Array.isArray(perm.components) && perm.components.length > 0) {
        perm.components.forEach((component) => {
          const componentId = component._id;
          if (componentId) {
            permissionMap[componentId] = {
              create: false,
              read: true,
              update: false,
              delete: false
            };
          }
        });
      }
    });
  });

  // Map sidebar items with their permissions and dynamic components
  const permissionsData = sidebarItems.map((item) => {
    const moduleId = item._id;
    const savedPermissions = permissionMap[moduleId];

    // Get matching dynamic components for this sidebar item
    const matchingComponents = dynamicComponents.filter(
      (dc) => dc.usageLocation?.toString() === item._id.toString()
    );

    const formattedComponents = matchingComponents.map((dc) => {
      const componentPermissions = permissionMap[dc._id];
      return {
        _id: dc._id,
        componentName: dc.componentName,
        description: dc.description,
        status: dc.status,
        hasAccess: componentPermissions ? componentPermissions.read : false
      };
    });

    return {
      _id: item._id,
      name: item.name,
      sidebarName: item.sidebarName,
      icon: item.icon,
      order: item.order,
      permissions: savedPermissions
        ? {
            create: savedPermissions.create,
            read: savedPermissions.read,
            update: savedPermissions.update,
            delete: savedPermissions.delete
          }
        : {
            create: false,
            read: false,
            update: false,
            delete: false
          },
      dynamicComponents: formattedComponents
    };
  });

  return {
    role: {
      _id: role._id,
      roleName: role.roleName
    },
    permissions: permissionsData
  };
};

export const getAccessPermissionsForRoleOrNameService = async (
  roleId,
  userId,
  organizationId
) => {
  console.log(
    "🔍 [SERVICE] getAccessPermissionsForRoleOrNameService called with:"
  );
  console.log("📌 roleId:", roleId);
  console.log("👤 userId:", userId);
  console.log("🏢 organizationId:", organizationId);

  if (!roleId) {
    throw new Error("❌ roleId is required");
  }
  if (!Types.ObjectId.isValid(roleId)) {
    throw new Error("❌ Invalid roleId");
  }

  let accessMatrix = null;

  // 1️⃣ Try user-specific access matrix (ABAC)
  if (userId && Types.ObjectId.isValid(userId)) {
    console.log("🔎 Checking ABAC accessMatrix for user...");
    accessMatrix = await AccessMatrix.findOne({
      userId: new Types.ObjectId(userId),
      isDeleted: { $ne: true }
    })
      .populate([
        { path: "roleId", select: "roleName" },
        { path: "permissions.module", select: "name sidebarName icon" },
        {
          path: "permissions.components",
          select: "componentName description status"
        }
      ])
      .lean();

    if (accessMatrix) console.log("✅ ABAC accessMatrix found");
    else console.log("❌ ABAC accessMatrix not found");
  }

  // 2️⃣ Fallback: Check RBAC with orgId + roleId
  if (
    !accessMatrix &&
    organizationId &&
    Types.ObjectId.isValid(organizationId)
  ) {
    console.log("🔎 Checking RBAC accessMatrix for role + org...");
    accessMatrix = await AccessMatrix.findOne({
      userId: null,
      roleId: new Types.ObjectId(roleId),
      organizationId: new Types.ObjectId(organizationId),
      isDeleted: { $ne: true }
    })
      .populate([
        { path: "roleId", select: "roleName" },
        { path: "permissions.module", select: "name sidebarName icon" },
        {
          path: "permissions.components",
          select: "componentName description status"
        }
      ])
      .lean();

    if (accessMatrix) console.log("✅ RBAC (role + org) accessMatrix found");
    else console.log("❌ RBAC (role + org) accessMatrix not found");
  }

  // 3️⃣ Final fallback: Check RBAC with just roleId
  if (!accessMatrix) {
    console.log("🔎 Checking RBAC accessMatrix for role only...");
    accessMatrix = await AccessMatrix.findOne({
      userId: null,
      roleId: new Types.ObjectId(roleId),
      isDeleted: { $ne: true }
    })
      .populate([
        { path: "roleId", select: "roleName" },
        { path: "permissions.module", select: "name sidebarName icon" },
        {
          path: "permissions.components",
          select: "componentName description status"
        }
      ])
      .lean();

    if (accessMatrix) console.log("✅ RBAC (role only) accessMatrix found");
    else console.log("❌ No accessMatrix found at all");
  }

  if (!accessMatrix) {
    throw new Error("⛔ No access matrix found for user or role");
  }

  // 🧩 Build permissionMap
  const permissionMap = {};
  (accessMatrix.permissions || []).forEach((perm) => {
    const moduleId = perm.module?._id || perm.module;
    if (moduleId) {
      permissionMap[moduleId] = perm.accessLevel;
    }

    if (Array.isArray(perm.components) && perm.components.length > 0) {
      perm.components.forEach((component) => {
        const componentId = component._id;
        if (componentId) {
          permissionMap[componentId] = {
            create: false,
            read: true,
            update: false,
            delete: false
          };
        }
      });
    }
  });

  // 📚 Fetch sidebar items and components
  const sidebarItems = await SidebarItem.find({
    isDeleted: { $ne: true }
  })
    .sort({ order: 1 })
    .lean();
  const dynamicComponents = await DynamicComponents.find({
    isDeleted: { $ne: true }
  }).lean();

  console.log(`📦 Found ${sidebarItems.length} sidebarItems`);
  console.log(`🔧 Found ${dynamicComponents.length} dynamicComponents`);

  // 📐 Format permissions per module
  const permissionsData = sidebarItems.map((item) => {
    const moduleId = item._id;
    const savedPermissions = permissionMap[moduleId];

    // Match dynamic components
    const matchingComponents = dynamicComponents.filter(
      (dc) => dc.usageLocation?.toString() === item._id.toString()
    );
    const formattedComponents = matchingComponents.map((dc) => {
      const componentPermissions = permissionMap[dc._id];
      return {
        _id: dc._id,
        componentName: dc.componentName,
        description: dc.description,
        status: dc.status,
        hasAccess: componentPermissions ? componentPermissions.read : false
      };
    });

    return {
      _id: item._id,
      name: item.name,
      sidebarName: item.sidebarName,
      icon: item.icon,
      order: item.order,
      permissions: savedPermissions
        ? {
            create: savedPermissions.create,
            read: savedPermissions.read,
            update: savedPermissions.update,
            delete: savedPermissions.delete
          }
        : {
            create: false,
            read: false,
            update: false,
            delete: false
          },
      dynamicComponents: formattedComponents
    };
  });

  return {
    role: {
      _id: accessMatrix.roleId?._id || accessMatrix.roleId,
      roleName: accessMatrix.roleId?.roleName || ""
    },
    permissions: permissionsData
  };
};
