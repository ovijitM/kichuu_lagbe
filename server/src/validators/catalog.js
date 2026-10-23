import { z } from "zod";

const imageUrl = z
  .string()
  .trim()
  .max(5000000)
  .refine(
    (value) =>
      value === "" ||
      /^https?:\/\/\S+$/.test(value) ||
      /^\/products\/\S+$/.test(value) ||
      /^data:image\/[a-zA-Z0-9+.-]+;base64,/.test(value),
    "Use a valid image URL or uploaded file",
  );

export const shopCreateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  block: z.string().trim().min(1).max(20),
  prepTimeMinutes: z.number().int().min(0).max(180).optional(),
});

export const shopUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  block: z.string().trim().min(1).max(20),
  isOpen: z.boolean(),
  prepTimeMinutes: z.number().int().min(0).max(180),
  heroImage: z.string().max(5000000).optional(),
  avatarImage: z.string().max(5000000).optional(),
  description: z.string().trim().max(500).optional(),
  phone: z.string().trim().max(30).optional(),
});

export const productWriteSchema = z.object({
  name: z.string().trim().min(2).max(120),
  categoryId: z.string().trim().min(1),
  price: z.number().min(0),
  unit: z.string().trim().min(1).max(20),
  stock: z.number().int().min(0, "Stock cannot go below zero"),
  imageUrl: imageUrl.optional(),
});

export const stockLevelSchema = z.object({
  level: z.enum(["in", "low", "out"]),
});

export const shopDecisionSchema = z.object({
  approvalStatus: z.enum(["approved", "rejected"]),
  rejectionReason: z.string().trim().max(240).optional(),
});

export const cartAddSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(99).default(1),
  replaceShop: z.boolean().optional(),
});
