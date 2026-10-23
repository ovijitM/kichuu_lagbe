import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import { LiveTrackingMap } from "../../components/LiveTrackingMap.jsx";

const QUICK_ITEMS = [
  { id: "q1", name: "Kinley 20L Water Jar", price: 80, image: "/products/water_jar.jpg", tag: "Essential" },
  { id: "q2", name: "Aarong Fresh Milk 1L", price: 110, image: "/products/fresh_milk.jpg", tag: "Dairy" },
  { id: "q3", name: "Farm Brown Eggs (12 pcs)", price: 140, image: "/products/brown_eggs.jpg", tag: "Pantry" },
  { id: "q4", name: "Miniket Rice 5kg", price: 520, image: "/products/rice_bag.jpg", tag: "Staple" },
  { id: "q5", name: "Midnight Nachos Combo", price: 240, image: "/products/midnight_snacks.jpg", tag: "Till 4 AM" },
];

export function ResidentHubPage() {
  const { user } = useAuth();
  const [reordered, setReordered] = useState("");

  function triggerReorder(itemName) {
    setReordered(itemName);
    setTimeout(() => setReordered(""), 3000);
  }

  return (
    <div className="space-y-6">
      {/* 1. TOP GREETING & GATED SECTOR STATUS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-secondary">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span>VERIFIED RESIDENT • APARTMENT 4B</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-ink mt-1">
            Good afternoon, {user?.name || "Resident"} 👋{" "}
            <span className="text-muted font-normal text-lg sm:text-xl">| Block D, Road 11</span>
          </h1>
        </div>

        {/* Gate Access Quick Badges */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white border border-line p-2.5 shadow-sm text-xs">
          <div className="flex items-center gap-1 text-primary font-bold">
            <span className="material-symbols-outlined text-base">traffic</span>
            <span>Gate Access:</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container text-on-secondary-container px-2.5 py-0.5 font-semibold text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
            Gate 1 Clear
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container text-on-secondary-container px-2.5 py-0.5 font-semibold text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
            Gate 2 Clear
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container text-on-secondary-container px-2.5 py-0.5 font-semibold text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
            Gate 3 Clear
          </span>
          <span className="text-muted pl-1">Avg Transit: <b className="text-ink">21 mins</b></span>
        </div>
      </div>

      {reordered && (
        <div className="rounded-xl bg-mint border border-primary/30 p-3 text-xs font-bold text-primary-dark flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{reordered} added to your basket! Proceed to checkout in Instant Mart.</span>
        </div>
      )}

      {/* 2. HYPERLOCAL VALUE BANNER REDESIGN */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-[#062419] to-[#021811] border border-emerald-500/25 p-6 sm:p-8 shadow-2xl">
        {/* Ambient Glowing Blobs & Tech Grid */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Column: Hero Typography & Key Trust Highlights */}
          <div className="space-y-4 max-w-2xl">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="tracking-wide uppercase text-[10px] sm:text-[11px]">Internal Runner Fleet Active</span>
              <span className="text-emerald-500/60">•</span>
              <span className="text-white/80 font-normal text-[10px] sm:text-[11px]">Blocks A through M</span>
            </div>

            {/* Main Title */}
            <div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Rapid 15–25 Min Delivery <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                  Right to Your Apartment Door
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300/90 mt-2 leading-relaxed max-w-xl">
                Dedicated bike &amp; moped couriers operating strictly inside Bashundhara R/A gate perimeters. Pre-cleared at security checkpoints with direct intercom drop-off.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-xs font-semibold backdrop-blur-sm">
                <span className="material-symbols-outlined text-emerald-400 text-base">bolt</span>
                <span>15–25 Min Transit</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-xs font-semibold backdrop-blur-sm">
                <span className="material-symbols-outlined text-emerald-400 text-base">security</span>
                <span>Intercom &amp; Gate PIN Sync</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-xs font-semibold backdrop-blur-sm">
                <span className="material-symbols-outlined text-amber text-base">nightlight</span>
                <span>Open Till 4:00 AM</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Dispatch Monitor Card & CTAs */}
          <div className="w-full lg:w-auto lg:min-w-[340px] shrink-0">
            <div className="rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/15 p-5 shadow-2xl space-y-4">
              {/* Card Header with Live Radar Animation */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
                    <span className="material-symbols-outlined text-xl animate-pulse">electric_moped</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live Fleet Radar</p>
                    <p className="text-xs font-bold text-white">Bashundhara Dispatch</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Active Fleet</span>
                  <span className="font-display text-base font-extrabold text-white tabular">48 Couriers</span>
                </div>
              </div>

              {/* Real-time Sector Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-black/30 p-2.5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-medium">Nearest Hub</span>
                  <span className="font-bold text-white text-[11px] mt-0.5 block truncate">Block G Warehouse</span>
                </div>
                <div className="rounded-xl bg-black/30 p-2.5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-medium">Avg Delivery</span>
                  <span className="font-bold text-emerald-400 text-[11px] mt-0.5 block tabular">18–22 Mins</span>
                </div>
                <div className="rounded-xl bg-black/30 p-2.5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-medium">Security Gates</span>
                  <span className="font-bold text-teal-300 text-[11px] mt-0.5 block flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    All 3 Pre-Cleared
                  </span>
                </div>
                <div className="rounded-xl bg-black/30 p-2.5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-medium">Delivery Fee</span>
                  <span className="font-bold text-white text-[11px] mt-0.5 block">From ৳29</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex items-center gap-2">
                <Link
                  to="/app/mart"
                  className="flex-1 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 px-4 py-2.5 text-xs font-black transition-all shadow-md hover:shadow-emerald-500/30 flex items-center justify-center gap-1.5"
                >
                  <span>Order Instant Mart</span>
                  <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                </Link>
                <Link
                  to="/app/shops"
                  className="rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 px-3.5 py-2.5 text-xs font-bold transition-all flex items-center justify-center"
                >
                  <span>Shops</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THREE PRIMARY SUPER TILES (STITCH SPEC) */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Super Tile 1: Instant Mart */}
        <Link
          to="/app/mart"
          className="group rounded-3xl border border-line bg-white p-6 shadow-card hover:shadow-float transition-all flex flex-col justify-between hover:border-primary/40"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-2.5 py-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">bolt</span>
                20 MIN EXPRESS
              </span>
              <span className="material-symbols-outlined text-muted group-hover:text-primary transition-colors">
                arrow_forward
              </span>
            </div>
            <h3 className="font-display text-xl font-bold text-ink group-hover:text-primary transition-colors">
              Instant Mart
            </h3>
            <p className="text-xs text-muted mt-1">Direct from Block G Central Micro-Warehouse</p>

            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="px-2 py-0.5 rounded-md bg-surface-low text-ink text-[10px] font-semibold">Groceries</span>
              <span className="px-2 py-0.5 rounded-md bg-surface-low text-ink text-[10px] font-semibold">20L Water</span>
              <span className="px-2 py-0.5 rounded-md bg-surface-low text-ink text-[10px] font-semibold">Dairy</span>
              <span className="px-2 py-0.5 rounded-md bg-surface-low text-ink text-[10px] font-semibold">Till 4 AM</span>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-line flex items-center justify-between text-xs font-bold text-primary">
            <span>Browse Essentials</span>
            <span className="h-7 w-7 rounded-full bg-mint flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">storefront</span>
            </span>
          </div>
        </Link>

        {/* Super Tile 2: Local Community Shops */}
        <Link
          to="/app/shops"
          className="group rounded-3xl border border-line bg-white p-6 shadow-card hover:shadow-float transition-all flex flex-col justify-between hover:border-primary/40"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2.5 py-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">store</span>
                35+ SHOPS OPEN
              </span>
              <span className="material-symbols-outlined text-muted group-hover:text-primary transition-colors">
                arrow_forward
              </span>
            </div>
            <h3 className="font-display text-xl font-bold text-ink group-hover:text-primary transition-colors">
              Community Shops
            </h3>
            <p className="text-xs text-muted mt-1">Support verified stores across Blocks A through M</p>

            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="px-2 py-0.5 rounded-md bg-surface-low text-ink text-[10px] font-semibold">Artisan Bakeries</span>
              <span className="px-2 py-0.5 rounded-md bg-surface-low text-ink text-[10px] font-semibold">Fresh Bazar</span>
              <span className="px-2 py-0.5 rounded-md bg-surface-low text-ink text-[10px] font-semibold">Stationery</span>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-line flex items-center justify-between text-xs font-bold text-primary">
            <span>Explore Stores</span>
            <span className="h-7 w-7 rounded-full bg-mint flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">local_mall</span>
            </span>
          </div>
        </Link>

        {/* Super Tile 3: Book Home Technicians */}
        <Link
          to="/app/services"
          className="group rounded-3xl border border-line bg-white p-6 shadow-card hover:shadow-float transition-all flex flex-col justify-between hover:border-primary/40"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="rounded-full bg-mint text-primary-dark text-[10px] font-bold px-2.5 py-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">verified</span>
                SECURITY VETTED
              </span>
              <span className="material-symbols-outlined text-muted group-hover:text-primary transition-colors">
                arrow_forward
              </span>
            </div>
            <h3 className="font-display text-xl font-bold text-ink group-hover:text-primary transition-colors">
              Home Technicians
            </h3>
            <p className="text-xs text-muted mt-1">AC servicing, electricians, plumbers &amp; cleaners</p>

            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="px-2 py-0.5 rounded-md bg-surface-low text-ink text-[10px] font-semibold">AC Jet Wash</span>
              <span className="px-2 py-0.5 rounded-md bg-surface-low text-ink text-[10px] font-semibold">Breakers</span>
              <span className="px-2 py-0.5 rounded-md bg-surface-low text-ink text-[10px] font-semibold">Pipe Leaks</span>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-line flex items-center justify-between text-xs font-bold text-primary">
            <span>Book in 60s</span>
            <span className="h-7 w-7 rounded-full bg-mint flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">handyman</span>
            </span>
          </div>
        </Link>
      </div>

      {/* 4. MAIN FEED DUAL COLUMN: ACTIVE ORDER TRACKER & POPULAR ROW */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Active Order Card & Quick Re-order */}
        <div className="lg:col-span-8 space-y-6">
          {/* LIVE ORDER TRACKER MAP & DISPATCH CARD */}
          <div className="space-y-3">
            <LiveTrackingMap role="resident" orderId="KL-8492" height="380px" />

            {/* Order Timeline Milestones */}
            <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
                <span className="text-xs font-bold text-ink">Delivery Milestones</span>
                <span className="text-[11px] text-primary font-bold">Bashundhara Fresh Hub · 3 items (৳330 COD)</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Confirmed", time: "12:02 PM", done: true },
                  { label: "Packed", time: "12:08 PM", done: true },
                  { label: "Gate 2 Passed", time: "12:15 PM", done: true, active: true },
                  { label: "Delivered", time: "12:23 PM (est)", done: false },
                ].map((step, idx) => (
                  <div key={step.label} className="flex flex-col items-start">
                    <div className="w-full flex items-center">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 shrink-0 ${
                          step.done
                            ? "bg-primary text-white"
                            : "bg-surface-low text-muted border border-line"
                        }`}
                      >
                        {step.done ? (
                          <span className="material-symbols-outlined text-xs">check</span>
                        ) : (
                          idx + 1
                        )}
                      </div>
                      {idx < 3 && (
                        <div
                          className={`h-1 w-full -ml-1 ${
                            step.done ? "bg-primary" : "bg-line"
                          }`}
                        ></div>
                      )}
                    </div>
                    <p className={`text-xs font-bold mt-1.5 ${step.active ? "text-primary" : "text-ink"}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-muted">{step.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Re-Order Row */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-bold text-ink">Popular in Block D</h3>
              <Link to="/app/shops" className="text-xs font-bold text-primary hover:underline">
                View All Catalog
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {QUICK_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-line bg-white p-3 shadow-card flex flex-col justify-between"
                >
                  <div className="h-24 w-full rounded-xl bg-slate-100 overflow-hidden mb-2">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <span className="rounded-md bg-mint text-primary-dark text-[9px] font-bold px-1.5 py-0.5">
                      {item.tag}
                    </span>
                    <h4 className="font-bold text-xs text-ink mt-1 truncate">{item.name}</h4>
                  </div>
                  <div className="mt-2 pt-2 border-t border-line flex items-center justify-between">
                    <span className="text-xs font-extrabold text-primary tabular">৳{item.price}</span>
                    <button
                      type="button"
                      onClick={() => triggerReorder(item.name)}
                      className="rounded-lg bg-surface-low hover:bg-primary hover:text-white px-2 py-1 text-[11px] font-bold text-ink transition-colors"
                    >
                      + Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Gate Pass Widget & Notice Board */}
        <div className="lg:col-span-4 space-y-5">
          {/* Digital Intercom Pass Card */}
          <div className="rounded-3xl border border-line bg-white p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-primary">key</span>
                <span>Gate Pass Protocol</span>
              </span>
              <span className="rounded-full bg-mint text-primary-dark text-[10px] font-bold px-2 py-0.5">
                Active
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              When runners or technicians arrive at your building gate, show this code or confirm via intercom:
            </p>
            <div className="mt-3 p-3 rounded-2xl bg-surface-low border border-line text-center">
              <p className="text-[10px] text-muted uppercase font-bold">Building Security Pass</p>
              <p className="font-display text-2xl font-black text-primary tracking-widest tabular mt-0.5">
                4892
              </p>
              <p className="text-[10px] text-secondary font-bold mt-1">Valid for today's deliveries</p>
            </div>
          </div>

          {/* Community Notice Board */}
          <div className="rounded-3xl border border-line bg-white p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-secondary">campaign</span>
                <span>Bashundhara Community Notice</span>
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-surface-low border border-line">
                <p className="font-bold text-ink">Gate 2 Routine Inspection</p>
                <p className="text-[11px] text-muted mt-0.5">Gate 2 clearance is operating smoothly. Internal runners have zero hold-ups.</p>
                <span className="text-[10px] text-secondary font-semibold mt-1 block">Updated 15 mins ago</span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-low border border-line">
                <p className="font-bold text-ink">Late Night Mart Till 4:00 AM</p>
                <p className="text-[11px] text-muted mt-0.5">Drinking water jars, cold dairy, and snacks available through midnight shift.</p>
                <span className="text-[10px] text-secondary font-semibold mt-1 block">Active Daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
