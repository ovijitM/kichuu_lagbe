import { Router } from "express";
import { protect, requireRole } from "../middleware/auth.js";
import { ServiceProvider } from "../models/ServiceProvider.js";

const router = Router();

router.use(protect, requireRole("service_provider"));

function presentProvider(provider, user) {
  return {
    id: provider._id ? provider._id.toString() : "",
    userId: user?._id ? user._id.toString() : (provider.user?._id ? provider.user._id.toString() : String(provider.user)),
    name: user?.name || "Service Provider",
    email: user?.email || "",
    bio: provider.bio || "",
    trade: provider.trade || "Technician",
    phone: provider.phone || user?.phone || "",
    basePrice: Number(provider.basePrice || 0),
    verified: Boolean(provider.verified),
    avatarImage: provider.avatarImage || "/services/electrician.jpg",
    nidDocumentImage: provider.nidDocumentImage || "",
    portfolioImages: Array.isArray(provider.portfolioImages) ? provider.portfolioImages : [],
  };
}

router.get("/profile", async (req, res, next) => {
  try {
    let provider = await ServiceProvider.findOne({ user: req.user.id });
    if (!provider) {
      provider = await ServiceProvider.create({
        user: req.user.id,
        bio: "Specialist technician serving Bashundhara R/A residences.",
        trade: "AC & Electrical Specialist",
        phone: req.user.phone || "",
        basePrice: 500,
        avatarImage: "/services/electrician.jpg",
        verified: true,
      });
    }
    res.json({ provider: presentProvider(provider, req.user) });
  } catch (error) {
    next(error);
  }
});

router.patch("/profile", async (req, res, next) => {
  try {
    let provider = await ServiceProvider.findOne({ user: req.user.id });
    if (!provider) {
      provider = new ServiceProvider({ user: req.user.id });
    }
    if (typeof req.body.bio === "string") provider.bio = req.body.bio.trim().slice(0, 1000);
    if (typeof req.body.trade === "string") provider.trade = req.body.trade.trim().slice(0, 100);
    if (typeof req.body.phone === "string") provider.phone = req.body.phone.trim().slice(0, 30);
    if (req.body.basePrice !== undefined) {
      const price = Number(req.body.basePrice);
      if (!Number.isNaN(price) && price >= 0) provider.basePrice = price;
    }
    if (typeof req.body.avatarImage === "string") {
      provider.avatarImage = req.body.avatarImage;
    }
    if (typeof req.body.nidDocumentImage === "string") {
      provider.nidDocumentImage = req.body.nidDocumentImage;
      if (req.body.nidDocumentImage) {
        provider.verified = true;
      }
    }
    if (Array.isArray(req.body.portfolioImages)) {
      provider.portfolioImages = req.body.portfolioImages.slice(0, 12);
    }
    await provider.save();
    res.json({ provider: presentProvider(provider, req.user) });
  } catch (error) {
    next(error);
  }
});

export default router;
