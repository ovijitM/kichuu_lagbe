import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import { Badge } from "../../components/Badge.jsx";
import { Button } from "../../components/Button.jsx";
import { Field, TextInput } from "../../components/Field.jsx";

const INCOMING_JOBS = [
  {
    id: "JOB-401",
    service: "AC Master Jet Wash & Cooling Check",
    category: "AC Servicing",
    resident: "Mahmudul Hasan",
    address: "Block C, Road 8, Apt 3A",
    gatePin: "5912",
    rate: "৳850",
    timing: "Today · 3:00 PM",
    desc: "1.5 Ton Split AC not cooling, water dripping from indoor unit.",
  },
  {
    id: "JOB-403",
    service: "Emergency DB Box Short Circuit",
    category: "Electrician",
    resident: "Dr. Farhan Chowdhury",
    address: "Block D, Road 11, Apt 4B",
    gatePin: "4892",
    rate: "৳450",
    timing: "Emergency · ASAP",
    desc: "Main breaker tripping repeatedly when water heater turns on.",
  },
];

const PRESET_PROVIDER_AVATARS = [
  { label: "Electrician", url: "/services/electrician.jpg" },
  { label: "AC Technician", url: "/services/ac_technician.jpg" },
  { label: "Plumber", url: "/services/plumber.jpg" },
  { label: "Deep Cleaner", url: "/services/cleaner.jpg" },
];

