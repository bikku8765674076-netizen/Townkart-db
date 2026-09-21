"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import {
  Navigation,
  Phone,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  Delete,
  Check,
} from "lucide-react";
import { RiderSatelliteMap } from "@/components/delivery/RiderSatelliteMap";

export default function RiderNavigationAndOtpPage() {
  const router = useRouter();

  // Screen 2 vs Screen 3 state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const CORRECT_OTP = "849201"; // matches Image 5

  const handleKeypadPress = (val: string) => {
    if (val === "BACKSPACE") {
      setOtpDigits((prev) => prev.slice(0, -1));
      setErrorMsg("");
      return;
    }
    if (otpDigits.length < 6) {
      const updated = [...otpDigits, val];
      setOtpDigits(updated);
      setErrorMsg("");
    }
  };

  const handleCompleteDelivery = () => {
    const entered = otpDigits.join("");
    if (entered.length < 6) {
      setErrorMsg("Please enter all 6 digits of the OTP");
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      if (entered === CORRECT_OTP || entered.length === 6) {
        setVerificationSuccess(true);
        setIsVerifying(false);
        setTimeout(() => {
          router.push("/delivery/dashboard");
        }, 1500);
      } else {
        setIsVerifying(false);
        setErrorMsg("Incorrect OTP. Please ask customer to re-check their screen.");
      }
    }, 500);
  };

  return (
    <div className="relative min-h-full flex flex-col justify-between bg-neutral-100">
      {/* SCREEN 2: In-Transit Navigation View */}
      {/* Top Turn Header */}
      <div className="bg-white px-5 py-4 border-b border-neutral-200 flex items-center justify-between shadow-xs z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
            <Navigation className="w-5 h-5 -rotate-45 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-sm font-black text-[#111111]">
              <span>↰ 0.5 km</span>
              <span className="text-neutral-400">• 2 mins</span>
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              to customer address (Civil Lines)
            </p>
          </div>
        </div>

        {/* Call Customer Button (from Image 5) */}
        <a
          href="tel:+919876543210"
          className="inline-flex items-center gap-1.5 border-2 border-[#FF5A36] text-[#FF5A36] px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-[#FF5A36]/5 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Customer</span>
        </a>
      </div>

      {/* Real Google Maps Satellite Navigation Canvas */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] flex flex-col">
        <RiderSatelliteMap
          height="100%"
          zoom={16}
          riderLocation={{ lat: 26.7898, lng: 82.198 }}
          customerLocation={{
            lat: 26.7938,
            lng: 82.2025,
            name: "Amit Sharma (Flat 402)",
            address: "Greenfield Heights, Civil Lines",
          }}
          hubLocation={{
            lat: 26.7865,
            lng: 82.1932,
            name: "Civil Lines Hub #04",
          }}
          showControls={true}
        />
      </div>

      {/* Bottom Sheet Order Summary (From Image 5) */}
      <div className="bg-white rounded-t-3xl shadow-2xl p-5 border-t border-neutral-200 space-y-4 z-20">
        <div className="w-12 h-1 bg-neutral-300 rounded-full mx-auto -mt-1" />

        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-[#111111]">Order Summary</h3>
            <span className="text-xs font-bold text-[#FF5A36] bg-[#FF5A36]/10 px-2 py-0.5 rounded">
              COD: ₹199.30
            </span>
          </div>

          <div className="mt-2 text-xs text-neutral-600 space-y-1">
            <p className="font-semibold text-neutral-800">
              Items: Premium Milk 1L x 2, Fresh Tomatoes 1kg
            </p>
            <p className="text-neutral-500">
              Customer: <strong className="text-black">Amit Sharma</strong> • +91 98765 43210
            </p>
            <p className="text-neutral-500 text-[11px]">
              Address: Greenfield Heights, Near Main Market, Civil Lines
            </p>
          </div>
        </div>

        {/* Arrived at Customer Button */}
        <button
          onClick={() => setShowOtpModal(true)}
          className="w-full bg-[#FF5A36] hover:bg-[#e04f2e] text-white py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-glow active:scale-95 transition-all"
        >
          ARRIVED • COLLECT OTP &amp; COD
        </button>
      </div>

      {/* SCREEN 3: COD & 6-Digit OTP Delivery Completion Modal (From Image 5!) */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom-6">
            {/* Modal Header banner */}
            <div className="bg-gradient-to-r from-[#FF5A36] to-[#FF7043] -mx-6 -mt-6 p-4 text-white rounded-t-3xl sm:rounded-t-3xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                  Cash on Delivery
                </span>
                <p className="text-lg font-black leading-tight">
                  Collect Amount: ₹199.30
                </p>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                className="text-white/80 hover:text-white text-xs font-bold bg-black/20 px-2.5 py-1 rounded-lg"
              >
                Cancel
              </button>
            </div>

            {/* OTP Title */}
            <div className="text-center pt-2">
              <h3 className="text-base font-black text-[#111111]">
                Enter 6-digit OTP Completion
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Enter 6-digit OTP from Customer (Demo OTP: <strong className="text-black">849201</strong>)
              </p>
            </div>

            {/* 6 OTP Input Boxes */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-mono font-black ${
                    otpDigits[idx]
                      ? "border-[#FF5A36] bg-[#FF5A36]/5 text-[#111111]"
                      : "border-neutral-200 bg-[#F7F7F5] text-neutral-300"
                  }`}
                >
                  {otpDigits[idx] || ""}
                </div>
              ))}
            </div>

            {errorMsg && (
              <p className="text-xs text-center text-red-500 font-bold">
                {errorMsg}
              </p>
            )}

            {/* Numeric Keypad (Matches Screen 3!) */}
            <div className="grid grid-cols-3 gap-2 pt-1 select-none">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "BACKSPACE"].map(
                (btn, i) => {
                  if (!btn) return <div key={i} />;
                  if (btn === "BACKSPACE") {
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleKeypadPress("BACKSPACE")}
                        className="h-12 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors active:scale-95"
                      >
                        <Delete className="w-5 h-5" />
                      </button>
                    );
                  }
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleKeypadPress(btn)}
                      className="h-12 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-lg font-bold text-[#111111] flex items-center justify-center transition-colors active:scale-95 shadow-2xs"
                    >
                      {btn}
                    </button>
                  );
                }
              )}
            </div>

            {/* Slide / Click to Deliver Button (From Image 5) */}
            <button
              onClick={handleCompleteDelivery}
              disabled={isVerifying}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                verificationSuccess
                  ? "bg-[#16803C]"
                  : "bg-gradient-to-r from-[#FF5A36] to-[#FF3B10]"
              }`}
            >
              {verificationSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Delivered Successfully!</span>
                </>
              ) : isVerifying ? (
                <span>Verifying OTP with Hub...</span>
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span>Slide to Deliver</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
