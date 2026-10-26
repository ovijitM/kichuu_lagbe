import { Navigate, Route, Routes } from "react-router-dom";
import { ROLE_HOME, useAuth } from "./auth/AuthContext.jsx";
import { PanelLayout, ResidentLayout } from "./components/Layouts.jsx";
import { ROLE_CONFIGS } from "./config/roleConfigs.js";
import { AdminDispatchPage } from "./pages/admin/AdminDispatchPage.jsx";
import { AdminShopsPage } from "./pages/admin/ShopsPage.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { ShopPage } from "./pages/merchant/ShopPage.jsx";
import { ProviderDashboardPage } from "./pages/provider/ProviderDashboardPage.jsx";
import { ResidentHubPage } from "./pages/resident/ResidentHubPage.jsx";
import { ResidentServicesPage } from "./pages/resident/ResidentServicesPage.jsx";
import { ResidentShopsPage } from "./pages/resident/ShopsPage.jsx";
import { InstantMartPage } from "./pages/resident/InstantMartPage.jsx";
import { RiderDashboardPage } from "./pages/rider/RiderDashboardPage.jsx";
import { GuestRoute, ProtectedRoute } from "./routes/guards.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />

      {/* Resident Role Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute roles={["resident"]}>
            <ResidentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ResidentHubPage />} />
        <Route path="shops" element={<ResidentShopsPage />} />
        <Route path="shops/:shopId" element={<ResidentShopsPage />} />
        <Route path="mart" element={<InstantMartPage />} />
        <Route path="services" element={<ResidentServicesPage />} />
      </Route>

      {/* Merchant / Shop Owner Routes */}
      <Route
        path="/merchant"
        element={
          <ProtectedRoute roles={["shop_owner"]}>
            <PanelLayout config={ROLE_CONFIGS.shop_owner} />
          </ProtectedRoute>
        }
      >
        <Route index element={<ShopPage />} />
      </Route>

      {/* Service Provider / Technician Routes */}
      <Route
        path="/provider"
        element={
          <ProtectedRoute roles={["service_provider"]}>
            <PanelLayout config={ROLE_CONFIGS.service_provider} />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProviderDashboardPage />} />
      </Route>

      {/* Delivery Rider Routes */}
      <Route
        path="/rider"
        element={
          <ProtectedRoute roles={["rider"]}>
            <PanelLayout config={ROLE_CONFIGS.rider} />
          </ProtectedRoute>
        }
      >
        <Route index element={<RiderDashboardPage />} />
      </Route>

      {/* Admin Operations Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <PanelLayout config={ROLE_CONFIGS.admin} />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDispatchPage />} />
        <Route path="shops" element={<AdminShopsPage />} />
      </Route>

      <Route path="*" element={<RoleRedirect />} />
    </Routes>
  );
}

function RoleRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user ? ROLE_HOME[user.role] || "/app" : "/"} replace />;
}
