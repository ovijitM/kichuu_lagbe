import mongoose from "mongoose";

const bookingStatuses = ["requested", "accepted", "rejected", "completed", "cancelled"];

const bookingSchema = new mongoose.Schema(
  {
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, required: true, trim: true },
    schedule: { type: String, trim: true, default: "" },
    status: { type: String, enum: bookingStatuses, default: "requested", index: true },
    price: { type: Number, min: 0 },
  },
  { timestamps: true },
);

export const BOOKING_STATUSES = bookingStatuses;
export const Booking = mongoose.model("Booking", bookingSchema);
