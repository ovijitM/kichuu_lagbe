import { stockLevel } from "./stock.js";

export function presentCategory(category) {
  return { id: category.id, name: category.name, kind: category.kind };
}

export function presentShop(shop, owner) {
  return {
    id: shop.id,
    name: shop.name,
    block: shop.block,
    isOpen: shop.isOpen,
    prepTimeMinutes: shop.prepTimeMinutes,
    approvalStatus: shop.approvalStatus,
    rejectionReason: shop.rejectionReason || "",
    heroImage: shop.heroImage || "",
    avatarImage: shop.avatarImage || "",
    description: shop.description || "",
    phone: shop.phone || "",
    owner: owner ? { id: owner.id, name: owner.name, email: owner.email } : undefined,
  };
}

export function presentProduct(product, { includeInactive = false } = {}) {
  if (!includeInactive && product.isActive === false) return null;
  const category = product.category;
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    unit: product.unit,
    stock: product.stock,
    stockLevel: stockLevel(product.stock),
    imageUrl: product.imageUrl || "",
    isActive: product.isActive,
    purchasable: product.isActive && product.stock > 0,
    category: category?.name ? { id: category.id, name: category.name } : { id: String(category) },
  };
}
