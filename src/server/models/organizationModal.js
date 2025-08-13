import mongoose from "mongoose";

const orgSchema = new mongoose.Schema(
  {
    // 🏷️ Primary Field
    organizationId: {
      type: String,
      default: null,
      trim: true,
      unique: true
    },

    // 🎨 Theme Configuration
    theme: {
      name: {
        type: String,
        default: "default"
      },
      primaryColor: {
        type: String,
        default: "#3B82F6" // Blue
      },
      secondaryColor: {
        type: String,
        default: "#64748B" // Slate
      },
      backgroundColor: {
        type: String,
        default: "#FFFFFF" // White
      },
      surfaceColor: {
        type: String,
        default: "#F8FAFC" // Light gray
      },
      textColor: {
        type: String,
        default: "#1E293B" // Dark slate
      },
      borderColor: {
        type: String,
        default: "#E2E8F0" // Light slate
      },
      accentColor: {
        type: String,
        default: "#10B981" // Green
      },
      warningColor: {
        type: String,
        default: "#F59E0B" // Amber
      },
      errorColor: {
        type: String,
        default: "#EF4444" // Red
      },
      successColor: {
        type: String,
        default: "#10B981" // Green
      },
      isCustom: {
        type: Boolean,
        default: false
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },

    // 👤 Audit User References
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    restoredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    // 🕒 Audit Timestamps
    deletedAt: {
      type: Date,
      default: null
    },
    restoredAt: {
      type: Date,
      default: null
    },

    // 📝 Audit Metadata
    changeReason: {
      type: String,
      default: null
    },

    // 🗑️ Soft Delete Flag
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // createdAt and updatedAt handled automatically
  }
);

// ✅ Middleware: Exclude soft-deleted docs unless explicitly queried
orgSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

// ✅ Static: Hard delete document
orgSchema.statics.hardDelete = async function (id) {
  return this.findByIdAndDelete(id);
};

// ✅ Static: Restore soft-deleted document
orgSchema.statics.restore = async function (id) {
  return this.findOneAndUpdate(
    { _id: id, isDeleted: true },
    {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      restoredAt: new Date()
    },
    { new: true }
  );
};

const Organization =
  mongoose.models.Organization || mongoose.model("Organization", orgSchema);

export default Organization;
