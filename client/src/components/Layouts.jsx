import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useCart } from "../cart/CartContext.jsx";
import { CartDrawer } from "../cart/CartDrawer.jsx";
import { Brand } from "./Brand.jsx";
import { NotificationBell } from "./NotificationBell.jsx";

export function ResidentLayout() {
  const { user, logout } = useAuth();
  const { totalItemCount, grandTotal, setIsCartDrawerOpen } = useCart();

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased flex flex-col justify-between">
      {/* Top Gated Sector Status Banner */}
      <div className="bg-primary-deep text-on-primary text-[11px] font-semibold py-1.5 px-4">
        <div className="max-w-app mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-fixed"></span>
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-secondary-fixed">bolt</span>
              <b>Hyperlocal Active:</b> 20–30 min average arrival across Blocks A–M
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-primary-fixed">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">traffic</span>
              Gate 1 &amp; Gate 2 Clear
            </span>
            <span>•</span>
            <span className="bg-primary-container px-2 py-0.5 rounded-full text-[10px] text-white font-bold uppercase tracking-wider">
              Gate Passes Live
            </span>
          </div>
        </div>
      </div>

      {/* Main Resident Navigation Bar */}
      <header className="sticky top-0 z-40 bg-surface-lowest/90 backdrop-blur-md border-b border-line shadow-sm">
        <div className="max-w-app mx-auto flex items-center justify-between gap-4 px-4 py-2.5 md:px-8">
          <div className="flex items-center gap-4">
            <Link to="/" aria-label="Home" className="flex items-center">
              <span className="md:hidden">
                <Brand compact />
              </span>
              <span className="hidden md:block">
                <Brand />
              </span>
            </Link>

            {/* Resident Verified Address Badge */}
            <div className="hidden md:flex items-center gap-2 rounded-xl bg-surface-low border border-line px-3 py-1.5 text-xs">
              <span className="material-symbols-outlined text-base text-primary">verified_user</span>
              <div className="flex flex-col text-left">
                <span className="font-bold text-ink leading-tight">Block D, Road 11, Apt 4B</span>
                <span className="text-[10px] text-secondary font-bold">20-30 min Delivery Active</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-low p-1 rounded-xl border border-line">
            <ResidentNavLink to="/app" end icon="hub">
              Hub
            </ResidentNavLink>
            <ResidentNavLink to="/app/mart" icon="bolt">
              Instant Mart
            </ResidentNavLink>
            <ResidentNavLink to="/app/shops" icon="storefront">
              Shops
            </ResidentNavLink>
            <ResidentNavLink to="/app/services" icon="handyman">
              Services
            </ResidentNavLink>
          </nav>

          {/* Top Cart Option & User Controls */}
          <div className="flex items-center gap-2.5">
            {/* Notifications Bell */}
            <NotificationBell />

            {/* Express Cart Pill */}
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="min-h-11 flex items-center gap-2 rounded-2xl bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-all px-3 py-1.5 shadow-sm active:scale-95 group border border-secondary/20"
              aria-label="Open Cart Basket"
            >
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
                  shopping_bag
                </span>
                {totalItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="hidden sm:block text-xs font-black font-mono">
                  {totalItemCount > 0 ? `${totalItemCount} items (৳${grandTotal})` : "Cart (0)"}
                </span>
                <span className="text-[9px] text-on-secondary-container/85 font-bold hidden sm:inline">
                  15–25m ETA
                </span>
              </div>
            </button>

            {/* Profile & Logout */}
            <div className="hidden lg:flex flex-col text-right pl-1">
              <span className="text-xs font-bold text-ink leading-tight">{user?.name || "Resident"}</span>
              <span className="text-[10px] text-muted">Verified Resident</span>
            </div>

            <button
              onClick={logout}
              type="button"
              className="min-h-11 rounded-xl border border-line bg-white hover:bg-surface-low px-2.5 py-1.5 text-xs font-bold text-ink transition-colors flex items-center gap-1 shadow-sm"
              title="Log out"
            >
              <span className="material-symbols-outlined text-sm text-muted">logout</span>
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Cart Drawer & Modal */}
      <CartDrawer />

      {/* Main Content Body */}
      <main className="w-full flex-1 max-w-app mx-auto px-4 md:px-8 py-6 pb-24 md:pb-6">
        <Outlet />
      </main>

      <ResidentMobileNav onCartOpen={() => setIsCartDrawerOpen(true)} totalItemCount={totalItemCount} />

      {/* Minimalist Resident Footer */}
      <footer className="bg-white border-t border-line py-6 text-xs text-muted">
        <div className="max-w-app mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Kichuu Lagbe · Bashundhara R/A Community Super-App</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Currency: ৳ BDT</span>
            <span>•</span>
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>Gate PIN Intercom</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ResidentMobileNav({ onCartOpen, totalItemCount }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden">
      <div className="grid h-16 grid-cols-5">
        <MobileNavLink to="/app" end icon="hub" label="Home" />
        <MobileNavLink to="/app/mart" icon="bolt" label="Mart" />
        <MobileNavLink to="/app/shops" icon="storefront" label="Shops" />
        <MobileNavLink to="/app/services" icon="handyman" label="Services" />
        <button
          type="button"
          onClick={onCartOpen}
          className="relative flex min-h-11 flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-muted"
          aria-label={`Open cart${totalItemCount ? ` with ${totalItemCount} items` : ""}`}
        >
          <span className="relative">
            <span className="material-symbols-outlined text-xl">shopping_bag</span>
            {totalItemCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] text-white">
                {totalItemCount}
              </span>
            )}
          </span>
          <span>Cart</span>
        </button>
      </div>
    </nav>
  );
}

