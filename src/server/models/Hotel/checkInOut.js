import mongoose from "mongoose";

const CheckInOutSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    type: { type: String, enum: ["check-in", "check-out"], required: true },
    at: { type: Date, default: Date.now },
    actorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

CheckInOutSchema.index({ bookingId: 1, at: 1 });

const CheckInOut =
  mongoose.models.CheckInOut || mongoose.model("CheckInOut", CheckInOutSchema);
export default CheckInOut;
