import mongoose from "mongoose";

const AmenitySchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: null },
    isGlobal: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
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
    restoredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    restoredAt: { type: Date, default: null },
  },
  { timestamps: true }
);

AmenitySchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

AmenitySchema.index({ organizationId: 1, code: 1 }, { unique: true });

const Amenity =
  mongoose.models.Amenity || mongoose.model("Amenity", AmenitySchema);
export default Amenity;
