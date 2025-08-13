"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import gcsImageLoader from "@/lib/gcs-image-loader";
import { CpuChipIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { debounce } from "lodash";
import AccessMatrixTable from "./AccessMatrixTable";
import { useSession } from "next-auth/react";
import {
  ShieldCheckIcon,
  LockClosedIcon,
  Cog6ToothIcon,
  StarIcon,
  UserPlusIcon,
  UserIcon,
  CalendarIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  HomeIcon,
  HomeModernIcon,
  ChartBarIcon,
  ChartBarSquareIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  UsersIcon,
  PuzzlePieceIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import Notification from "@/Components/ui/Notification";

const fallbackImage = "/error.png";

const iconMap = {
  ShieldCheckIcon,
  LockClosedIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  StarIcon,
  UserPlusIcon,
  UserIcon,
  CalendarIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  HomeIcon,
  HomeModernIcon,
  ChartBarIcon,
  ChartBarSquareIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  UsersIcon,
  PuzzlePieceIcon
};

const crudOperations = ["CREATE", "READ", "UPDATE", "DELETE"];

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  user,
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
            You are updating permissions for user:{" "}
            <span className="font-semibold text-blue-600">
              {user ? `${user.firstName} ${user.lastName}` : ""}
            </span>
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

const ABACComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [accessMatrixLoading, setAccessMatrixLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [originalPermissions, setOriginalPermissions] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [groupedItems, setGroupedItems] = useState({});
  const { data: session } = useSession();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    title: "",
    message: ""
  });
  const [changedModules, setChangedModules] = useState([]);
  const [isUpdateOperation, setIsUpdateOperation] = useState(false);

  // Debounced search (memoized debounced function)
  const debouncedFetchUsers = useMemo(
    () =>
      debounce(async (query) => {
        if (!query) {
          setUsers([]);
          return;
        }
        try {
          setLoading(true);
          const res = await fetch(
            `/api/user?controllerName=getStaffByName&staff-name=${query}`
          );
          const data = await res.json();
          setUsers(data?.users?.slice(0, 5)); // Top 5 users
        } catch (error) {
          console.error("Failed to fetch users:", error);
        } finally {
          setLoading(false);
        }
      }, 500),
    []
  );

  useEffect(() => {
    debouncedFetchUsers(searchTerm);
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [searchTerm, debouncedFetchUsers]);

  // Get the appropriate icon component
  const getIconComponent = (iconName) => {
    const Icon = iconMap[iconName] || ShieldCheckIcon;
    return Icon;
  };

  // Deep clone permissions for comparison
  const clonePermissions = (perms) => {
    return JSON.parse(JSON.stringify(perms));
  };

  // Detect changes and build changedModules (like RBAC)
  const detectChanges = () => {
    if (!originalPermissions.length || !permissions.length) return false;
    if (originalPermissions.length !== permissions.length) return true;
    const changedItems = [];
    let hasAnyChanges = false;
    for (let i = 0; i < permissions.length; i++) {
      const original = originalPermissions[i];
      const current = permissions[i];
      if (original.itemId !== current.itemId) continue;
      const originalPerms = original.permissions[0];
      const currentPerms = current.permissions[0];
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
              : "#fca5a5",
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

  // Group sidebar items by their sidebarName
  const computeGroupedItems = (perms) => {
    return perms.reduce((acc, item) => {
      if (!item.sidebarName) return acc;
      if (!acc[item.sidebarName]) acc[item.sidebarName] = [];
      if (!item.parentId || (item.parentId && item.isComponent)) {
        acc[item.sidebarName].push(item);
      }
      return acc;
    }, {});
  };

  // Get dynamic components for a sidebar group
  const getDynamicComponents = (sidebarName) => {
    return permissions.filter(
      (item) =>
        item.sidebarName === sidebarName && item.isComponent && item.parentId
    );
  };

  // Get permission style class
  const getPermissionClass = (value) => {
    return value === 1
      ? "bg-green-100 border-green-300"
      : "bg-red-100 border-red-300";
  };

  // Toggle permission (index 0 for user)
  const togglePermission = (itemId, crudIndex) => {
    const item = permissions.find((i) => i.itemId === itemId);
    if (item && item.isComponent && crudIndex !== 1) return;
    const newPermissions = [...permissions];
    const itemIndex = newPermissions.findIndex(
      (item) => item.itemId === itemId
    );
    if (itemIndex !== -1) {
      const currentValue = newPermissions[itemIndex].permissions[0][crudIndex];
      const newValue = currentValue === 1 ? 0 : 1;
      newPermissions[itemIndex].permissions[0][crudIndex] = newValue;
      if (crudIndex === 1 && newValue === 0) {
        newPermissions[itemIndex].permissions[0][0] = 0;
        newPermissions[itemIndex].permissions[0][2] = 0;
        newPermissions[itemIndex].permissions[0][3] = 0;
      }
      setPermissions(newPermissions);
      setHasChanges(detectChanges());
    }
  };

  // Toggle all permissions for a CRUD operation in a group
  const toggleAllPermissions = (crudIndex, sidebarName) => {
    const newPermissions = [...permissions];
    const sidebarItems = newPermissions.filter(
      (item) => item.sidebarName === sidebarName
    );
    const allGranted = sidebarItems.every(
      (item) => item.permissions[0][crudIndex] === 1
    );
    const newValue = allGranted ? 0 : 1;
    sidebarItems.forEach((item) => {
      const itemIndex = newPermissions.findIndex(
        (p) => p.itemId === item.itemId
      );
      if (item.isComponent && crudIndex !== 1) return;
      newPermissions[itemIndex].permissions[0][crudIndex] = newValue;
      if (crudIndex === 1 && newValue === 0) {
        newPermissions[itemIndex].permissions[0][0] = 0;
        newPermissions[itemIndex].permissions[0][2] = 0;
        newPermissions[itemIndex].permissions[0][3] = 0;
      }
    });
    setPermissions(newPermissions);
    setHasChanges(detectChanges());
  };

  // Fetch access matrix for selected user
  const fetchUserAccessMatrix = async (user) => {
    if (!user || !user._id || !user.roleId || !session?.user?.organizationId)
      return;
    setAccessMatrixLoading(true);
    try {
      const res = await fetch(
        "/api/access-matrix?controllerName=getAccessPermissionsForRoleOrName",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roleId: user.roleId._id || user.roleId,
            userId: user._id,
            organizationId: session.user.organizationId
          })
        }
      );
      const data = await res.json();
      if (res.ok && data && data.permissions) {
        // Transform API response
        const rolesArr = [{ _id: data.role._id, roleName: data.role.roleName }];
        setRoles(rolesArr);
        const perms = [];
        data.permissions
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .forEach((item) => {
            perms.push({
              itemId: item._id,
              name: item.name,
              icon: item.icon,
              parentId: null,
              sidebarName: item.sidebarName,
              order: item.order ?? 0,
              permissions: [
                [
                  item.permissions.create ? 1 : 0,
                  item.permissions.read ? 1 : 0,
                  item.permissions.update ? 1 : 0,
                  item.permissions.delete ? 1 : 0
                ]
              ]
            });
            if (
              Array.isArray(item.dynamicComponents) &&
              item.dynamicComponents.length > 0
            ) {
              item.dynamicComponents
                .slice()
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .forEach((component) => {
                  perms.push({
                    itemId: component._id,
                    name: component.componentName,
                    parentId: item._id,
                    sidebarName: item.sidebarName,
                    isComponent: true,
                    permissions: [[0, component.hasAccess ? 1 : 0, 0, 0]]
                  });
                });
            }
          });
        setPermissions(perms);
        setOriginalPermissions(clonePermissions(perms));
        // Sort groups by order using sidebarName -> min order
        const grouped = computeGroupedItems(perms);
        const groupOrderMap = Object.values(perms).reduce((map, item) => {
          const key = item.sidebarName;
          if (!key) return map;
          const ord = item.order ?? 0;
          if (map[key] === undefined) map[key] = ord;
          else map[key] = Math.min(map[key], ord);
          return map;
        }, {});
        const orderedGrouped = Object.keys(grouped)
          .sort((a, b) => (groupOrderMap[a] ?? 0) - (groupOrderMap[b] ?? 0))
          .reduce((acc, key) => {
            acc[key] = grouped[key]
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            return acc;
          }, {});
        setGroupedItems(orderedGrouped);
        setHasChanges(false);
      }
    } catch (error) {
      console.error("Failed to fetch user access matrix:", error);
    } finally {
      setAccessMatrixLoading(false);
    }
  };

  // Handle user select
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchUserAccessMatrix(user);
  };

  // Format permission data for API submission (user-level)
  const formatPermissionsForAPI = () => {
    if (!roles.length || !selectedUser || !session?.user?.organizationId) {
      setNotification({
        show: true,
        type: "error",
        title: "No user selected or missing organization.",
        message: "Please select a user and ensure organization is set."
      });
      return null;
    }
    const currentRoleId = roles[0]?._id;
    const userId = selectedUser._id;
    const organizationId = session.user.organizationId;
    const formattedPermissions = permissions
      .filter((item) => !item.isComponent)
      .filter((item) => item.permissions[0][1] === 1)
      .map((item) => {
        const permArray = item.permissions[0];
        const componentIds = permissions
          .filter(
            (comp) =>
              comp.isComponent &&
              comp.parentId === item.itemId &&
              comp.permissions[0][1] === 1
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
      userId,
      organizationId,
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
    console.log("formattedData While submitting", formattedData);
    try {
      // Always use updateAccessMatrix endpoint
      const apiEndpoint =
        "/api/access-matrix?controllerName=updateAccessMatrixForAbac";
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
      setNotification({
        show: true,
        type: "success",
        title: `Permissions for ${selectedUser.firstName} ${selectedUser.lastName} updated successfully`,
        message: ""
      });
      // Refresh the permissions for the current user after saving
      if (selectedUser) {
        await fetchUserAccessMatrix(selectedUser);
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
    <div className="container mx-auto">
      <Notification
        show={notification.show}
        setShow={(show) => setNotification((n) => ({ ...n, show }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
      <div className="mb-6 flex justify-start">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email"
            className="w-full px-4 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-600"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      {/* User Cards (Horizontal) */}
      {loading ? (
        <div className="flex gap-4 overflow-x-auto py-4 mb-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="min-w-[200px] bg-white border rounded-lg shadow p-4 flex flex-col items-center animate-pulse"
            >
              <div className="h-16 w-16 rounded-full bg-gray-300 mb-2" />
              <div className="h-4 w-24 bg-gray-300 rounded mb-1" />
              <div className="h-3 w-32 bg-gray-200 rounded mb-1" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : users.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto p-4 mb-6">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserSelect(user)}
              className={`min-w-[200px] bg-white border rounded-lg shadow p-4 flex flex-col items-center cursor-pointer transition duration-200 ${
                selectedUser && selectedUser._id === user._id
                  ? "border-blue-500 ring-3 ring-blue-300"
                  : "hover:border-blue-300"
              }`}
            >
              <Image
                loader={gcsImageLoader}
                src={user.profileImageUrl || fallbackImage}
                alt="profile"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover mb-2"
                unoptimized={Boolean(user.profileImageUrl)}
              />
              <p className="font-semibold text-gray-800 text-sm mb-1">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 mb-1">{user.email}</p>
              <p className="text-xs text-blue-500 font-medium">
                {user.roleId?.roleName}
              </p>
            </div>
          ))}
        </div>
      ) : searchTerm ? (
        <p className="text-sm text-gray-500 text-center mb-6">
          No users found.
        </p>
      ) : null}
      {/* Selected User Name */}
      {selectedUser && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">
            Managing permissions for:{" "}
            <span className="text-blue-600">
              {selectedUser.firstName} {selectedUser.lastName}
            </span>
          </h2>
        </div>
      )}
      {/* Access Matrix Table below user cards */}
      <AccessMatrixTable
        selectedRoleIndex={0}
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
        user={selectedUser}
        changedModules={changedModules}
      />
    </div>
  );
};

export default ABACComponent;
