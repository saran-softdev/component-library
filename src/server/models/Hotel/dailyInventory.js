import mongoose from "mongoose";

const DailyInventorySchema = new mongoose.Schema(
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
    date: { type: Date, required: true },
    total: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    hold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

DailyInventorySchema.index(
  { hotelId: 1, roomTypeId: 1, date: 1 },
  { unique: true }
);

const DailyInventory =
  mongoose.models.DailyInventory ||
  mongoose.model("DailyInventory", DailyInventorySchema);
export default DailyInventory;
