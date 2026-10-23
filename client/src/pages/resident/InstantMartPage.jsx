import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";
import { useCart } from "../../cart/CartContext.jsx";

// Rich catalog matching the Stitch instant_mart_local_marketplace prototype
const DEFAULT_MART_PRODUCTS = [
  {
    id: "mart-1",
    name: "Kinley 20L Water Jar (Refill Exchange)",
    category: "water",
    categoryLabel: "Water Jars (20L)",
    price: 90,
    originalPrice: 100,
    unit: "jar",
    image: "/products/water_jar.jpg",
    store: "Al-Madina Store (Block D)",
    stock: 42,
    stockLevel: "in",
    eta: "15 Mins",
    badge: "Swap Cap",
    tag: "SAVE ৳10",
    speedMinutes: 15,
    hasOffer: true,
  },
  {
    id: "mart-2",
    name: "Farm Fresh Brown Eggs (Box of 12)",
    category: "dairy",
    categoryLabel: "Dairy & Eggs",
    price: 140,
    originalPrice: 160,
    unit: "box",
    image: "/products/brown_eggs.jpg",
    store: "Bashundhara Fresh Hub (Block G)",
    stock: 18,
    stockLevel: "low",
    eta: "18 Mins",
    badge: "Graded",
    tag: "PROMO -10%",
    speedMinutes: 18,
    hasOffer: true,
  },
  {
    id: "mart-3",
    name: "Aarong Pure Pasteurised Milk 1L",
    category: "dairy",
    categoryLabel: "Dairy & Eggs",
    price: 95,
    unit: "pack",
    image: "/products/fresh_milk.jpg",
    store: "Daily Mart (Block G)",
    stock: 24,
    stockLevel: "in",
    eta: "15 Mins",
    badge: "Cold Chilled",
    speedMinutes: 15,
    hasOffer: false,
  },
  {
    id: "mart-4",
    name: "Fresh ACI Miniket Rice 5kg Bag",
    category: "staples",
    categoryLabel: "Staples & Rice",
    price: 380,
    originalPrice: 400,
    unit: "bag",
    image: "/products/rice_bag.jpg",
    store: "Shwapno Express (Block C)",
    stock: 12,
    stockLevel: "in",
    eta: "22 Mins",
    badge: "Heavy Weight",
    tag: "SAVE ৳20",
    speedMinutes: 22,
    hasOffer: true,
  },
  {
    id: "mart-5",
    name: "Midnight Crunchies & Spicy Crisps Combo",
    category: "snacks",
    categoryLabel: "Snacks & Drinks",
    price: 120,
    originalPrice: 135,
    unit: "pack",
    image: "/products/midnight_snacks.jpg",
    store: "Daily Mart (Block G)",
    stock: 35,
    stockLevel: "in",
    eta: "15 Mins",
    badge: "Till 4 AM",
    tag: "Late Night Fav",
    speedMinutes: 15,
    hasOffer: true,
  },
  {
    id: "mart-6",
    name: "Fresh Farm Organic Tomatoes (1 kg)",
    category: "produce",
    categoryLabel: "Fresh Produce",
    price: 75,
    unit: "kg",
    image: "/products/fresh_produce.jpg",
    store: "Bashundhara Fresh Hub (Block G)",
    stock: 20,
    stockLevel: "in",
    eta: "18 Mins",
    badge: "Morning Harvest",
    speedMinutes: 18,
    hasOffer: false,
  },
  {
    id: "mart-7",
    name: "Daily Loaf Sandwich Bread & Butter Buns",
    category: "bakery",
    categoryLabel: "Bakery & Breads",
    price: 65,
    unit: "pack",
    image: "/products/bakery_bread.jpg",
    store: "Shwapno Express (Block C)",
    stock: 16,
    stockLevel: "in",
    eta: "15 Mins",
    badge: "Oven Fresh",
    speedMinutes: 15,
    hasOffer: false,
  },
];

const CATEGORIES = [
  { id: "all", label: "All Items", icon: "category", count: 48 },
  { id: "water", label: "Water Jars (20L)", icon: "water_drop" },
  { id: "dairy", label: "Dairy & Eggs", icon: "egg" },
  { id: "produce", label: "Fresh Produce", icon: "eco" },
  { id: "staples", label: "Staples & Rice", icon: "rice_bowl" },
  { id: "snacks", label: "Snacks & Drinks", icon: "cookie" },
  { id: "bakery", label: "Bakery & Breads", icon: "bakery_dining" },
];

