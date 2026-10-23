import mongoose from "mongoose";

const roles = ["resident", "shop_owner", "service_provider", "rider", "admin"];
const statuses = ["pending", "active", "suspended"];

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: roles, required: true },
    status: { type: String, enum: statuses, default: "active" },
  },
  { timestamps: true },
);

export const USER_ROLES = roles;
export const SELF_SERVE_ROLES = roles.filter((role) => role !== "admin");
export const User = mongoose.model("User", userSchema);
