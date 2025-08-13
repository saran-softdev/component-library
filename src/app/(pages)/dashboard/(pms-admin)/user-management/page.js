"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "lucide-react";
import Notification from "@/custom-components/common/Notification";
import Image from "next/image";
import gcsImageLoader from "@/lib/gcs-image-loader";

// Modal Component
const UserModal = ({
  isOpen,
  onClose,
  isEditing,
  formData,
  handleInputChange,
  handleSubmit,
  loading,
  roles,
  organizations,
  showPassword,
  setShowPassword
}) => {
  if (!isOpen) return null;

  return (
    <section className="fixed inset-0 z-10 bg-black/60 bg-opacity-50 transition-opacity">
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? "Edit User" : "Create New User"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Last Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {!isEditing && "*"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={
                      isEditing
                        ? "Leave blank to keep current password"
                        : "Password"
                    }
                    required={!isEditing}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  name="profileImageUrl"
                  value={formData.profileImageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Profile Image URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization *
                </label>
                <select
                  name="organizationId"
                  value={formData.organizationId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Organization</option>
                  {organizations.map((org) => (
                    <option key={org._id} value={org._id}>
                      {org.organizationId}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Update User"
                  : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const UserManagement = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeletedUsers, setShowDeletedUsers] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    profileImageUrl: "",
    roleId: "",
    organizationId: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    title: "",
    message: ""
  });

  // Get session for user info
  const { data: session } = useSession();

  // Fetch users based on deleted status
  const fetchUsers = useCallback(async (getDeletedUsers = false) => {
    try {
      const endpoint = getDeletedUsers
        ? "/api/user?controllerName=userManagementGetDeletedUsers"
        : "/api/user?controllerName=getAllUsers";

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      throw err;
    }
  }, []);

  // Fetch roles
  const fetchRoles = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/role-management?controllerName=getRolesByCurrentUser"
      );
      if (!response.ok) throw new Error("Failed to fetch roles");

      const data = await response.json();
      setRoles(data.roles || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
      throw err;
    }
  }, []);

  // Fetch organizations
  const fetchOrganizations = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/organization-management?controllerName=getAllOrganizations"
      );
      if (!response.ok) throw new Error("Failed to fetch organizations");

      const data = await response.json();
      setOrganizations(data.organizations || []);
    } catch (err) {
      console.error("Error fetching organizations:", err);
      throw err;
    }
  }, []);

  // Initial data loading on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUsers(false), // Initially load active users
          fetchRoles(),
          fetchOrganizations()
        ]);
      } catch (err) {
        setError(err.message);
        setNotification({
          show: true,
          type: "error",
          title: "Error loading data",
          message: err.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchUsers, fetchRoles, fetchOrganizations]); // Only run once on mount

  // Separate effect for when showDeletedUsers changes - ONLY fetch users
  useEffect(() => {
    if (users.length > 0 || roles.length > 0) {
      // Only run after initial load
      const fetchUsersOnly = async () => {
        setLoading(true);
        try {
          await fetchUsers(showDeletedUsers);
        } catch (err) {
          setNotification({
            show: true,
            type: "error",
            title: "Failed to load users",
            message: err.message
          });
        } finally {
          setLoading(false);
        }
      };

      fetchUsersOnly();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDeletedUsers, fetchUsers]); // Only fetch users when toggle changes

  // Toggle between active and deleted users
  const toggleDeletedUsers = () => {
    setShowDeletedUsers(!showDeletedUsers);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      profileImageUrl: "",
      roleId: "",
      organizationId: ""
    });
    setIsEditing(false);
    setCurrentUserId(null);
    setShowForm(false);
  };

  // Load user data into form for editing
  const editUser = (user) => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "", // Password is not shown in edit mode
      phoneNumber: user.phoneNumber || "",
      profileImageUrl: user.profileImageUrl || "",
      roleId: user.roleId?._id || "",
      organizationId: user.organizationId || ""
    });
    setIsEditing(true);
    setCurrentUserId(user._id);
    setShowForm(true);
  };

  // Handle form submission (create or update user)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Prepare the data to send
      const userData = {
        ...formData,
        createdBy: session?.user?.id
      };
      console.log("userData:", userData);

      // If editing, include the user ID and mark as updated by current user
      if (isEditing) {
        userData.id = currentUserId;
        userData.updatedBy = session?.user?.id;
      }

      // Determine the endpoint based on whether we're creating or updating
      const endpoint = isEditing
        ? "/api/user?controllerName=updateUser"
        : "/api/user?controllerName=createUserByPmsAdmin";

      // Make the API request with the appropriate HTTP method
      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (
          errorData.error &&
          errorData.error.includes("duplicate key error")
        ) {
          if (errorData.error.includes("email")) {
            throw new Error(
              "Email already exists. Please use a different email address."
            );
          } else {
            throw new Error("Duplicate record exists: " + errorData.message);
          }
        } else {
          throw new Error(errorData.message || "Failed to save user");
        }
      }

      // Show success message
      setNotification({
        show: true,
        type: "success",
        title: isEditing
          ? "User updated successfully"
          : "User created successfully",
        message: ""
      });

      // Reset form and refresh user list
      resetForm();
      await fetchUsers(showDeletedUsers);
    } catch (err) {
      console.error("Error saving user:", err);
      setNotification({
        show: true,
        type: "error",
        title: "Failed to save user",
        message: err.message || "Failed to save user"
      });
    } finally {
      setLoading(false);
    }
  };

  // Soft delete a user
  const handleSoftDelete = async (userId) => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/user?controllerName=userManagementSoftDeleteUser",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            deletedBy: session?.user?.id
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }

      setNotification({
        show: true,
        type: "success",
        title: "User deleted successfully",
        message: ""
      });
      await fetchUsers(showDeletedUsers);
    } catch (err) {
      console.error("Error deleting user:", err);
      setNotification({
        show: true,
        type: "error",
        title: "Failed to delete user",
        message: err.message || "Failed to delete user"
      });
    } finally {
      setLoading(false);
    }
  };

  // Hard delete a user
  const handleHardDelete = async (userId) => {
    if (
      !confirm(
        "This action will permanently delete the user. This cannot be undone. Continue?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/user?controllerName=userManagementHardDeleteUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to permanently delete user"
        );
      }

      setNotification({
        show: true,
        type: "success",
        title: "User permanently deleted",
        message: ""
      });
      await fetchUsers(showDeletedUsers);
    } catch (err) {
      console.error("Error permanently deleting user:", err);
      setNotification({
        show: true,
        type: "error",
        title: "Failed to permanently delete user",
        message: err.message || "Failed to permanently delete user"
      });
    } finally {
      setLoading(false);
    }
  };

  // Restore a soft-deleted user
  const handleRestore = async (userId) => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/user?controllerName=userManagementRestoreUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            restoredBy: session?.user?.id
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to restore user");
      }

      setNotification({
        show: true,
        type: "success",
        title: "User restored successfully",
        message: ""
      });
      await fetchUsers(showDeletedUsers);
    } catch (err) {
      console.error("Error restoring user:", err);
      setNotification({
        show: true,
        type: "error",
        title: "Failed to restore user",
        message: err.message || "Failed to restore user"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Notification
        show={notification.show}
        setShow={(show) => setNotification((n) => ({ ...n, show }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* User Modal */}
      <UserModal
        isOpen={showForm}
        onClose={resetForm}
        isEditing={isEditing}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        loading={loading}
        roles={roles}
        organizations={organizations}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              User Management
            </h1>
            <p className="text-gray-600 text-sm">
              Manage system users, roles, and permissions
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={toggleDeletedUsers}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                showDeletedUsers
                  ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              👤 {showDeletedUsers ? "Active Users" : "Deleted Users"}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add New User
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-lg p-2 mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-semibold text-blue-900">
                  {users ? users.length + (showDeletedUsers ? 0 : 0) : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-lg p-2 mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-green-600 text-sm font-medium">
                  Active Users
                </p>
                <p className="text-2xl font-semibold text-green-900">
                  {!showDeletedUsers ? (users ? users.length : 0) : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-lg p-2 mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-purple-600 text-sm font-medium">Roles</p>
                <p className="text-2xl font-semibold text-purple-900">
                  {roles ? roles.length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Search and Filter Section */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]">
                <option>All Roles</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3 text-sm text-gray-500">
              Showing {users ? users.length : 0} of {users ? users.length : 0}{" "}
              users
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-black">
                              {user.firstName?.[0]?.toUpperCase()}
                              {user.lastName?.[0]?.toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user._id.slice(-6)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <svg
                              className="w-4 h-4 text-gray-400 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <svg
                              className="w-4 h-4 text-gray-400 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            {user.phoneNumber || "No phone"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {user.roleId?.roleName || "No role"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {showDeletedUsers ? "Deleted" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {!showDeletedUsers ? (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => editUser(user)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleSoftDelete(user._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleRestore(user._id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Restore
                              </button>
                              <button
                                onClick={() => handleHardDelete(user._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete Permanently
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-12 h-12 text-gray-300 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <p>No users found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default UserManagement;
