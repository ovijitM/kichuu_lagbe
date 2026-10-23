import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    block: { type: String, required: true, trim: true },
    road: { type: String, required: true, trim: true },
    building: { type: String, trim: true, default: "" },
    apartment: { type: String, trim: true, default: "" },
    gatePin: { type: String, trim: true, default: "" },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Address = mongoose.model("Address", addressSchema);
