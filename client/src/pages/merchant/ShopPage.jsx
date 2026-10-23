import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { Badge } from "../../components/Badge.jsx";
import { Button } from "../../components/Button.jsx";
import { Field, SelectInput, TextInput } from "../../components/Field.jsx";

const emptyProduct = {
  name: "",
  categoryId: "",
  price: "",
  unit: "pcs",
  stock: "0",
  imageUrl: "",
};

const levelTone = { in: "mint", low: "amber", out: "slate" };

const PRESET_PRODUCT_IMAGES = [
  { label: "Water Jar", url: "/products/water_jar.jpg" },
  { label: "Farm Eggs", url: "/products/brown_eggs.jpg" },
  { label: "Fresh Milk", url: "/products/fresh_milk.jpg" },
  { label: "Aromatic Rice", url: "/products/rice_bag.jpg" },
  { label: "Midnight Snacks", url: "/products/midnight_snacks.jpg" },
  { label: "Fresh Produce", url: "/products/fresh_produce.jpg" },
  { label: "Bakery Bread", url: "/products/bakery_bread.jpg" },
  { label: "Tissue Box", url: "/products/tissue_box.svg" },
];

const PRESET_SHOP_COVERS = [
  { label: "Fresh Produce", url: "/products/fresh_produce.jpg" },
  { label: "Midnight Snacks", url: "/products/midnight_snacks.jpg" },
  { label: "Artisan Bakery", url: "/products/bakery_bread.jpg" },
  { label: "Dairy & Staples", url: "/products/fresh_milk.jpg" },
];

