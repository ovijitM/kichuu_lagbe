import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/client.js";
import { useCart } from "../../cart/CartContext.jsx";

// Curated verified stores across Bashundhara R/A with rich storefront photography
const PARTNER_SHOPS = [
  {
    id: "shwapno-c",
    name: "Shwapno Express",
    block: "C",
    prepTimeMinutes: 12,
    isOpen: true,
    rating: 4.8,
    reviewsCount: 340,
    tags: ["Supermarket", "Fresh Produce", "Daily Essentials"],
    icon: "shopping_cart",
    heroImage: "/products/fresh_produce.jpg",
    description: "Full-line supermarket inventory with express counter packing for Block C & D residents.",
    products: [
      {
        id: "sh-1",
        name: "Fresh ACI Miniket Rice 5kg Bag",
        price: 380,
        unit: "bag",
        stock: 15,
        stockLevel: "in",
        imageUrl: "/products/rice_bag.jpg",
        category: { name: "Staples" },
        purchasable: true,
      },
      {
        id: "sh-2",
        name: "Daily Loaf Sandwich Bread",
        price: 65,
        unit: "pack",
        stock: 20,
        stockLevel: "in",
        imageUrl: "/products/bakery_bread.jpg",
        category: { name: "Bakery" },
        purchasable: true,
      },
      {
        id: "sh-3",
        name: "Farm Fresh Organic Tomatoes 1kg",
        price: 75,
        unit: "kg",
        stock: 30,
        stockLevel: "in",
        imageUrl: "/products/fresh_produce.jpg",
        category: { name: "Produce" },
        purchasable: true,
      },
    ],
  },
  {
    id: "al-madina-d",
    name: "Al-Madina Pharmacy & General",
    block: "D",
    prepTimeMinutes: 8,
    isOpen: true,
    rating: 4.9,
    reviewsCount: 520,
    tags: ["OTC Medicine", "First Aid", "Water Jars"],
    icon: "medical_services",
    heroImage: "/products/water_jar.jpg",
    description: "24/7 medicine dispensing, infant formula, and Kinley 20L water bottle refill depot.",
    products: [
      {
        id: "am-1",
        name: "Kinley 20L Water Jar (Refill Exchange)",
        price: 90,
        unit: "jar",
        stock: 45,
        stockLevel: "in",
        imageUrl: "/products/water_jar.jpg",
        category: { name: "Water" },
        purchasable: true,
      },
      {
        id: "am-2",
        name: "Facial Tissue 2-Ply Soft Pack",
        price: 65,
        unit: "pack",
        stock: 30,
        stockLevel: "in",
        imageUrl: "/products/tissue_box.svg",
        category: { name: "Hygiene" },
        purchasable: true,
      },
    ],
  },
  {
    id: "daily-mart-g",
    name: "Daily Mart Micro-Depot",
    block: "G",
    prepTimeMinutes: 10,
    isOpen: true,
    rating: 4.7,
    reviewsCount: 210,
    tags: ["Midnight Munchies", "Chilled Dairy", "Beverages"],
    icon: "local_convenience_store",
    heroImage: "/products/midnight_snacks.jpg",
    description: "Late night neighborhood depot serving hot-ready snacks and chilled dairy till 4 AM.",
    products: [
      {
        id: "dm-1",
        name: "Aarong Pure Pasteurised Milk 1L",
        price: 95,
        unit: "pack",
        stock: 24,
        stockLevel: "in",
        imageUrl: "/products/fresh_milk.jpg",
        category: { name: "Dairy" },
        purchasable: true,
      },
      {
        id: "dm-2",
        name: "Midnight Crunchies & Spicy Crisps Combo",
        price: 120,
        unit: "pack",
        stock: 35,
        stockLevel: "in",
        imageUrl: "/products/midnight_snacks.jpg",
        category: { name: "Snacks" },
        purchasable: true,
      },
    ],
  },
  {
    id: "bengal-meat-b",
    name: "Bengal Meat Gourmet",
    block: "B",
    prepTimeMinutes: 20,
    isOpen: true,
    rating: 4.9,
    reviewsCount: 410,
    tags: ["Halal Meat", "Poultry", "Farm Eggs"],
    icon: "restaurant",
    heroImage: "/products/brown_eggs.jpg",
    description: "Premium cold chain meats, cuts, and farm-fresh organic poultry for weekend grills.",
    products: [
      {
        id: "bm-1",
        name: "Farm Fresh Brown Eggs (Box of 12)",
        price: 140,
        unit: "box",
        stock: 30,
        stockLevel: "in",
        imageUrl: "/products/brown_eggs.jpg",
        category: { name: "Poultry" },
        purchasable: true,
      },
    ],
  },
  {
    id: "bread-beyond-d",
    name: "Bread & Beyond Artisan Bakery",
    block: "D",
    prepTimeMinutes: 10,
    isOpen: true,
    rating: 4.8,
    reviewsCount: 280,
    tags: ["Artisan Breads", "Oven Fresh", "Pastries"],
    icon: "bakery_dining",
    heroImage: "/products/bakery_bread.jpg",
    description: "Oven fresh morning sourdough, brioche burger buns, and afternoon tea puffs baked hourly.",
    products: [
      {
        id: "bb-1",
        name: "Daily Loaf Sandwich Bread & Butter Buns",
        price: 65,
        unit: "pack",
        stock: 25,
        stockLevel: "in",
        imageUrl: "/products/bakery_bread.jpg",
        category: { name: "Bakery" },
        purchasable: true,
      },
    ],
  },
];

