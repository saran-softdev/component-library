import React from "react";
import {
  UserIcon,
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

const StaffManagementTopBar = ({
  users,
  roles,
  onAddUser,
  onToggleDeleted,
  showDeletedUsers,
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  onClearFilters,
  filteredCount
}) => (
  <div className="bg-white shadow-sm border-b border-gray-200">
    <div className="px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="mt-2 text-gray-600">
            Manage hotel staff members, roles, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onToggleDeleted(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !showDeletedUsers
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <UserIcon className="h-4 w-4 inline-block mr-2" />
              Active Staff
            </button>
            <button
              onClick={() => onToggleDeleted(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                showDeletedUsers
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <TrashIcon className="h-4 w-4 inline-block mr-2" />
              Deleted Staff
            </button>
          </div>
          <button
            onClick={onAddUser}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Staff
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Staff</p>
              <p className="text-2xl font-bold text-blue-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Active Staff</p>
              <p className="text-2xl font-bold text-green-900">
                {users.filter((u) => !u.deletedAt).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Roles</p>
              <p className="text-2xl font-bold text-purple-900">
                {roles.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.roleName}
                  </option>
                ))}
              </select>

              {(searchTerm || selectedRole) && (
                <button
                  onClick={onClearFilters}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredCount} of {users.length} staff members
        </div>
      </div>
    </div>
  </div>
);

export default StaffManagementTopBar;
