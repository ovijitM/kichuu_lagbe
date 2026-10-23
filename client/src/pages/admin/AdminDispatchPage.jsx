import { useState } from "react";
import { Link } from "react-router-dom";

const ORDERS_FEED = [
  {
    id: "KL-8492",
    resident: "Tanvir Ahmed",
    address: "Block D, Road 11, Apt 4B",
    shop: "Bashundhara Fresh Hub",
    items: "Kinley 20L Water (2), Aarong Milk 1L (1)",
    amount: "৳270",
    status: "in_transit",
    runner: "Runner Hasan",
    eta: "8 mins",
    gate: "Gate 1",
  },
  {
    id: "KL-8495",
    resident: "Nusrat Jahan",
    address: "Block G, Road 4, Apt 2A",
    shop: "Block C Daily Grocery",
    items: "Farm Brown Eggs (1), Miniket Rice 5kg (1)",
    amount: "৳660",
    status: "packing",
    runner: "Standby Rider",
    eta: "14 mins",
    gate: "Gate 2",
  },
  {
    id: "KL-8501",
    resident: "Kazi Shafiq",
    address: "Block I, Road 2, Apt 6C",
    shop: "Bashundhara Fresh Hub",
    items: "Midnight Nachos Combo, Cold Soda",
    amount: "৳320",
    status: "unassigned",
    runner: "Unassigned",
    eta: "Pending",
    gate: "Gate 3",
  },
  {
    id: "KL-8504",
    resident: "Farhana Huq",
    address: "Block C, Road 8, Apt 1D",
    shop: "Oven Fresh Bakery",
    items: "Milk Bread, Butter 200g, Eggs (6)",
    amount: "৳215",
    status: "delivered",
    runner: "Runner Imran",
    eta: "Delivered",
    gate: "Gate 1",
  },
];

