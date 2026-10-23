import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    bio: { type: String, trim: true, default: "" },
    verified: { type: Boolean, default: false },
    basePrice: { type: Number, default: 0, min: 0 },
    avatarImage: { type: String, default: "" },
    nidDocumentImage: { type: String, default: "" },
    trade: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    portfolioImages: [{ type: String }],
  },
  { timestamps: true },
);

export const ServiceProvider = mongoose.model("ServiceProvider", serviceProviderSchema);
