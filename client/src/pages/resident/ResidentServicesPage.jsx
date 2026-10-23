import { useState } from "react";
import { Link } from "react-router-dom";

const SERVICE_PROVIDERS = [
  {
    id: "sp1",
    name: "Md. Kabir Hossain",
    trade: "Emergency Electrician",
    category: "electrician",
    rating: 4.9,
    reviews: 142,
    callout: 350,
    arrival: "25-35 mins",
    image: "/services/electrician.jpg",
    bio: "Certified technician. Expert in short circuits, DB box breaker trips, and UPS inverter setups.",
  },
  {
    id: "sp2",
    name: "Bashundhara AC Care",
    trade: "AC Servicing & Gas Top-Up",
    category: "ac",
    rating: 4.8,
    reviews: 218,
    callout: 800,
    arrival: "Today · 2:00 PM",
    image: "/services/ac_technician.jpg",
    bio: "Master jet wash cleaning, R410A / R32 cooling gas refill, compressor capacitor fixes.",
  },
  {
    id: "sp3",
    name: "Sajib Sanitary Works",
    trade: "Plumbing & Sanitary Pro",
    category: "plumbing",
    rating: 4.9,
    reviews: 96,
    callout: 400,
    arrival: "30-40 mins",
    image: "/services/plumber.jpg",
    bio: "Commode flush leakages, concealed pipe repairs, tap installations & rooftop water motors.",
  },
  {
    id: "sp4",
    name: "Clean Home Services",
    trade: "Deep Apartment Cleaning",
    category: "cleaning",
    rating: 4.7,
    reviews: 84,
    callout: 1200,
    arrival: "Scheduled",
    image: "/services/cleaner.jpg",
    bio: "Heavy kitchen degreasing, bathroom descaling, balcony scrubbing & full home sanitization.",
  },
];

export function ResidentServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bookingPro, setBookingPro] = useState(null);
  const [desc, setDesc] = useState("");
  const [windowTime, setWindowTime] = useState("today");
  const [notice, setNotice] = useState("");

  const filtered =
    selectedCategory === "all"
      ? SERVICE_PROVIDERS
      : SERVICE_PROVIDERS.filter((p) => p.category === selectedCategory);

  function confirmBooking(e) {
    e.preventDefault();
    setNotice(
      `Booking request confirmed for ${bookingPro.name} (${bookingPro.trade})! Gate PIN synced for arrival.`
    );
    setBookingPro(null);
    setDesc("");
    setTimeout(() => setNotice(""), 4500);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-black text-ink">
              Verified Home Services
            </h1>
            <span className="rounded-full bg-mint text-primary-dark px-2.5 py-0.5 text-[10px] font-bold">
              SECURITY VETTED
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Pre-cleared residential pros with building gate pass integration · Pay Cash After Work
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-1.5 text-xs font-bold">
          {[
            { id: "all", label: "All Pros", icon: "handyman" },
            { id: "electrician", label: "Electrician", icon: "bolt" },
            { id: "ac", label: "AC Care", icon: "mode_fan" },
            { id: "plumbing", label: "Plumbing", icon: "plumbing" },
            { id: "cleaning", label: "Cleaning", icon: "cleaning_services" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-low text-ink hover:bg-surface-container border border-line"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div className="p-3 rounded-xl bg-mint border border-primary/30 text-primary-dark text-xs font-bold flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-base">verified</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Providers Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((pro) => (
          <div
            key={pro.id}
            className="rounded-3xl border border-line bg-white overflow-hidden shadow-card hover:shadow-float transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={pro.image}
                  alt={pro.name}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute top-2.5 left-2.5">
                  <span className="rounded-full bg-mint text-primary-dark px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    NID Checked
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
                  <div>
                    <p className="text-[10px] text-emerald-300 font-bold uppercase">{pro.trade}</p>
                    <h3 className="font-display text-sm font-bold truncate">{pro.name}</h3>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs font-bold text-amber-300">
                    <span className="material-symbols-outlined text-xs text-amber-400">star</span>
                    <span className="tabular">{pro.rating}</span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-muted leading-relaxed line-clamp-2">
                  {pro.bio}
                </p>

                <div className="mt-4 pt-3 border-t border-line space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Standard Call-out:</span>
                    <span className="font-display text-base font-black text-primary tabular">
                      ৳{pro.callout}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted">Response Window:</span>
                    <span className="font-semibold text-secondary">{pro.arrival}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                type="button"
                onClick={() => setBookingPro(pro)}
                className="w-full rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 transition-all shadow-sm flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                <span>Request Visit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingPro && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={confirmBooking}
            className="w-full max-w-lg rounded-3xl border border-line bg-white p-6 shadow-modal space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div>
                <h3 className="font-display text-base font-bold text-ink">
                  Book {bookingPro.trade}
                </h3>
                <p className="text-xs text-muted">Pro: {bookingPro.name} · Fixed rate ৳{bookingPro.callout}</p>
              </div>
              <button
                type="button"
                onClick={() => setBookingPro(null)}
                className="text-muted hover:text-ink text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1">Describe the problem</label>
              <textarea
                rows={3}
                required
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="e.g. Master AC not cooling properly, blowing room-temperature air..."
                className="w-full rounded-xl border border-line p-3 text-xs text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1">Preferred Time Window</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "emergency", label: "Emergency (ASAP)" },
                  { id: "today", label: "Today Afternoon" },
                  { id: "tomorrow", label: "Tomorrow Morning" },
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWindowTime(w.id)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                      windowTime === w.id
                        ? "border-primary bg-mint text-primary-dark"
                        : "border-line bg-surface-low text-ink"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-surface-low border border-line flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-ink">Address: Block D, Road 11, Apt 4B</p>
                <p className="text-[10px] text-muted">Gate PIN: 4892 · Intercom pre-cleared</p>
              </div>
              <span className="font-display text-sm font-black text-primary tabular">
                ৳{bookingPro.callout} COD
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setBookingPro(null)}
                className="rounded-xl border border-line px-4 py-2 text-xs font-semibold text-muted hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary text-white px-5 py-2 text-xs font-bold hover:bg-primary-dark transition-all shadow-sm"
              >
                Confirm Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
