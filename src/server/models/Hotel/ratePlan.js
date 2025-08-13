import mongoose from "mongoose";

const CancellationPolicySchema = new mongoose.Schema(
  {
    freeUptoHours: { type: Number, default: 24 },
    penaltyPercentage: { type: Number, default: 0 },
  },
  { _id: false }
);

const RatePlanSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },

    name: { type: String, required: true },
    description: { type: String, default: "" },

    policy: { type: CancellationPolicySchema, default: undefined },
    prepayPercent: { type: Number, default: 0 },

    pricingModel: {
      type: String,
      enum: ["BAR", "Seasonal", "Static"],
      default: "BAR",
    },
    currency: { type: String, default: "INR" },

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

RatePlanSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

RatePlanSchema.index({ hotelId: 1, roomTypeId: 1, name: 1 }, { unique: true });

const RatePlan =
  mongoose.models.RatePlan || mongoose.model("RatePlan", RatePlanSchema);
export default RatePlan;
