import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    block: String,
    road: String,
    building: String,
    apartment: String,
    gatePin: String,
  },
  { _id: false },
);

const orderStatuses = [
  "placed",
  "shop_confirmed",
  "rider_assigned",
  "picked_up",
  "delivered",
  "cancelled",
];

const orderSchema = new mongoose.Schema(
  {
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: { type: [orderItemSchema], validate: [(items) => items.length > 0, "An order needs at least one item"] },
    address: { type: addressSnapshotSchema, required: true },
    status: { type: String, enum: orderStatuses, default: "placed", index: true },
    paymentMethod: { type: String, enum: ["cod", "online"], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    commission: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

export const ORDER_STATUSES = orderStatuses;
export const Order = mongoose.model("Order", orderSchema);
