import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 🧍 Personal Information
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email"
      ]
    },
    passwordHash: {
      type: String
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    profileImageUrl: {
      type: String,
      default: null
    },

    // 🔐 Security & Brute-force Protection
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    accountLockedUntil: {
      type: Date,
      default: null
    },

    // 🏢 References
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true
    },

    // 📡 Status
    isActive: {
      type: Boolean,
      default: true
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
  { timestamps: true } // handles createdAt, updatedAt
);

// ✅ Middleware: exclude soft-deleted users from all find queries
userSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

// ✅ Static method: Hard delete
userSchema.statics.hardDelete = async function (id) {
  return this.findByIdAndDelete(id);
};

// ✅ Static method: Restore soft-deleted user
userSchema.statics.restoreUser = async function (id, restoredBy = null) {
  return this.findOneAndUpdate(
    { _id: id, isDeleted: true },
    {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      restoredAt: new Date(),
      restoredBy
    },
    { new: true }
  );
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
