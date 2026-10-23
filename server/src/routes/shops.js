import mongoose from "mongoose";
import { Router } from "express";
import { presentProduct, presentShop } from "../catalog/present.js";
import { protect, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { Shop } from "../models/Shop.js";
import { cartAddSchema } from "../validators/catalog.js";

const router = Router();

router.use(protect, requireRole("resident"));

function visibleShopFilter(extra = {}) {
  return { approvalStatus: "approved", isOpen: true, ...extra };
}

router.get("/", async (req, res, next) => {
  try {
    const shops = await Shop.find(visibleShopFilter()).sort({ name: 1 });
    res.json({ shops: shops.map((shop) => presentShop(shop)) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/products", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Shop not found." });
    }
    const shop = await Shop.findOne(visibleShopFilter({ _id: req.params.id }));
    if (!shop) return res.status(404).json({ message: "Shop not found." });
    const products = await Product.find({ shop: shop.id, isActive: true }).populate("category").sort({ name: 1 });
    res.json({
      shop: presentShop(shop),
      products: products.map((product) => presentProduct(product)).filter(Boolean),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/cart/current", async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ resident: req.user.id }).populate({
      path: "items.product",
      populate: { path: "category" },
    });
    if (!cart) return res.json({ cart: null });
    const shop = await Shop.findById(cart.shop);
    res.json({
      cart: {
        shop: shop ? presentShop(shop) : null,
        items: cart.items
          .filter((item) => item.product)
          .map((item) => ({
            quantity: item.quantity,
            product: presentProduct(item.product, { includeInactive: true }),
          })),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/cart/items", validate(cartAddSchema), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.body.productId)) {
      return res.status(404).json({ message: "Product not found." });
    }
    const product = await Product.findById(req.body.productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found." });
    }
    const shop = await Shop.findOne(visibleShopFilter({ _id: product.shop }));
    if (!shop) return res.status(404).json({ message: "That shop is not taking orders." });
    if (product.stock < 1) {
      return res.status(409).json({ message: "This item is out of stock." });
    }
    if (req.body.quantity > product.stock) {
      return res.status(409).json({ message: `Only ${product.stock} left in stock.` });
    }

    let cart = await Cart.findOne({ resident: req.user.id });
    if (cart && String(cart.shop) !== String(shop.id) && !req.body.replaceShop) {
      return res.status(409).json({
        message: "Your basket is for another shop. Clear it to add this item.",
        code: "different_shop",
      });
    }
    if (!cart || (cart && String(cart.shop) !== String(shop.id))) {
      cart = cart || new Cart({ resident: req.user.id, shop: shop.id, items: [] });
      cart.shop = shop.id;
      cart.items = [];
    }

    const existing = cart.items.find((item) => String(item.product) === String(product.id));
    const nextQuantity = (existing?.quantity || 0) + req.body.quantity;
    if (nextQuantity > product.stock) {
      return res.status(409).json({ message: `Only ${product.stock} left in stock.` });
    }
    if (existing) existing.quantity = nextQuantity;
    else cart.items.push({ product: product.id, quantity: req.body.quantity });
    await cart.save();
    res.status(201).json({ message: "Added to basket." });
  } catch (error) {
    next(error);
  }
});

export default router;