export function ProviderDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("jobs"); // "jobs" | "profile"
  const [isAvailable, setIsAvailable] = useState(true);
  const [jobs, setJobs] = useState(INCOMING_JOBS);
  const [activeJob, setActiveJob] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "Md. Kabir Hossain",
    trade: "AC & Electrical Specialist",
    phone: "01712-894520",
    basePrice: "500",
    bio: "Certified residential HVAC and electrical maintenance specialist with 8+ years experience serving high-rise apartments in Bashundhara R/A. Fast diagnosis, genuine spare parts, and transparent call-out pricing.",
    avatarImage: "/services/electrician.jpg",
    nidDocumentImage: "",
    portfolioImages: [
      "/services/ac_technician.jpg",
      "/services/electrician.jpg",
    ],
    verified: true,
  });

  useEffect(() => {
    api("/api/provider/profile")
      .then((res) => {
        if (res?.provider) {
          setProfile((prev) => ({
            ...prev,
            name: res.provider.name || prev.name,
            trade: res.provider.trade || prev.trade,
            phone: res.provider.phone || prev.phone,
            basePrice: String(res.provider.basePrice ?? prev.basePrice),
            bio: res.provider.bio || prev.bio,
            avatarImage: res.provider.avatarImage || prev.avatarImage,
            nidDocumentImage: res.provider.nidDocumentImage || prev.nidDocumentImage,
            portfolioImages: res.provider.portfolioImages?.length
              ? res.provider.portfolioImages
              : prev.portfolioImages,
            verified: res.provider.verified ?? prev.verified,
          }));
        }
      })
      .catch(() => {
        // Keeps sensible defaults if mock user
      });
  }, []);

  function handleImageFile(file, onLoaded) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      onLoaded(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function saveProfile(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setIsSaving(true);
    try {
      const body = {
        trade: profile.trade,
        phone: profile.phone,
        basePrice: Number(profile.basePrice) || 0,
        bio: profile.bio,
        avatarImage: profile.avatarImage,
        nidDocumentImage: profile.nidDocumentImage,
        portfolioImages: profile.portfolioImages,
      };
      await api("/api/provider/profile", { method: "PATCH", body });
      setNotice("Technician profile & credentials saved successfully!");
      setTimeout(() => setNotice(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to save provider profile");
    } finally {
      setIsSaving(false);
    }
  }

  function addPortfolioImage(file) {
    handleImageFile(file, (dataUrl) => {
      setProfile((p) => ({
        ...p,
        portfolioImages: [...p.portfolioImages, dataUrl].slice(0, 12),
      }));
    });
  }

  function removePortfolioImage(indexToRemove) {
    setProfile((p) => ({
      ...p,
      portfolioImages: p.portfolioImages.filter((_, idx) => idx !== indexToRemove),
    }));
  }

  function acceptJob(job) {
    setActiveJob(job);
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
    setNotice(`Accepted ${job.service}! Gate PIN ${job.gatePin} saved.`);
    setTimeout(() => setNotice(""), 3500);
  }

  function declineJob(jobId) {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }

  function completeJob() {
    setNotice(`Job #${activeJob.id} marked complete! ${activeJob.rate} added to earnings.`);
    setActiveJob(null);
    setTimeout(() => setNotice(""), 3500);
  }

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & PRO BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="flex items-center gap-3">
          <img
            src={profile.avatarImage || "/services/electrician.jpg"}
            alt={profile.name}
            className="h-12 w-12 rounded-2xl object-cover border-2 border-primary/20 shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-black text-ink">
                {profile.name}
              </h1>
              {profile.verified ? (
                <span className="rounded-full bg-mint text-primary-dark px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  NID VERIFIED PRO
                </span>
              ) : (
                <span className="rounded-full bg-amber-soft text-amber-deep px-2.5 py-0.5 text-[10px] font-bold">
                  VERIFICATION PENDING
                </span>
              )}
            </div>
            <p className="text-xs text-muted mt-0.5">
              {profile.trade} · Call-out: <span className="font-bold text-primary tabular">৳{profile.basePrice}</span> · Bashundhara Blocks A–M
            </p>
          </div>
        </div>

        {/* View Switcher Tabs & Availability Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-low p-1 rounded-xl border border-line text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("jobs")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "jobs"
                  ? "bg-white text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              <span className="material-symbols-outlined text-sm">home_repair_service</span>
              <span>Jobs Console</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "profile"
                  ? "bg-white text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              <span className="material-symbols-outlined text-sm">badge</span>
              <span>Profile &amp; Credentials</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAvailable(!isAvailable)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
              isAvailable
                ? "bg-secondary-container text-on-secondary-container border border-secondary"
                : "bg-surface-low text-muted border border-line"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isAvailable ? "bg-secondary animate-pulse" : "bg-muted"
              }`}
            ></span>
            <span>{isAvailable ? "Online" : "Busy"}</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-mint border border-primary/30 text-primary-dark text-xs font-bold flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-danger text-xs font-bold flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* TAB A: JOBS CONSOLE */}
      {activeTab === "jobs" && (
        <div className="space-y-6">
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-line shadow-sm">
              <span className="text-xs text-muted font-semibold">Today's Visits</span>
              <p className="font-display text-2xl font-black text-ink mt-1 tabular">3</p>
              <p className="text-[10px] text-secondary font-bold mt-0.5">2 completed · 1 active</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-line shadow-sm">
              <span className="text-xs text-muted font-semibold">Today's Earnings</span>
              <p className="font-display text-2xl font-black text-primary mt-1 tabular">৳2,150</p>
              <p className="text-[10px] text-muted mt-0.5">Collected in Cash</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-line shadow-sm">
              <span className="text-xs text-muted font-semibold">Community Rating</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="font-display text-2xl font-black text-ink tabular">4.92</span>
                <span className="material-symbols-outlined text-amber text-lg">star</span>
              </div>
              <p className="text-[10px] text-muted mt-0.5">From 142 Bashundhara homes</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-line shadow-sm">
              <span className="text-xs text-muted font-semibold">Gate Entry Pass</span>
              <div className="flex items-center gap-1 mt-1 text-sm font-bold text-ink">
                <span className="material-symbols-outlined text-base text-primary">key</span>
                <span>Pre-cleared Tech</span>
              </div>
              <p className="text-[10px] text-secondary font-bold mt-0.5">No Gate Pass Hassle</p>
            </div>
          </div>

          {/* ACTIVE JOB WORKFLOW (IF ANY ACCEPTED) */}
          {activeJob && (
            <div className="rounded-3xl border border-primary/40 bg-mint/30 p-6 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-primary/20 mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary animate-ping"></span>
                  <h3 className="font-display text-base font-bold text-ink">
                    Currently On-Site: #{activeJob.id} - {activeJob.service}
                  </h3>
                </div>
                <span className="font-display text-lg font-black text-primary tabular">{activeJob.rate}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-xs mb-4">
                <div className="bg-white p-3.5 rounded-2xl border border-line">
                  <span className="text-[10px] text-muted uppercase font-bold block mb-1">Customer &amp; Location</span>
                  <p className="font-bold text-ink text-sm">{activeJob.resident}</p>
                  <p className="text-muted mt-0.5">{activeJob.address}</p>
                  <div className="mt-2 text-primary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">phone_in_talk</span>
                    <span>Intercom / Phone Connected</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-line flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-muted uppercase font-bold block mb-1">Building Security</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted">Gate PIN:</span>
                      <span className="font-display text-base font-black text-primary tracking-widest">{activeJob.gatePin}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted mt-2 italic">"{activeJob.desc}"</p>
                </div>
              </div>

              <div className="pt-3 border-t border-primary/20 flex justify-end">
                <button
                  type="button"
                  onClick={completeJob}
                  className="rounded-xl bg-primary hover:bg-primary-dark text-white px-5 py-2.5 text-xs font-bold transition-all shadow-float flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Mark Visit Completed &amp; Collected {activeJob.rate}</span>
                </button>
              </div>
            </div>
          )}

          {/* INCOMING JOB REQUESTS */}
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-ink">
                  Incoming Job Requests ({jobs.length})
                </h3>
                <span className="rounded-full bg-secondary-container text-on-secondary-container px-2 py-0.5 text-[10px] font-bold">
                  Direct Community Bookings
                </span>
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted">
                <span className="material-symbols-outlined text-3xl text-secondary mb-1">done_all</span>
                <p className="font-semibold text-ink">All caught up! No pending requests right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-line bg-surface-low p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded-md bg-white border border-line text-ink text-[10px] font-bold px-2 py-0.5">
                          {job.category}
                        </span>
                        <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          {job.timing}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-ink">{job.service}</h4>
                      <p className="text-xs text-muted mt-0.5">
                        {job.resident} · {job.address}
                      </p>
                      <p className="text-[11px] text-ink/80 mt-1 italic">
                        Note: "{job.desc}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-muted block uppercase font-bold">Call-out</span>
                        <span className="font-display text-lg font-black text-primary tabular">{job.rate}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => declineJob(job.id)}
                        className="rounded-xl border border-line px-3 py-2 text-xs font-semibold text-muted hover:text-danger hover:bg-white transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => acceptJob(job)}
                        className="rounded-xl bg-primary hover:bg-primary-dark text-white px-4 py-2 text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">check</span>
                        <span>Accept Job</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB B: PROFILE & CREDENTIALS SETTINGS */}
      {activeTab === "profile" && (
        <form onSubmit={saveProfile} className="max-w-3xl rounded-3xl border border-line bg-white p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Technician Profile &amp; Credentials</h3>
              <p className="text-xs text-muted mt-0.5">
                Set your public profile photo, official NID verification document, trade specialty, and past work photos.
              </p>
            </div>
            <Badge tone={profile.verified ? "mint" : "amber"}>
              {profile.verified ? "Verified Specialist" : "Pending Verification"}
            </Badge>
          </div>

          {/* 1. Technician Avatar / Photo Uploader */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-ink">Technician Profile Photo</label>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-low border border-line">
              <img
                src={profile.avatarImage || "/services/electrician.jpg"}
                alt="Profile Avatar"
                className="h-20 w-20 rounded-2xl object-cover border-2 border-primary/30 shadow-md shrink-0 bg-white"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-ink">Public Service Face</p>
                <p className="text-[11px] text-muted">
                  Shown to residents when booking services, during intercom verification, and at building security gates.
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-line text-xs font-bold text-ink hover:bg-surface-low transition-colors shadow-xs">
                    <span className="material-symbols-outlined text-xs">upload</span>
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(file, (dataUrl) => setProfile((p) => ({ ...p, avatarImage: dataUrl })));
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {profile.avatarImage && (
                    <button
                      type="button"
                      onClick={() => setProfile((p) => ({ ...p, avatarImage: "/services/electrician.jpg" }))}
                      className="text-xs text-muted hover:text-danger font-semibold px-2 py-1"
                    >
                      Reset Default
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick avatar presets */}
            <div>
              <span className="text-[10px] font-bold text-muted block mb-1.5 uppercase tracking-wider">
                Or select specialty avatar preset:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_PROVIDER_AVATARS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, avatarImage: preset.url }))}
                    className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                      profile.avatarImage === preset.url
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-line bg-white hover:border-ink/40"
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="h-9 w-9 rounded-lg object-cover" />
                    <span className="text-[10px] font-bold text-ink truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Trade Specialty, Rate, & Phone */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <Field label="Trade / Specialty Title">
              <TextInput
                value={profile.trade}
                onChange={(e) => setProfile({ ...profile, trade: e.target.value })}
                placeholder="e.g. AC Technician & HVAC Specialist"
                required
              />
            </Field>

            <Field label="Base Call-out Rate (৳ BDT)">
              <TextInput
                type="number"
                min="0"
                step="50"
                value={profile.basePrice}
                onChange={(e) => setProfile({ ...profile, basePrice: e.target.value })}
                placeholder="500"
                required
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Direct Phone / WhatsApp">
              <TextInput
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="017XXXXXXXX"
                required
              />
            </Field>

            <Field label="Primary Coverage Zone">
              <TextInput
                defaultValue="Bashundhara R/A (Blocks A, B, C, D, G, I, M)"
                disabled
                className="bg-surface-low text-muted cursor-not-allowed"
              />
            </Field>
          </div>

          {/* 3. Bio / Work Summary */}
          <Field label="Experience, Qualifications &amp; Service Guarantee">
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="e.g. Certified technician with 8+ years experience repairing Daikin, Gree, and General split AC units..."
              className="w-full rounded-2xl border border-line bg-white px-3.5 py-2.5 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </Field>

          {/* 4. NID / Trade Certificate Verification Document Uploader */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ink">NID / Trade Verification Document</label>
              <span className="text-[10px] font-bold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">security</span>
                <span>Encrypted &amp; Stored Securely</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-low border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {profile.nidDocumentImage ? (
                  <img
                    src={profile.nidDocumentImage}
                    alt="NID Document"
                    className="h-16 w-24 rounded-xl object-cover border border-line shadow-xs bg-white"
                  />
                ) : (
                  <div className="h-16 w-24 rounded-xl bg-white border border-dashed border-line flex flex-col items-center justify-center text-muted shrink-0">
                    <span className="material-symbols-outlined text-xl">contact_page</span>
                    <span className="text-[9px] font-bold">No NID uploaded</span>
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-ink">National ID / Trade Certification</p>
                  <p className="text-[11px] text-muted">Required for building security clearance &amp; Verified Pro badge.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-line text-xs font-bold text-ink hover:bg-surface-low shadow-xs">
                  <span className="material-symbols-outlined text-xs">upload</span>
                  <span>{profile.nidDocumentImage ? "Change Document" : "Upload NID / Cert"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageFile(file, (dataUrl) => setProfile((p) => ({ ...p, nidDocumentImage: dataUrl, verified: true })));
                      e.target.value = "";
                    }}
                  />
                </label>
                {profile.nidDocumentImage && (
                  <button
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, nidDocumentImage: "" }))}
                    className="text-xs text-danger font-semibold hover:underline px-2 py-1"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 5. Past Work & Portfolio Photo Gallery */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ink">
                Job Portfolio &amp; Past Work Photos ({profile.portfolioImages.length}/12)
              </label>
              <label className="cursor-pointer inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                <span>Add Portfolio Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) addPortfolioImage(file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {profile.portfolioImages.map((imgUrl, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden border border-line aspect-square group shadow-xs">
                  <img src={imgUrl} alt={`Job sample ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removePortfolioImage(idx)}
                      className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 shadow-md"
                      title="Remove image"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}

              {profile.portfolioImages.length < 12 && (
                <label className="cursor-pointer rounded-2xl border-2 border-dashed border-line bg-surface-low hover:bg-surface-high/50 flex flex-col items-center justify-center aspect-square text-muted transition-colors">
                  <span className="material-symbols-outlined text-2xl text-primary/60">add_circle</span>
                  <span className="text-[11px] font-bold text-ink mt-1">Add Photo</span>
                  <span className="text-[9px] text-muted">Up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) addPortfolioImage(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-line flex items-center justify-between">
            <span className="text-xs text-muted">Visible on community booking cards</span>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Profile & Credentials"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
