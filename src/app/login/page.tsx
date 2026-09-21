"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TownKartLogo } from "@/components/common/TownKartLogo";
import { Eye, EyeOff, Mail, Lock, Phone, User, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

type Mode = "login" | "register";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register extra fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => { setError(""); }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = mode === "login"
      ? { email, password }
      : { name, email, phone, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // On success — refresh auth state then navigate
      // Dispatch a storage event so AuthContext re-fetches /api/auth/me
      window.dispatchEvent(new Event("townkart_auth_changed"));

      // Role-based redirect
      const role: string = data.role ?? "CUSTOMER";
      if (role === "SUPER_ADMIN" || role === "SUPERVISOR" || role === "ADMIN") {
        router.push("/admin");
      } else if (role === "DELIVERY_PARTNER") {
        router.push("/delivery/dashboard");
      } else {
        router.push(redirect);
      }

      router.refresh();
    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center px-4 py-12">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#111111] px-8 pt-8 pb-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #FF5A36 0%, transparent 60%)" }} />
          <div className="relative">
            <TownKartLogo size="lg" inverted={true} />
            <p className="text-neutral-400 text-sm mt-2">Everything you need. Right around the corner.</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex border-b border-neutral-100">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
              mode === "login"
                ? "text-[#FF5A36] border-b-2 border-[#FF5A36] bg-[#FF5A36]/5"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
              mode === "register"
                ? "text-[#FF5A36] border-b-2 border-[#FF5A36] bg-[#FF5A36]/5"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
              <span className="text-red-500 mt-0.5">⚠</span>
              {error}
            </div>
          )}

          {/* Name (register only) */}
          {mode === "register" && (
            <div>
              <label className="text-xs font-bold text-neutral-600 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amit Sharma"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#F7F7F5] border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 focus:border-[#FF5A36] transition-all"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-neutral-600 mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 bg-[#F7F7F5] border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 focus:border-[#FF5A36] transition-all"
              />
            </div>
          </div>

          {/* Phone (register only) */}
          {mode === "register" && (
            <div>
              <label className="text-xs font-bold text-neutral-600 mb-1.5 block">Mobile Number</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm font-semibold flex items-center gap-1">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-500">+91</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9876543210"
                  required
                  maxLength={10}
                  className="w-full pl-16 pr-4 py-3 bg-[#F7F7F5] border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 focus:border-[#FF5A36] transition-all"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-600">Password</label>
              {mode === "login" && (
                <button type="button" className="text-xs text-[#FF5A36] font-semibold hover:underline">
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "Min 8 characters" : "Enter password"}
                required
                minLength={mode === "register" ? 8 : 1}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full pl-10 pr-11 py-3 bg-[#F7F7F5] border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 focus:border-[#FF5A36] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === "register" && (
              <p className="text-[11px] text-neutral-400 mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                Your password is encrypted and stored securely.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF5A36] hover:bg-[#e04a28] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-[#FF5A36]/20 mt-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {mode === "login" ? "Signing in…" : "Creating account…"}</>
            ) : (
              <>{mode === "login" ? "Sign In" : "Create Account"} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          {/* Quick test credentials hint */}
          {mode === "login" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 space-y-1">
              <p className="font-bold text-amber-900">🔑 Test Credentials</p>
              <p><span className="font-semibold">Customer:</span> amit.sharma@example.com</p>
              <p><span className="font-semibold">Admin:</span> admin@townkart.in</p>
              <p><span className="font-semibold">Rider:</span> dinesh.rider@townkart.in</p>
              <p className="text-amber-700 font-semibold mt-1">Password: TownKart@123</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-8 pb-6 text-center text-xs text-neutral-500">
          {mode === "login" ? (
            <>Don&apos;t have an account?{" "}
              <button onClick={() => setMode("register")} className="text-[#FF5A36] font-bold hover:underline">
                Register free
              </button>
            </>
          ) : (
            <>Already registered?{" "}
              <button onClick={() => setMode("login")} className="text-[#FF5A36] font-bold hover:underline">
                Sign in
              </button>
            </>
          )}
        </div>
      </div>

      {/* Back to home */}
      <Link href="/" className="mt-6 text-sm text-neutral-500 hover:text-neutral-800 transition-colors">
        ← Back to TownKart
      </Link>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F7F7F5]"><Loader2 className="w-6 h-6 animate-spin text-[#FF5A36]" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
