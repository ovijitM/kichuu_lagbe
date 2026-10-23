import { Navigate, useLocation } from "react-router-dom";
import { ROLE_HOME, useAuth } from "../auth/AuthContext.jsx";

export function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <ScreenMessage>Checking your session…</ScreenMessage>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to={ROLE_HOME[user.role] || "/"} replace />;
  return children;
}

export function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <ScreenMessage>Checking your session…</ScreenMessage>;
  if (user) return <Navigate to={ROLE_HOME[user.role] || "/"} replace />;
  return children;
}

function ScreenMessage({ children }) {
  return (
    <div className="grid min-h-screen place-items-center text-sm font-semibold text-muted">{children}</div>
  );
}
