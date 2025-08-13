import mongoose from "mongoose";

const HousekeepingSchema = new mongoose.Schema(
  {
    schedule: {
      type: String,
      enum: ["Daily", "Weekly", "OnRequest"],
      default: "Daily",
    },
    lastCleanedAt: { type: Date, default: null },
    isUnderMaintenance: { type: Boolean, default: false },
  },
  { _id: false }
);

const RoomSchema = new mongoose.Schema(
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

    roomNumber: { type: String, required: true },
    floor: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance", "out-of-order"],
      default: "available",
    },
    housekeeping: { type: HousekeepingSchema, default: undefined },

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

RoomSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

RoomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });
RoomSchema.index({ roomTypeId: 1 });

const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);
export default Room;
