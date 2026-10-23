import { useState } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import { LiveTrackingMap } from "../../components/LiveTrackingMap.jsx";

export function RiderDashboardPage() {
  const { user } = useAuth();
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [activeStep, setActiveStep] = useState(1); // 1 = Assigned / Pickup, 2 = En route, 3 = Delivered
  const [notice, setNotice] = useState("");

  function handleAction() {
    if (activeStep === 1) {
      setActiveStep(2);
      setNotice("Order picked up from Central Hub! Navigate to Block D, Road 11.");
    } else if (activeStep === 2) {
      setActiveStep(3);
      setNotice("Delivered successfully! ৳330 COD cash collected.");
    } else {
      setActiveStep(1);
      setNotice("Simulating new incoming internal delivery run.");
    }
    setTimeout(() => setNotice(""), 3500);
  }

  return (
    <div className="space-y-6">
      {/* 1. TOP RIDER STATUS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-black text-ink">
              Rider Dispatch Console
            </h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1 ${
                isOnDuty
                  ? "bg-secondary-container text-on-secondary-container"
                  : "bg-surface-low text-muted"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isOnDuty ? "bg-secondary animate-pulse" : "bg-muted"
                }`}
              ></span>
              {isOnDuty ? "ON DUTY (BLOCKS A–M)" : "OFF DUTY"}
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Runner: {user?.name || "Hasan"} · Vehicle: Electric Moped · Shift: Midnight Active Till 4 AM
          </p>
        </div>

        {/* Duty Toggle */}
        <button
          type="button"
          onClick={() => setIsOnDuty(!isOnDuty)}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
            isOnDuty
              ? "bg-red-50 text-danger border border-red-200 hover:bg-red-100"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
        >
          <span className="material-symbols-outlined text-sm">
            {isOnDuty ? "pause_circle" : "play_circle"}
          </span>
          <span>{isOnDuty ? "Go on Break" : "Start Shift"}</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 rounded-xl bg-mint border border-primary/30 text-primary-dark text-xs font-bold flex items-center gap-1.5 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{notice}</span>
        </div>
      )}

      {/* 2. RIDER STATS METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-line shadow-sm">
          <span className="text-xs text-muted font-semibold">Completed Runs</span>
          <p className="font-display text-2xl font-black text-ink mt-1 tabular">14</p>
          <p className="text-[10px] text-secondary font-bold mt-0.5">100% within 24m SLA</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-line shadow-sm">
          <span className="text-xs text-muted font-semibold">COD Cash Collected</span>
          <p className="font-display text-2xl font-black text-primary mt-1 tabular">৳2,840</p>
          <p className="text-[10px] text-muted mt-0.5">To deposit at Central Hub</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-line shadow-sm">
          <span className="text-xs text-muted font-semibold">Today's Earnings</span>
          <p className="font-display text-2xl font-black text-ink mt-1 tabular">৳980</p>
          <p className="text-[10px] text-secondary font-bold mt-0.5">+৳120 resident tips</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-line shadow-sm">
          <span className="text-xs text-muted font-semibold">Gate Access Pass</span>
          <div className="flex items-center gap-1 mt-1 text-sm font-bold text-ink">
            <span className="material-symbols-outlined text-base text-primary">verified_user</span>
            <span>All Gates Verified</span>
          </div>
          <p className="text-[10px] text-muted mt-0.5">Pass ID: #RUN-4029</p>
        </div>
      </div>

      {/* 3. ACTIVE DELIVERY RUN CARD */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
          <div className="flex items-center gap-2.5">
            <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">electric_moped</span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-bold text-ink">Active Job: Order #KL-8492</span>
                <span className="rounded-full bg-secondary-container text-on-secondary-container px-2 py-0.5 text-[10px] font-bold">
                  {activeStep === 1 ? "PICKUP REQUIRED" : activeStep === 2 ? "IN TRANSIT" : "DELIVERED"}
                </span>
              </div>
              <p className="text-xs text-muted">Bashundhara R/A Internal Route · Approx 1.1 km</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-muted uppercase font-bold">COD Cash to Collect</span>
            <p className="font-display text-xl font-black text-primary tabular">৳330</p>
          </div>
        </div>

        {/* Live GPS Navigation & Sector Route Map */}
        <div className="my-4">
          <LiveTrackingMap role="rider" orderId="KL-8492" height="320px" />
        </div>

        {/* Pickup & Drop Details */}
        <div className="grid md:grid-cols-2 gap-4 my-4">
          <div className="p-4 rounded-2xl bg-surface-low border border-line">
            <span className="text-[10px] font-bold text-muted uppercase block mb-1">Step 1: Pick Up Store</span>
            <h4 className="font-bold text-sm text-ink">Bashundhara Fresh Hub</h4>
            <p className="text-xs text-muted mt-0.5">Central Warehouse · Block G, Road 2</p>
            <div className="mt-2.5 text-xs text-ink bg-white p-2 rounded-xl border border-line">
              <b>Items:</b> 2 × Kinley 20L Water Jar, 1 × Aarong Milk 1L
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-low border border-line">
            <span className="text-[10px] font-bold text-muted uppercase block mb-1">Step 2: Drop Apartment</span>
            <h4 className="font-bold text-sm text-ink">Tanvir Ahmed</h4>
            <p className="text-xs text-muted mt-0.5">Block D, Road 11, Apartment 4B</p>
            <div className="mt-2.5 flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-line">
              <span className="text-muted">Building Gate PIN:</span>
              <span className="font-display text-sm font-black text-primary tracking-wider tabular">4892</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-line flex items-center justify-between">
          <span className="text-xs text-muted flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary">security</span>
            <span>Security Intercom clearance active</span>
          </span>

          <button
            type="button"
            onClick={handleAction}
            className="rounded-xl bg-primary hover:bg-primary-dark text-white px-5 py-2.5 text-xs font-bold transition-all shadow-float flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">
              {activeStep === 1 ? "storefront" : activeStep === 2 ? "done_all" : "replay"}
            </span>
            <span>
              {activeStep === 1
                ? "Mark Picked Up & Start Transit"
                : activeStep === 2
                ? "Confirm Delivered & Collected ৳330 COD"
                : "Reset / Load Next Order"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
