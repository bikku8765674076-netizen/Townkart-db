"use client";

import Link from "next/link";
import { ShieldOff, Home, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mb-6">
        <ShieldOff className="w-10 h-10 text-red-500" />
      </div>
      <h1 className="text-3xl font-extrabold text-[#111111] mb-2">Access Denied</h1>
      <p className="text-neutral-500 max-w-sm mb-8">
        You don&apos;t have permission to view this page. Please log in with an account that has the required access.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-all"
        >
          <Home className="w-4 h-4" /> Go Home
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5A36] rounded-xl text-sm font-bold text-white hover:bg-[#e04a28] transition-all"
        >
          <LogIn className="w-4 h-4" /> Sign In
        </Link>
      </div>
    </div>
  );
}
