"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  Navigation,
  Layers,
  LocateFixed,
  MapPin,
  Key,
  ExternalLink,
  Sparkles,
  Check,
  AlertTriangle,
} from "lucide-react";

// Default coordinates for TownKart Central Hub & Customer in Civil Lines
const DEFAULT_HUB_LOCATION = { lat: 26.7865, lng: 82.1932 };
const DEFAULT_CUSTOMER_LOCATION = { lat: 26.7938, lng: 82.2025 };
const DEFAULT_RIDER_LOCATION = { lat: 26.7898, lng: 82.198 };

interface RiderSatelliteMapProps {
  riderLocation?: { lat: number; lng: number };
  customerLocation?: { lat: number; lng: number; name?: string; address?: string };
  hubLocation?: { lat: number; lng: number; name?: string };
  height?: string;
  zoom?: number;
  showControls?: boolean;
}

// Controller component to re-center the map on the rider
function MapRecenterHandler({
  center,
  trigger,
}: {
  center: { lat: number; lng: number };
  trigger: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo(center);
    map.setZoom(16);
  }, [map, center, trigger]);

  return null;
}

export function RiderSatelliteMap({
  riderLocation = DEFAULT_RIDER_LOCATION,
  customerLocation = {
    ...DEFAULT_CUSTOMER_LOCATION,
    name: "Amit Sharma (Flat 402)",
    address: "Greenfield Heights, Civil Lines",
  },
  hubLocation = {
    ...DEFAULT_HUB_LOCATION,
    name: "TownKart Hub #04",
  },
  height = "380px",
  zoom = 15,
  showControls = true,
}: RiderSatelliteMapProps) {
  // Map configuration state
  const [mapTypeId, setMapTypeId] = useState<"satellite" | "hybrid" | "roadmap">("hybrid");
  const [recenterTrigger, setRecenterTrigger] = useState(0);
  const [activeInfoWindow, setActiveInfoWindow] = useState<"rider" | "customer" | "hub" | null>(null);

  // API Key management: env variable with localStorage fallback for testing
  const [apiKey, setApiKey] = useState<string>("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    // 1. Check environment variable
    const envKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    // 2. Check localStorage custom key
    const localKey = typeof window !== "undefined" ? localStorage.getItem("townkart_gmaps_key") || "" : "";
    
    const activeKey = localKey || envKey;
    setApiKey(activeKey);
    setInputKey(activeKey);
  }, []);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("townkart_gmaps_key", inputKey.trim());
      setApiKey(inputKey.trim());
      setKeySaved(true);
      setTimeout(() => {
        setKeySaved(false);
        setShowKeyModal(false);
      }, 1200);
    }
  };

  const centerCoord = useMemo(() => riderLocation, [riderLocation]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-sm border border-neutral-200" style={{ height }}>
      {apiKey ? (
        <APIProvider apiKey={apiKey} libraries={["marker"]}>
          <Map
            mapId="DEMO_MAP_ID"
            mapTypeId={mapTypeId}
            defaultCenter={centerCoord}
            defaultZoom={zoom}
            gestureHandling="greedy"
            disableDefaultUI={true}
            internalUsageAttributionIds={["gmp_git_agentskills_v1"]}
            className="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          >
            <MapRecenterHandler center={riderLocation} trigger={recenterTrigger} />

            {/* Hub Marker */}
            <AdvancedMarker
              position={hubLocation}
              title={hubLocation.name}
              onClick={() => setActiveInfoWindow("hub")}
            >
              <div className="flex flex-col items-center">
                <span className="bg-[#111111]/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-md mb-0.5 whitespace-nowrap border border-white/20">
                  {hubLocation.name}
                </span>
                <Pin
                  background="#16803C"
                  borderColor="#FFFFFF"
                  glyphColor="#FFFFFF"
                  scale={1.05}
                />
              </div>
            </AdvancedMarker>

            {/* Customer Delivery Pin */}
            <AdvancedMarker
              position={customerLocation}
              title={customerLocation.name}
              onClick={() => setActiveInfoWindow("customer")}
            >
              <div className="flex flex-col items-center">
                <span className="bg-[#FF5A36] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg mb-0.5 whitespace-nowrap border-2 border-white">
                  {customerLocation.name}
                </span>
                <Pin
                  background="#FF5A36"
                  borderColor="#FFFFFF"
                  glyphColor="#FFFFFF"
                  scale={1.2}
                />
              </div>
            </AdvancedMarker>

            {/* Active Rider Bike Location Marker */}
            <AdvancedMarker
              position={riderLocation}
              title="You (Dinesh Kumar)"
              onClick={() => setActiveInfoWindow("rider")}
            >
              <div className="relative flex items-center justify-center cursor-pointer">
                {/* Sonar Radar Pulse */}
                <span className="absolute w-12 h-12 rounded-full bg-blue-500/40 animate-ping" />
                <span className="absolute w-8 h-8 rounded-full bg-blue-400/30" />
                {/* Rider Motorcycle Badge */}
                <div className="relative w-8 h-8 rounded-full bg-[#111111] text-white border-2 border-blue-400 shadow-xl flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-blue-400 -rotate-45" />
                </div>
              </div>
            </AdvancedMarker>

            {/* InfoWindows */}
            {activeInfoWindow === "rider" && (
              <InfoWindow
                position={riderLocation}
                onCloseClick={() => setActiveInfoWindow(null)}
              >
                <div className="p-2 text-[#111111] min-w-[160px]">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>Dinesh Kumar (Rider)</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">Vehicle: UP-32-AB-1234</p>
                  <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">Speed: 28 km/h • En Route</p>
                </div>
              </InfoWindow>
            )}

            {activeInfoWindow === "customer" && (
              <InfoWindow
                position={customerLocation}
                onCloseClick={() => setActiveInfoWindow(null)}
              >
                <div className="p-2 text-[#111111] min-w-[170px]">
                  <div className="flex items-center gap-1.5 font-black text-xs text-[#FF5A36]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{customerLocation.name}</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-1">{customerLocation.address}</p>
                  <p className="text-[10px] font-bold text-neutral-500 mt-1 uppercase">Order #TK-7492 • Collect ₹199.30</p>
                </div>
              </InfoWindow>
            )}

            {activeInfoWindow === "hub" && (
              <InfoWindow
                position={hubLocation}
                onCloseClick={() => setActiveInfoWindow(null)}
              >
                <div className="p-2 text-[#111111]">
                  <p className="font-bold text-xs">{hubLocation.name}</p>
                  <p className="text-[11px] text-neutral-500">Dispatch &amp; Sorting Bay B-04</p>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      ) : (
        /* Real Satellite Fallback View with High-Resolution Satellite Map Tile & Quick Connect */
        <div className="relative w-full h-full bg-[#121921] flex flex-col items-center justify-between p-4 overflow-hidden select-none">
          {/* High-Resolution Satellite Texture Layer */}
          <div
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.4) 0%, rgba(10, 15, 26, 0.95) 100%), url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop&q=80')",
            }}
          />

          {/* Abstract Satellite Roads & Highlighting Grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
            <path
              d="M -30,120 Q 140,80 180,180 T 420,240"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            <path
              d="M 180,180 L 260,110 L 320,110"
              fill="none"
              stroke="#F97316"
              strokeWidth="3"
            />
          </svg>

          {/* Top Satellite Status Bar */}
          <div className="relative z-10 w-full flex items-center justify-between">
            <div className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-white text-[11px] font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Satellite GPS Active • 26.7898° N, 82.1980° E</span>
            </div>

            <button
              onClick={() => setShowKeyModal(true)}
              className="bg-[#FF5A36] hover:bg-[#e04a28] text-white px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 shadow-lg shadow-[#FF5A36]/30 transition-all active:scale-95"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Connect Maps Key</span>
            </button>
          </div>

          {/* Center Simulated Satellite Hub & Target Markers */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            {/* Pulsing Rider Satellite Pin */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-500/30 animate-ping absolute" />
              <div className="w-10 h-10 rounded-full bg-black/90 border-2 border-blue-400 text-blue-400 flex items-center justify-center shadow-2xl">
                <Navigation className="w-5 h-5 -rotate-45 text-blue-400" />
              </div>
              <span className="absolute -bottom-6 bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow whitespace-nowrap">
                Rider: Dinesh (28 km/h)
              </span>
            </div>

            {/* Quick Demo Key Prompt */}
            <div className="bg-black/80 backdrop-blur-md border border-white/15 rounded-2xl p-4 max-w-xs text-center shadow-2xl">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-white text-xs font-black">Google Maps Satellite Ready</h4>
              <p className="text-neutral-300 text-[11px] mt-1">
                Enter your Google Cloud API Key or free Maps Demo Key to enable live dynamic satellite pan &amp; zoom.
              </p>
              <button
                onClick={() => setShowKeyModal(true)}
                className="mt-3 w-full bg-white text-[#111111] hover:bg-neutral-100 font-bold py-1.5 rounded-xl text-xs transition-colors"
              >
                Enter API Key / Demo Key
              </button>
            </div>
          </div>

          {/* Bottom Satellite Info Bar */}
          <div className="relative z-10 w-full flex items-center justify-between text-[11px] text-white/80">
            <span className="bg-black/60 px-2.5 py-1 rounded-lg border border-white/10">
              Target: Amit Sharma • 0.5 km (2 mins)
            </span>
            <span className="text-[10px] text-neutral-400">
              Imagery © Google Satellite
            </span>
          </div>
        </div>
      )}

      {/* Floating Interactive Controls (when real map is active) */}
      {showControls && (
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
          {/* Satellite vs Hybrid vs Street Map Switcher */}
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-lg border border-neutral-200 flex flex-col gap-1">
            <button
              onClick={() => setMapTypeId("hybrid")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                mapTypeId === "hybrid"
                  ? "bg-[#111111] text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              title="Hybrid Satellite with Streets"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">Hybrid</span>
            </button>
            <button
              onClick={() => setMapTypeId("satellite")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                mapTypeId === "satellite"
                  ? "bg-[#111111] text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              title="Pure Satellite Imagery"
            >
              <span className="text-[10px] font-bold">🛰️</span>
              <span className="text-[10px] hidden sm:inline">Satellite</span>
            </button>
            <button
              onClick={() => setMapTypeId("roadmap")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                mapTypeId === "roadmap"
                  ? "bg-[#111111] text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              title="Street Roadmap"
            >
              <span className="text-[10px] font-bold">🗺️</span>
              <span className="text-[10px] hidden sm:inline">Street</span>
            </button>
          </div>

          {/* Re-center Rider Location Button */}
          <button
            onClick={() => setRecenterTrigger((c) => c + 1)}
            className="w-9 h-9 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-[#FF5A36] hover:bg-neutral-50 transition-all active:scale-95"
            title="Re-center on Rider GPS"
          >
            <LocateFixed className="w-4 h-4" />
          </button>

          {/* Key Settings Button */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="w-9 h-9 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-[#FF5A36] hover:bg-neutral-50 transition-all active:scale-95"
            title="Google Maps API Key Settings"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-neutral-100 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2 text-[#111111]">
                <div className="w-8 h-8 rounded-xl bg-[#FF5A36]/10 text-[#FF5A36] flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm">Google Maps API Key</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              TownKart uses the official Google Maps JavaScript SDK to render real satellite imagery and turn-by-turn navigation for riders.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                  Enter Key (Production Key or Maps Demo Key)
                </label>
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-neutral-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 focus:border-[#FF5A36]"
                />
              </div>

              {keySaved && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-1.5 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Key saved! Map updated.</span>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#FF5A36] hover:bg-[#e04a28] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Save &amp; Load Real Map
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("townkart_gmaps_key");
                    setApiKey("");
                    setInputKey("");
                    setShowKeyModal(false);
                  }}
                  className="px-3 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Clear Key
                </button>
              </div>
            </form>

            <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 space-y-1">
              <div className="flex items-center gap-1 text-neutral-700 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Zero-Cost Prototyping Option</span>
              </div>
              <p>
                Get a free key without a credit card from the{" "}
                <a
                  href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF5A36] font-bold underline inline-flex items-center gap-0.5"
                >
                  Maps Demo Key Portal <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
