import React from "react";

const AccessMatrixTable = ({
  selectedRoleIndex,
  originalPermissions,
  hasChanges,
  saving,
  saveMessage,
  groupedItems,
  crudOperations,
  getIconComponent,
  getPermissionClass,
  getDynamicComponents,
  togglePermission,
  toggleAllPermissions,
  initiatePermissionSave,
  setPermissions,
  setHasChanges,
  clonePermissions
}) => {
  return (
    <section>
      {" "}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 shadow-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-200">
                ROLE / PERMISSION
              </th>
              {crudOperations.map((operation) => (
                <th
                  key={operation}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-200"
                >
                  {operation}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Render grouped sidebar items */}
            {Object.keys(groupedItems).map((groupName) => {
              // Items for this group (includes mains and components)
              const groupItems = groupedItems[groupName] || [];
              // Items are already sorted by order in parent, but ensure main items keep order
              const mainItems = groupItems.filter((item) => !item.isComponent);
              const groupDynamicComponents = groupItems.filter(
                (item) => item.isComponent
              );

              return (
                <React.Fragment key={groupName}>
                  {/* Group header */}
                  <tr className="bg-gray-100">
                    <td
                      colSpan={5}
                      className="px-4 py-2 text-sm font-medium text-gray-900 border-r border-gray-200"
                    >
                      <div className="font-semibold">{groupName}</div>
                    </td>
                  </tr>

                  {/* Select all row */}
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-700 border-r border-gray-200">
                      <div className="pl-2 text-sm italic text-blue-600 font-medium hover:underline cursor-pointer transition duration-200">
                        Select All for {groupName}
                      </div>
                    </td>
                    {crudOperations.map((operation, crudIndex) => {
                      const allItems = [...groupItems];
                      const allGranted = allItems.every(
                        (item) =>
                          item.permissions[selectedRoleIndex][crudIndex] === 1
                      );

                      return (
                        <td
                          key={`select-all-${crudIndex}`}
                          className="px-2 py-2 text-center border-r border-gray-200"
                          onClick={() =>
                            toggleAllPermissions(crudIndex, groupName)
                          }
                        >
                          <div
                            className={`mx-auto w-8 h-8 rounded border cursor-pointer transition-colors duration-200 ${
                              allGranted
                                ? "bg-green-100 border-green-300"
                                : "bg-red-100 border-red-300"
                            }`}
                          ></div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Main items and their dynamic components inline */}
                  {mainItems.map((item) => {
                    const Icon = getIconComponent(item.icon);
                    const children = groupDynamicComponents.filter(
                      (c) => c.parentId === item.itemId
                    );

                    return (
                      <React.Fragment key={item.itemId}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                            <div className="flex items-center">
                              <Icon className="h-5 w-5 mr-2 text-gray-500" />
                              <span>{item.name}</span>
                            </div>
                          </td>
                          {crudOperations.map((operation, crudIndex) => (
                            <td
                              key={`${item.itemId}-${crudIndex}`}
                              className="px-2 py-2 text-center border-r border-gray-200"
                            >
                              <div
                                className={`mx-auto w-8 h-8 rounded border cursor-pointer transition-colors duration-200 ${getPermissionClass(
                                  item.permissions[selectedRoleIndex][crudIndex]
                                )}`}
                                onClick={() =>
                                  togglePermission(item.itemId, crudIndex)
                                }
                              ></div>
                            </td>
                          ))}
                        </tr>

                        {/* Children directly below the parent */}
                        {children.length > 0 && (
                          <>
                            <tr className="bg-gray-50">
                              <td
                                colSpan={5}
                                className="px-4 py-1 text-sm font-medium text-gray-700 border-r border-gray-200"
                              >
                                <div className="pl-8 text-xs italic">
                                  Dynamic Components for {item.name}
                                </div>
                              </td>
                            </tr>
                            {children.map((component) => (
                              <tr
                                key={component.itemId}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                                  <div className="flex items-center pl-12">
                                    <span className="text-gray-600">
                                      {component.name}
                                    </span>
                                  </div>
                                </td>
                                {crudOperations.map((operation, crudIndex) => (
                                  <td
                                    key={`${component.itemId}-${crudIndex}`}
                                    className="px-2 py-2 text-center border-r border-gray-200"
                                  >
                                    <div
                                      className={
                                        crudIndex === 1
                                          ? `mx-auto w-8 h-8 rounded border cursor-pointer transition-colors duration-200 ${getPermissionClass(
                                              component.permissions[
                                                selectedRoleIndex
                                              ][crudIndex]
                                            )}`
                                          : `mx-auto w-8 h-8 rounded border bg-gray-200 border-gray-300 opacity-60 cursor-not-allowed`
                                      }
                                      onClick={() => {
                                        if (crudIndex === 1) {
                                          togglePermission(
                                            component.itemId,
                                            crudIndex
                                          );
                                        }
                                      }}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex items-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
          <span>Allowed</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
          <span>Denied</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded mr-2 opacity-60"></div>
          <span>Read-only (Dynamic Components)</span>
        </div>
      </div>
      {/* Save message alert */}
      {saveMessage && (
        <div
          className={`mt-4 p-3 rounded-md ${
            saveMessage.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {saveMessage.text}
        </div>
      )}
      <div className="mt-6">
        <button
          className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded ${
            saving || !hasChanges ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={initiatePermissionSave}
          disabled={saving || !hasChanges}
        >
          {saving ? "Saving..." : "Save Permissions"}
        </button>

        {hasChanges && (
          <button
            className="ml-3 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
            onClick={() => {
              setPermissions(clonePermissions(originalPermissions));
              setHasChanges(false);
            }}
          >
            Reset Changes
          </button>
        )}
      </div>
    </section>
  );
};

export default AccessMatrixTable;
