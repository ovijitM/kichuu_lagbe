import { useEffect, useRef, useState } from "react";
import { api } from "../api/client.js";
import { useAuth } from "../auth/AuthContext.jsx";

function formatTimeAgo(dateString) {
  if (!dateString) return "Just now";
  const now = new Date();
  const past = new Date(dateString);
  const diffMinutes = Math.floor((now - past) / (1000 * 60));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

function getNotificationIcon(title, body) {
  const text = `${title} ${body}`.toLowerCase();
  if (text.includes("runner") || text.includes("rider") || text.includes("pickup") || text.includes("dispatch")) {
    return { name: "electric_moped", bg: "bg-emerald-50 text-primary border-emerald-200" };
  }
  if (text.includes("gate") || text.includes("security") || text.includes("clearance") || text.includes("pin")) {
    return { name: "verified_user", bg: "bg-teal-50 text-teal-700 border-teal-200" };
  }
  if (text.includes("order") || text.includes("storefront") || text.includes("shop")) {
    return { name: "shopping_bag", bg: "bg-blue-50 text-blue-700 border-blue-200" };
  }
  if (text.includes("service") || text.includes("call-out") || text.includes("emergency") || text.includes("technician")) {
    return { name: "handyman", bg: "bg-amber-soft text-amber-deep border-amber-200" };
  }
  if (text.includes("review") || text.includes("star") || text.includes("milestone") || text.includes("bonus")) {
    return { name: "award_star", bg: "bg-purple-50 text-purple-700 border-purple-200" };
  }
  return { name: "notifications", bg: "bg-surface-low text-ink border-line" };
}

export function NotificationBell({ align = "right" }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // "all" | "unread"
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef(null);

  // Load notifications from API (with fallback if offline/mock)
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api("/api/notifications")
      .then((res) => {
        if (Array.isArray(res?.notifications)) {
          setNotifications(res.notifications);
        }
      })
      .catch(() => {
        // Fallback demo notifications per role if API fails
        setNotifications([
          {
            id: "fallback-1",
            title: "Internal Runner Fleet Active",
            body: "20-30 min door delivery operating inside Bashundhara perimeters.",
            read: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: "fallback-2",
            title: "Security Gate Clearance",
            body: "Pre-cleared intercom PIN connected to your address.",
            read: true,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  async function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await api(`/api/notifications/${id}/read`, { method: "PATCH" });
    } catch {
      // Optimistic update retained
    }
  }

  async function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api("/api/notifications/read-all", { method: "POST" });
    } catch {
      // Optimistic update retained
    }
  }

  async function deleteNotification(e, id) {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await api(`/api/notifications/${id}`, { method: "DELETE" });
    } catch {
      // Optimistic update retained
    }
  }

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative rounded-xl border p-2 text-ink transition-all shadow-xs flex items-center justify-center hover:bg-surface-low ${
          isOpen ? "bg-surface-low border-primary/50 text-primary ring-2 ring-primary/20" : "bg-white border-line"
        }`}
        aria-label="Open notifications"
        title="Notifications"
      >
        <span className="material-symbols-outlined text-lg leading-none">notifications</span>

        {/* Unread Badge & Ping Beacon */}
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-primary text-white text-[9px] font-black shadow-xs ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] rounded-full bg-primary opacity-60 animate-ping pointer-events-none"></span>
          </>
        )}
      </button>

      {/* Floating Notifications Popover */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "left" ? "left-0" : "right-0"
          } mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-line shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Header */}
          <div className="p-4 border-b border-line bg-surface-low/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-lg bg-mint text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">notifications</span>
              </span>
              <h3 className="font-display text-sm font-bold text-ink">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-secondary-container text-on-secondary-container px-2 py-0.2 text-[10px] font-extrabold">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-primary hover:underline hover:text-primary-dark"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="px-4 py-2 border-b border-line flex items-center gap-2 text-xs font-semibold bg-white">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                filter === "all" ? "bg-ink text-white font-bold" : "text-muted hover:text-ink hover:bg-surface-low"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                filter === "unread" ? "bg-ink text-white font-bold" : "text-muted hover:text-ink hover:bg-surface-low"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications Scroll Area */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-line/60">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <span className="material-symbols-outlined text-3xl text-muted/60 mb-1">done_all</span>
                <p className="text-xs font-bold text-ink">You're all caught up!</p>
                <p className="text-[11px] text-muted mt-0.5">
                  No {filter === "unread" ? "unread" : ""} alerts for your Bashundhara account right now.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const icon = getNotificationIcon(notification.title, notification.body);
                return (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                      notification.read ? "bg-white hover:bg-surface-low/50" : "bg-mint/30 hover:bg-mint/50"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 shadow-xs ${icon.bg}`}
                    >
                      <span className="material-symbols-outlined text-base">{icon.name}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs truncate ${notification.read ? "font-bold text-ink" : "font-extrabold text-primary-dark"}`}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] text-muted shrink-0 tabular">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted mt-0.5 leading-snug">
                        {notification.body}
                      </p>
                    </div>

                    {/* Actions: Unread dot & Delete */}
                    <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                      {!notification.read ? (
                        <span className="h-2 w-2 rounded-full bg-primary" title="Unread"></span>
                      ) : (
                        <span className="h-2 w-2"></span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => deleteNotification(e, notification.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-opacity p-0.5"
                        title="Dismiss"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-2.5 bg-surface-low/80 border-t border-line text-center text-[10px] text-muted flex items-center justify-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
            <span>Real-time dispatch updates for Bashundhara R/A</span>
          </div>
        </div>
      )}
    </div>
  );
}
