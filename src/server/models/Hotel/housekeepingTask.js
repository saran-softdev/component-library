import mongoose from "mongoose";

const HousekeepingTaskSchema = new mongoose.Schema(
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
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    type: {
      type: String,
      enum: ["clean", "repair", "inspect"],
      required: true,
    },
    status: {
      type: String,
      enum: ["queued", "assigned", "done"],
      default: "queued",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    dueAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

HousekeepingTaskSchema.index({ hotelId: 1, status: 1, dueAt: 1 });

const HousekeepingTask =
  mongoose.models.HousekeepingTask ||
  mongoose.model("HousekeepingTask", HousekeepingTaskSchema);
export default HousekeepingTask;
