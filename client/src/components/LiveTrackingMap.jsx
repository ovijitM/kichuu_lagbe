import { useEffect, useRef, useState } from "react";
import L from "leaflet";

// Key GPS Waypoints in Bashundhara R/A
const ROUTE_POINTS = [
  { lat: 23.8164, lng: 90.4288, label: "Bashundhara Fresh Hub (Block G)", type: "store" },
  { lat: 23.8172, lng: 90.4276, type: "waypoint" },
  { lat: 23.8181, lng: 90.4261, type: "waypoint" },
  { lat: 23.8189, lng: 90.4246, label: "Gate 2 Checkpoint (Pre-Cleared)", type: "gate" },
  { lat: 23.8197, lng: 90.4237, type: "waypoint" },
  { lat: 23.8205, lng: 90.4226, type: "waypoint" },
  { lat: 23.8214, lng: 90.4218, label: "Block D, Road 11, Apt 4B (Tanvir Ahmed)", type: "destination" },
];

export function LiveTrackingMap({
  role = "resident", // "resident" | "rider"
  orderId = "KL-8492",
  onStatusChange,
  className = "",
  height = "380px",
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const completedPolylineRef = useRef(null);
  const remainingPolylineRef = useRef(null);

  // Simulation state: progress from 0 (at store) to 1 (at destination)
  // Current active progress starts near Gate 2 passed (~60%)
  const [progress, setProgress] = useState(0.62);
  const [isSimulating, setIsSimulating] = useState(true);
  const [etaMinutes, setEtaMinutes] = useState(8);
  const [distanceMeters, setDistanceMeters] = useState(480);
  const [currentSpeed, setCurrentSpeed] = useState(26);

  // Calculate coordinates at a fractional progress (0..1)
  function getPositionAtProgress(p) {
    const totalSegments = ROUTE_POINTS.length - 1;
    const scaled = Math.max(0, Math.min(1, p)) * totalSegments;
    const segIndex = Math.min(Math.floor(scaled), totalSegments - 1);
    const segFraction = scaled - segIndex;

    const p1 = ROUTE_POINTS[segIndex];
    const p2 = ROUTE_POINTS[segIndex + 1];

    const lat = p1.lat + (p2.lat - p1.lat) * segFraction;
    const lng = p1.lng + (p2.lng - p1.lng) * segFraction;
    return { lat, lng, segIndex };
  }

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered around Bashundhara Block D & G
    const map = L.map(mapContainerRef.current, {
      center: [23.8189, 90.4252],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    // High quality modern CartoDB Voyager tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    // Zoom control in bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Store Custom Marker
    const storePoint = ROUTE_POINTS[0];
    const storeIcon = L.divIcon({
      className: "custom-map-marker",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="h-9 w-9 rounded-2xl bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-lg font-bold">
            <span class="material-symbols-outlined text-lg leading-none">storefront</span>
          </div>
          <span class="absolute -bottom-5 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
            Fresh Hub
          </span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
    L.marker([storePoint.lat, storePoint.lng], { icon: storeIcon })
      .addTo(map)
      .bindTooltip("Bashundhara Fresh Hub · Central Micro-Warehouse (Block G)", {
        direction: "top",
        offset: [0, -18],
      });

    // Gate 2 Checkpoint Marker
    const gatePoint = ROUTE_POINTS[3];
    const gateIcon = L.divIcon({
      className: "custom-map-marker",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="h-7 w-7 rounded-xl bg-teal-600 border-2 border-white text-white flex items-center justify-center shadow-md">
            <span class="material-symbols-outlined text-sm leading-none">security</span>
          </div>
          <span class="absolute -bottom-5 bg-teal-900 text-teal-200 text-[8px] font-bold px-1 rounded shadow-xs whitespace-nowrap">
            Gate 2 Clear
          </span>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
    L.marker([gatePoint.lat, gatePoint.lng], { icon: gateIcon })
      .addTo(map)
      .bindTooltip("Gate 2 Checkpoint · Pre-cleared 12:15 PM", {
        direction: "top",
        offset: [0, -14],
      });

    // Destination Marker (Customer Apartment)
    const destPoint = ROUTE_POINTS[ROUTE_POINTS.length - 1];
    const destIcon = L.divIcon({
      className: "custom-map-marker",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="h-9 w-9 rounded-2xl bg-slate-900 border-2 border-white text-white flex items-center justify-center shadow-lg font-bold">
            <span class="material-symbols-outlined text-lg leading-none text-emerald-400">home</span>
          </div>
          <span class="absolute -bottom-5 bg-slate-900 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
            Block D, Apt 4B
          </span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
    L.marker([destPoint.lat, destPoint.lng], { icon: destIcon })
      .addTo(map)
      .bindTooltip("Tanvir Ahmed · Block D, Road 11, Apt 4B (Intercom Pass #4892)", {
        direction: "top",
        offset: [0, -18],
      });

    // Polylines: initial creation
    const latLngs = ROUTE_POINTS.map((pt) => [pt.lat, pt.lng]);
    const completedPolyline = L.polyline([], {
      color: "#059669",
      weight: 5,
      opacity: 0.95,
      lineCap: "round",
    }).addTo(map);

    const remainingPolyline = L.polyline(latLngs, {
      color: "#10b981",
      weight: 4,
      opacity: 0.7,
      dashArray: "6, 8",
      lineCap: "round",
    }).addTo(map);

    completedPolylineRef.current = completedPolyline;
    remainingPolylineRef.current = remainingPolyline;

    // Moving Rider Marker
    const initialPos = getPositionAtProgress(progress);
    const riderIcon = L.divIcon({
      className: "custom-rider-marker",
      html: `
        <div class="relative flex items-center justify-center">
          <!-- Pulse Halo Wave -->
          <div class="absolute h-12 w-12 rounded-full bg-emerald-500/30 animate-ping pointer-events-none"></div>
          <div class="h-10 w-10 rounded-2xl bg-emerald-500 border-2 border-white text-slate-950 flex items-center justify-center shadow-xl font-bold ring-4 ring-emerald-500/20">
            <span class="material-symbols-outlined text-xl leading-none">electric_moped</span>
          </div>
          <span class="absolute -top-6 bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
            Rider Hasan (Transit)
          </span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const riderMarker = L.marker([initialPos.lat, initialPos.lng], { icon: riderIcon, zIndexOffset: 1000 }).addTo(map);
    riderMarkerRef.current = riderMarker;

    // Fit map bounds to encompass full route comfortably
    map.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Rider & Polylines whenever progress changes
  useEffect(() => {
    if (!mapInstanceRef.current || !riderMarkerRef.current) return;

    const currentPos = getPositionAtProgress(progress);
    riderMarkerRef.current.setLatLng([currentPos.lat, currentPos.lng]);

    // Recalculate completed vs remaining path
    const segIndex = currentPos.segIndex;
    const completedCoords = [];
    for (let i = 0; i <= segIndex; i++) {
      completedCoords.push([ROUTE_POINTS[i].lat, ROUTE_POINTS[i].lng]);
    }
    completedCoords.push([currentPos.lat, currentPos.lng]);

    const remainingCoords = [[currentPos.lat, currentPos.lng]];
    for (let i = segIndex + 1; i < ROUTE_POINTS.length; i++) {
      remainingCoords.push([ROUTE_POINTS[i].lat, ROUTE_POINTS[i].lng]);
    }

    if (completedPolylineRef.current) completedPolylineRef.current.setLatLngs(completedCoords);
    if (remainingPolylineRef.current) remainingPolylineRef.current.setLatLngs(remainingCoords);

    // Dynamic ETA and remaining distance calculation
    const remainingFraction = 1 - progress;
    const remainingDistance = Math.round(remainingFraction * 1200);
    const calculatedEta = Math.max(1, Math.round(remainingFraction * 14));
    setDistanceMeters(remainingDistance);
    setEtaMinutes(calculatedEta);

    // Random slight speed variation for realism
    setCurrentSpeed(Math.floor(22 + Math.random() * 8));

    if (progress >= 1 && onStatusChange) {
      onStatusChange("delivered");
    }
  }, [progress]);

  // Automatic Smooth Movement Simulation Timer
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) return 0.2; // Loop back towards store for demo
        return Math.min(1, prev + 0.015);
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating]);

  function recenterMap() {
    if (!mapInstanceRef.current || !riderMarkerRef.current) return;
    const pos = riderMarkerRef.current.getLatLng();
    mapInstanceRef.current.flyTo(pos, 17, { duration: 1 });
  }

  function resetFullView() {
    if (!mapInstanceRef.current) return;
    const latLngs = ROUTE_POINTS.map((pt) => [pt.lat, pt.lng]);
    mapInstanceRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] });
  }

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-line shadow-card bg-white ${className}`}>
      {/* 1. TOP STATUS BAR (Heads-Up Display) */}
      <div className="p-4 bg-white/95 backdrop-blur-md border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold shadow-xs">
            <span className="material-symbols-outlined text-xl animate-pulse">electric_moped</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-ink">
                Order #{orderId} Live Tracking
              </span>
              <span className="rounded-full bg-secondary-container text-on-secondary-container px-2 py-0.2 text-[10px] font-extrabold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse"></span>
                {progress >= 1 ? "DELIVERED" : progress >= 0.5 ? "GATE 2 PASSED" : "EN ROUTE"}
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">
              {role === "rider"
                ? "Turn-by-turn navigation · Destination: Block D, Road 11, Apt 4B"
                : "Courier Hasan is in transit inside Bashundhara perimeter"}
            </p>
          </div>
        </div>

        {/* Live Metrics Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="rounded-2xl bg-surface-low border border-line px-3.5 py-1.5 text-xs flex items-center gap-3">
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">Estimated Arrival</span>
              <span className="font-display text-sm font-extrabold text-primary tabular">
                {progress >= 1 ? "Arrived" : `${etaMinutes} mins`}
              </span>
            </div>
            <div className="h-6 w-px bg-line"></div>
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">Remaining</span>
              <span className="font-display text-sm font-extrabold text-ink tabular">
                {progress >= 1 ? "0 m" : `${distanceMeters}m`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE LEAFLET MAP CONTAINER */}
      <div className="relative w-full" style={{ height }}>
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Live Telemetry Badge over Map */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/10 px-3.5 py-2 text-white shadow-xl flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <div className="text-xs">
              <span className="font-bold text-emerald-300 block text-[11px]">
                {role === "rider" ? "GPS Active · Road 11 Sector" : "Live Courier Radar Active"}
              </span>
              <span className="text-[10px] text-slate-300">
                Speed: {currentSpeed} km/h · Intercom Pass #4892 Synced
              </span>
            </div>
          </div>
        </div>

        {/* Map Floating Action Controls */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={recenterMap}
            className="h-9 w-9 rounded-xl bg-white border border-line text-ink shadow-md flex items-center justify-center hover:bg-surface-low transition-colors"
            title="Recenter on Rider"
          >
            <span className="material-symbols-outlined text-lg text-primary">my_location</span>
          </button>
          <button
            type="button"
            onClick={resetFullView}
            className="h-9 w-9 rounded-xl bg-white border border-line text-ink shadow-md flex items-center justify-center hover:bg-surface-low transition-colors"
            title="View Full Sector Route"
          >
            <span className="material-symbols-outlined text-lg text-muted">zoom_out_map</span>
          </button>
          <button
            type="button"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`h-9 w-9 rounded-xl border shadow-md flex items-center justify-center transition-colors ${
              isSimulating ? "bg-emerald-50 border-emerald-300 text-primary" : "bg-white border-line text-muted hover:text-ink"
            }`}
            title={isSimulating ? "Pause Simulation" : "Play Simulation"}
          >
            <span className="material-symbols-outlined text-lg">
              {isSimulating ? "pause" : "play_arrow"}
            </span>
          </button>
        </div>
      </div>

      {/* 3. BOTTOM RIDER / CUSTOMER COORDINATION CARD */}
      <div className="p-4 bg-surface-low/60 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Rider Info Card */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-white border border-line shadow-xs flex items-center justify-center text-primary font-bold overflow-hidden">
            <span className="material-symbols-outlined text-2xl">two_wheeler</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-ink">Runner Hasan (Electric Moped)</span>
              <span className="rounded-full bg-mint text-primary-dark px-2 py-0.2 text-[9px] font-bold">
                ID #RUN-4029
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Plate: Dhaka Metro Ha-4921 · Building Intercom PIN: <span className="font-bold text-ink">4892</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Coordination Actions */}
        <div className="flex items-center gap-2">
          {role === "rider" ? (
            <>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=23.8214,90.4218`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-line bg-white hover:bg-surface-low text-ink px-3 py-2 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-primary">navigation</span>
                <span>Open Google Maps</span>
              </a>
              <button
                type="button"
                onClick={() => setProgress(1)}
                className="rounded-xl bg-primary hover:bg-primary-dark text-white px-4 py-2 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Arrived at Door</span>
              </button>
            </>
          ) : (
            <>
              <a
                href="tel:01712894520"
                className="rounded-xl border border-line bg-white hover:bg-surface-low text-ink px-3.5 py-2 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-primary">phone_in_talk</span>
                <span>Call Courier</span>
              </a>
              <button
                type="button"
                onClick={() => alert("Connecting to Gate 2 intercom with PIN 4892...")}
                className="rounded-xl bg-emerald-50 hover:bg-emerald-100 text-primary-dark border border-emerald-200 px-3.5 py-2 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">security</span>
                <span>Intercom Sync</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
