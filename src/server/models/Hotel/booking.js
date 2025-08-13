import mongoose from "mongoose";

const NightlySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const RateSummarySchema = new mongoose.Schema(
  {
    nightly: { type: [NightlySchema], default: [] },
    taxes: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: "INR" },
  },
  { _id: false }
);

const PaxSchema = new mongoose.Schema(
  {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    childAges: { type: [Number], default: [] },
  },
  { _id: false }
);

const PaymentSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ["WALLET", "CARD", "CASH", "INVOICE"],
      default: "WALLET",
    },
    status: {
      type: String,
      enum: ["unpaid", "partial", "paid", "refunded"],
      default: "unpaid",
    },
  },
  { _id: false }
);

const BookingSchema = new mongoose.Schema(
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
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "checked-in",
        "checked-out",
        "cancelled",
        "no-show",
      ],
      default: "confirmed",
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true },

    pax: { type: PaxSchema, default: undefined },
    ratePlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatePlan",
      required: true,
    },
    rateSummary: { type: RateSummarySchema, required: true },
    payment: { type: PaymentSchema, default: undefined },

    channel: { type: String, enum: ["B2C", "B2B", "OTA"], default: "B2C" },
    sourceRef: { type: String, default: null },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    specialRequests: { type: String, default: "" },

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
  },
  { timestamps: true }
);

BookingSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

BookingSchema.index({ hotelId: 1, status: 1, checkIn: 1, checkOut: 1 });
BookingSchema.index({ guestId: 1 });

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
export default Booking;
