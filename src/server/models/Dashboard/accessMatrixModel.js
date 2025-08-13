import mongoose from "mongoose";

// Access Level (CRUD flags)
const AccessLevelSchema = new mongoose.Schema(
  {
    create: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false }
  },
  { _id: false }
);

// Individual module permission
const PermissionSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SidebarItem",
      required: true
    },
    accessLevel: {
      type: AccessLevelSchema,
      required: true
    },
    components: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DynamicComponents",
        default: null
      }
    ]
  },
  { _id: false }
);

// Main access matrix schema
const AccessMatrixSchema = new mongoose.Schema(
  {
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    matrixType: {
      type: String,
      enum: ["RBAC", "ABAC"],
      default: "RBAC"
    },
    organizationId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
      }
    ],
    permissions: {
      type: [PermissionSchema],
      default: []
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

// Unique constraint to prevent duplicate role+user (active only)
AccessMatrixSchema.index(
  { userId: 1, roleId: 1, isDeleted: 1 },
  { unique: true }
);

// Pre-hook to exclude soft-deleted records by default
AccessMatrixSchema.pre(/^find/, function () {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
});

// Model export
const AccessMatrixModel =
  mongoose.models.AccessMatrix ||
  mongoose.model("AccessMatrix", AccessMatrixSchema);

export default AccessMatrixModel;