export function AdminDispatchPage() {
  const [orders, setOrders] = useState(ORDERS_FEED);
  const [filterBlock, setFilterBlock] = useState("all");
  const [assigningId, setAssigningId] = useState(null);
  const [selectedRider, setSelectedRider] = useState("Runner Hasan");

  function assignRider(orderId) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, runner: selectedRider, status: "in_transit", eta: "16 mins" }
          : o
      )
    );
    setAssigningId(null);
  }

  const filteredOrders =
    filterBlock === "all"
      ? orders
      : orders.filter((o) => o.address.includes(`Block ${filterBlock}`));

  return (
    <div className="space-y-6">
      {/* 1. TOP DISPATCH OPERATIONS HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-black text-ink">
              Admin Dispatch &amp; Operations Console
            </h1>
            <span className="rounded-full bg-secondary-container text-on-secondary-container px-2.5 py-0.5 text-[10px] font-bold">
              LIVE SYSTEM
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Zone: Bashundhara Residential Area (Blocks A–M) · 48 Active Couriers · Central Hub Terminal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/shops"
            className="rounded-xl border border-line bg-white hover:bg-surface-low px-3.5 py-2 text-xs font-bold text-ink transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm text-primary">store</span>
            <span>Shop Approvals</span>
          </Link>
        </div>
      </div>

      {/* 2. FIVE KPI METRIC CARDS (Direct from Stitch Admin Console Spec) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Active Orders */}
        <div className="p-4 bg-white rounded-2xl border border-line shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted mb-1">
            <span className="font-semibold">Active Orders</span>
            <span className="material-symbols-outlined text-base text-primary">bolt</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-black text-ink tabular">32</span>
              <span className="text-[10px] font-bold text-secondary">in transit</span>
            </div>
            <p className="text-[10px] text-muted mt-0.5">Avg transit: 21 mins</p>
          </div>
          <div className="w-full bg-surface-low h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "75%" }}></div>
          </div>
        </div>

        {/* Card 2: On-Duty Riders */}
        <div className="p-4 bg-white rounded-2xl border border-line shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted mb-1">
            <span className="font-semibold">On-Duty Riders</span>
            <span className="material-symbols-outlined text-base text-secondary">two_wheeler</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-black text-ink tabular">28</span>
              <span className="text-[10px] font-bold text-secondary">online</span>
            </div>
            <p className="text-[10px] text-muted mt-0.5">19 busy · 9 standby</p>
          </div>
          <div className="w-full bg-surface-low h-1.5 rounded-full mt-2.5 overflow-hidden flex">
            <div className="bg-secondary h-full" style={{ width: "68%" }}></div>
            <div className="bg-secondary-container h-full" style={{ width: "32%" }}></div>
          </div>
        </div>

        {/* Card 3: Technicians Active */}
        <div className="p-4 bg-white rounded-2xl border border-line shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted mb-1">
            <span className="font-semibold">Technicians Pro</span>
            <span className="material-symbols-outlined text-base text-amber-deep">handyman</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-black text-ink tabular">14</span>
              <span className="text-[10px] font-bold text-amber-deep">domestic</span>
            </div>
            <p className="text-[10px] text-muted mt-0.5">100% NID Verified</p>
          </div>
          <div className="w-full bg-surface-low h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-amber h-full rounded-full" style={{ width: "82%" }}></div>
          </div>
        </div>

        {/* Card 4: Platform GMV */}
        <div className="p-4 bg-white rounded-2xl border border-line shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted mb-1">
            <span className="font-semibold">Today's GMV</span>
            <span className="material-symbols-outlined text-base text-primary">payments</span>
          </div>
          <div>
            <span className="font-display text-xl font-black text-ink tabular">৳384.5k</span>
            <p className="text-[10px] text-primary font-bold mt-0.5">Comm: ৳34,605</p>
          </div>
          <div className="w-full bg-surface-low h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-primary-container h-full rounded-full" style={{ width: "70%" }}></div>
          </div>
        </div>

        {/* Card 5: Escalations */}
        <div className="p-4 bg-white rounded-2xl border border-line shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted mb-1">
            <span className="font-semibold">Gate Incidents</span>
            <span className="material-symbols-outlined text-base text-secondary">verified_user</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-black text-ink tabular">0</span>
              <span className="text-[10px] font-bold text-secondary">all clear</span>
            </div>
            <p className="text-[10px] text-muted mt-0.5">Gate Passes 100% Synced</p>
          </div>
          <div className="w-full bg-surface-low h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>
      </div>

      {/* 3. GATE MONITOR & BLOCK FILTER STRIP */}
      <div className="p-4 rounded-2xl bg-white border border-line flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-ink flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary">traffic</span>
            <span>Security Gates:</span>
          </span>
          <span className="rounded-full bg-secondary-container px-2.5 py-0.5 font-semibold text-on-secondary-container">
            Gate 1: Clear (2 mins)
          </span>
          <span className="rounded-full bg-secondary-container px-2.5 py-0.5 font-semibold text-on-secondary-container">
            Gate 2: Clear (3 mins)
          </span>
          <span className="rounded-full bg-secondary-container px-2.5 py-0.5 font-semibold text-on-secondary-container">
            Gate 3: Clear (2 mins)
          </span>
        </div>

        {/* Block Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-muted font-semibold">Filter:</span>
          {["all", "D", "G", "C", "I"].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setFilterBlock(b)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterBlock === b
                  ? "bg-primary text-white"
                  : "bg-surface-low text-ink hover:bg-surface-container"
              }`}
            >
              {b === "all" ? "All Blocks" : `Block ${b}`}
            </button>
          ))}
        </div>
      </div>

      {/* 4. LIVE ORDER DISPATCH & RIDER ASSIGNMENT TABLE */}
      <div className="rounded-3xl border border-line bg-white overflow-hidden shadow-card">
        <div className="p-4 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
            <h3 className="font-display text-base font-bold text-ink">
              Live Order Dispatch Feed ({filteredOrders.length})
            </h3>
          </div>
          <span className="text-xs text-muted">Auto-updating · 15s interval</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-low border-b border-line text-muted uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Resident &amp; Destination</th>
                <th className="py-3 px-4">Merchant Shop</th>
                <th className="py-3 px-4">Contents</th>
                <th className="py-3 px-4">COD Total</th>
                <th className="py-3 px-4">Assigned Runner</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-low/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-ink font-display">
                    #{order.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-ink">{order.resident}</p>
                    <p className="text-[11px] text-muted">{order.address}</p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-ink">
                    {order.shop}
                  </td>
                  <td className="py-3.5 px-4 text-muted max-w-xs truncate">
                    {order.items}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-primary tabular text-sm">
                    {order.amount}
                  </td>
                  <td className="py-3.5 px-4">
                    {order.status === "unassigned" ? (
                      <span className="rounded-full bg-amber-soft text-amber-deep px-2 py-0.5 text-[10px] font-bold">
                        Unassigned
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs text-secondary">two_wheeler</span>
                        <span className="font-semibold text-ink">{order.runner}</span>
                        <span className="text-[10px] text-muted">({order.eta})</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {order.status === "unassigned" ? (
                      <button
                        type="button"
                        onClick={() => setAssigningId(order.id)}
                        className="rounded-xl bg-primary text-white px-3 py-1 text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm"
                      >
                        Assign Runner
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-secondary">
                        In Progress
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Runner Modal Dialog */}
      {assigningId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-modal">
            <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
              <h4 className="font-display text-base font-bold text-ink">
                Assign Runner to Order #{assigningId}
              </h4>
              <button
                type="button"
                onClick={() => setAssigningId(null)}
                className="text-muted hover:text-ink text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted mb-4">
              Select an available runner on standby near Central Hub (Block G):
            </p>

            <div className="space-y-2 mb-5">
              {[
                { name: "Runner Hasan", block: "Block G (Hub)", eta: "3 mins to shop", busy: false },
                { name: "Runner Tanvir", block: "Block D Gate", eta: "5 mins to shop", busy: false },
                { name: "Runner Shakil", block: "Block C Market", eta: "6 mins to shop", busy: false },
              ].map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => setSelectedRider(r.name)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    selectedRider === r.name
                      ? "border-primary bg-mint text-primary-dark font-bold"
                      : "border-line bg-surface-low text-ink hover:bg-surface-container"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">two_wheeler</span>
                    <div>
                      <p className="text-xs font-bold leading-tight">{r.name}</p>
                      <p className="text-[10px] text-muted">{r.block} · {r.eta}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold text-on-secondary-container">
                    Standby
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setAssigningId(null)}
                className="rounded-xl border border-line px-4 py-2 text-xs font-semibold text-muted hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => assignRider(assigningId)}
                className="rounded-xl bg-primary text-white px-5 py-2 text-xs font-bold hover:bg-primary-dark transition-all shadow-sm"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
