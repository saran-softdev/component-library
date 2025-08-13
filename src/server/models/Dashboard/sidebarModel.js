import mongoose from "mongoose";

const SidebarItemSchema = new mongoose.Schema(
  {
    sidebarName: { type: String, required: true },
    name: { type: String, required: true },
    href: { type: String, required: true },
    icon: { type: String },
    children: {
      type: [
        {
          name: { type: String, required: true },
          href: { type: String, required: true }
        }
      ],
      default: null
    },
    order: { type: Number, default: 0 },
    // Soft delete functionality
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

// Add index for better query performance
SidebarItemSchema.index({ isDeleted: 1, createdAt: -1 });

// Add pre-hook to exclude deleted items by default
SidebarItemSchema.pre(/^find/, function () {
  // Only apply to normal queries, not when explicitly querying deleted items
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
});

const SidebarItem =
  mongoose.models.SidebarItem ||
  mongoose.model("SidebarItem", SidebarItemSchema);

export default SidebarItem;
