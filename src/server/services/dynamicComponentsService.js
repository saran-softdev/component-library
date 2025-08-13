// 📁 /server/Services/dynamicComponentsService.js
import DynamicComponents from "@/server/models/Dashboard/dynamicComponentsModel";
import SidebarItem from "@/server/models/Dashboard/sidebarModel";

export const createComponentService = async (data) => {
  const { componentName, description, status, usageLocation, createdBy } = data;

  // Validate required fields
  if (!componentName) {
    throw new Error("Component name is required");
  }

  // Check if component with same name already exists
  const existingComponent = await DynamicComponents.findOne({
    componentName,
    isDeleted: false
  });

  if (existingComponent) {
    throw new Error("Component with this name already exists");
  }

  // Create new component
  const newComponent = await DynamicComponents.create({
    componentName,
    description: description || "",
    status: status || "active",
    usageLocation: usageLocation || [],
    createdBy: createdBy
  });

  return newComponent;
};

export const getAllComponentsService = async (filters = {}) => {
  const { status, search } = filters;

  const query = { isDeleted: false };

  // Apply status filter if provided
  if (status) {
    query.status = status;
  }

  // Apply search if provided
  if (search) {
    query.$or = [
      { componentName: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  const components = await DynamicComponents.find(query)
    .sort({ createdAt: -1 })
    .populate([
      { path: "createdBy", select: "name email" },
      { path: "updatedBy", select: "name email" },
      { path: "usageLocation" }
    ]);

  // Transform usageLocation to just the name (or sidebarName > name), fetch if not populated
  const transformedComponents = await Promise.all(
    components.map(async (component) => {
      let usageLocationDisplay = "-";
      const usageLocation = component.usageLocation;
      if (usageLocation) {
        if (
          typeof usageLocation === "object" &&
          (usageLocation.sidebarName || usageLocation.name)
        ) {
          if (usageLocation.sidebarName && usageLocation.name) {
            usageLocationDisplay = `${usageLocation.sidebarName} > ${usageLocation.name}`;
          } else if (usageLocation.name) {
            usageLocationDisplay = usageLocation.name;
          }
        } else if (
          typeof usageLocation === "string" ||
          typeof usageLocation === "object"
        ) {
          // If not populated, fetch from SidebarItem
          try {
            const sidebar = await SidebarItem.findById(usageLocation).lean();
            if (sidebar) {
              if (sidebar.sidebarName && sidebar.name) {
                usageLocationDisplay = `${sidebar.sidebarName} > ${sidebar.name}`;
              } else if (sidebar.name) {
                usageLocationDisplay = sidebar.name;
              }
            }
          } catch (e) {
            // ignore error, keep usageLocationDisplay as '-'
          }
        }
      }
      return {
        ...component.toObject(),
        usageLocation: usageLocationDisplay
      };
    })
  );

  return {
    count: transformedComponents.length,
    components: transformedComponents
  };
};

export const getComponentByIdService = async (id) => {
  if (!id) {
    throw new Error("Component ID is required");
  }

  const component = await DynamicComponents.findOne({
    _id: id,
    isDeleted: false
  }).populate([
    { path: "createdBy", select: "name email" },
    { path: "updatedBy", select: "name email" }
  ]);

  if (!component) {
    throw new Error("Component not found");
  }

  return component;
};

export const updateComponentService = async (id, data) => {
  const { componentName, description, status, usageLocation, updatedBy } = data;

  if (!id) {
    throw new Error("Component ID is required");
  }

  // Check if component exists
  const existingComponent = await DynamicComponents.findOne({
    _id: id,
    isDeleted: false
  });

  if (!existingComponent) {
    throw new Error("Component not found");
  }

  // If changing name, check if name already exists
  if (componentName && componentName !== existingComponent.componentName) {
    const duplicateComponent = await DynamicComponents.findOne({
      componentName,
      _id: { $ne: id },
      isDeleted: false
    });

    if (duplicateComponent) {
      throw new Error("Component with this name already exists");
    }
  }

  // Update component
  const updatedComponent = await DynamicComponents.findByIdAndUpdate(
    id,
    {
      ...(componentName && { componentName }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
      ...(usageLocation && { usageLocation }),
      updatedBy: updatedBy
    },
    { new: true }
  ).populate([
    { path: "createdBy", select: "name email" },
    { path: "updatedBy", select: "name email" }
  ]);

  return updatedComponent;
};

export const deleteComponentService = async (id, deletedBy) => {
  if (!id) {
    throw new Error("Component ID is required");
  }

  // Check if component exists
  const component = await DynamicComponents.findOne({
    _id: id,
    isDeleted: false
  });

  if (!component) {
    throw new Error("Component not found");
  }

  // Soft delete the component
  await DynamicComponents.findByIdAndUpdate(id, {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: deletedBy
  });

  return true;
};

export const restoreComponentService = async (id, restoredBy) => {
  if (!id) {
    throw new Error("Component ID is required");
  }

  // Check if component exists and is deleted
  const component = await DynamicComponents.findOne({
    _id: id,
    isDeleted: true
  });

  if (!component) {
    throw new Error("Deleted component not found");
  }

  // Check if there's now a component with the same name that's not deleted
  const duplicateComponent = await DynamicComponents.findOne({
    componentName: component.componentName,
    _id: { $ne: id },
    isDeleted: false
  });

  if (duplicateComponent) {
    throw new Error(
      "Cannot restore: A component with this name already exists"
    );
  }

  // Restore the component
  const restoredComponent = await DynamicComponents.findByIdAndUpdate(
    id,
    {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      restoredAt: new Date(),
      restoredBy: restoredBy
    },
    { new: true }
  );

  return restoredComponent;
};
