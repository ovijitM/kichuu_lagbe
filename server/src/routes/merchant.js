import mongoose from "mongoose";
import { Router } from "express";
import { presentProduct, presentShop } from "../catalog/present.js";
import { stockForLevel } from "../catalog/stock.js";
import { protect, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { Shop } from "../models/Shop.js";
import { productWriteSchema, shopCreateSchema, shopUpdateSchema, stockLevelSchema } from "../validators/catalog.js";

const router = Router();

router.use(protect, requireRole("shop_owner"));

async function ownShop(userId) {
  return Shop.findOne({ owner: userId });
}

async function productCategory(categoryId) {
  if (!mongoose.isValidObjectId(categoryId)) return null;
  return Category.findOne({ _id: categoryId, kind: "product" });
}

router.get("/shop", async (req, res, next) => {
  try {
    const shop = await ownShop(req.user.id);
    res.json({ shop: shop ? presentShop(shop) : null });
  } catch (error) {
    next(error);
  }
});

router.post("/shop", validate(shopCreateSchema), async (req, res, next) => {
  try {
    const existing = await ownShop(req.user.id);
    if (existing) {
      return res.status(409).json({ message: "You already have a shop." });
    }
    const shop = await Shop.create({
      owner: req.user.id,
      name: req.body.name,
      block: req.body.block,
      prepTimeMinutes: req.body.prepTimeMinutes ?? 15,
      isOpen: false,
      approvalStatus: "pending",
    });
    res.status(201).json({ shop: presentShop(shop) });
  } catch (error) {
    next(error);
  }
});

router.patch("/shop", validate(shopUpdateSchema), async (req, res, next) => {
  try {
    const shop = await ownShop(req.user.id);
    if (!shop) return res.status(404).json({ message: "Register a shop first." });
    shop.name = req.body.name;
    shop.block = req.body.block;
    shop.isOpen = req.body.isOpen;
    shop.prepTimeMinutes = req.body.prepTimeMinutes;
    if (req.body.heroImage !== undefined) shop.heroImage = req.body.heroImage;
    if (req.body.avatarImage !== undefined) shop.avatarImage = req.body.avatarImage;
    if (req.body.description !== undefined) shop.description = req.body.description;
    if (req.body.phone !== undefined) shop.phone = req.body.phone;
    if (shop.approvalStatus === "rejected") {
      shop.approvalStatus = "pending";
      shop.rejectionReason = "";
    }
    await shop.save();
    res.json({ shop: presentShop(shop) });
  } catch (error) {
    next(error);
  }
});

router.get("/products", async (req, res, next) => {
  try {
    const shop = await ownShop(req.user.id);
    if (!shop) return res.json({ products: [] });
    const products = await Product.find({ shop: shop.id }).populate("category").sort({ name: 1 });
    res.json({ products: products.map((product) => presentProduct(product, { includeInactive: true })) });
  } catch (error) {
    next(error);
  }
});

router.post("/products", validate(productWriteSchema), async (req, res, next) => {
  try {
    const shop = await ownShop(req.user.id);
    if (!shop) return res.status(404).json({ message: "Register a shop first." });
    const category = await productCategory(req.body.categoryId);
    if (!category) return res.status(400).json({ message: "Choose a product category." });
    try {
      const product = await Product.create({
        shop: shop.id,
        category: category.id,
        name: req.body.name,
        price: req.body.price,
        unit: req.body.unit,
        stock: req.body.stock,
        imageUrl: req.body.imageUrl || "",
      });
      product.category = category;
      res.status(201).json({ product: presentProduct(product, { includeInactive: true }) });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "This shop already has a product with that name." });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/products/:id", validate(productWriteSchema), async (req, res, next) => {
  try {
    const shop = await ownShop(req.user.id);
    if (!shop || !mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Product not found." });
    }
    const category = await productCategory(req.body.categoryId);
    if (!category) return res.status(400).json({ message: "Choose a product category." });
    const product = await Product.findOne({ _id: req.params.id, shop: shop.id });
    if (!product) return res.status(404).json({ message: "Product not found." });
    product.name = req.body.name;
    product.category = category.id;
    product.price = req.body.price;
    product.unit = req.body.unit;
    product.stock = req.body.stock;
    product.imageUrl = req.body.imageUrl || "";
    try {
      await product.save();
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "This shop already has a product with that name." });
      }
      throw error;
    }
    product.category = category;
    res.json({ product: presentProduct(product, { includeInactive: true }) });
  } catch (error) {
    next(error);
  }
});

router.patch("/products/:id/archive", async (req, res, next) => {
  try {
    const shop = await ownShop(req.user.id);
    const product = shop && mongoose.isValidObjectId(req.params.id)
      ? await Product.findOne({ _id: req.params.id, shop: shop.id }).populate("category")
      : null;
    if (!product) return res.status(404).json({ message: "Product not found." });
    product.isActive = !product.isActive;
    await product.save();
    res.json({ product: presentProduct(product, { includeInactive: true }) });
  } catch (error) {
    next(error);
  }
});

router.post("/products/:id/stock-level", validate(stockLevelSchema), async (req, res, next) => {
  try {
    const shop = await ownShop(req.user.id);
    const product = shop && mongoose.isValidObjectId(req.params.id)
      ? await Product.findOne({ _id: req.params.id, shop: shop.id }).populate("category")
      : null;
    if (!product) return res.status(404).json({ message: "Product not found." });
    product.stock = stockForLevel(req.body.level, product.stock);
    await product.save();
    res.json({ product: presentProduct(product, { includeInactive: true }) });
  } catch (error) {
    next(error);
  }
});

export default router;
