"use client";

import React, { useState, useEffect } from "react";
import { MapPin, X, Navigation, CheckCircle2 } from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocality: string;
  onSelectLocality: (locality: string, pincode: string) => void;
}

const TOWN_LOCALITIES = [
  { name: "Civil Lines, Ward 12", pincode: "272001", est: "10-15 mins" },
  { name: "Anand Vihar, Sector 4", pincode: "272001", est: "12-18 mins" },
  { name: "Station Road, Ward 5", pincode: "272002", est: "15-20 mins" },
  { name: "Gandhi Nagar Market", pincode: "272001", est: "10-15 mins" },
  { name: "Purani Basti, Main Chowk", pincode: "272002", est: "18-25 mins" },
  { name: "Malviya Road Hub", pincode: "272001", est: "10-15 mins" },
];

export function LocationModal({
  isOpen,
  onClose,
  currentLocality,
  onSelectLocality,
}: LocationModalProps) {
  const [detecting, setDetecting] = useState(false);
  const [search, setSearch] = useState("");
  const [detectedSuccess, setDetectedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDetect = () => {
    setDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setDetecting(false);
          setDetectedSuccess(true);
          setTimeout(() => {
            onSelectLocality("Civil Lines, Ward 12", "272001");
            onClose();
          }, 600);
        },
        () => {
          // Fallback to default town locality if permission denied
          setDetecting(false);
          onSelectLocality("Civil Lines, Ward 12", "272001");
          onClose();
        }
      );
    } else {
      setDetecting(false);
      onSelectLocality("Civil Lines, Ward 12", "272001");
      onClose();
    }
  };

  const filtered = TOWN_LOCALITIES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.pincode.includes(search)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#F7D928]/20 flex items-center justify-center text-[#171717] flex-shrink-0">
            <MapPin className="w-6 h-6 text-[#0C831F]" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#171717]">
              Welcome to TownKart
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
              Please provide your delivery location to see products at your nearby dark store
            </p>
          </div>
        </div>

        {/* Action: Detect location */}
        <div className="space-y-3">
          <button
            onClick={handleDetect}
            disabled={detecting}
            className="w-full flex items-center justify-center gap-2 bg-[#0C831F] hover:bg-[#0a6f1a] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition-colors"
          >
            {detectedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Location Detected!</span>
              </>
            ) : (
              <>
                <Navigation className={`w-4 h-4 ${detecting ? "animate-spin" : ""}`} />
                <span>{detecting ? "Detecting GPS..." : "Detect my location"}</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 my-2">
            <div className="h-px bg-neutral-200 flex-1" />
            <span className="text-[11px] font-bold text-neutral-400 uppercase">OR</span>
            <div className="h-px bg-neutral-200 flex-1" />
          </div>

          <div>
            <input
              type="text"
              placeholder="Search delivery locality or PIN code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F] bg-[#F7F7F5]"
            />
          </div>
        </div>

        {/* Localities List */}
        <div className="mt-4 max-h-56 overflow-y-auto divide-y divide-neutral-100 pr-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-2">
            Serviceable Town Localities
          </p>
          {filtered.map((loc) => {
            const isSelected = currentLocality.includes(loc.name.split(",")[0]);
            return (
              <button
                key={loc.name}
                onClick={() => {
                  onSelectLocality(loc.name, loc.pincode);
                  onClose();
                }}
                className={`w-full text-left py-2.5 px-2 rounded-xl flex items-center justify-between transition-colors hover:bg-neutral-50 ${
                  isSelected ? "bg-[#0C831F]/5 text-[#0C831F]" : "text-neutral-700"
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-[#171717]">{loc.name}</p>
                  <p className="text-[10px] text-neutral-400 font-medium">
                    PIN {loc.pincode} • Instant delivery
                  </p>
                </div>
                <span className="text-[10px] font-black text-[#0C831F] bg-[#0C831F]/10 px-2 py-0.5 rounded-full">
                  ⏱ {loc.est}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
