import mongoose from "mongoose";

const riderProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    isAvailable: { type: Boolean, default: false },
    vehicle: { type: String, trim: true, default: "bike" },
  },
  { timestamps: true },
);

export const RiderProfile = mongoose.model("RiderProfile", riderProfileSchema);
