"use client";
import React, { useEffect, useState } from "react";
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import AccessMatrixTable from "./AccessMatrixTable";
import Notification from "@/Components/ui/Notification";

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  role,
  changedModules
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Confirm Permission Changes
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            You are updating permissions for role:{" "}
            <span className="font-semibold text-blue-600">{role}</span>
          </p>
        </div>
        {changedModules.length > 0 ? (
          <div className="mb-4">
            {(() => {
              const grantedModules = changedModules.filter((m) => !m.isRevoked);
              const revokedModules = changedModules.filter((m) => m.isRevoked);
              return (
                <>
                  {grantedModules.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Access will be granted to:
                      </p>
                      <ul className="max-h-40 overflow-y-auto border rounded-md p-2 mb-3">
                        {grantedModules.map((module, index) => (
                          <li
                            key={index}
                            className="text-sm py-1 border-b last:border-b-0 flex items-center"
                          >
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: module.color }}
                            ></div>
                            <span>{module.name}</span>
                            <span className="ml-auto text-xs text-gray-500">
                              {module.permissions
                                .map((p, i) =>
                                  p ? ["C", "R", "U", "D"][i] : ""
                                )
                                .join("")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {revokedModules.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Access will be revoked from:
                      </p>
                      <ul className="max-h-40 overflow-y-auto border rounded-md p-2">
                        {revokedModules.map((module, index) => (
                          <li
                            key={index}
                            className="text-sm py-1 border-b last:border-b-0 flex items-center"
                          >
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: module.color }}
                            ></div>
                            <span>{module.name}</span>
                            <span className="ml-auto text-xs text-red-500">
                              Access Removed
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        ) : (
          <div className="flex items-center p-3 mb-4 bg-yellow-50 rounded-md border border-yellow-300">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-sm text-yellow-700">
              No permission changes detected
            </p>
          </div>
        )}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
              changedModules.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={changedModules.length === 0}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const RBACComponent = () => {
  const [roles, setRoles] = useState([]);
  const [sidebarItems, setSidebarItems] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [originalPermissions, setOriginalPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [pendingRoleIndex, setPendingRoleIndex] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    title: "",
    message: ""
  });
  const [changedModules, setChangedModules] = useState([]);
  const [isUpdateOperation, setIsUpdateOperation] = useState(false);
  const { data: session, status } = useSession();

  // CRUD operations
  const crudOperations = ["CREATE", "READ", "UPDATE", "DELETE"];

  // Map icon names to their components
  const iconMap = {
    ShieldCheckIcon
  };

  // Get the appropriate icon component
  const getIconComponent = (iconName) => {
    const Icon = iconMap[iconName] || ShieldCheckIcon;
    return Icon;
  };

  // Compare permissions to detect changes
  const detectChanges = () => {
    if (!originalPermissions.length || !permissions.length || !roles.length)
      return false;
    if (selectedRoleIndex >= roles.length) return false;

    if (originalPermissions.length !== permissions.length) return true;

    const changedItems = [];
    let hasAnyChanges = false;

    for (let i = 0; i < permissions.length; i++) {
      const original = originalPermissions[i];
      const current = permissions[i];

      if (original.itemId !== current.itemId) continue;

      const originalPerms = original.permissions[selectedRoleIndex];
      const currentPerms = current.permissions[selectedRoleIndex];

      if (!originalPerms || !currentPerms) continue;

      let changed = false;
      for (let j = 0; j < 4; j++) {
        if (originalPerms[j] !== currentPerms[j]) {
          changed = true;
          break;
        }
      }

      if (changed) {
        hasAnyChanges = true;
        // Show modules that either have READ access now OR had READ access before (grant/revoke)
        if (currentPerms[1] === 1 || originalPerms[1] === 1) {
          const isBeingGranted = currentPerms[1] === 1;
          const isBeingRevoked =
            originalPerms[1] === 1 && currentPerms[1] === 0;

          changedItems.push({
            id: current.itemId,
            name: current.name,
            color: isBeingGranted
              ? currentPerms.every((p) => p === 1)
                ? "#4ade80"
                : "#93c5fd"
              : "#fca5a5", // Light red for revoked items
            permissions: [
              currentPerms[0] === 1,
              currentPerms[1] === 1,
              currentPerms[2] === 1,
              currentPerms[3] === 1
            ],
            isRevoked: isBeingRevoked
          });
        }
      }
    }

    setChangedModules(changedItems);
    return hasAnyChanges;
  };

  // Deep clone permissions for comparison
  const clonePermissions = (perms) => {
    return JSON.parse(JSON.stringify(perms));
  };

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to detect changes when permissions change
  useEffect(() => {
    if (originalPermissions.length > 0 && permissions.length > 0) {
      const hasAnyChanges = detectChanges();
      setHasChanges(hasAnyChanges);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions, selectedRoleIndex]);

  // Fetch initial data (roles and sidebar items)
  const fetchInitialData = async () => {
    try {
      const res = await fetch(
        "/api/access-matrix?controllerName=getAccessMatrixForPmsAdmin",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch initial data");
      }

      const data = await res.json();
      const rolesData = data.roles || [];
      const sidebarData = data.sidebarItems || [];

      // Ensure sidebar is sorted by order asc and keep for UI grouping
      const sortedSidebar = [...sidebarData].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      setRoles(rolesData);
      setSidebarItems(sortedSidebar);

      // If there are roles, automatically fetch permissions for the first role
      if (rolesData.length > 0) {
        await fetchRolePermissions(rolesData[0]._id, rolesData, sidebarData);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error.message);
      setLoading(false);
    }
  };

  // Fetch permissions for a specific role
  const fetchRolePermissions = async (
    roleId,
    rolesData = null,
    sidebarData = null
  ) => {
    try {
      const res = await fetch(
        "/api/access-matrix?controllerName=getAccessPermissionsForRole",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ roleId })
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to fetch role permissions"
        );
      }

      const data = await res.json();

      // Use provided data or fall back to state
      const currentRoles = rolesData || roles;
      const currentSidebar = (sidebarData || sidebarItems)
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      // Ensure we have valid roles array
      if (!currentRoles || currentRoles.length === 0) {
        console.error("No roles available");
        setLoading(false);
        return;
      }

      // Initialize permissions based on the response
      const initialPermissions = [];
      const permissionsData = data.permissions || [];

      // Check if this role has existing permissions (to determine create vs update)
      const hasExistingPermissions = permissionsData.some(
        (item) =>
          item.permissions &&
          (item.permissions.create ||
            item.permissions.read ||
            item.permissions.update ||
            item.permissions.delete)
      );
      setIsUpdateOperation(hasExistingPermissions);

      // Create permission entries for each sidebar item
      permissionsData.forEach((item) => {
        // Create permissions array for all roles, but only set data for the selected role
        const rolePermissions = currentRoles.map((role, index) => {
          if (role._id === roleId) {
            return [
              item.permissions.create ? 1 : 0,
              item.permissions.read ? 1 : 0,
              item.permissions.update ? 1 : 0,
              item.permissions.delete ? 1 : 0
            ];
          } else {
            // For other roles, initialize with no permissions (will be loaded when clicked)
            return [0, 0, 0, 0];
          }
        });

        // Add main item with CRUD permissions
        initialPermissions.push({
          itemId: item._id,
          name: item.name,
          icon: item.icon,
          parentId: null,
          sidebarName: item.sidebarName,
          order: item.order ?? 0,
          permissions: rolePermissions
        });

        // Handle dynamic components
        if (
          Array.isArray(item.dynamicComponents) &&
          item.dynamicComponents.length > 0
        ) {
          item.dynamicComponents.forEach((component) => {
            const componentRolePermissions = currentRoles.map((role, index) => {
              if (role._id === roleId) {
                return [
                  0, // CREATE - always 0 for components
                  component.hasAccess ? 1 : 0, // READ - from API
                  0, // UPDATE - always 0 for components
                  0 // DELETE - always 0 for components
                ];
              } else {
                return [0, 0, 0, 0];
              }
            });

            initialPermissions.push({
              itemId: component._id,
              name: component.componentName,
              parentId: item._id,
              sidebarName: item.sidebarName,
              isComponent: true,
              permissions: componentRolePermissions
            });
          });
        }
      });

      setPermissions(initialPermissions);
      setOriginalPermissions(clonePermissions(initialPermissions));
      setHasChanges(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching role permissions:", error.message);
      setLoading(false);
    }
  };

  // Handle role selection with change detection
  const handleRoleChange = async (index) => {
    if (hasChanges) {
      setPendingRoleIndex(index);
      setShowDiscardModal(true);
    } else {
      const selectedRole = roles[index];
      if (selectedRole) {
        setLoading(true);
        setSelectedRoleIndex(index);
        await fetchRolePermissions(selectedRole._id);
      }
    }
  };

  // **UPDATED: Toggle permission state with dynamic component restrictions**
  const togglePermission = (itemId, crudIndex) => {
    // **NEW: Check if this is a dynamic component and restrict to READ-only**
    const item = permissions.find((i) => i.itemId === itemId);
    if (item && item.isComponent && crudIndex !== 1) {
      // Dynamic component: only allow READ toggling (index 1)
      return;
    }

    const newPermissions = [...permissions];
    const itemIndex = newPermissions.findIndex(
      (item) => item.itemId === itemId
    );

    if (itemIndex !== -1) {
      const currentValue =
        newPermissions[itemIndex].permissions[selectedRoleIndex][crudIndex];
      const newValue = currentValue === 1 ? 0 : 1;

      newPermissions[itemIndex].permissions[selectedRoleIndex][crudIndex] =
        newValue;

      // If this is the READ permission (index 1) being set to false (0),
      // then also set CREATE, UPDATE, and DELETE to false
      if (crudIndex === 1 && newValue === 0) {
        newPermissions[itemIndex].permissions[selectedRoleIndex][0] = 0; // CREATE
        newPermissions[itemIndex].permissions[selectedRoleIndex][2] = 0; // UPDATE
        newPermissions[itemIndex].permissions[selectedRoleIndex][3] = 0; // DELETE
      }

      setPermissions(newPermissions);
    }
  };

  // Toggle all permissions for a specific CRUD operation in a group
  const toggleAllPermissions = (crudIndex, sidebarName) => {
    const newPermissions = [...permissions];
    const sidebarItems = newPermissions.filter(
      (item) => item.sidebarName === sidebarName
    );

    // Check if all items have this permission
    const allGranted = sidebarItems.every(
      (item) => item.permissions[selectedRoleIndex][crudIndex] === 1
    );

    const newValue = allGranted ? 0 : 1;

    // Toggle all items in the group
    sidebarItems.forEach((item) => {
      const itemIndex = newPermissions.findIndex(
        (p) => p.itemId === item.itemId
      );

      // **UPDATED: For dynamic components, only allow READ toggling**
      if (item.isComponent && crudIndex !== 1) {
        return; // Skip non-READ permissions for dynamic components
      }

      newPermissions[itemIndex].permissions[selectedRoleIndex][crudIndex] =
        newValue;

      if (crudIndex === 1 && newValue === 0) {
        newPermissions[itemIndex].permissions[selectedRoleIndex][0] = 0; // CREATE
        newPermissions[itemIndex].permissions[selectedRoleIndex][2] = 0; // UPDATE
        newPermissions[itemIndex].permissions[selectedRoleIndex][3] = 0; // DELETE
      }
    });

    setPermissions(newPermissions);
  };

  // Get permission style class based on permission value
  const getPermissionClass = (value) => {
    return value === 1
      ? "bg-green-100 border-green-300"
      : "bg-red-100 border-red-300";
  };

  // Group sidebar items by their sidebarName
  const groupedItemsUnsorted = permissions.reduce((acc, item) => {
    if (!item.sidebarName) return acc;

    if (!acc[item.sidebarName]) {
      acc[item.sidebarName] = [];
    }

    if (!item.parentId || (item.parentId && item.isComponent)) {
      acc[item.sidebarName].push(item);
    }

    return acc;
  }, {});

  // Sort groups and items by sidebar order then by item.order if present
  const groupOrderMap = (sidebarItems || []).reduce((map, s) => {
    if (!map[s.sidebarName]) {
      map[s.sidebarName] = s.order ?? 0;
    }
    // Keep the smallest order for the group name if multiple items share the same sidebarName
    map[s.sidebarName] = Math.min(map[s.sidebarName], s.order ?? 0);
    return map;
  }, {});

  const groupedItems = Object.keys(groupedItemsUnsorted)
    .sort((a, b) => (groupOrderMap[a] ?? 0) - (groupOrderMap[b] ?? 0))
    .reduce((ordered, groupName) => {
      ordered[groupName] = groupedItemsUnsorted[groupName]
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return ordered;
    }, {});

  // **UPDATED: Get dynamic components for ANY sidebarName, not just "Overview"**
  const getDynamicComponents = (sidebarName) => {
    return permissions.filter(
      (item) =>
        item.sidebarName === sidebarName && item.isComponent && item.parentId
    );
  };

  // Format permission data for API submission
  const formatPermissionsForAPI = () => {
    if (!roles.length || selectedRoleIndex >= roles.length) {
      console.error("No valid role selected");
      return null;
    }

    const currentRoleId = roles[selectedRoleIndex]?._id;

    if (!currentRoleId) {
      console.error("No role selected");
      return null;
    }

    const organizationId = session?.user?.organizationId;

    // Format permissions for the selected role only
    const formattedPermissions = permissions
      .filter((item) => !item.isComponent)
      .filter((item) => item.permissions[selectedRoleIndex][1] === 1)
      .map((item) => {
        const permArray = item.permissions[selectedRoleIndex];

        // **UPDATED: Get component IDs for ANY module that has dynamic components**
        const componentIds = permissions
          .filter(
            (comp) =>
              comp.isComponent &&
              comp.parentId === item.itemId &&
              comp.permissions[selectedRoleIndex][1] === 1
          )
          .map((comp) => comp.itemId);

        return {
          module: item.itemId,
          accessLevel: {
            create: permArray[0] === 1,
            read: true,
            update: permArray[2] === 1,
            delete: permArray[3] === 1
          },
          components: componentIds.length > 0 ? componentIds : null
        };
      });

    return {
      roleId: currentRoleId,
      userId: null,
      organizationId: organizationId,
      permissions: formattedPermissions
    };
  };

  // Initiate the save process by showing confirmation modal
  const initiatePermissionSave = () => {
    if (!hasChanges) {
      setNotification({
        show: true,
        type: "warning",
        title: "No changes detected in permissions",
        message: ""
      });
      return;
    }

    setShowConfirmModal(true);
  };

  // Save permissions to backend after confirmation
  const savePermissions = async () => {
    setShowConfirmModal(false);

    const formattedData = formatPermissionsForAPI();
    if (!formattedData) {
      setNotification({
        show: true,
        type: "error",
        title: "Error formatting permissions data",
        message: ""
      });
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      const apiEndpoint = isUpdateOperation
        ? "/api/access-matrix?controllerName=updateAccessMatrix"
        : "/api/access-matrix?controllerName=createAccessMatrix";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save permissions");
      }

      const actionType = isUpdateOperation ? "updated" : "created";

      setNotification({
        show: true,
        type: "success",
        title: `Permissions for ${roles[selectedRoleIndex].roleName} role ${actionType} successfully`,
        message: ""
      });

      // Refresh the permissions for the current role after saving
      if (roles.length > selectedRoleIndex && roles[selectedRoleIndex]) {
        await fetchRolePermissions(roles[selectedRoleIndex]._id);
      }
    } catch (error) {
      setNotification({
        show: true,
        type: "error",
        title: "Error saving permissions",
        message: error.message
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <div>
      <Notification
        show={notification.show}
        setShow={(show) => setNotification((n) => ({ ...n, show }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
      {/* Role selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Role to Manage:
        </label>
        <div className="flex flex-wrap gap-2">
          {roles.map((role, index) => (
            <button
              key={role._id}
              onClick={() => handleRoleChange(index)}
              className={`px-4 py-2 rounded-md border ${
                selectedRoleIndex === index
                  ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {role.roleName}
            </button>
          ))}
        </div>
      </div>

      {roles.length > 0 &&
        selectedRoleIndex < roles.length &&
        roles[selectedRoleIndex] && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              Managing permissions for:{" "}
              <span className="text-blue-600">
                {roles[selectedRoleIndex].roleName}
              </span>
              {hasChanges && (
                <span className="ml-2 text-sm text-yellow-600 font-normal">
                  (Unsaved changes)
                </span>
              )}
            </h2>
          </div>
        )}
      <AccessMatrixTable
        roles={roles}
        selectedRoleIndex={selectedRoleIndex}
        permissions={permissions}
        originalPermissions={originalPermissions}
        hasChanges={hasChanges}
        saving={saving}
        saveMessage={saveMessage}
        groupedItems={groupedItems}
        crudOperations={crudOperations}
        getIconComponent={getIconComponent}
        getPermissionClass={getPermissionClass}
        getDynamicComponents={getDynamicComponents}
        togglePermission={togglePermission}
        toggleAllPermissions={toggleAllPermissions}
        initiatePermissionSave={initiatePermissionSave}
        setPermissions={setPermissions}
        setHasChanges={setHasChanges}
        clonePermissions={clonePermissions}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={savePermissions}
        role={roles[selectedRoleIndex]?.roleName || ""}
        changedModules={changedModules}
      />

      {/* Discard Changes Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Unsaved Changes
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              You have unsaved changes to the permissions for{" "}
              {roles[selectedRoleIndex]?.roleName}. Do you want to discard these
              changes?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDiscardModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowDiscardModal(false);
                  if (
                    pendingRoleIndex !== null &&
                    roles.length > pendingRoleIndex
                  ) {
                    const selectedRole = roles[pendingRoleIndex];
                    if (selectedRole) {
                      setLoading(true);
                      setSelectedRoleIndex(pendingRoleIndex);
                      setPendingRoleIndex(null);
                      await fetchRolePermissions(selectedRole._id);
                      setHasChanges(false);
                    }
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RBACComponent;
