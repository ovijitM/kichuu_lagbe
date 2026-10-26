export const ROLE_CONFIGS = {
  shop_owner: {
    title: "Merchant Terminal",
    icon: "store",
    subtitle: "Manage orders, inventory, and shop operations",
    nav: [
      { to: "/merchant", label: "Live Terminal", icon: "dashboard" },
    ],
  },
  service_provider: {
    title: "Provider Console",
    icon: "handyman",
    subtitle: "Manage service requests and credentials",
    nav: [
      { to: "/provider", label: "Jobs Console", icon: "home_repair_service" },
    ],
  },
  rider: {
    title: "Rider Console",
    icon: "two_wheeler",
    subtitle: "Complete internal delivery runs",
    nav: [
      { to: "/rider", label: "Active Runs", icon: "route" },
    ],
  },
  admin: {
    title: "Operations Console",
    icon: "admin_panel_settings",
    subtitle: "Monitor dispatch, riders, and shop approvals",
    nav: [
      { to: "/admin", label: "Dispatch", icon: "dashboard" },
      { to: "/admin/shops", label: "Shop Approvals", icon: "store" },
    ],
  },
};

