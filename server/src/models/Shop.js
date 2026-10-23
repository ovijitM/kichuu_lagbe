import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    block: { type: String, required: true, trim: true },
    isOpen: { type: Boolean, default: false },
    prepTimeMinutes: { type: Number, default: 15, min: 0 },
    heroImage: { type: String, default: "" },
    avatarImage: { type: String, default: "" },
    description: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    rejectionReason: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

export const Shop = mongoose.model("Shop", shopSchema);
