import { z } from "zod";
import { SELF_SERVE_ROLES } from "../models/User.js";

const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email")
  .transform((value) => value.toLowerCase());

const passwordSchema = z.string().min(8, "Use at least 8 characters");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = loginSchema.extend({
  name: z.string().trim().min(2).max(80),
  role: z.enum(SELF_SERVE_ROLES),
});
