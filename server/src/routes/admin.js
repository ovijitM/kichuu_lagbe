import mongoose from "mongoose";
import { Router } from "express";
import { presentShop } from "../catalog/present.js";
import { protect, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { Shop } from "../models/Shop.js";
import { shopDecisionSchema } from "../validators/catalog.js";

const router = Router();

router.use(protect, requireRole("admin"));

router.get("/shops", async (req, res, next) => {
  try {
    const filter = {};
    if (["pending", "approved", "rejected"].includes(req.query.status)) {
      filter.approvalStatus = req.query.status;
    }
    const shops = await Shop.find(filter).populate("owner", "name email").sort({ createdAt: -1 });
    res.json({
      shops: shops.map((shop) => presentShop(shop, shop.owner)),
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/shops/:id", validate(shopDecisionSchema), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Shop not found." });
    }
    const shop = await Shop.findById(req.params.id).populate("owner", "name email");
    if (!shop) return res.status(404).json({ message: "Shop not found." });
    if (req.body.approvalStatus === "rejected" && !req.body.rejectionReason) {
      return res.status(400).json({ message: "Add a reason when rejecting a shop." });
    }
    shop.approvalStatus = req.body.approvalStatus;
    shop.rejectionReason = req.body.approvalStatus === "rejected" ? req.body.rejectionReason : "";
    await shop.save();
    res.json({ shop: presentShop(shop, shop.owner) });
  } catch (error) {
    next(error);
  }
});

export default router;
