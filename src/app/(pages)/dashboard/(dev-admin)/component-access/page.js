"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

const Page = () => {
  const router = useRouter();
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sidebar items
  const [sidebarItems, setSidebarItems] = useState([]);
  const [groupedSidebars, setGroupedSidebars] = useState({});
  const [loadingSidebar, setLoadingSidebar] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, delete
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    componentName: "",
    description: "",
    status: "active",
    usageLocation: ""
  });

  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const componentsPerPage = 10;

  // Fetch sidebar items
  const fetchSidebarItems = async () => {
    setLoadingSidebar(true);
    try {
      const response = await fetch(
        `/api/sidebar?controllerName=getAllSidebarItemsNoFilter`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch sidebar items");
      }
      const data = await response.json();
      const sidebars = data.sidebars || [];
      setSidebarItems(sidebars);

      // Group sidebars by sidebarName
      const grouped = sidebars.reduce((acc, item) => {
        if (!acc[item.sidebarName]) {
          acc[item.sidebarName] = [];
        }
        acc[item.sidebarName].push(item);
        return acc;
      }, {});

      setGroupedSidebars(grouped);

      // Initialize all groups as expanded
      const initialExpanded = {};
      Object.keys(grouped).forEach((group) => {
        initialExpanded[group] = true;
      });
      setExpandedGroups(initialExpanded);
    } catch (err) {
      console.error("Error fetching sidebar items:", err);
      setSidebarItems([]);
      setGroupedSidebars({});
    } finally {
      setLoadingSidebar(false);
    }
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Fetch components (memoized to avoid unstable dependency in useEffect)
  const fetchComponents = useCallback(async ({ searchQuery, status } = {}) => {
    setLoading(true);
    try {
      let url = `/api/dynamic-components?controllerName=getAllComponents`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (status) url += `&status=${encodeURIComponent(status)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch components");
      }
      const data = await response.json();
      setComponents(data.components || []);
    } catch (err) {
      console.error("Error fetching components:", err);
      setError("Failed to load components. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data load + refetch on status filter change
  useEffect(() => {
    fetchComponents({ status: statusFilter });
  }, [statusFilter, fetchComponents]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchComponents({ searchQuery: search, status: statusFilter });
  };

  // Open modal for create/edit/delete
  const openModal = (mode, component = null) => {
    setModalMode(mode);
    if (component) {
      setSelectedComponent(component);
      setFormData({
        componentName: component.componentName,
        description: component.description || "",
        status: component.status,
        usageLocation: component.usageLocationId || ""
      });
    } else {
      setSelectedComponent(null);
      setFormData({
        componentName: "",
        description: "",
        status: "active",
        usageLocation: ""
      });
    }
    fetchSidebarItems();
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generate a location identifier that combines sidebarName and name
  const getLocationId = (sidebarItem) => {
    return `${sidebarItem.sidebarName} > ${sidebarItem.name}`;
  };

  // Handle location selection (single select)
  const handleLocationSelect = (sidebarItemId) => {
    setFormData((prev) => ({ ...prev, usageLocation: sidebarItemId }));
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === "create") {
        const response = await fetch(
          `/api/dynamic-components?controllerName=createComponent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create component");
        }
      } else if (modalMode === "edit") {
        const response = await fetch(
          `/api/dynamic-components?controllerName=updateComponent&id=${selectedComponent._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update component");
        }
      }

      closeModal();
      fetchComponents();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  // Delete component
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `/api/dynamic-components?controllerName=deleteComponent&id=${selectedComponent._id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete component");
      }

      closeModal();
      fetchComponents();
    } catch (err) {
      console.error("Error deleting component:", err);
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  // Restore component
  const handleRestore = async (componentId) => {
    try {
      const response = await fetch(
        `/api/dynamic-components?controllerName=restoreComponent&id=${componentId}`,
        {
          method: "POST"
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to restore component");
      }

      fetchComponents();
    } catch (err) {
      console.error("Error restoring component:", err);
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  // Pagination logic
  const indexOfLastComponent = currentPage * componentsPerPage;
  const indexOfFirstComponent = indexOfLastComponent - componentsPerPage;
  const currentComponents = components.slice(
    indexOfFirstComponent,
    indexOfLastComponent
  );
  const totalPages = Math.ceil(components.length / componentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dynamic Components</h1>
        <button
          onClick={() => openModal("create")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add Component
        </button>
      </div>

      {/* Search and filter */}
      <div className="flex items-center mb-6 space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="absolute right-0 top-0 h-full px-4 bg-gray-100 hover:bg-gray-200 border-l rounded-r-md"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-gray-700">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <button
          onClick={fetchComponents}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
        >
          <ArrowPathIcon className="h-5 w-5 mr-1" />
          Refresh
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Components table */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage Location
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentComponents.length > 0 ? (
                currentComponents.map((component) => (
                  <tr key={component._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {component.componentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {component.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          component.status === "active"
                            ? "bg-green-100 text-green-800"
                            : component.status === "inactive"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {component.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {component.usageLocationDisplay || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModal("edit", component)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openModal("delete", component)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No components found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-l-md border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 border-t border-b ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-r-md border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Modal */}
      <div>
        {showModal && (
          <div className="fixed inset-0 z-10 overflow-y-auto bg-black/50 bg-opacity-75">
            <div className="flex items-center justify-center min-h-screen">
              <div className="bg-white rounded-lg shadow-xl max-w-xl w-full mx-4 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium mb-6">
                    {modalMode === "delete"
                      ? "Delete Component"
                      : modalMode === "create"
                      ? "Add New Component"
                      : "Edit Component"}
                  </h2>

                  {modalMode === "delete" ? (
                    <div>
                      <p className="text-gray-700 mb-6">
                        Are you sure you want to delete &quot;
                        {selectedComponent?.componentName}&quot;? This action
                        cannot be undone.
                      </p>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm text-white hover:bg-red-700"
                          onClick={handleDelete}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Component Name*
                        </label>
                        <input
                          type="text"
                          name="componentName"
                          value={formData.componentName}
                          onChange={handleChange}
                          required
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="5"
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Usage Location
                        </label>

                        {loadingSidebar ? (
                          <div className="py-4 text-center text-gray-500 border border-gray-300 rounded-md">
                            Loading sidebar items...
                          </div>
                        ) : Object.keys(groupedSidebars).length > 0 ? (
                          <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                            {Object.entries(groupedSidebars).map(
                              ([groupName, items]) => (
                                <div
                                  key={groupName}
                                  className="border-b border-gray-200 last:border-b-0"
                                >
                                  <div
                                    className="flex items-center justify-between px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100"
                                    onClick={() =>
                                      toggleGroupExpansion(groupName)
                                    }
                                  >
                                    <span className="font-medium text-gray-700">
                                      {groupName}
                                    </span>
                                    <button
                                      type="button"
                                      className="focus:outline-none"
                                    >
                                      {expandedGroups[groupName] ? (
                                        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                                      ) : (
                                        <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                                      )}
                                    </button>
                                  </div>

                                  {expandedGroups[groupName] &&
                                    items.map((item) => {
                                      const locationId = getLocationId(item);
                                      return (
                                        <div
                                          key={item._id}
                                          className="flex items-center px-3 py-2 pl-6 hover:bg-gray-50 border-t border-gray-200"
                                        >
                                          <input
                                            type="radio"
                                            name="usageLocation"
                                            id={`location-${item._id}`}
                                            checked={
                                              formData.usageLocation ===
                                              item._id
                                            }
                                            onChange={() =>
                                              handleLocationSelect(item._id)
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                          />
                                          <label
                                            htmlFor={`location-${item._id}`}
                                            className="ml-2 block text-sm text-gray-700 cursor-pointer w-full"
                                          >
                                            {item.name}
                                          </label>
                                        </div>
                                      );
                                    })}
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="py-4 text-center text-gray-500 border border-gray-300 rounded-md">
                            No sidebar items found
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm text-white hover:bg-blue-700"
                        >
                          {modalMode === "create" ? "Create" : "Update"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