function MobileNavLink({ to, end, icon, label }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex min-h-11 flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors ${
          isActive ? "text-primary" : "text-muted"
        }`
      }
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

function ResidentNavLink({ to, end, icon, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
          isActive
            ? "bg-primary text-white shadow-sm"
            : "text-muted hover:text-ink hover:bg-surface-container"
        }`
      }
    >
      <span className="material-symbols-outlined text-sm">{icon}</span>
      <span>{children}</span>
    </NavLink>
  );
}

export function PanelLayout({ config }) {
  const { user, logout } = useAuth();
  const items = config?.nav || [];

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased md:pl-[260px]">
      {/* Desktop 260px Nav Spine */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-line bg-white md:flex justify-between shadow-card">
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-line">
            <Link to="/" aria-label="Home">
              <Brand />
            </Link>
          </div>

          {/* Current Role Banner */}
          <div className="p-3 mx-3 my-3 rounded-xl bg-surface-low border border-line flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-base">
                {config?.icon || "work"}
              </span>
            </span>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-ink truncate">{config?.title || "Operations Terminal"}</p>
              <p className="text-[10px] text-secondary font-bold">● Active Online</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 px-3">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-xs font-bold transition-all flex items-center gap-2.5 ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:bg-surface-low hover:text-ink"
                  }`
                }
              >
                <span className="material-symbols-outlined text-base">
                  {item.icon || (item.label.includes("Shop") ? "store" : item.label.includes("Dispatch") ? "dashboard" : item.label.includes("Deliver") ? "two_wheeler" : "work")}
                </span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Profile & Logout Bottom Bar */}
        <div className="border-t border-line p-4 bg-surface-low/50">
          <div className="flex items-center justify-between mb-3">
            <div className="overflow-hidden">
              <p className="font-bold text-xs text-ink truncate">{user?.name || "User"}</p>
              <p className="text-[10px] text-muted truncate">{user?.email}</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-secondary"></span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex-1 py-1.5 rounded-lg border border-line bg-white text-center text-xs font-semibold text-ink hover:bg-surface-container transition-colors"
            >
              Home
            </Link>
            <button
              onClick={logout}
              type="button"
              className="py-1.5 px-3 rounded-lg border border-line bg-white text-xs font-semibold text-danger hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">logout</span>
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Top Command Bar */}
      <header className="hidden md:flex sticky top-0 z-20 h-14 bg-white/95 backdrop-blur-md border-b border-line px-6 lg:px-8 items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          <span className="font-bold text-ink">{config?.title || "Operations Terminal"}</span>
          <span className="text-muted">•</span>
          <span className="text-muted hidden sm:inline">{config?.subtitle || "Bashundhara R/A Internal Operations"}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <NotificationBell />

          {/* User info badge */}
          <div className="flex items-center gap-2 pl-3 border-l border-line text-right">
            <div>
              <p className="text-xs font-bold text-ink leading-tight">{user?.name || "Terminal User"}</p>
              <p className="text-[10px] text-secondary font-bold capitalize">{user?.role?.replaceAll("_", " ")}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-2.5 md:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/" aria-label="Home">
            <Brand compact />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-ink">{config?.title || "Operations Terminal"}</p>
            <p className="truncate text-[10px] text-muted">{config?.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={logout}
            type="button"
            className="text-xs font-bold text-danger flex items-center gap-1 p-1 rounded-lg hover:bg-red-50"
            title="Logout"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Sub-nav */}
      <div className="border-b border-line bg-white px-4 py-2 md:hidden overflow-x-auto flex gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive ? "bg-primary text-white" : "bg-surface-low text-muted"
              }`
            }
          >
              {item.icon && <span className="material-symbols-outlined text-sm">{item.icon}</span>}
              {item.label}
          </NavLink>
        ))}
      </div>

      {/* Main View Area */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
