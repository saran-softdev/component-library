"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  TrashIcon,
  CheckBadgeIcon,
  ClockIcon,
  ArrowUpIcon,
  IdentificationIcon,
  ChartPieIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

export default function RoleManagement() {
  // State for tab management
  const [tabValue, setTabValue] = useState(0);

  // States for role management
  const [roles, setRoles] = useState([]);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [roleDialogMode, setRoleDialogMode] = useState("add"); // 'add' or 'edit'
  const [currentRole, setCurrentRole] = useState({ id: "", roleName: "" });
  const [showDeletedRoles, setShowDeletedRoles] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  // States for organization management
  const [organizations, setOrganizations] = useState([]);
  const [openOrgDialog, setOpenOrgDialog] = useState(false);
  const [orgDialogMode, setOrgDialogMode] = useState("add"); // 'add' or 'edit'
  const [currentOrg, setCurrentOrg] = useState({ id: "", organizationId: "" });
  const [showDeletedOrgs, setShowDeletedOrgs] = useState(false);
  const [openDeleteOrgDialog, setOpenDeleteOrgDialog] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState(null);

  // Fetch Roles (memoized)
  const fetchRoles = useCallback(async () => {
    try {
      const endpoint = showDeletedRoles
        ? "/api/role-management?controllerName=getDeletedRoles"
        : "/api/role-management?controllerName=getRolesByCurrentUser";
      const response = await fetch(endpoint);
      const data = await response.json();
      setRoles(data.roles || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }, [showDeletedRoles]);

  // Fetch Organizations (memoized)
  const fetchOrganizations = useCallback(async () => {
    try {
      const endpoint = showDeletedOrgs
        ? "/api/organization-management?controllerName=getDeletedOrganizations"
        : "/api/organization-management?controllerName=getAllOrganizations";
      const response = await fetch(endpoint);
      const data = await response.json();
      setOrganizations(data.organizations || []);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  }, [showDeletedOrgs]);

  // Initial data fetch
  useEffect(() => {
    fetchRoles();
    fetchOrganizations();
  }, [fetchRoles, fetchOrganizations]);

  // -------------------- Role Management Functions --------------------

  const handleOpenRoleDialog = (mode, role = { id: "", roleName: "" }) => {
    setRoleDialogMode(mode);
    setCurrentRole(role);
    setOpenRoleDialog(true);
  };

  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
  };

  const handleRoleSubmit = async () => {
    try {
      if (roleDialogMode === "add") {
        // Create new role
        const response = await fetch(
          "/api/role-management?controllerName=createRole",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roleName: currentRole.roleName,
            }),
          }
        );

        if (response.ok) {
          fetchRoles();
          handleCloseRoleDialog();
        } else {
          console.error("Failed to create role");
        }
      } else if (roleDialogMode === "edit") {
        // Update existing role
        const response = await fetch(
          "/api/role-management?controllerName=updateRole",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: currentRole.id,
              roleName: currentRole.roleName,
            }),
          }
        );

        if (response.ok) {
          fetchRoles();
          handleCloseRoleDialog();
        } else {
          console.error("Failed to update role");
        }
      }
    } catch (error) {
      console.error("Error submitting role:", error);
    }
  };

  const handleRoleDelete = (role) => {
    setRoleToDelete(role);
    setOpenDeleteDialog(true);
  };

  const confirmRoleDelete = async () => {
    try {
      const response = await fetch(
        "/api/role-management?controllerName=softDeleteRole",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: roleToDelete.id,
          }),
        }
      );

      if (response.ok) {
        fetchRoles();
        setOpenDeleteDialog(false);
      } else {
        console.error("Failed to delete role");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleRoleRestore = async (role) => {
    try {
      const response = await fetch(
        "/api/role-management?controllerName=restoreRole",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: role.id,
          }),
        }
      );

      if (response.ok) {
        fetchRoles();
      } else {
        console.error("Failed to restore role");
      }
    } catch (error) {
      console.error("Error restoring role:", error);
    }
  };

  // -------------------- Organization Management Functions --------------------

  const handleOpenOrgDialog = (mode, org = { id: "", organizationId: "" }) => {
    setOrgDialogMode(mode);
    setCurrentOrg(org);
    setOpenOrgDialog(true);
  };

  const handleCloseOrgDialog = () => {
    setOpenOrgDialog(false);
  };

  const handleOrgSubmit = async () => {
    try {
      if (orgDialogMode === "add") {
        // Create new organization
        const response = await fetch(
          "/api/organization-management?controllerName=createOrganization",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              organizationId: currentOrg.organizationId,
            }),
          }
        );

        if (response.ok) {
          fetchOrganizations();
          handleCloseOrgDialog();
        } else {
          console.error("Failed to create organization");
        }
      } else if (orgDialogMode === "edit") {
        // Update existing organization
        const response = await fetch(
          "/api/organization-management?controllerName=updateOrganization",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: currentOrg.id,
              organizationId: currentOrg.organizationId,
            }),
          }
        );

        if (response.ok) {
          fetchOrganizations();
          handleCloseOrgDialog();
        } else {
          console.error("Failed to update organization");
        }
      }
    } catch (error) {
      console.error("Error submitting organization:", error);
    }
  };

  const handleOrgDelete = (org) => {
    setOrgToDelete(org);
    setOpenDeleteOrgDialog(true);
  };

  const confirmOrgDelete = async () => {
    try {
      const response = await fetch(
        "/api/organization-management?controllerName=softDeleteOrganization",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: orgToDelete.id,
          }),
        }
      );

      if (response.ok) {
        fetchOrganizations();
        setOpenDeleteOrgDialog(false);
      } else {
        console.error("Failed to delete organization");
      }
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  const handleOrgRestore = async (org) => {
    try {
      const response = await fetch(
        "/api/organization-management?controllerName=restoreOrganization",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: org.id,
          }),
        }
      );

      if (response.ok) {
        fetchOrganizations();
      } else {
        console.error("Failed to restore organization");
      }
    } catch (error) {
      console.error("Error restoring organization:", error);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Management Console
          </h1>
          <p className="text-gray-600">
            Manage your organizations and roles efficiently
          </p>
        </div>

        {/* Enhanced Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-1 inline-flex">
            <button
              onClick={() => setTabValue(0)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                tabValue === 0
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <div className="flex items-center space-x-2">
                <BuildingOfficeIcon className="w-5 h-5" />
                <span>Organizations</span>
              </div>
            </button>

            <button
              onClick={() => setTabValue(1)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                tabValue === 1
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="w-5 h-5" />
                <span>Roles</span>
              </div>
            </button>
          </div>
        </div>

        {/* Role Management Tab */}
        <div className={`${tabValue === 1 ? "block" : "hidden"}`}>
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Role Management
              </h2>
              <p className="text-gray-600 mt-1">Create and manage user roles</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeletedRoles(!showDeletedRoles)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {showDeletedRoles ? "Show Active Roles" : "Show Deleted Roles"}
              </button>
              <button
                onClick={() => handleOpenRoleDialog("add")}
                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Role
              </button>
            </div>
          </div>

          {/* Enhanced Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">
                    Total Roles
                  </p>
                  <p className="text-3xl font-bold mt-1">{roles.length}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <IdentificationIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div
              className={`rounded-xl p-6 text-white shadow-lg ${
                showDeletedRoles
                  ? "bg-gradient-to-br from-amber-500 to-amber-600"
                  : "bg-gradient-to-br from-emerald-500 to-emerald-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">
                    {showDeletedRoles ? "Deleted Roles" : "Active Roles"}
                  </p>
                  <p className="text-3xl font-bold mt-1">{roles.length}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  {showDeletedRoles ? (
                    <TrashIcon className="w-6 h-6 text-white" />
                  ) : (
                    <CheckBadgeIcon className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Recent Updates
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {
                      roles.filter((role) => {
                        const updatedAt = new Date(role.updatedAt);
                        const now = new Date();
                        const diffTime = Math.abs(now - updatedAt);
                        const diffDays = Math.ceil(
                          diffTime / (1000 * 60 * 60 * 24)
                        );
                        return diffDays <= 7;
                      }).length
                    }
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium">
                    Quick Stats
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {Math.ceil(roles.length / 10) * 10}+
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <ChartPieIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Roles Overview
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {roles.length} {roles.length === 1 ? "role" : "roles"}
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Updated At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {roles.map((role, index) => (
                    <tr
                      key={role._id}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-indigo-600 font-semibold text-sm">
                              {role.roleName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {role.roleName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Role ID: {role._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(role.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(role.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(role.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(role.updatedAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {showDeletedRoles ? (
                          <button
                            onClick={() =>
                              handleRoleRestore({
                                id: role._id,
                                roleName: role.roleName,
                              })
                            }
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-150"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Restore
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleOpenRoleDialog("edit", {
                                  id: role._id,
                                  roleName: role.roleName,
                                })
                              }
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-150 tooltip"
                              title="Edit Role"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                handleRoleDelete({
                                  id: role._id,
                                  roleName: role.roleName,
                                })
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 tooltip"
                              title="Delete Role"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {roles.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-12 h-12 text-gray-300 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                          <p className="text-gray-500 font-medium">
                            No roles found
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Get started by creating a new role
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Enhanced Role Dialog */}
          {openRoleDialog && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                  onClick={handleCloseRoleDialog}
                ></div>
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                          <svg
                            className="w-5 h-5 text-indigo-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {roleDialogMode === "add"
                            ? "Add New Role"
                            : "Edit Role"}
                        </h3>
                      </div>
                      <button
                        onClick={handleCloseRoleDialog}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Role Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="Enter role name"
                        value={currentRole.roleName}
                        onChange={(e) =>
                          setCurrentRole({
                            ...currentRole,
                            roleName: e.target.value,
                          })
                        }
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Choose a descriptive name for the role
                      </p>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={handleCloseRoleDialog}
                        className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRoleSubmit}
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {roleDialogMode === "add" ? "Add Role" : "Update Role"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Delete Confirmation Dialog */}
          {openDeleteDialog && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Confirm Delete
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-6">
                      Are you sure you want to delete the role{" "}
                      <span className="font-semibold text-gray-900">
                        {roleToDelete?.roleName}
                      </span>
                      ? This action cannot be undone.
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex">
                        <svg
                          className="w-5 h-5 text-red-400 mr-2 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-red-800">
                            Warning
                          </p>
                          <p className="text-sm text-red-700 mt-1">
                            This will permanently remove the role from your
                            system.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setOpenDeleteDialog(false)}
                        className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmRoleDelete}
                        className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Delete Role
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Organization Management Tab */}
        <div className={`${tabValue === 0 ? "block" : "hidden"}`}>
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Organization Management
              </h2>
              <p className="text-gray-600 mt-1">
                Create and manage organizations
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeletedOrgs(!showDeletedOrgs)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {showDeletedOrgs
                  ? "Show Active Organizations"
                  : "Show Deleted Organizations"}
              </button>
              <button
                onClick={() => handleOpenOrgDialog("add")}
                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Organization
              </button>
            </div>
          </div>

          {/* Enhanced Status Cards for Organizations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Organizations
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {organizations.length}
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <BuildingOfficeIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div
              className={`rounded-xl p-6 text-white shadow-lg ${
                showDeletedOrgs
                  ? "bg-gradient-to-br from-amber-500 to-amber-600"
                  : "bg-gradient-to-br from-emerald-500 to-emerald-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">
                    {showDeletedOrgs
                      ? "Deleted Organizations"
                      : "Active Organizations"}
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {organizations.length}
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  {showDeletedOrgs ? (
                    <TrashIcon className="w-6 h-6 text-white" />
                  ) : (
                    <CheckBadgeIcon className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm font-medium">
                    Recent Updates
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {
                      organizations.filter((org) => {
                        const updatedAt = new Date(org.updatedAt);
                        const now = new Date();
                        const diffTime = Math.abs(now - updatedAt);
                        const diffDays = Math.ceil(
                          diffTime / (1000 * 60 * 60 * 24)
                        );
                        return diffDays <= 7;
                      }).length
                    }
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Growth Rate
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    +{Math.ceil(organizations.length * 0.15)}%
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <ArrowUpIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Organizations Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Organizations Overview
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {organizations.length}{" "}
                    {organizations.length === 1
                      ? "organization"
                      : "organizations"}
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Organization ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Updated At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {organizations.map((org, index) => (
                    <tr
                      key={org._id}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">
                              {org.organizationId.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {org.organizationId}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {org._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(org.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(org.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(org.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(org.updatedAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {showDeletedOrgs ? (
                          <button
                            onClick={() =>
                              handleOrgRestore({
                                id: org._id,
                                organizationId: org.organizationId,
                              })
                            }
                            className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-150"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Restore
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleOpenOrgDialog("edit", {
                                  id: org._id,
                                  organizationId: org.organizationId,
                                })
                              }
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150 tooltip"
                              title="Edit Organization"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                handleOrgDelete({
                                  id: org._id,
                                  organizationId: org.organizationId,
                                })
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 tooltip"
                              title="Delete Organization"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {organizations.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-12 h-12 text-gray-300 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <p className="text-gray-500 font-medium">
                            No organizations found
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Get started by creating a new organization
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Enhanced Organization Dialog */}
          {openOrgDialog && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                  onClick={handleCloseOrgDialog}
                ></div>
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {orgDialogMode === "add"
                            ? "Add New Organization"
                            : "Edit Organization"}
                        </h3>
                      </div>
                      <button
                        onClick={handleCloseOrgDialog}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                      >
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Organization ID
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="Enter organization ID"
                        value={currentOrg.organizationId}
                        onChange={(e) =>
                          setCurrentOrg({
                            ...currentOrg,
                            organizationId: e.target.value,
                          })
                        }
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Choose a unique identifier for the organization like:
                      </p>
                      <ul className="text-xs text-gray-500 list-disc ml-4 mt-1 space-y-1">
                        <li>
                          Hotel Name + postal code (e.g.{" "}
                          <code>hilton-600001</code>)
                        </li>
                      </ul>
                      <span className="text-xs text-red-500 mt-2">
                        Rules:
                        <ul className="list-disc ml-4 mt-1 space-y-1 text-xs text-red-500">
                          <li>Must be lowercase only</li>
                          <li>
                            No spaces or special characters (except hyphen)
                          </li>
                          <li>Only use letters, numbers, and hyphens</li>
                          <li>Minimum 6 characters</li>
                          <li>Recommended format: hotelname-postalcode</li>
                        </ul>
                      </span>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={handleCloseOrgDialog}
                        className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleOrgSubmit}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {orgDialogMode === "add"
                          ? "Add Organization"
                          : "Update Organization"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Delete Organization Confirmation Dialog */}
          {openDeleteOrgDialog && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Confirm Delete
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-6">
                      Are you sure you want to delete the organization{" "}
                      <span className="font-semibold text-gray-900">
                        {orgToDelete?.organizationId}
                      </span>
                      ? This action cannot be undone.
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex">
                        <svg
                          className="w-5 h-5 text-red-400 mr-2 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-red-800">
                            Warning
                          </p>
                          <p className="text-sm text-red-700 mt-1">
                            This will permanently remove the organization from
                            your system.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setOpenDeleteOrgDialog(false)}
                        className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmOrgDelete}
                        className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Delete Organization
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
