import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { Category } from "../models/Category.js";
import { presentCategory } from "../catalog/present.js";

const router = Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const kind = req.query.kind === "service" ? "service" : "product";
    const categories = await Category.find({ kind }).sort({ name: 1 });
    res.json({ categories: categories.map(presentCategory) });
  } catch (error) {
    next(error);
  }
});

export default router;
