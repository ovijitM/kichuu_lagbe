import { Link } from "react-router-dom";
import { useCart } from "./CartContext.jsx";

export function CartDrawer() {
  const {
    cart,
    totalItemCount,
    itemsSubtotal,
    deliveryFee,
    grandTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    checkoutModalOpen,
    setCheckoutModalOpen,
    orderStep,
    handleCheckout,
  } = useCart();

  if (!isCartDrawerOpen && !checkoutModalOpen) return null;

  return (
    <>
      {/* 1. SLIDE-OUT CART DRAWER */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
          {/* Backdrop */}
          <div
            onClick={() => setIsCartDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
          ></div>

          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slideInRight border-l border-line">
            {/* Drawer Top Header */}
            <div className="p-4 border-b border-line flex items-center justify-between bg-surface-lowest">
              <div className="flex items-center gap-2.5">
                <span className="h-9 w-9 rounded-xl bg-mint text-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">shopping_cart</span>
                </span>
                <div>
                  <h2 className="font-display text-base font-extrabold text-ink leading-tight">
                    Your Instant Basket
                  </h2>
                  <p className="text-[11px] text-muted">
                    {totalItemCount} {totalItemCount === 1 ? "item" : "items"} · 15–25 mins ETA
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] font-bold text-muted hover:text-danger px-2 py-1 rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="h-8 w-8 rounded-xl bg-surface-low text-ink hover:bg-surface-container flex items-center justify-center transition-colors"
                  aria-label="Close cart"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>

            {/* Middle Scrollable Section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Delivery Address & Gate PIN Card */}
              <div className="rounded-2xl bg-surface-low border border-line p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-sm">home_pin</span>
                    <span>Block D, Road 11, Apt 4B</span>
                  </span>
                  <span className="text-[10px] font-bold text-primary">Resident Pass</span>
                </div>
                <p className="text-[11px] text-muted flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">vpn_key</span>
                  <span>Gate Intercom PIN: <b>#4892</b> (Auto-synced with Rider)</span>
                </p>
              </div>

              {/* Items List */}
              {cart.length === 0 ? (
                <div className="py-16 text-center text-muted">
                  <span className="material-symbols-outlined text-5xl text-muted/60">
                    remove_shopping_cart
                  </span>
                  <p className="mt-3 text-sm font-bold text-ink">Your cart is empty</p>
                  <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
                    Add groceries, 20L water jars, or fresh dairy to start fast delivery.
                  </p>
                  <Link
                    to="/app/mart"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">bolt</span>
                    <span>Explore Instant Mart</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 divide-y divide-line/60">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={product.image || "/products/fresh_produce.jpg"}
                          alt=""
                          className="h-12 w-12 rounded-xl object-cover bg-surface-low shrink-0 border border-line/60"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-ink truncate leading-tight">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-muted mt-0.5">
                            <span className="text-primary font-bold">৳{product.price}</span> / {product.unit || "unit"} · <span className="text-secondary font-semibold">{product.store}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center rounded-xl border border-line bg-surface-low p-0.5 shadow-xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, -1)}
                            className="h-6 w-6 rounded-lg text-ink hover:bg-white flex items-center justify-center text-xs font-bold transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-ink font-mono">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, 1)}
                            className="h-6 w-6 rounded-lg text-ink hover:bg-white flex items-center justify-center text-xs font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="h-6 w-6 rounded-lg text-muted hover:text-danger hover:bg-red-50 flex items-center justify-center transition-colors"
                          aria-label="Remove item"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Bill Breakdown & Checkout Action */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-line bg-surface-lowest space-y-3">
                <div className="space-y-1.5 text-xs">
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
                    <span>Gate Security Clearance Intercom</span>
                    <span className="text-secondary font-bold">Included</span>
                  </div>
                  <div className="pt-2 border-t border-line flex items-center justify-between text-sm font-extrabold text-ink">
                    <span>Total Amount (COD)</span>
                    <span className="text-primary text-base font-mono">৳{grandTotal}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    handleCheckout();
                  }}
                  className="w-full py-3 rounded-2xl bg-primary text-white font-display text-xs font-extrabold shadow-md hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">bolt</span>
                  <span>Instant Checkout · ৳{grandTotal}</span>
                </button>

                <p className="text-[10px] text-center text-muted flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-xs text-secondary">verified_user</span>
                  <span>20–30 min guarantee across Bashundhara R/A</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. ORDER CONFIRMATION MODAL */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-modal border border-line space-y-4">
            <div className="text-center space-y-2">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-mint text-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h3 className="font-display text-xl font-black text-ink">
                Order #KL-9481 Confirmed!
              </h3>
              <p className="text-xs text-muted">
                Assigned to Runner Hasan on Honda Moped · Arriving in 18 mins
              </p>
            </div>

            {/* Live Status Milestones */}
            <div className="rounded-2xl bg-surface-low border border-line p-4 space-y-3">
              <div className="flex items-center gap-3">
                <span
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    orderStep >= 1 ? "bg-primary text-white" : "bg-line text-muted"
                  }`}
                >
                  ✓
                </span>
                <div className="text-left text-xs">
                  <p className="font-bold text-ink">Shop Packing Order</p>
                  <p className="text-[10px] text-muted">Bashundhara Micro-Depot</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    orderStep >= 2 ? "bg-primary text-white" : "bg-line text-muted"
                  }`}
                >
                  {orderStep >= 2 ? "✓" : "2"}
                </span>
                <div className="text-left text-xs">
                  <p className="font-bold text-ink">Runner En Route</p>
                  <p className="text-[10px] text-muted">Honda Moped · Inside Block D</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    orderStep >= 3 ? "bg-primary text-white" : "bg-line text-muted"
                  }`}
                >
                  {orderStep >= 3 ? "✓" : "3"}
                </span>
                <div className="text-left text-xs">
                  <p className="font-bold text-ink">Gate 2 Security Clearance</p>
                  <p className="text-[10px] text-secondary font-bold">Intercom Pass PIN #4892 Synced</p>
                </div>
              </div>
            </div>

            {/* Total and Payment */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container/50 text-xs font-bold text-ink">
              <span>Amount Due on Delivery</span>
              <span className="text-primary text-sm font-mono">৳{grandTotal} (Cash on Delivery)</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCheckoutModalOpen(false);
                  clearCart();
                }}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all"
              >
                Track Live on Resident Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
