import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ROLE_HOME, useAuth } from "../auth/AuthContext.jsx";
import { Brand } from "../components/Brand.jsx";

// Scroll Reveal Component using IntersectionObserver
function Reveal({ children, className = "", delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal-init ${isVisible ? "reveal-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

const BLOCKS = [
  { id: "A", name: "Block A", eta: 22 },
  { id: "B", name: "Block B", eta: 20 },
  { id: "C", name: "Block C", eta: 18 },
  { id: "D", name: "Block D", eta: 21 },
  { id: "E", name: "Block E", eta: 25 },
  { id: "F", name: "Block F", eta: 23 },
  { id: "G", name: "Block G", eta: 15 },
  { id: "H", name: "Block H", eta: 24 },
  { id: "I", name: "Block I", eta: 26 },
  { id: "J", name: "Block J", eta: 28 },
  { id: "K", name: "Block K", eta: 29 },
  { id: "L", name: "Block L", eta: 30 },
  { id: "M", name: "Block M", eta: 30 },
];

const CAROUSEL_FEATURED = [
  {
    id: "c1",
    title: "Kinley 20L Water Jar",
    tagline: "Factory sealed mineral water · Doorstep drop",
    price: "৳80",
    eta: "15-20 min",
    badge: "20-Min Flash",
    icon: "bolt",
    image: "/products/water_jar.jpg",
    accent: "text-emerald-400",
  },
  {
    id: "c2",
    title: "Aarong Fresh Milk 1L",
    tagline: "Pasteurized whole milk · Cold-chain runner bags",
    price: "৳110",
    eta: "18-22 min",
    badge: "Chilled Dairy",
    icon: "ac_unit",
    image: "/products/fresh_milk.jpg",
    accent: "text-cyan-400",
  },
  {
    id: "c3",
    title: "Organic Brown Eggs (1 Dozen)",
    tagline: "Fresh farm harvest · Protective eco-carton",
    price: "৳140",
    eta: "20 min",
    badge: "Daily Fresh",
    icon: "egg",
    image: "/products/brown_eggs.jpg",
    accent: "text-amber-400",
  },
  {
    id: "c4",
    title: "Midnight Munchies & Nachos",
    tagline: "Crispy chips & dip · Delivered till 4:00 AM",
    price: "৳240",
    eta: "20-25 min",
    badge: "Crave Till Four",
    icon: "bedtime",
    image: "/products/midnight_snacks.jpg",
    accent: "text-purple-400",
  },
  {
    id: "c5",
    title: "Miniket Premium Rice 5kg",
    tagline: "Slender aromatic grains · Heavy bag to your door",
    price: "৳520",
    eta: "25 min",
    badge: "Pantry Staple",
    icon: "inventory_2",
    image: "/products/rice_bag.jpg",
    accent: "text-emerald-400",
  },
];

const SHOWCASE_PRODUCTS = [
  {
    id: "p1",
    name: "Kinley 20L Purified Water",
    category: "water",
    price: 80,
    unit: "jar",
    eta: "15-20m",
    badge: "Essential",
    image: "/products/water_jar.jpg",
  },
  {
    id: "p2",
    name: "Aarong Fresh Milk 1L",
    category: "dairy",
    price: 110,
    unit: "pack",
    eta: "18-22m",
    badge: "Cold Chain",
    image: "/products/fresh_milk.jpg",
  },
  {
    id: "p3",
    name: "Farm Brown Eggs (12 pcs)",
    category: "dairy",
    price: 140,
    unit: "dozen",
    eta: "20m",
    badge: "Daily Fresh",
    image: "/products/brown_eggs.jpg",
  },
  {
    id: "p4",
    name: "Miniket Premium Rice 5kg",
    category: "pantry",
    price: 520,
    unit: "bag",
    eta: "25m",
    badge: "Pantry",
    image: "/products/rice_bag.jpg",
  },
  {
    id: "p5",
    name: "Midnight Nachos & Dip Combo",
    category: "snacks",
    price: 240,
    unit: "combo",
    eta: "20m",
    badge: "Till 4 AM",
    image: "/products/midnight_snacks.jpg",
  },
  {
    id: "p6",
    name: "Fresh Market Fruit Basket",
    category: "fresh",
    price: 185,
    unit: "basket",
    eta: "22m",
    badge: "Block C Bazar",
    image: "/products/fresh_produce.jpg",
  },
  {
    id: "p7",
    name: "Golden Oven Milk Bread",
    category: "fresh",
    price: 75,
    unit: "loaf",
    eta: "18m",
    badge: "Bakery",
    image: "/products/bakery_bread.jpg",
  },
];

const SHOWCASE_SERVICES = [
  {
    title: "Emergency Electrician",
    rating: "4.9",
    rate: "From ৳350",
    arrival: "25-35m",
    icon: "bolt",
    tag: "Circuit & Wiring",
    image: "/services/electrician.jpg",
    provider: "Md. Kabir Hossain",
    verified: true,
  },
  {
    title: "AC Servicing & Gas",
    rating: "4.8",
    rate: "From ৳800",
    arrival: "Same-Day",
    icon: "mode_fan",
    tag: "Master Jet Wash",
    image: "/services/ac_technician.jpg",
    provider: "Bashundhara AC Care",
    verified: true,
  },
  {
    title: "Plumbing & Motor Repair",
    rating: "4.9",
    rate: "From ৳400",
    arrival: "30-40m",
    icon: "plumbing",
    tag: "Pipes & Fixtures",
    image: "/services/plumber.jpg",
    provider: "Sajib Sanitary Works",
    verified: true,
  },
  {
    title: "Deep House Cleaning",
    rating: "4.7",
    rate: "From ৳1,200",
    arrival: "Scheduled",
    icon: "cleaning_services",
    tag: "Sanitization Pro",
    image: "/services/cleaner.jpg",
    provider: "Clean Home Services",
    verified: true,
  },
];

export function LandingPage() {
  const { user } = useAuth();
  const appHome = user ? ROLE_HOME[user.role] || "/app" : "/login?mode=signup";

  const [selectedBlock, setSelectedBlock] = useState(BLOCKS[3]); // Default Block D
  const [activeTab, setActiveTab] = useState("all");
  const [basket, setBasket] = useState({});

  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_FEATURED.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPaused]);

  function addToDemoBasket(item) {
    setBasket((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  }

  function removeFromDemoBasket(item) {
    setBasket((prev) => {
      const copy = { ...prev };
      if (copy[item.id] > 1) {
        copy[item.id] -= 1;
      } else {
        delete copy[item.id];
      }
      return copy;
    });
  }

  const basketItemCount = Object.values(basket).reduce((sum, n) => sum + n, 0);
  const basketTotal = SHOWCASE_PRODUCTS.reduce((sum, p) => sum + (basket[p.id] || 0) * p.price, 0);

  const filteredProducts =
    activeTab === "all"
      ? SHOWCASE_PRODUCTS
      : activeTab === "water"
      ? SHOWCASE_PRODUCTS.filter((p) => p.category === "water")
      : activeTab === "dairy"
      ? SHOWCASE_PRODUCTS.filter((p) => p.category === "dairy")
      : activeTab === "snacks"
      ? SHOWCASE_PRODUCTS.filter((p) => p.category === "snacks")
      : activeTab === "fresh"
      ? SHOWCASE_PRODUCTS.filter((p) => p.category === "fresh")
      : SHOWCASE_PRODUCTS;

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* 1. TOP LIVE TICKER RIBBON */}
      <div className="bg-primary-deep text-on-primary text-[11px] font-semibold py-1.5 px-4">
        <div className="max-w-app mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-fixed"></span>
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-secondary-fixed">bolt</span>
              <b>Hyperlocal Dispatch:</b> ~<b>21 min</b> delivery across Blocks A–M · Security Intercom Synced
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-primary-fixed">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              Gate 1 &amp; 2 Clear
            </span>
            <span>•</span>
            <span className="bg-primary-container px-2 py-0.5 rounded-full text-[10px] text-white font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[11px]">bedtime</span>
              Till 4 AM Active
            </span>
          </div>
        </div>
      </div>

      {/* 2. MINIMALIST STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-surface-lowest/90 backdrop-blur-md border-b border-line shadow-sm transition-all">
        <div className="max-w-app mx-auto flex items-center justify-between gap-4 px-4 py-2.5 md:px-8">
          <Link to="/" className="flex items-center group" aria-label="Kichuu Lagbe home">
            <Brand subtitle="Bashundhara R/A" />
          </Link>

          {/* Quick Block Location Badge */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-line bg-surface-low px-3 py-1 text-xs">
            <span className="material-symbols-outlined text-sm text-primary">near_me</span>
            <span className="font-bold text-ink">{selectedBlock.name}</span>
            <span className="text-muted">·</span>
            <span className="text-secondary font-bold tabular">{selectedBlock.eta} min ETA</span>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-muted">
            <a href="#featured" className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">view_carousel</span>
              <span>Hot Picks</span>
            </a>
            <a href="#services-overview" className="hover:text-primary transition-colors">Services</a>
            <a href="#instant-mart" className="hover:text-primary transition-colors">Mart</a>
            <a href="#technicians" className="hover:text-primary transition-colors">Pros</a>
            <a href="#partners" className="hover:text-primary transition-colors">Join Us</a>
          </nav>

          <div className="flex items-center gap-2.5">
            {basketItemCount > 0 && (
              <a
                href="#instant-mart"
                className="flex items-center gap-1.5 rounded-xl bg-secondary-container px-3 py-1.5 text-xs font-bold text-on-secondary-container shadow-sm animate-pulse"
              >
                <span className="material-symbols-outlined text-sm">shopping_bag</span>
                <span className="tabular">{basketItemCount} (৳{basketTotal})</span>
              </a>
            )}

            {user ? (
              <Link
                to={appHome}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-xl bg-mint/80 border border-primary/30 px-3 py-1.5 text-xs font-bold text-primary-dark hover:bg-mint transition-all flex items-center gap-1 shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm text-primary">flash_on</span>
                  <span>1-Click Demo</span>
                </Link>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex rounded-xl border border-line px-3.5 py-1.5 text-xs font-bold text-ink hover:bg-surface-low transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?mode=signup"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-float hover:bg-primary-dark transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (VISUAL FIRST, LESS TEXT) */}
      <section className="relative pt-8 pb-12 md:pt-14 md:pb-20 overflow-hidden">
        {/* Glowing backdrop elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-gradient-to-b from-mint/60 via-transparent to-transparent -z-10 blur-3xl pointer-events-none"></div>

        <div className="max-w-app mx-auto px-4 md:px-8 grid lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left: Punchy Headline & Visual Block Selector */}
          <div className="lg:col-span-7 text-left">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-bold text-primary shadow-sm mb-4">
                <span className="h-2 w-2 rounded-full bg-primary animate-ping"></span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">domain</span>
                  Bashundhara Residential Community Super-App
                </span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-ink leading-[1.05] tracking-tight">
                Kichuu Lagbe? <br />
                <span className="bg-gradient-to-r from-primary-dark via-primary to-teal bg-clip-text text-transparent">
                  Crave more! Till four.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-4 text-base sm:text-lg text-muted font-normal max-w-xl">
                20-minute groceries, 20L water jars, and verified home technicians. Delivered straight to your apartment door with <b>Gate PIN sync</b>.
              </p>
            </Reveal>

            {/* Interactive Block Selector Pills */}
            <Reveal delay={250}>
              <div className="mt-5 rounded-2xl border border-line bg-white/90 p-3 shadow-card backdrop-blur max-w-lg">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-line text-xs font-bold">
                  <span className="text-ink flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                    Select Your Block:
                  </span>
                  <span className="text-secondary tabular font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">bolt</span>
                    {selectedBlock.eta} mins to {selectedBlock.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {BLOCKS.map((block) => (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => setSelectedBlock(block)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedBlock.id === block.id
                          ? "bg-primary text-white scale-105 shadow-sm"
                          : "bg-surface-low text-ink hover:bg-surface-container"
                      }`}
                    >
                      {block.name}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Action Buttons */}
            <Reveal delay={320}>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to={user ? appHome : "/login?mode=signup"}
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-float hover:bg-primary-dark transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">shopping_cart</span>
                  <span>Order Instant Mart</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
                <a
                  href="#technicians"
                  className="rounded-xl border border-line bg-white px-5 py-3 text-sm font-bold text-ink shadow-sm hover:bg-surface-low transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base text-primary">handyman</span>
                  <span>Book Technician</span>
                </a>
              </div>
            </Reveal>

            {/* Micro Stats Bar */}
            <Reveal delay={400}>
              <div className="mt-7 pt-4 border-t border-line flex items-center gap-6 text-xs text-ink font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary">bolt</span>
                  <span>20–30m Arrival</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary">payments</span>
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary">lock</span>
                  <span>Gate PIN Intercom</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Hero Right: High-Impact Visual Live Dispatch Card */}
          <div className="lg:col-span-5">
            <Reveal delay={200}>
              <div className="relative mx-auto max-w-sm rounded-3xl border border-line bg-white p-4 shadow-modal">
                {/* Live Dispatch Header */}
                <div className="flex items-center justify-between pb-3 border-b border-line">
                  <div className="flex items-center gap-2">
                    <Brand compact size="sm" />
                    <div>
                      <p className="font-display text-xs font-bold text-ink leading-tight">Runner Hasan · On Moped</p>
                      <p className="text-[10px] text-muted flex items-center gap-1">
                        <span className="material-symbols-outlined text-[11px] text-secondary">verified</span>
                        Gate 2 Pass Verified
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse"></span>
                    En Route
                  </span>
                </div>

                {/* Main Hero Product Visual */}
                <div className="relative mt-3 rounded-2xl overflow-hidden h-52 bg-slate-900 shadow-sm group">
                  <img
                    src={CAROUSEL_FEATURED[carouselIndex].image}
                    alt={CAROUSEL_FEATURED[carouselIndex].title}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">{CAROUSEL_FEATURED[carouselIndex].icon}</span>
                      {CAROUSEL_FEATURED[carouselIndex].badge}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
                    <div>
                      <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Ready For Dispatch</p>
                      <p className="font-display text-sm font-bold leading-tight">{CAROUSEL_FEATURED[carouselIndex].title}</p>
                    </div>
                    <span className="font-display text-lg font-extrabold tabular text-white">
                      {CAROUSEL_FEATURED[carouselIndex].price}
                    </span>
                  </div>
                </div>

                {/* Destination & Action */}
                <div className="mt-3 p-2.5 rounded-xl bg-surface-low border border-line flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-bold text-ink flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-primary">pin_drop</span>
                      To {selectedBlock.name}, Apt 4B
                    </p>
                    <p className="text-[10px] text-muted">Gate PIN: 4892 · COD</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const item = SHOWCASE_PRODUCTS[0];
                      addToDemoBasket(item);
                    }}
                    className="rounded-lg bg-primary text-white text-xs font-bold px-3 py-1.5 hover:bg-primary-dark transition-all shadow-sm flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">add</span>
                    <span>৳80</span>
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. VISUAL PRODUCT CAROUSEL ARRAY (HOT PICKS) */}
      <section
        id="featured"
        className="scroll-mt-16 py-12 bg-slate-950 text-white relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="max-w-app mx-auto px-4 md:px-8">
          <Reveal>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">view_carousel</span>
                  Featured Carousel
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  Hot Picks in Bashundhara
                </h2>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCarouselIndex((prev) => (prev === 0 ? CAROUSEL_FEATURED.length - 1 : prev - 1))
                  }
                  className="h-9 w-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors border border-slate-700"
                  aria-label="Previous slide"
                >
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCarouselIndex((prev) => (prev + 1) % CAROUSEL_FEATURED.length)}
                  className="h-9 w-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors border border-slate-700"
                  aria-label="Next slide"
                >
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            </div>
          </Reveal>

          {/* Main Visual Slide Card */}
          <Reveal delay={100}>
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
              <div className="grid md:grid-cols-12 items-center min-h-[300px]">
                {/* Visual Left: Product Details */}
                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">{CAROUSEL_FEATURED[carouselIndex].icon}</span>
                        {CAROUSEL_FEATURED[carouselIndex].badge}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        {CAROUSEL_FEATURED[carouselIndex].eta}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
                      {CAROUSEL_FEATURED[carouselIndex].title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-300">
                      {CAROUSEL_FEATURED[carouselIndex].tagline}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Zone Rate</p>
                      <p className="font-display text-2xl font-black text-emerald-400 tabular">
                        {CAROUSEL_FEATURED[carouselIndex].price}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const item = SHOWCASE_PRODUCTS[carouselIndex % SHOWCASE_PRODUCTS.length];
                          addToDemoBasket(item);
                        }}
                        className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 text-xs transition-all shadow-glow flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                        <span>Add to Cart</span>
                      </button>
                      <Link
                        to={user ? "/app/shops" : "/login?mode=signup&role=resident"}
                        className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors flex items-center gap-1"
                      >
                        <span>Order Live</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Visual Right: Large High-Res Image */}
                <div className="md:col-span-5 h-56 md:h-full relative overflow-hidden bg-slate-950">
                  <img
                    src={CAROUSEL_FEATURED[carouselIndex].image}
                    alt={CAROUSEL_FEATURED[carouselIndex].title}
                    className="h-full w-full object-cover object-center transition-all duration-700 scale-100 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r md:from-slate-900 md:via-transparent md:to-transparent"></div>
                </div>
              </div>

              {/* Progress dots */}
              <div className="absolute bottom-3 left-6 flex items-center gap-1.5">
                {CAROUSEL_FEATURED.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCarouselIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      carouselIndex === idx ? "w-6 bg-emerald-400" : "w-2 bg-slate-700 hover:bg-slate-500"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Thumbnail Strip */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {CAROUSEL_FEATURED.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCarouselIndex(idx)}
                className={`rounded-xl p-2 border transition-all flex items-center gap-2.5 text-left ${
                  carouselIndex === idx
                    ? "border-emerald-500 bg-slate-900 ring-2 ring-emerald-500/30"
                    : "border-slate-800 bg-slate-950/60 hover:bg-slate-900"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-10 w-10 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{item.title}</p>
                  <p className="text-[10px] text-emerald-400 tabular font-bold">{item.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THREE VISUAL VERTICALS (CLEAN BENTO CARDS WITH REAL IMAGERY) */}
      <section id="services-overview" className="py-14 bg-white border-b border-line">
        <div className="max-w-app mx-auto px-4 md:px-8">
          <Reveal>
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="rounded-full bg-mint px-3 py-0.5 text-xs font-bold uppercase text-primary-dark">
                Everything in One App
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-ink">
                Three Essential Services
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Vertical 1: Instant Mart */}
            <Reveal delay={100}>
              <div className="group rounded-3xl border border-line bg-surface p-5 shadow-card hover:shadow-float transition-all flex flex-col justify-between h-full hover:border-primary/40">
                <div>
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100">
                    <img
                      src="/products/water_jar.jpg"
                      alt="Instant Mart"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">bolt</span>
                      20 Min Express
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink">Instant Mart</h3>
                  <p className="mt-1 text-xs text-muted">Water jars, dairy, rice, bread, and midnight munchies.</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="bg-white border border-line rounded-md px-2 py-0.5 text-[10px] font-bold text-ink">No Minimum</span>
                    <span className="bg-white border border-line rounded-md px-2 py-0.5 text-[10px] font-bold text-ink">Cold Chain</span>
                    <span className="bg-white border border-line rounded-md px-2 py-0.5 text-[10px] font-bold text-secondary">Till 4 AM</span>
                  </div>
                </div>

                <Link
                  to={user ? "/app/shops" : "/login?mode=signup&role=resident"}
                  className="mt-5 w-full rounded-xl bg-primary text-white text-xs font-bold py-2.5 text-center block hover:bg-primary-dark transition-colors shadow-sm"
                >
                  Shop Instant Mart
                </Link>
              </div>
            </Reveal>

            {/* Vertical 2: Local Shops */}
            <Reveal delay={200}>
              <div className="group rounded-3xl border border-line bg-surface p-5 shadow-card hover:shadow-float transition-all flex flex-col justify-between h-full hover:border-primary/40">
                <div>
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100">
                    <img
                      src="/products/fresh_produce.jpg"
                      alt="Local Shops"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">storefront</span>
                      Blocks A–M Stores
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink">Neighborhood Stores</h3>
                  <p className="mt-1 text-xs text-muted">Grocers, bakeries, and stationers in your block.</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="bg-white border border-line rounded-md px-2 py-0.5 text-[10px] font-bold text-ink">Direct Rates</span>
                    <span className="bg-white border border-line rounded-md px-2 py-0.5 text-[10px] font-bold text-ink">Real-time Stock</span>
                    <span className="bg-white border border-line rounded-md px-2 py-0.5 text-[10px] font-bold text-secondary">Runner Drop</span>
                  </div>
                </div>

                <Link
                  to={user ? "/app/shops" : "/login?mode=signup&role=resident"}
                  className="mt-5 w-full rounded-xl bg-ink text-white text-xs font-bold py-2.5 text-center block hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Browse Local Shops
                </Link>
              </div>
            </Reveal>

            {/* Vertical 3: Verified Home Services with REAL PRO PHOTOGRAPHY */}
            <Reveal delay={300}>
              <div className="group rounded-3xl border border-line bg-surface p-5 shadow-card hover:shadow-float transition-all flex flex-col justify-between h-full hover:border-primary/40">
                <div>
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100">
                    <img
                      src="/services/ac_technician.jpg"
                      alt="Home Technicians"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-mint text-primary-dark text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-xs">verified_user</span>
                      Security Vetted
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink">Home Technicians</h3>
                  <p className="mt-1 text-xs text-muted">Electricians, AC mechanics, plumbers &amp; cleaners.</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="bg-white border border-line rounded-md px-2 py-0.5 text-[10px] font-bold text-ink">NID Verified</span>
                    <span className="bg-white border border-line rounded-md px-2 py-0.5 text-[10px] font-bold text-ink">Fixed Taka Rate</span>
                    <span className="bg-white border border-line rounded-md px-2 py-0.5 text-[10px] font-bold text-secondary">Gate PIN Sync</span>
                  </div>
                </div>

                <Link
                  to={user ? "/app/services" : "/login?mode=signup&role=resident"}
                  className="mt-5 w-full rounded-xl border border-primary text-primary hover:bg-mint text-xs font-bold py-2.5 text-center block transition-colors shadow-sm"
                >
                  Book a Technician
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6. VISUAL PRODUCT GRID (CLEAN PROPER ICONS, ZERO EMOJIS) */}
      <section id="instant-mart" className="py-14 bg-surface-low border-b border-line">
        <div className="max-w-app mx-auto px-4 md:px-8">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Live Catalog
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
                  Instant Mart in {selectedBlock.name}
                </h2>
              </div>

              {/* Minimalist Filter Pills with PROPER ICONS */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "All", icon: "apps" },
                  { id: "water", label: "Water", icon: "water_drop", iconColor: "text-sky-500" },
                  { id: "dairy", label: "Dairy & Eggs", icon: "egg", iconColor: "text-amber-500" },
                  { id: "fresh", label: "Fresh & Bakery", icon: "bakery_dining", iconColor: "text-orange-500" },
                  { id: "snacks", label: "Till 4 AM", icon: "bedtime", iconColor: "text-purple-500" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-sm"
                        : "bg-white text-ink border border-line hover:bg-surface"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-sm ${
                        activeTab === tab.id ? "text-white" : tab.iconColor || "text-muted"
                      }`}
                    >
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p, idx) => {
              const qty = basket[p.id] || 0;
              return (
                <Reveal key={p.id} delay={idx * 50}>
                  <div className="group rounded-2xl border border-line bg-white overflow-hidden shadow-card hover:shadow-float transition-all flex flex-col justify-between hover:border-primary/40">
                    {/* Big Image View */}
                    <div className="relative h-40 sm:h-44 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 rounded-md bg-white/90 backdrop-blur px-2 py-0.5 text-[9px] font-bold text-primary-dark shadow-sm">
                        {p.badge}
                      </span>
                      <span className="absolute bottom-2 right-2 rounded-md bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 backdrop-blur flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">schedule</span>
                        {p.eta}
                      </span>
                    </div>

                    {/* Card Foot */}
                    <div className="p-3.5 flex flex-col justify-between flex-1">
                      <h4 className="font-display text-xs sm:text-sm font-bold text-ink leading-snug group-hover:text-primary transition-colors line-clamp-1">
                        {p.name}
                      </h4>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-display text-base font-black text-primary tabular">
                          ৳{p.price}
                        </span>

                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => addToDemoBasket(p)}
                            className="rounded-lg bg-surface-low border border-line px-2.5 py-1 text-xs font-bold text-ink hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">add</span>
                            <span>Add</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 rounded-lg bg-primary text-white px-2 py-0.5">
                            <button
                              type="button"
                              onClick={() => removeFromDemoBasket(p)}
                              className="text-xs font-bold px-1 hover:opacity-80"
                            >
                              −
                            </button>
                            <span className="text-xs font-bold tabular">{qty}</span>
                            <button
                              type="button"
                              onClick={() => addToDemoBasket(p)}
                              className="text-xs font-bold px-1 hover:opacity-80"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Sticky Demo Cart Bar */}
          {basketItemCount > 0 && (
            <Reveal>
              <div className="mt-6 rounded-2xl border border-primary/30 bg-mint/70 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-float animate-float">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-2xl text-primary">shopping_bag</span>
                  <div>
                    <span className="text-xs font-bold text-ink">
                      Simulated Basket: {basketItemCount} items · Total <b className="text-primary tabular text-sm">৳{basketTotal}</b> COD
                    </span>
                    <p className="text-[10px] text-muted">Arrival to {selectedBlock.name} in ~{selectedBlock.eta} mins</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBasket({})}
                    className="text-xs text-muted hover:text-danger font-semibold px-2 py-1"
                  >
                    Clear
                  </button>
                  <Link
                    to={user ? "/app/shops" : "/login?mode=signup&role=resident"}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-all flex items-center gap-1"
                  >
                    <span>Order Now</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* 7. VERIFIED PROS (WITH REAL SERVICE PROVIDER PHOTOGRAPHY & PROPER ICONS) */}
      <section id="technicians" className="py-14 bg-white border-b border-line">
        <div className="max-w-app mx-auto px-4 md:px-8">
          <Reveal>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">handyman</span>
                  Home Repairs
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
                  Verified Local Technicians
                </h2>
              </div>
              <Link
                to={user ? "/app/services" : "/login?mode=signup&role=resident"}
                className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1"
              >
                <span>View All 8 Categories</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SHOWCASE_SERVICES.map((s, idx) => (
              <Reveal key={s.title} delay={idx * 75}>
                <div className="group rounded-3xl border border-line bg-surface overflow-hidden shadow-card hover:shadow-float transition-all flex flex-col justify-between h-full hover:border-primary/40">
                  {/* Real Pro Photography Header */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>

                    {/* Pro Icon & Verified badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <div className="h-8 w-8 rounded-lg bg-black/60 backdrop-blur text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-base text-secondary-fixed">{s.icon}</span>
                      </div>
                      <span className="rounded-full bg-mint text-primary-dark text-[10px] font-bold px-2 py-0.5 flex items-center gap-0.5 shadow-sm">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        Verified
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
                      <div>
                        <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">{s.tag}</p>
                        <p className="font-display text-xs font-bold truncate">{s.provider}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-xs font-bold text-amber-300">
                        <span className="material-symbols-outlined text-xs text-amber-400">star</span>
                        <span className="tabular">{s.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content & Action */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-display text-base font-bold text-ink leading-snug group-hover:text-primary transition-colors">
                        {s.title}
                      </h4>
                      <p className="text-xs text-muted mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-secondary">schedule</span>
                        <span>Avg arrival: {s.arrival}</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted uppercase font-semibold">Call-out</span>
                        <p className="font-bold text-sm text-ink tabular">{s.rate}</p>
                      </div>
                      <Link
                        to={user ? "/app/services" : "/login?mode=signup&role=resident"}
                        className="rounded-xl bg-primary text-white hover:bg-primary-dark px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                      >
                        <span>Book</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. HYPERLOCAL VALUE (4 CLEAN VISUAL ICONS) */}
      <section className="py-14 bg-surface-lowest">
        <div className="max-w-app mx-auto px-4 md:px-8">
          <Reveal>
            <div className="text-center max-w-lg mx-auto mb-8">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Hyperlocal Advantage
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-ink">
                Built Strictly for Bashundhara R/A
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: "traffic",
                title: "0% Highway Gridlock",
                desc: "Runners operate 100% inside perimeter gates (Blocks A–M).",
              },
              {
                icon: "lock",
                title: "Gate PIN Intercom Sync",
                desc: "Digital passes eliminate security guard interrogation calls.",
              },
              {
                icon: "bedtime",
                title: "Crave More! Till Four",
                desc: "Midnight munchies, water jars & dairy delivered till 4:00 AM.",
              },
              {
                icon: "payments",
                title: "100% Cash on Delivery",
                desc: "Inspect products or service work before paying in BDT.",
              },
            ].map((card, idx) => (
              <Reveal key={card.title} delay={idx * 60}>
                <div className="rounded-2xl border border-line bg-white p-5 shadow-card hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 rounded-xl bg-mint text-primary flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-xl">{card.icon}</span>
                  </div>
                  <h4 className="font-display text-sm font-bold text-ink">{card.title}</h4>
                  <p className="mt-1 text-xs text-muted leading-relaxed">{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9. HOW AN ORDER MOVES (MINIMAL 4 STEPS) */}
      <section className="py-12 bg-surface-low border-y border-line">
        <div className="max-w-app mx-auto px-4 md:px-8">
          <Reveal>
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Order Lifecycle
              </span>
              <h3 className="font-display text-xl font-bold text-ink">How It Works</h3>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { n: "01", title: "Select Address", detail: "Block, Road & Gate PIN" },
              { n: "02", title: "Pick Items / Pro", detail: "Single-shop fresh basket" },
              { n: "03", title: "Internal Runner", detail: "20-30 min express transit" },
              { n: "04", title: "Doorstep COD", detail: "Pay cash after inspection" },
            ].map((step, idx) => (
              <Reveal key={step.n} delay={idx * 70}>
                <div className="rounded-xl border border-line bg-white p-4 shadow-sm text-center">
                  <span className="font-display text-sm font-black text-primary tabular">{step.n}</span>
                  <h4 className="mt-1 font-display text-xs sm:text-sm font-bold text-ink">{step.title}</h4>
                  <p className="text-[10px] text-muted mt-0.5">{step.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10. COMMUNITY ROLES (3 COMPACT PARTNER CARDS) */}
      <section id="partners" className="py-14 bg-white">
        <div className="max-w-app mx-auto px-4 md:px-8">
          <Reveal>
            <div className="text-center max-w-lg mx-auto mb-8">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Work With Us
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-ink">
                Earn &amp; Grow in Bashundhara
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Local Shops",
                tag: "Zero Setup Cost",
                desc: "List catalog, manage stock, receive orders from local families.",
                role: "shop_owner",
                cta: "Open Shop",
                icon: "store",
              },
              {
                title: "Delivery Runners",
                tag: "Safe Internal Routes",
                desc: "Short rides within Blocks A–M with day & midnight shifts.",
                role: "rider",
                cta: "Apply as Rider",
                icon: "two_wheeler",
              },
              {
                title: "Service Pros",
                tag: "50,000+ Homes",
                desc: "Electricians & mechanics get direct bookings with zero middleman.",
                role: "service_provider",
                cta: "Join as Pro",
                icon: "handyman",
              },
            ].map((p, idx) => (
              <Reveal key={p.title} delay={idx * 80}>
                <div className="rounded-2xl border border-line bg-surface p-5 shadow-card hover:shadow-float transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-md bg-secondary-container px-2 py-0.5 text-[10px] font-bold text-on-secondary-container">
                        {p.tag}
                      </span>
                      <span className="material-symbols-outlined text-primary text-lg">{p.icon}</span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-ink">{p.title}</h4>
                    <p className="mt-1 text-xs text-muted leading-relaxed">{p.desc}</p>
                  </div>

                  <Link
                    to={`/login?mode=signup&role=${p.role}`}
                    className="mt-5 w-full rounded-xl bg-ink text-white text-xs font-bold py-2.5 text-center block hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    {p.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 11. CLEAN PRE-FOOTER CALL TO ACTION */}
      <section className="py-12 bg-primary-deep text-on-primary text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-4">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready for 20-Minute Convenience?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-primary-fixed">
              Order fresh groceries or book a vetted home technician in Bashundhara today.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Link
                to={user ? appHome : "/login?mode=signup"}
                className="rounded-xl bg-white text-primary px-6 py-2.5 text-xs font-bold shadow-float hover:bg-surface-low transition-all flex items-center gap-1.5"
              >
                <span>{user ? "Go to Dashboard" : "Create Resident Account"}</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
              <Link
                to="/login?mode=signup&role=shop_owner"
                className="rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all"
              >
                Onboard Shop
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 12. MINIMALIST FOOTER */}
      <footer className="bg-ink text-slate-400 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-app mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Brand dark size="sm" subtitle="Bashundhara R/A" />
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>Blocks A through M</span>
            <span>•</span>
            <span>৳ BDT</span>
            <span>•</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
