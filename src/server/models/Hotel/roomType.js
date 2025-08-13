import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    label: { type: String, default: "" },
  },
  { _id: false }
);

const OccupancySchema = new mongoose.Schema(
  { default: { type: Number, default: 2 }, max: { type: Number, default: 2 } },
  { _id: false }
);

const PricingSchema = new mongoose.Schema(
  {
    basePrice: { type: Number, required: true },
    extraAdultCharge: { type: Number, default: 0 },
    extraChildCharge: { type: Number, default: 0 },
  },
  { _id: false }
);

const RoomTypeSchema = new mongoose.Schema(
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

    name: { type: String, required: true },
    suiteCategory: { type: String, default: "Standard" },
    suiteType: { type: String, default: "" },
    sizeSqFt: { type: Number, default: 0 },
    bedType: {
      type: String,
      enum: ["King", "Queen", "Double", "Twin", "Single", "Bunk", "Sofa"],
      default: "Queen",
    },

    occupancy: { type: OccupancySchema, default: undefined },
    pricing: { type: PricingSchema, required: true },
    inclusions: { type: [String], default: [] },
    amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amenity" }],
    images: { type: [ImageSchema], default: [] },

    flags: {
      interconnectedRooms: { type: Boolean, default: false },
      accessibleRoom: { type: Boolean, default: false },
      roomServiceAvailable: { type: Boolean, default: false },
    },

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

RoomTypeSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

RoomTypeSchema.index({ hotelId: 1, name: 1 });

const RoomType =
  mongoose.models.RoomType || mongoose.model("RoomType", RoomTypeSchema);
export default RoomType;
