import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { connectDb, syncIndexes } from "../config/db.js";
import "../models/register.js";
import { Address } from "../models/Address.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { RiderProfile } from "../models/RiderProfile.js";
import { ServiceProvider } from "../models/ServiceProvider.js";
import { Shop } from "../models/Shop.js";
import { User } from "../models/User.js";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. Add it to server/.env`);
  return value.trim();
}

const people = [
  ["resident", "RESIDENT"],
  ["shop_owner", "SHOP_OWNER"],
  ["service_provider", "PROVIDER"],
  ["rider", "RIDER"],
  ["admin", "ADMIN"],
].map(([role, key]) => ({
  role,
  name: required(`${key}_NAME`),
  email: required(`${key}_EMAIL`).toLowerCase(),
  password: required(`${key}_PASSWORD`),
}));

async function upsertCategory(name, kind) {
  return Category.findOneAndUpdate({ name, kind }, { name, kind }, { upsert: true, new: true });
}

await connectDb(env.mongoUri);

try {
  const indexes = await User.collection.indexes();
  if (indexes.some((index) => index.name === "phone_1")) {
    await User.collection.dropIndex("phone_1");
  }
} catch (error) {
  if (error.code !== 26) throw error;
}
await User.deleteMany({ email: { $exists: false } });
await syncIndexes();

const users = {};
for (const person of people) {
  const passwordHash = await bcrypt.hash(person.password, 10);
  users[person.role] = await User.findOneAndUpdate(
    { email: person.email },
    { email: person.email, name: person.name, role: person.role, status: "active", passwordHash },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

await Address.findOneAndUpdate(
  { user: users.resident._id, isDefault: true },
  {
    user: users.resident._id,
    block: "D",
    road: "11",
    building: "4",
    apartment: "4B",
    gatePin: "4892",
    isDefault: true,
  },
  { upsert: true },
);

const shop = await Shop.findOneAndUpdate(
  { name: "Bashundhara Fresh Hub" },
  {
    owner: users.shop_owner._id,
    name: "Bashundhara Fresh Hub",
    block: "G",
    isOpen: true,
    prepTimeMinutes: 15,
    approvalStatus: "approved",
  },
  { upsert: true, new: true },
);

const water = await upsertCategory("Water", "product");
const grocery = await upsertCategory("Grocery", "product");
const household = await upsertCategory("Household", "product");
await upsertCategory("Snacks", "product");
await upsertCategory("Toiletries", "product");
await upsertCategory("Baby", "product");
const electrician = await upsertCategory("Electrician", "service");

const products = [
  { category: water._id, name: "Kinley 20L water jar", price: 80, stock: 24, unit: "jar" },
  { category: grocery._id, name: "Farm brown eggs", price: 140, stock: 3, unit: "dozen" },
  { category: grocery._id, name: "Aarong milk 1L", price: 110, stock: 30, unit: "pack" },
  { category: grocery._id, name: "Miniket rice 5kg", price: 520, stock: 12, unit: "bag" },
  { category: household._id, name: "Facial tissue 2-ply", price: 65, stock: 40, unit: "pack" },
];

for (const product of products) {
  await Product.findOneAndUpdate(
    { shop: shop._id, name: product.name },
    { ...product, shop: shop._id, isActive: true },
    { upsert: true },
  );
}

await ServiceProvider.findOneAndUpdate(
  { user: users.service_provider._id },
  {
    user: users.service_provider._id,
    categories: [electrician._id],
    bio: "Verified electrician for Bashundhara apartments.",
    verified: true,
    basePrice: 500,
  },
  { upsert: true },
);

await RiderProfile.findOneAndUpdate(
  { user: users.rider._id },
  { user: users.rider._id, isAvailable: true, vehicle: "bike" },
  { upsert: true },
);

console.log("Seed complete. Account emails and passwords are in server/.env");
for (const person of people) {
  console.log(`${person.role.padEnd(18)} ${person.email}  ${person.name}`);
}

await import("mongoose").then(({ default: mongoose }) => mongoose.disconnect());