export function ShopPage() {
  const [shop, setShop] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    block: "",
    prepTimeMinutes: "15",
    isOpen: false,
    heroImage: "",
    avatarImage: "",
    description: "",
    phone: "",
  });
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [activeTab, setActiveTab] = useState("fulfillment"); // fulfillment | catalog | settings

  function handleImageFile(file, onLoaded) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image file size must be less than 5MB.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      onLoaded(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function load() {
    const [{ shop: nextShop }, { categories: nextCategories }] = await Promise.all([
      api("/api/merchant/shop"),
      api("/api/categories?kind=product"),
    ]);
    setShop(nextShop);
    setCategories(nextCategories);
    if (nextShop) {
      setProfile({
        name: nextShop.name,
        block: nextShop.block,
        prepTimeMinutes: String(nextShop.prepTimeMinutes),
        isOpen: nextShop.isOpen,
        heroImage: nextShop.heroImage || "",
        avatarImage: nextShop.avatarImage || "",
        description: nextShop.description || "",
        phone: nextShop.phone || "",
      });
      const { products: nextProducts } = await api("/api/merchant/products");
      setProducts(nextProducts);
    }
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function saveShop(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    const body = {
      name: profile.name,
      block: profile.block,
      prepTimeMinutes: Number(profile.prepTimeMinutes),
      isOpen: profile.isOpen,
      heroImage: profile.heroImage,
      avatarImage: profile.avatarImage,
      description: profile.description,
      phone: profile.phone,
    };
    try {
      const path = "/api/merchant/shop";
      const result = shop
        ? await api(path, { method: "PATCH", body })
        : await api(path, {
            method: "POST",
            body: {
              name: body.name,
              block: body.block,
              prepTimeMinutes: body.prepTimeMinutes,
            },
          });
      setShop(result.shop);
      setNotice(
        result.shop.approvalStatus === "pending" && shop?.approvalStatus === "rejected"
          ? "Sent back for review."
          : shop
          ? "Shop profile updated successfully."
          : "Shop submitted for admin approval."
      );
      if (!shop) await load();
    } catch (err) {
      setError(err.message);
    }
  }

  function editProduct(product) {
    setEditingId(product.id);
    setProductForm({
      name: product.name,
      categoryId: product.category.id,
      price: String(product.price),
      unit: product.unit,
      stock: String(product.stock),
      imageUrl: product.imageUrl || "",
    });
    setActiveTab("catalog");
  }

  async function saveProduct(event) {
    event.preventDefault();
    setError("");
    const body = {
      name: productForm.name,
      categoryId: productForm.categoryId,
      price: Number(productForm.price),
      unit: productForm.unit,
      stock: Number(productForm.stock),
      imageUrl: productForm.imageUrl,
    };
    try {
      if (editingId) {
        const { product } = await api(`/api/merchant/products/${editingId}`, { method: "PATCH", body });
        setProducts((current) => current.map((item) => (item.id === product.id ? product : item)));
        setNotice(`${product.name} updated.`);
      } else {
        const { product } = await api("/api/merchant/products", { method: "POST", body });
        setProducts((current) => [...current, product].sort((a, b) => a.name.localeCompare(b.name)));
        setNotice(`${product.name} created.`);
      }
      setEditingId("");
      setProductForm(emptyProduct);
    } catch (err) {
      setError(err.message);
    }
  }

  async function setLevel(product, level) {
    setError("");
    try {
      const { product: next } = await api(`/api/merchant/products/${product.id}/stock-level`, {
        method: "POST",
        body: { level },
      });
      setProducts((current) => current.map((item) => (item.id === next.id ? next : item)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleArchive(product) {
    setError("");
    try {
      const { product: next } = await api(`/api/merchant/products/${product.id}/archive`, { method: "PATCH" });
      setProducts((current) => current.map((item) => (item.id === next.id ? next : item)));
    } catch (err) {
      setError(err.message);
    }
  }

  if (shop === undefined) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
        <span>Loading merchant console…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & STORE STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-black text-ink">
              {shop?.name || "Merchant Terminal"}
            </h1>
            {shop && (
              <Badge tone={shop.approvalStatus === "approved" ? "mint" : shop.approvalStatus === "rejected" ? "slate" : "amber"}>
                {shop.approvalStatus}
              </Badge>
            )}
            {shop?.isOpen ? (
              <span className="rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse"></span>
                OPEN &amp; TAKING ORDERS
              </span>
            ) : shop ? (
              <span className="rounded-full bg-surface-low text-muted text-[10px] font-bold px-2 py-0.5">
                CLOSED
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted mt-1">
            Bashundhara R/A Block {shop?.block || "G"} · Dedicated Internal Runner Dispatch
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-surface-low p-1 rounded-xl border border-line text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("fulfillment")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "fulfillment"
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            <span>Live Terminal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "catalog"
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            <span>Inventory ({products.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "settings"
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            <span className="material-symbols-outlined text-sm">settings</span>
            <span>Shop Profile</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-danger text-xs flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">error</span>
          <span>{error}</span>
        </div>
      )}
      {notice && (
        <div className="p-3 rounded-xl bg-mint border border-primary/30 text-primary-dark text-xs font-semibold flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{notice}</span>
        </div>
      )}

      {/* 2. FOUR KPI METRIC CARDS (Direct from Stitch Dashboard Spec) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-line bg-white p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-semibold">Today's Sales</span>
            <span className="h-7 w-7 rounded-lg bg-mint text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-base">payments</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-black text-ink tabular">৳42,850</span>
              <span className="text-[10px] font-bold text-secondary bg-secondary-container px-1.5 py-0.2 rounded">+18%</span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">vs yesterday (৳36,200)</p>
          </div>
          <div className="w-full bg-surface-low h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "78%" }}></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-line bg-white p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-semibold">Instant Orders</span>
            <span className="h-7 w-7 rounded-lg bg-amber-soft text-amber-deep flex items-center justify-center">
              <span className="material-symbols-outlined text-base">bolt</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-black text-ink tabular">58</span>
              <span className="text-xs text-muted">orders</span>
            </div>
            <p className="text-[11px] text-primary font-bold mt-0.5">Avg pack: 3.4 mins</p>
          </div>
          <div className="w-full bg-surface-low h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: "85%" }}></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-line bg-white p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-semibold">In Fulfillment</span>
            <span className="h-7 w-7 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-base">two_wheeler</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-black text-amber-deep tabular">4</span>
              <span className="text-xs text-muted">active</span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">1 packing · 3 en route</p>
          </div>
          <div className="w-full bg-surface-low h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber h-full rounded-full" style={{ width: "60%" }}></div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-line bg-white p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-semibold">Store Rating</span>
            <span className="h-7 w-7 rounded-lg bg-mint text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-base">star</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-black text-ink tabular">4.85</span>
              <span className="text-xs text-muted">/ 5.0</span>
            </div>
            <p className="text-[11px] text-secondary font-bold mt-0.5">99.4% on-time guarantee</p>
          </div>
          <div className="w-full bg-surface-low h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "95%" }}></div>
          </div>
        </div>
      </div>

      {/* 3. CONDITIONAL TAB VIEWS */}

      {/* TAB A: LIVE FULFILLMENT TERMINAL */}
      {activeTab === "fulfillment" && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Active Orders Kanban (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
                <h3 className="font-display text-base font-bold text-ink">Active Orders Terminal</h3>
              </div>
              <span className="rounded-full bg-surface-low border border-line px-2 py-0.5 text-[10px] font-bold text-muted">
                Audio Chimes Active
              </span>
            </div>

            {/* Simulated Live Incoming Cards */}
            <div className="space-y-3">
              <div className="rounded-2xl border border-amber/40 bg-amber-soft/40 p-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-amber/20">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-amber text-white text-[10px] font-bold px-1.5 py-0.5">
                      PACKING NOW
                    </span>
                    <span className="font-display text-xs font-bold text-ink">Order #KL-9104</span>
                  </div>
                  <span className="text-[11px] text-amber-deep font-bold">1:45 mins left</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-ink">2 × Kinley 20L Water, 1 × Aarong Milk 1L</p>
                    <p className="text-[10px] text-muted">Block D, Road 11, Apt 4B · Runner assigned</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotice("Order #KL-9104 handed to Runner Hasan!")}
                    className="rounded-xl bg-primary hover:bg-primary-dark text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">check</span>
                    <span>Hand to Rider</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-mint text-primary-dark text-[10px] font-bold px-1.5 py-0.5">
                      EN ROUTE
                    </span>
                    <span className="font-display text-xs font-bold text-ink">Order #KL-9088</span>
                  </div>
                  <span className="text-[11px] text-muted">Runner Tanvir</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-ink">1 × Miniket Rice 5kg, 1 × Farm Eggs (12 pcs)</p>
                    <p className="text-[10px] text-muted">Block G, Road 4 · Delivered soon</p>
                  </div>
                  <span className="font-bold text-primary tabular text-sm">৳660 COD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Quick Stock Toggles */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-ink">Fast Stock Toggles</h3>
              <button
                type="button"
                onClick={() => setActiveTab("catalog")}
                className="text-xs font-bold text-primary hover:underline"
              >
                Full Catalog →
              </button>
            </div>

            <div className="rounded-2xl border border-line bg-white p-4 shadow-sm space-y-3">
              {products.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="p-2.5 rounded-xl border border-line bg-surface-low flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="h-8 w-8 rounded-lg bg-white border border-line flex items-center justify-center text-xs font-bold shrink-0">
                      📦
                    </span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-ink truncate">{product.name}</p>
                      <p className="text-[10px] text-muted tabular">৳{product.price} · Stock: {product.stock}</p>
                    </div>
                  </div>

                  {/* Level Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setLevel(product, "in")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        product.stockLevel === "in"
                          ? "bg-primary text-white"
                          : "bg-white text-muted hover:text-ink"
                      }`}
                    >
                      In
                    </button>
                    <button
                      type="button"
                      onClick={() => setLevel(product, "low")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        product.stockLevel === "low"
                          ? "bg-amber text-white"
                          : "bg-white text-muted hover:text-ink"
                      }`}
                    >
                      Low
                    </button>
                    <button
                      type="button"
                      onClick={() => setLevel(product, "out")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        product.stockLevel === "out"
                          ? "bg-slate-700 text-white"
                          : "bg-white text-muted hover:text-ink"
                      }`}
                    >
                      Out
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB B: PRODUCT CATALOG MANAGEMENT */}
      {activeTab === "catalog" && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Products List (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-ink">Shop Inventory ({products.length})</h3>
              <button
                type="button"
                onClick={() => {
                  setEditingId("");
                  setProductForm(emptyProduct);
                }}
                className="rounded-xl bg-primary text-white px-3 py-1.5 text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>New Item</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-line bg-white p-3.5 shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-11 w-11 rounded-xl object-cover border border-line shrink-0 shadow-xs"
                      />
                    ) : (
                      <span className="h-11 w-11 rounded-xl bg-surface-low border border-line flex items-center justify-center text-primary font-bold shrink-0">
                        <span className="material-symbols-outlined text-lg">inventory_2</span>
                      </span>
                    )}
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-ink truncate">{product.name}</p>
                        <Badge tone={levelTone[product.stockLevel]}>{product.stockLevel}</Badge>
                      </div>
                      <p className="text-[11px] text-muted mt-0.5">
                        <span className="font-bold text-primary tabular">৳{product.price}</span> / {product.unit} · Stock: {product.stock}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => editProduct(product)}
                      className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold hover:bg-surface-low"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleArchive(product)}
                      className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-muted hover:text-danger"
                    >
                      {product.isArchived ? "Unarchive" : "Archive"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add / Edit Form (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-line bg-white p-5 shadow-card">
            <h3 className="font-display text-base font-bold text-ink mb-4">
              {editingId ? "Edit Product" : "Add Product to Catalog"}
            </h3>

            <form onSubmit={saveProduct} className="space-y-3">
              <Field label="Item Name">
                <TextInput
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Kinley 20L Water Jar"
                  required
                />
              </Field>

              {/* Product Image Uploader */}
              <Field label="Product Image">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-low border border-line">
                    {productForm.imageUrl ? (
                      <img
                        src={productForm.imageUrl}
                        alt="Product preview"
                        className="h-16 w-16 rounded-xl object-cover border border-line shadow-sm shrink-0 bg-white"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-white border border-dashed border-line flex flex-col items-center justify-center text-muted shrink-0">
                        <span className="material-symbols-outlined text-xl">image</span>
                        <span className="text-[9px] font-bold">No Image</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-ink truncate">
                        {productForm.imageUrl ? "Image Selected" : "Upload Product Photo"}
                      </p>
                      <p className="text-[11px] text-muted">Supports JPG, PNG, WebP up to 5MB</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-line text-xs font-bold text-ink hover:bg-surface-low transition-colors shadow-xs">
                          <span className="material-symbols-outlined text-xs">upload</span>
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageFile(file, (dataUrl) => setProductForm((p) => ({ ...p, imageUrl: dataUrl })));
                              e.target.value = "";
                            }}
                          />
                        </label>
                        {productForm.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setProductForm((p) => ({ ...p, imageUrl: "" }))}
                            className="px-2 py-1 text-xs text-danger hover:underline font-bold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-muted block mb-1.5 uppercase tracking-wider">
                      Or pick a ready catalog image:
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {PRESET_PRODUCT_IMAGES.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setProductForm((p) => ({ ...p, imageUrl: preset.url }))}
                          className={`group flex flex-col items-center p-1 rounded-xl border text-center transition-all ${
                            productForm.imageUrl === preset.url
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-line bg-white hover:border-ink/30"
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="h-10 w-full object-cover rounded-lg mb-1"
                          />
                          <span className="text-[9px] font-bold text-ink truncate w-full">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Field>

              <Field label="Category">
                <SelectInput
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <div className="grid grid-cols-2 gap-2">
                <Field label="Price (৳ BDT)">
                  <TextInput
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </Field>
                <Field label="Unit">
                  <TextInput
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="pcs / jar / kg"
                    required
                  />
                </Field>
              </div>

              <Field label="Available Stock">
                <TextInput
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  required
                />
              </Field>

              <div className="pt-2 flex items-center gap-2">
                <Button type="submit">
                  {editingId ? "Save Changes" : "Create Product"}
                </Button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId("");
                      setProductForm(emptyProduct);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-muted hover:text-ink"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB C: SHOP SETTINGS & PROFILE */}
      {activeTab === "settings" && (
        <form onSubmit={saveShop} className="max-w-2xl rounded-3xl border border-line bg-white p-6 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Shop Profile &amp; Storefront Brand</h3>
              <p className="text-xs text-muted mt-0.5">Manage your Bashundhara storefront visual banner, logo, and store parameters.</p>
            </div>
            <span className="rounded-full bg-mint text-primary-dark text-[10px] font-bold px-2 py-0.5">
              Bashundhara Verified
            </span>
          </div>

          {/* Storefront Cover Banner */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-ink">Storefront Cover Banner</label>
            <div className="relative rounded-2xl overflow-hidden border border-line bg-surface-low aspect-[3/1] max-h-48 group">
              {profile.heroImage ? (
                <img
                  src={profile.heroImage}
                  alt="Storefront cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted bg-gradient-to-r from-emerald-50 to-teal-50">
                  <span className="material-symbols-outlined text-3xl text-primary/40">storefront</span>
                  <span className="text-xs font-semibold mt-1">No cover image uploaded</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-ink text-xs font-bold shadow-md hover:bg-surface-low">
                  <span className="material-symbols-outlined text-sm">upload</span>
                  <span>Change Cover</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageFile(file, (dataUrl) => setProfile((p) => ({ ...p, heroImage: dataUrl })));
                      e.target.value = "";
                    }}
                  />
                </label>
                {profile.heroImage && (
                  <button
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, heroImage: "" }))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted">
              <span>Recommended ratio 3:1 (e.g. 1200x400)</span>
              <label className="cursor-pointer text-primary font-bold hover:underline">
                Upload from device
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageFile(file, (dataUrl) => setProfile((p) => ({ ...p, heroImage: dataUrl })));
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            {/* Quick cover presets */}
            <div className="pt-1">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                Or choose sample cover:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_SHOP_COVERS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, heroImage: preset.url }))}
                    className={`relative rounded-xl overflow-hidden border h-14 group ${
                      profile.heroImage === preset.url
                        ? "border-primary ring-2 ring-primary"
                        : "border-line hover:border-ink/40"
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] font-bold px-1 py-0.5 truncate text-center">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Store Logo / Avatar */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-ink">Storefront Logo / Brand Avatar</label>
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-surface-low border border-line">
              {profile.avatarImage ? (
                <img
                  src={profile.avatarImage}
                  alt="Store avatar"
                  className="h-16 w-16 rounded-2xl object-cover border border-line shadow-sm shrink-0 bg-white"
                />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-white border border-dashed border-line flex flex-col items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-2xl">storefront</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-ink">Storefront Emblem</p>
                <p className="text-[11px] text-muted">Displays on shop listings, cart items, and order chits.</p>
                <div className="mt-2 flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-line text-xs font-bold text-ink hover:bg-surface-low shadow-xs">
                    <span className="material-symbols-outlined text-xs">upload</span>
                    <span>Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(file, (dataUrl) => setProfile((p) => ({ ...p, avatarImage: dataUrl })));
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {profile.avatarImage && (
                    <button
                      type="button"
                      onClick={() => setProfile((p) => ({ ...p, avatarImage: "" }))}
                      className="text-xs text-danger hover:underline font-bold px-2 py-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <Field label="Shop Name">
              <TextInput
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </Field>

            <Field label="Bashundhara Block">
              <TextInput
                value={profile.block}
                onChange={(e) => setProfile({ ...profile, block: e.target.value.toUpperCase() })}
                placeholder="e.g. G"
                required
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Store Contact / Hotline">
              <TextInput
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="017XXXXXXXX"
              />
            </Field>

            <Field label="Average Preparation Time (Minutes)">
              <TextInput
                type="number"
                min="1"
                value={profile.prepTimeMinutes}
                onChange={(e) => setProfile({ ...profile, prepTimeMinutes: e.target.value })}
                required
              />
            </Field>
          </div>

          <Field label="Shop Description &amp; Specialty Notes">
            <textarea
              rows={3}
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              placeholder="e.g. Fresh daily vegetables, dairy, household essentials, and 20L mineral water bottles delivered within 15 minutes in Block G and surrounding blocks."
              className="w-full rounded-2xl border border-line bg-white px-3.5 py-2.5 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </Field>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 text-xs font-bold text-ink cursor-pointer bg-surface-low p-3 rounded-2xl border border-line">
              <input
                type="checkbox"
                checked={profile.isOpen}
                onChange={(e) => setProfile({ ...profile, isOpen: e.target.checked })}
                className="h-4 w-4 rounded text-primary focus:ring-primary"
              />
              <div>
                <span className="block font-bold">Shop is currently Open for orders in Bashundhara</span>
                <span className="block text-[11px] font-normal text-muted">When toggled off, residents see your store as closed and cannot place instant orders.</span>
              </div>
            </label>
          </div>

          <div className="pt-3 border-t border-line flex items-center justify-between">
            <span className="text-xs text-muted">Auto-synced with Dispatch Runner system</span>
            <Button type="submit">Save Shop Profile &amp; Branding</Button>
          </div>
        </form>
      )}
    </div>
  );
}
