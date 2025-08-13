import mongoose from "mongoose";

const RatePriceSchema = new mongoose.Schema(
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
    ratePlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatePlan",
      required: true,
    },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    closed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

RatePriceSchema.index(
  { hotelId: 1, roomTypeId: 1, ratePlanId: 1, date: 1 },
  { unique: true }
);

const RatePrice =
  mongoose.models.RatePrice || mongoose.model("RatePrice", RatePriceSchema);
export default RatePrice;
