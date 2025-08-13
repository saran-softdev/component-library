import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    // 🏷️ Role Name
    roleName: {
      type: String,
      required: true,
      trim: true,
    },

    // 👤 Audit User References
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

    // 🕒 Audit Timestamps
    deletedAt: {
      type: Date,
      default: null,
    },
    restoredAt: {
      type: Date,
      default: null,
    },

    // 📝 Audit Metadata
    changeReason: {
      type: String,
      default: null,
    },

    // 🗑️ Soft Delete Flag
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // creates createdAt and updatedAt automatically
  }
);

// ✅ Middleware: Exclude soft-deleted roles from find queries
roleSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

// ✅ Static: Hard delete role
roleSchema.statics.hardDelete = async function (id) {
  return this.findByIdAndDelete(id);
};

// ✅ Static: Restore soft-deleted role
roleSchema.statics.restoreRole = async function (id, restoredBy = null) {
  return this.findOneAndUpdate(
    { _id: id, isDeleted: true },
    {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      restoredAt: new Date(),
      restoredBy,
    },
    { new: true }
  );
};

const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

export default Role;
