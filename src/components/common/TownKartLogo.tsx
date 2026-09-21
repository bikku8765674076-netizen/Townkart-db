import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function TownKartLogo({
  className = "",
  inverted = false,
  size = "md",
  href = "/",
}: LogoProps) {
  const iconDimensions = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }[size];

  const titleSize = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  }[size];

  const tagSize = {
    sm: "text-[8px] tracking-[0.18em]",
    md: "text-[10px] tracking-[0.2em]",
    lg: "text-[11px] tracking-[0.22em]",
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon: Orange Bag with white lightning & green live dot */}
      <div className="relative flex-shrink-0">
        <div
          className={`${iconDimensions} rounded-xl bg-[#FF5A36] flex items-center justify-center shadow-sm relative`}
        >
          {/* Bag Handle */}
          <div className="absolute -top-1.5 w-4 h-2 border-2 border-[#FF5A36] border-b-0 rounded-t-full" />
          
          {/* Lightning Bolt */}
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="w-5 h-5 text-white"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>

          {/* Green Live/Express Dot */}
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#16A34A] border-2 border-white" />
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className={`font-extrabold leading-none ${titleSize}`}>
          <span className={inverted ? "text-white" : "text-[#111111]"}>Town</span>
          <span className="text-[#FF5A36]">Kart</span>
        </div>
        <span
          className={`font-bold uppercase text-[#16A34A] font-sans mt-0.5 ${tagSize}`}
        >
          Local Town Express
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
