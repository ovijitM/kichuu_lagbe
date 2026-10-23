import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken } from "../api/client.js";

const AuthContext = createContext(null);

export const ROLE_HOME = {
  resident: "/app",
  shop_owner: "/merchant",
  service_provider: "/provider",
  rider: "/rider",
  admin: "/admin",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api("/api/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(payload) {
        const data = await api("/api/auth/login", { method: "POST", body: payload });
        setToken(data.token);
        setUser(data.user);
        return data.user;
      },
      async signup(payload) {
        const data = await api("/api/auth/signup", { method: "POST", body: payload });
        setToken(data.token);
        setUser(data.user);
        return data.user;
      },
      async devLogin(role) {
        const data = await api("/api/auth/dev-login", { method: "POST", body: { role } });
        setToken(data.token);
        setUser(data.user);
        return data.user;
      },
      logout() {
        setToken(null);
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
