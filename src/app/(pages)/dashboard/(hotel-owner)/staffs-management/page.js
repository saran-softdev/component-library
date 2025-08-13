"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "lucide-react";
import StaffForm from "./(components)/StaffForm";
import StaffTable from "./(components)/StaffTable";
import LoadingSpinner from "./(components)/LoadingSpinner";
import ErrorAlert from "./(components)/ErrorAlert";
import StaffManagementTopBar from "./(components)/StaffManagementTopBar";
import Notification from "@/custom-components/common/Notification";

const StaffManagement = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeletedUsers, setShowDeletedUsers] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    roleId: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    title: "",
    message: ""
  });

  const { data: session } = useSession();

  // Filter and search functionality
  useEffect(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = !selectedRole || user.roleId?._id === selectedRole;

      return matchesSearch && matchesRole;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchTerm, selectedRole]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Fetch users based on deleted status
  const fetchUsers = useCallback(async () => {
    try {
      const endpoint = showDeletedUsers
        ? "/api/user?controllerName=getDeletedUsers"
        : "/api/user?controllerName=getAllStaffsForHotelOwner";
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      throw err;
    }
  }, [showDeletedUsers]);

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

  // Fetch all data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchUsers();
        await fetchRoles();
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
    fetchData();
  }, [fetchUsers, fetchRoles]);

  // Toggle between active and deleted users
  const toggleDeletedUsers = useCallback(async () => {
    setShowDeletedUsers((prev) => !prev);
  }, []);

  // Handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Reset form to default values
  const resetForm = useCallback(() => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      roleId: ""
    });
    setIsEditing(false);
    setCurrentUserId(null);
    setShowForm(false);
  }, []);

  // Load user data into form for editing
  const editUser = useCallback((user) => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "",
      phoneNumber: user.phoneNumber || "",
      roleId: user.roleId?._id || ""
    });
    setIsEditing(true);
    setCurrentUserId(user._id);
    setShowForm(true);
  }, []);

  // Handle form submission (create or update user)
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const userData = {
          ...formData,
          createdBy: session?.user?.id
        };

        if (isEditing) {
          userData.id = currentUserId;
          userData.updatedBy = session?.user?.id;
        }

        const endpoint = isEditing
          ? "/api/user?controllerName=updateUser"
          : "/api/user?controllerName=createStaffForHotelOwner";

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

        setNotification({
          show: true,
          type: "success",
          title: isEditing
            ? "Staff updated successfully"
            : "Staff created successfully",
          message: ""
        });
        resetForm();
        await fetchUsers();
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
    },
    [formData, session, isEditing, currentUserId, fetchUsers, resetForm]
  );

  // Soft delete a user
  const handleSoftDelete = useCallback(
    async (userId) => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/user?controllerName=softDeleteUser",
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
          title: "Staff deleted successfully",
          message: ""
        });
        setDeleteConfirmUser(null);
        await fetchUsers();
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
    },
    [session, fetchUsers]
  );

  // Hard delete a user
  const handleHardDelete = useCallback(
    async (userId) => {
      if (
        !confirm(
          "This action will permanently delete the staff member. This cannot be undone. Continue?"
        )
      ) {
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          "/api/user?controllerName=hardDeleteUser",
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
          title: "Staff permanently deleted",
          message: ""
        });
        await fetchUsers();
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
    },
    [fetchUsers]
  );

  // Restore a soft-deleted user
  const handleRestore = useCallback(
    async (userId) => {
      try {
        setLoading(true);
        const response = await fetch("/api/user?controllerName=restoreUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            restoredBy: session?.user?.id
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to restore user");
        }

        setNotification({
          show: true,
          type: "success",
          title: "Staff restored successfully",
          message: ""
        });
        await fetchUsers();
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
    },
    [session, fetchUsers]
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRole("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification
        show={notification.show}
        setShow={(show) => setNotification((n) => ({ ...n, show }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
      <StaffManagementTopBar
        users={users}
        roles={roles}
        onAddUser={() => setShowForm(true)}
        onToggleDeleted={toggleDeletedUsers}
        showDeletedUsers={showDeletedUsers}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        onClearFilters={clearFilters}
        filteredCount={filteredUsers.length}
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorAlert error={error} />
      ) : (
        <>
          <StaffForm
            showForm={showForm}
            isEditing={isEditing}
            formData={formData}
            roles={roles}
            showPassword={showPassword}
            loading={loading}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            onTogglePassword={() => setShowPassword((prev) => !prev)}
          />
          <StaffTable
            users={currentUsers}
            organizations={organizations}
            showDeletedUsers={showDeletedUsers}
            onEdit={editUser}
            onSoftDelete={(userId) =>
              setDeleteConfirmUser(users.find((u) => u._id === userId))
            }
            onRestore={handleRestore}
            onHardDelete={handleHardDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            filteredUsers={filteredUsers}
            usersPerPage={usersPerPage}
            deleteConfirmUser={deleteConfirmUser}
            setDeleteConfirmUser={setDeleteConfirmUser}
            onConfirmDelete={handleSoftDelete}
          />
        </>
      )}
    </div>
  );
};

export default StaffManagement;
