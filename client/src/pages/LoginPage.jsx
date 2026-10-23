import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ROLE_HOME, useAuth } from "../auth/AuthContext.jsx";
import { Brand } from "../components/Brand.jsx";

const devRoles = [
  { value: "resident", label: "Resident", icon: "person", hint: "tanvir@kichuulagbe.local" },
  { value: "shop_owner", label: "Shop Owner", icon: "store", hint: "shop@kichuulagbe.local" },
  { value: "service_provider", label: "Technician", icon: "handyman", hint: "kabir@kichuulagbe.local" },
  { value: "rider", label: "Rider", icon: "two_wheeler", hint: "hasan@kichuulagbe.local" },
  { value: "admin", label: "Admin Dispatch", icon: "admin_panel_settings", hint: "admin@kichuulagbe.local" },
];

const signupRoles = [
  { value: "resident", label: "Resident", icon: "person", desc: "Order 20m groceries & home repairs" },
  { value: "shop_owner", label: "Shop Owner", icon: "store", desc: "List products & receive local orders" },
  { value: "service_provider", label: "Technician", icon: "handyman", desc: "Get high-intent repair bookings" },
  { value: "rider", label: "Delivery Rider", icon: "two_wheeler", desc: "Safe internal short distance runs" },
];

export function LoginPage() {
  const { login, signup, devLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get("role");

  const [mode, setMode] = useState(searchParams.get("mode") === "signup" ? "signup" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(
    signupRoles.some((item) => item.value === requestedRole) ? requestedRole : "resident"
  );
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const user =
        mode === "login"
          ? await login({ email, password })
          : await signup({ name, email, password, role });
      navigate(ROLE_HOME[user.role] || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  async function signInAs(nextRole) {
    setError("");
    setPending(true);
    try {
      const signedIn = await devLogin(nextRole);
      navigate(ROLE_HOME[signedIn.role] || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface flex flex-col justify-center items-center py-10 px-4">
      {/* Background ambient glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-mint/40 via-surface-container/30 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      <div className="w-full max-w-4xl grid md:grid-cols-12 rounded-3xl border border-line bg-white shadow-modal overflow-hidden">
        {/* Left Branding Showcase Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-primary-deep via-primary to-primary-dark p-8 text-on-primary flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center group" aria-label="Kichuu Lagbe home">
              <Brand dark size="lg" subtitle="Bashundhara Community" />
            </Link>

            <div className="mt-10">
              <span className="rounded-full bg-secondary-fixed/20 border border-secondary-fixed/30 text-secondary-fixed px-3 py-1 text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">bolt</span>
                <span>Hyperlocal Super-App</span>
              </span>
              <h2 className="font-display text-2xl font-black mt-3 text-white leading-snug">
                One Account for All 5 Community Roles
              </h2>
              <p className="mt-2 text-xs text-primary-fixed/90 leading-relaxed">
                Connect directly with neighborhood micro-warehouses, internal bike runners, and verified technicians across Blocks A–M.
              </p>
            </div>
          </div>

          {/* Quick Features List */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/20 space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-white">
              <span className="material-symbols-outlined text-secondary-fixed text-base">verified_user</span>
              <span>Building Gate PIN Intercom Sync</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white">
              <span className="material-symbols-outlined text-secondary-fixed text-base">timer</span>
              <span>20–30 Min Average Arrival</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white">
              <span className="material-symbols-outlined text-secondary-fixed text-base">payments</span>
              <span>100% Cash on Delivery in BDT (৳)</span>
            </div>
          </div>

          {/* Decorative Corner Accents */}
          <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-secondary-fixed/10 pointer-events-none blur-xl"></div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-surface-low p-1 border border-line mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mode === "login"
                    ? "bg-white text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mode === "signup"
                    ? "bg-white text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                <span className="material-symbols-outlined text-sm">person_add</span>
                <span>Create Account</span>
              </button>
            </div>

            <div>
              <h1 className="font-display text-2xl font-black text-ink">
                {mode === "login" ? "Welcome back" : "Join Kichuu Lagbe"}
              </h1>
              <p className="mt-1 text-xs text-muted">
                {mode === "login"
                  ? "Enter your credentials to access your Bashundhara account"
                  : "Choose your role and register to begin in Bashundhara R/A"}
              </p>
            </div>

            {/* Main Form */}
            <form className="mt-5 space-y-3.5" onSubmit={submit}>
              {mode === "signup" && (
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Your Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-lg">
                      person
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      required
                      minLength={2}
                      className="w-full rounded-xl border border-line bg-surface-low pl-9 pr-3 py-2 text-xs font-medium text-ink outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="text-xs font-bold text-ink block mb-1.5">Select Your Community Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {signupRoles.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          role === r.value
                            ? "border-primary bg-mint text-primary-dark shadow-sm ring-1 ring-primary"
                            : "border-line bg-surface-low text-ink hover:bg-surface-container"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="material-symbols-outlined text-base">{r.icon}</span>
                          <span className="text-xs font-bold">{r.label}</span>
                        </div>
                        <p className="text-[10px] text-muted line-clamp-1">{r.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-ink block mb-1">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-lg">
                    mail
                  </span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@kichuulagbe.local"
                    required
                    className="w-full rounded-xl border border-line bg-surface-low pl-9 pr-3 py-2 text-xs font-medium text-ink outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-lg">
                    lock
                  </span>
                  <input
                    type="password"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-line bg-surface-low pl-9 pr-3 py-2 text-xs font-medium text-ink outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-danger text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full mt-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold py-2.5 text-xs transition-all shadow-float flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {pending ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{mode === "login" ? "Sign In to Dashboard" : "Create Account & Continue"}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Dev Quick-Sign In Panel */}
          {import.meta.env.DEV && (
            <div className="mt-6 pt-4 border-t border-line">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">developer_mode</span>
                  Quick Dev Sign-In (1-Click)
                </span>
                <Link to="/" className="text-[10px] font-semibold text-primary hover:underline">
                  Back to Home
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {devRoles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    disabled={pending}
                    onClick={() => signInAs(r.value)}
                    className="p-1.5 rounded-lg border border-line bg-surface-low hover:bg-surface-container text-ink text-left transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm text-primary">{r.icon}</span>
                    <span className="text-[11px] font-bold truncate">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
