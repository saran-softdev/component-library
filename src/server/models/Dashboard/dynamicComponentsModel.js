import mongoose from "mongoose";

const dynamicComponentsSchema = new mongoose.Schema(
  {
    // 🏷️ Component Name
    componentName: {
      type: String,
      required: true,
      trim: true,
    },
    // 📄 Description
    description: {
      type: String,
      default: "",
      trim: true,
    },
    // 🔖 Status
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
      trim: true,
    },
    // 📍 Where it is used (Pages, Tabs, Dashboards)
    usageLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SidebarItem",
      default: null,
    },
    // 🗑️ Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // 🕵️‍♂️ Audit: User References
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    restoredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // 🕒 Audit: Timestamps
    deletedAt: {
      type: Date,
      default: null,
    },
    restoredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const DynamicComponents =
  mongoose.models.DynamicComponents ||
  mongoose.model("DynamicComponents", dynamicComponentsSchema);
export default DynamicComponents;
