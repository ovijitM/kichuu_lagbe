import bcrypt from "bcryptjs";
import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { SELF_SERVE_ROLES, User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { loginSchema, signupSchema } from "../validators/auth.js";
import { z } from "zod";
import { env } from "../config/env.js";

const router = Router();

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
  };
}

router.post("/signup", validate(signupSchema), async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    if (!SELF_SERVE_ROLES.includes(role)) {
      return res.status(403).json({ message: "That role cannot be self-registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name, role, status: "active" });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }
    next(error);
  }
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select("+passwordHash");
    const matches = user && (await bcrypt.compare(req.body.password, user.passwordHash));
    if (!matches) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }
    if (user.status === "suspended") {
      return res.status(403).json({ message: "This account is suspended." });
    }
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

const devAccountEmail = {
  resident: "RESIDENT_EMAIL",
  shop_owner: "SHOP_OWNER_EMAIL",
  service_provider: "PROVIDER_EMAIL",
  rider: "RIDER_EMAIL",
  admin: "ADMIN_EMAIL",
};

const devLoginSchema = z.object({
  role: z.enum(["resident", "shop_owner", "service_provider", "rider", "admin"]),
});

router.post("/dev-login", validate(devLoginSchema), async (req, res, next) => {
  try {
    if (env.isProd) return res.status(404).json({ message: "Not found" });
    const email = process.env[devAccountEmail[req.body.role]]?.trim().toLowerCase();
    if (!email) return res.status(500).json({ message: "That role is missing from server/.env." });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Run npm run seed so this account exists." });
    if (user.status === "suspended") return res.status(403).json({ message: "This account is suspended." });
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.get("/me", protect, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;
