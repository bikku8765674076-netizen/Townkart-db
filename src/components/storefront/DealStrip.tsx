"use client";

import React, { useState } from "react";
import { Sparkles, Check, Copy } from "lucide-react";

export function DealStrip() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText("HELLO10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="bg-[#F4F2EA] border border-[#E9E8E2] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[#171717] shadow-2xs text-lg flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#F7D928] fill-[#F7D928]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#171717]">
              A little something for your first basket
            </h3>
            <p className="text-xs text-[#72716C] mt-0.5">
              Save 10% on orders over ₹299. Applied at checkout automatically.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-white border border-dashed border-[#B4A72E] hover:border-[#171717] rounded-xl px-4 py-2 font-mono text-xs font-black text-[#171717] transition-all self-end sm:self-auto shadow-2xs"
        >
          <span>HELLO10</span>
          {copied ? (
            <span className="flex items-center gap-1 text-[#0C831F] text-[10px] font-sans font-bold">
              <Check className="w-3.5 h-3.5" /> Copied
            </span>
          ) : (
            <Copy className="w-3.5 h-3.5 text-neutral-400" />
          )}
        </button>
      </div>
    </section>
  );
}