export function InstantMartPage() {
  const [products, setProducts] = useState(DEFAULT_MART_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [speedOnly, setSpeedOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [offersOnly, setOffersOnly] = useState(false);

  // Cart state from centralized CartContext
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalItemCount,
    itemsSubtotal,
    deliveryFee,
    grandTotal,
    handleCheckout,
  } = useCart();

  // Load backend shops & products if available
  useEffect(() => {
    api("/api/shops")
      .then(async ({ shops }) => {
        if (shops && shops.length > 0) {
          const firstShop = shops[0];
          const { products: dbProducts } = await api(`/api/shops/${firstShop.id}/products`);
          if (dbProducts && dbProducts.length > 0) {
            // merge backend products into catalog
            const mapped = dbProducts.map((p, idx) => ({
              id: p.id,
              name: p.name,
              category: p.category?.name?.toLowerCase().includes("water")
                ? "water"
                : p.category?.name?.toLowerCase().includes("egg") || p.category?.name?.toLowerCase().includes("milk")
                ? "dairy"
                : "staples",
              categoryLabel: p.category?.name || "Grocery",
              price: p.price,
              unit: p.unit || "unit",
              image:
                p.imageUrl ||
                (p.name.toLowerCase().includes("water")
                  ? "/products/water_jar.jpg"
                  : p.name.toLowerCase().includes("milk")
                  ? "/products/fresh_milk.jpg"
                  : p.name.toLowerCase().includes("egg")
                  ? "/products/brown_eggs.jpg"
                  : p.name.toLowerCase().includes("rice")
                  ? "/products/rice_bag.jpg"
                  : p.name.toLowerCase().includes("tissue")
                  ? "/products/tissue_box.svg"
                  : "/products/midnight_snacks.jpg"),
              store: `${firstShop.name} (Block ${firstShop.block})`,
              stock: p.stock || 20,
              stockLevel: p.stockLevel || "in",
              eta: `${firstShop.prepTimeMinutes || 15} Mins`,
              speedMinutes: firstShop.prepTimeMinutes || 15,
              badge: "Verified Local",
              hasOffer: idx % 2 === 0,
            }));

            // merge unique by name
            setProducts((prev) => {
              const names = new Set(mapped.map((m) => m.name.toLowerCase()));
              const filteredPrev = prev.filter((p) => !names.has(p.name.toLowerCase()));
              return [...mapped, ...filteredPrev];
            });
          }
        }
      })
      .catch(() => {
        // graceful fallback to rich mock products
      });
  }, []);

  // Filter products
  const filteredProducts = products.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (storeFilter !== "all" && !item.store.toLowerCase().includes(storeFilter.toLowerCase())) return false;
    if (speedOnly && item.speedMinutes > 20) return false;
    if (inStockOnly && item.stock <= 0) return false;
    if (offersOnly && !item.hasOffer) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.store.toLowerCase().includes(q)
      );
    }
    return true;
  });



  return (
    <div className="space-y-6">
      {/* 1. TOP HYPERLOCAL DELIVERY LIVE BANNER & STORE PICKER BAR */}
      <div className="rounded-2xl border border-line bg-white p-4 shadow-card flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-secondary-container text-on-secondary-container px-3.5 py-1 text-xs font-bold">
            <span className="material-symbols-outlined text-sm">bolt</span>
            <span>Express Delivery Hub: Block D Dispatch Live</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="material-symbols-outlined text-primary text-base">storefront</span>
            <span className="font-semibold text-ink">Store Source:</span>
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="rounded-lg border border-line bg-surface-low px-2.5 py-1 text-xs font-bold text-ink focus:border-primary focus:outline-none"
            >
              <option value="all">All Bashundhara Hubs (12 Active)</option>
              <option value="Bashundhara Fresh Hub">Bashundhara Fresh Hub (Block G)</option>
              <option value="Shwapno">Shwapno Express (Block C)</option>
              <option value="Al-Madina">Al-Madina Store (Block D)</option>
              <option value="Daily Mart">Daily Mart (Block G)</option>
            </select>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSpeedOnly(!speedOnly)}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-all ${
              speedOnly
                ? "bg-primary text-white shadow-sm"
                : "border border-line bg-surface-low text-muted hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-xs">timer</span>
            <span>&lt; 20 Mins Only</span>
          </button>

          <button
            type="button"
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-all ${
              inStockOnly
                ? "bg-primary text-white shadow-sm"
                : "border border-line bg-surface-low text-muted hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-xs">check_circle</span>
            <span>In-Stock Only</span>
          </button>

          <button
            type="button"
            onClick={() => setOffersOnly(!offersOnly)}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-all ${
              offersOnly
                ? "bg-amber text-white shadow-sm"
                : "border border-line bg-surface-low text-muted hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-xs">local_offer</span>
            <span>Offers &amp; Combos</span>
          </button>
        </div>
      </div>

      {/* 2. SEARCH & CATEGORY PILLS */}
      <div className="space-y-3">
        {/* Instant Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groceries, Kinley water jars, eggs, farm milk, midnight snacks..."
            className="w-full rounded-2xl border border-line bg-white pl-10 pr-4 py-2.5 text-xs text-ink placeholder:text-muted focus:border-primary focus:outline-none shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "border border-line bg-white text-muted hover:bg-surface-low hover:text-ink"
                }`}
              >
                <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.count && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? "bg-white/20 text-white" : "bg-surface-container text-muted"
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DUAL LAYOUT: CATALOG GRID (LEFT) + STICKY CART SIDEBAR (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CATALOG GRID (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Micro-Hub Dispatch Notice Banner */}
          <div className="rounded-2xl border border-line bg-gradient-to-r from-mint/50 via-white to-white p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">two_wheeler</span>
              </div>
              <div>
                <p className="font-display text-xs font-bold text-ink">Bashundhara R/A Micro-Hub Active</p>
                <p className="text-[11px] text-muted">
                  Drop within gate security clearance in 15–25 mins. Rider contact shared on dispatch.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex rounded-lg bg-surface-low border border-line px-2.5 py-1 text-[11px] font-bold text-primary">
              Block D Depot
            </span>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-card">
              <span className="material-symbols-outlined text-4xl text-muted">inventory_2</span>
              <p className="mt-2 text-sm font-bold text-ink">No items match your filters</p>
              <p className="mt-1 text-xs text-muted">Try resetting search or selecting another category.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                  setStoreFilter("all");
                  setSpeedOnly(false);
                  setOffersOnly(false);
                }}
                className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((item) => {
                const inCartItem = cart.find((c) => c.product.id === item.id);
                const quantityInCart = inCartItem?.quantity || 0;

                return (
                  <div
                    key={item.id}
                    className="group rounded-2xl border border-line bg-white p-3.5 shadow-card hover:shadow-float transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail with Overlay Badges */}
                      <div className="relative h-44 w-full overflow-hidden rounded-xl bg-surface-low mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Speed Tag */}
                        <span className="absolute top-2 left-2 rounded-full bg-secondary text-white px-2 py-0.5 text-[10px] font-bold flex items-center gap-0.5 shadow-sm">
                          <span className="material-symbols-outlined text-[11px]">bolt</span>
                          <span>{item.eta}</span>
                        </span>
                        {/* Custom Badge */}
                        {item.badge && (
                          <span className="absolute bottom-2 right-2 rounded-md bg-white/90 backdrop-blur-xs text-ink px-2 py-0.5 text-[10px] font-bold shadow-sm">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Store & Stock Subtitle */}
                      <div className="flex items-center gap-1.5 text-[10px] text-muted mb-1">
                        <span className="truncate max-w-[130px]">{item.store}</span>
                        <span>•</span>
                        <span className={item.stock < 15 ? "text-amber font-bold" : "text-secondary font-bold"}>
                          {item.stock} in stock
                        </span>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-display text-sm font-bold text-ink leading-snug line-clamp-2 min-h-[2.5rem] mb-2">
                        {item.name}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-line/60">
                      {/* Price & Discount */}
                      <div className="flex items-baseline justify-between mb-2.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-display text-base font-extrabold text-primary">৳{item.price}</span>
                          {item.originalPrice && (
                            <span className="text-xs text-muted line-through">৳{item.originalPrice}</span>
                          )}
                          <span className="text-[10px] text-muted">/{item.unit}</span>
                        </div>
                        {item.tag && (
                          <span className="rounded bg-mint text-primary-dark font-extrabold text-[9px] px-1.5 py-0.5">
                            {item.tag}
                          </span>
                        )}
                      </div>

                      {/* Interactive Cart Button or Quantity Counter */}
                      {quantityInCart === 0 ? (
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="w-full py-2 rounded-xl bg-surface-low border border-line text-ink hover:bg-primary hover:text-white hover:border-primary font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">shopping_bag</span>
                          <span>Add to Cart</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between rounded-xl bg-surface-low border border-line p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-7 w-7 rounded-lg bg-white text-ink flex items-center justify-center hover:bg-surface-container active:scale-95 transition-all shadow-sm"
                          >
                            <span className="material-symbols-outlined text-xs">remove</span>
                          </button>
                          <span className="font-display text-xs font-bold text-ink">
                            {quantityInCart} in cart
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-7 w-7 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark active:scale-95 transition-all shadow-sm"
                          >
                            <span className="material-symbols-outlined text-xs">add</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* STICKY CART & CHECKOUT SIDEBAR (4 Columns) */}
        <aside className="lg:col-span-4 sticky top-24 self-start">
          <div className="rounded-3xl border border-line bg-white p-5 shadow-card space-y-4">
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">shopping_cart</span>
                <div>
                  <h2 className="font-display text-sm font-extrabold text-ink leading-tight">Your Instant Basket</h2>
                  <p className="text-[10px] text-muted">{totalItemCount} items ready for dispatch</p>
                </div>
              </div>
              <span className="rounded-full bg-secondary-container px-2.5 py-0.5 text-[10px] font-bold text-on-secondary-container">
                15–25 mins ETA
              </span>
            </div>

            {/* Destination Gate & Address Card */}
            <div className="rounded-xl bg-surface-low border border-line p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-sm">home_pin</span>
                  <span>Block D, Road 11, Apt 4B</span>
                </span>
                <span className="text-[10px] font-bold text-primary">Change</span>
              </div>
              <p className="text-[10px] text-muted flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-primary">vpn_key</span>
                <span>Gate Pass Intercom PIN: <b>#4892</b> (Auto-synced)</span>
              </p>
            </div>

            {/* Itemized List */}
            {cart.length === 0 ? (
              <div className="py-8 text-center text-muted">
                <span className="material-symbols-outlined text-3xl">remove_shopping_cart</span>
                <p className="mt-2 text-xs font-semibold">Your basket is empty</p>
                <p className="text-[10px]">Add fresh groceries or water jars to start</p>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 divide-y divide-line/60">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <img
                        src={product.image}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover bg-surface-low shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-ink truncate leading-tight">{product.name}</p>
                        <p className="text-[10px] text-muted">৳{product.price} × {quantity}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center rounded-lg border border-line bg-surface-low p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, -1)}
                          className="h-5 w-5 rounded text-ink hover:bg-white flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className="px-1.5 text-xs font-bold text-ink">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, 1)}
                          className="h-5 w-5 rounded text-ink hover:bg-white flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-muted hover:text-danger p-0.5"
                        aria-label="Remove item"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bill Summary */}
            <div className="pt-3 border-t border-line space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted">
                <span>Items Subtotal</span>
                <span className="font-bold text-ink font-mono">৳{itemsSubtotal}</span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span className="flex items-center gap-1">
                  <span>Hyperlocal Runner Fee</span>
                  <span className="text-[10px] text-secondary font-bold">(Block D Depot)</span>
                </span>
                <span className="font-bold text-ink font-mono">
                  {deliveryFee === 0 ? <span className="text-primary font-bold">FREE</span> : `৳${deliveryFee}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Gate Pass Intercom Clearance</span>
                <span className="text-secondary font-bold">Included</span>
              </div>
              <div className="pt-2 border-t border-line flex items-center justify-between text-sm font-extrabold text-ink">
                <span>Total Amount (COD)</span>
                <span className="text-primary text-base font-mono">৳{grandTotal}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full py-3 rounded-2xl bg-primary text-white font-display text-xs font-extrabold shadow-md hover:bg-primary-dark transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">bolt</span>
              <span>Instant Checkout · ৳{grandTotal}</span>
            </button>

            {/* Guarantee micro-copy */}
            <p className="text-[10px] text-center text-muted flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-xs text-secondary">verified_user</span>
              <span>20–30 min guarantee or runner discount on next run</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