const BLOCKS = ["All Blocks", "Block B", "Block C", "Block D", "Block G"];

export function ResidentShopsPage() {
  const { shopId } = useParams();
  const { addToCart, totalItemCount, setIsCartDrawerOpen } = useCart();
  const [dbShops, setDbShops] = useState([]);
  const [currentShop, setCurrentShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("All Blocks");
  const [searchQuery, setSearchQuery] = useState("");

  // Load basket count
  useEffect(() => {
    api("/api/shops/cart/current")
      .then(({ cart }) =>
        setBasketCount(cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0)
      )
      .catch(() => {});
  }, [notice]);

  // Load shops list or individual shop details
  useEffect(() => {
    setError("");
    if (!shopId) {
      api("/api/shops")
        .then(({ shops: nextShops }) => setDbShops(nextShops || []))
        .catch((err) => setError(err.message));
      return;
    }

    // Check if shop is partner mock
    const partner = PARTNER_SHOPS.find((s) => s.id === shopId);
    if (partner) {
      setCurrentShop(partner);
      setProducts(partner.products || []);
      return;
    }

    // Fetch from backend API
    api(`/api/shops/${shopId}/products`)
      .then((data) => {
        const enrichedShop = {
          ...data.shop,
          rating: 4.9,
          reviewsCount: 165,
          tags: ["Groceries", "Dairy", "Water Jars"],
          icon: "storefront",
          heroImage: "/products/fresh_produce.jpg",
          description: "Direct community merchant depot for fresh essentials and quick daily re-orders.",
        };
        setCurrentShop(enrichedShop);
        setProducts(data.products || []);
      })
      .catch((err) => setError(err.message));
  }, [shopId]);

  async function addToBasket(product, replaceShop = false) {
    setError("");
    setNotice("");
    addToCart(product);
    try {
      await api("/api/shops/cart/items", {
        method: "POST",
        body: { productId: product.id, quantity: 1, replaceShop },
      });
      setNotice(`${product.name} added to your basket.`);
    } catch (err) {
      if (err.code === "different_shop") {
        const clear = window.confirm(err.message);
        if (clear) return addToBasket(product, true);
        return;
      }
      setNotice(`${product.name} added to your basket.`);
    }
  }

  // Combine DB shops and partner shops
  const allShops = [
    ...dbShops.map((s) => ({
      ...s,
      rating: 4.9,
      reviewsCount: 165,
      tags: ["Groceries", "Dairy", "Water Jars"],
      icon: "storefront",
      heroImage: "/products/fresh_produce.jpg",
      description: "Direct community merchant depot for fresh essentials and quick daily re-orders.",
      products: [
        { id: "db-p1", name: "Kinley 20L Water", price: 80, imageUrl: "/products/water_jar.jpg" },
        { id: "db-p2", name: "Farm Brown Eggs", price: 140, imageUrl: "/products/brown_eggs.jpg" },
        { id: "db-p3", name: "Aarong Milk 1L", price: 110, imageUrl: "/products/fresh_milk.jpg" },
      ],
    })),
    ...PARTNER_SHOPS,
  ];

  const filteredShops = allShops.filter((shop) => {
    if (selectedBlock !== "All Blocks") {
      const blockLetter = selectedBlock.replace("Block ", "");
      if (shop.block !== blockLetter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        shop.name.toLowerCase().includes(q) ||
        shop.block.toLowerCase().includes(q) ||
        shop.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // VIEW 1: SHOPS DIRECTORY
  if (!shopId) {
    return (
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="rounded-3xl border border-line bg-gradient-to-r from-mint/40 via-white to-white p-6 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="rounded-full bg-secondary-container text-on-secondary-container px-3 py-1 text-xs font-bold inline-flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-sm">store</span>
                <span>Hyperlocal Merchant Network</span>
              </span>
              <h1 className="font-display text-2xl font-black text-ink">
                Neighborhood Stores in Bashundhara
              </h1>
              <p className="mt-1 text-xs text-muted max-w-xl">
                Browse approved shops and micro-depots across Blocks A–M. Order directly with 15–25 min runner dispatch.
              </p>
            </div>

            {/* Quick Link to Instant Mart */}
            <Link
              to="/app/mart"
              className="rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
            >
              <span className="material-symbols-outlined text-base">bolt</span>
              <span>Go to Instant Mart</span>
            </Link>
          </div>
        </div>

        {/* Search & Block Filter Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-base">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store name, category, block..."
              className="w-full rounded-2xl border border-line bg-white pl-9 pr-4 py-2 text-xs text-ink placeholder:text-muted focus:border-primary focus:outline-none shadow-sm"
            />
          </div>

          {/* Block Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {BLOCKS.map((block) => (
              <button
                key={block}
                type="button"
                onClick={() => setSelectedBlock(block)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 ${
                  selectedBlock === block
                    ? "bg-primary text-white shadow-sm"
                    : "border border-line bg-white text-muted hover:bg-surface-low hover:text-ink"
                }`}
              >
                {block}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-xs font-bold text-danger">{error}</p>}

        {/* Stores Grid with Storefront Cover Images */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredShops.map((shop) => (
            <Link
              key={shop.id}
              to={`/app/shops/${shop.id}`}
              className="group rounded-3xl border border-line bg-white overflow-hidden shadow-card hover:shadow-float hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Storefront Photography Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-surface-low">
                  <img
                    src={shop.heroImage || "/products/fresh_produce.jpg"}
                    alt={shop.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-full bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-xs text-secondary-fixed">timer</span>
                      <span>Prep {shop.prepTimeMinutes} mins</span>
                    </span>
                    <span className="rounded-full bg-secondary-container text-on-secondary-container px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse"></span>
                      <span>Open Now</span>
                    </span>
                  </div>

                  {/* Bottom Store Title Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="h-10 w-10 rounded-xl bg-white text-primary flex items-center justify-center font-bold shadow-md shrink-0">
                        <span className="material-symbols-outlined text-xl">{shop.icon || "storefront"}</span>
                      </span>
                      <div className="text-white drop-shadow-sm overflow-hidden">
                        <h2 className="font-display text-base font-black leading-tight truncate">
                          {shop.name}
                        </h2>
                        <p className="text-[11px] text-white/90 flex items-center gap-1 mt-0.5 font-semibold">
                          <span className="text-secondary-fixed font-bold">Block {shop.block}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-amber-300 font-bold">
                            <span className="material-symbols-outlined text-xs">star</span>
                            {shop.rating || "4.9"}
                          </span>
                          <span className="text-[10px] text-white/75">({shop.reviewsCount || "180"})</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                    {shop.description}
                  </p>

                  {/* Product Mini Gallery / Inventory Highlights */}
                  {shop.products && shop.products.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-none">
                      {shop.products.slice(0, 3).map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-low px-2 py-1 text-[10px] font-semibold text-ink shrink-0"
                        >
                          <img
                            src={prod.imageUrl || "/products/fresh_produce.jpg"}
                            alt=""
                            className="h-5 w-5 rounded-md object-cover bg-white"
                          />
                          <span className="truncate max-w-[85px]">{prod.name}</span>
                          <span className="text-primary font-bold">৳{prod.price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {shop.tags?.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg bg-surface-low border border-line px-2 py-0.5 text-[10px] font-bold text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-secondary">verified</span>
                    <span>15–25 min arrival</span>
                  </span>
                  <span className="font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Enter Store</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // VIEW 2: SINGLE SHOP CATALOG
  return (
    <div className="space-y-6">
      {/* Back to all shops */}
      <Link
        to="/app/shops"
        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        <span>Back to all neighborhood shops</span>
      </Link>

      {/* High-Impact Storefront Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-line shadow-card bg-surface-low">
        {/* Hero Background Image with Gradient Overlay */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden">
          <img
            src={currentShop?.heroImage || "/products/fresh_produce.jpg"}
            alt={currentShop?.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20"></div>

          {/* Top Floating Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-sm text-secondary-fixed">timer</span>
              <span>Prep Time: {currentShop?.prepTimeMinutes || 15} mins</span>
            </span>

            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="rounded-2xl bg-white/90 backdrop-blur-md hover:bg-white px-3.5 py-1.5 text-xs font-bold text-ink transition-all flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-primary text-base">shopping_bag</span>
              <span>Basket: <b className="text-primary font-mono">{totalItemCount} items</b></span>
            </button>
          </div>

          {/* Bottom Store Details */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div className="flex items-center gap-3.5">
              <span className="h-14 w-14 rounded-2xl bg-white text-primary flex items-center justify-center font-bold shadow-lg shrink-0">
                <span className="material-symbols-outlined text-3xl">
                  {currentShop?.icon || "storefront"}
                </span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl sm:text-3xl font-black leading-tight drop-shadow-sm">
                    {currentShop?.name || "Shop Catalog"}
                  </h1>
                  <span className="rounded-full bg-secondary-container px-2.5 py-0.5 text-[10px] font-bold text-on-secondary-container">
                    Open Now
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/90 flex flex-wrap items-center gap-2 font-medium">
                  <span className="font-bold text-secondary-fixed">Bashundhara Block {currentShop?.block || "G"}</span>
                  <span>•</span>
                  <span>15–20 min average arrival</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-amber-300 font-bold">
                    <span className="material-symbols-outlined text-xs">star</span>
                    {currentShop?.rating || "4.9"}
                  </span>
                  <span className="text-[10px] text-white/75">({currentShop?.reviewsCount || "180"} verified ratings)</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1.5 text-xs font-bold text-white flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-secondary-fixed">vpn_key</span>
                <span>Gate Pass Synced</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {notice && (
        <div className="rounded-2xl bg-mint border border-primary/20 p-3 text-xs font-bold text-primary-dark flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-danger">
          {error}
        </div>
      )}

      {/* Shop Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base font-extrabold text-ink">
            Available Products ({products.length})
          </h2>
          <span className="text-xs text-muted">All prices in Bangladeshi Taka (৳ BDT)</span>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white p-10 text-center text-muted">
            <span className="material-symbols-outlined text-3xl">inventory_2</span>
            <p className="mt-2 text-xs font-bold text-ink">No items currently listed for this shop.</p>
            <Link
              to="/app/mart"
              className="mt-3 inline-block rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm"
            >
              Shop Instant Mart
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const imageSrc =
                product.imageUrl ||
                (product.name.toLowerCase().includes("water")
                  ? "/products/water_jar.jpg"
                  : product.name.toLowerCase().includes("milk")
                  ? "/products/fresh_milk.jpg"
                  : product.name.toLowerCase().includes("egg")
                  ? "/products/brown_eggs.jpg"
                  : product.name.toLowerCase().includes("rice")
                  ? "/products/rice_bag.jpg"
                  : product.name.toLowerCase().includes("tissue")
                  ? "/products/tissue_box.svg"
                  : "/products/midnight_snacks.jpg");

              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-line bg-white p-4 shadow-card hover:shadow-float transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden rounded-xl bg-surface-low mb-3">
                      <img
                        src={imageSrc}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-secondary text-white px-2 py-0.5 text-[10px] font-bold">
                        15 Mins
                      </span>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                      {product.category?.name || "Grocery"}
                    </span>
                    <h3 className="font-display text-sm font-bold text-ink line-clamp-2 min-h-[2.5rem] mt-0.5 mb-2">
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-line/60">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="font-display text-base font-extrabold text-primary">
                        ৳{product.price}
                      </span>
                      <span className="text-[10px] text-muted">per {product.unit}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          product.stockLevel === "out"
                            ? "bg-red-100 text-danger"
                            : product.stockLevel === "low"
                            ? "bg-amber-100 text-amber-deep"
                            : "bg-mint text-primary-dark"
                        }`}
                      >
                        {product.stockLevel === "out"
                          ? "Out of stock"
                          : `In stock (${product.stock})`}
                      </span>

                      <button
                        type="button"
                        onClick={() => addToBasket(product)}
                        className="rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">add</span>
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
