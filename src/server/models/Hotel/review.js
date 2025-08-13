import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
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
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      default: null,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    moderatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

ReviewSchema.index({ hotelId: 1, status: 1, createdAt: -1 });

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export default Review;
