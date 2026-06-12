/**
 * CUSTOMER MODULE — Hero Search Block (Book Doctor page)
 *
 * Orange hero panel: "Find the right expert for your journey" + search bar.
 * Below: clickable specialty chips that filter the doctor list.
 */

import React from "react";
import { Search } from "lucide-react";

// ============================================
// 🏷️ SPECIALTY CHIPS (matches Figma)
// ============================================
const SPECIALTIES = [
  "General Medicine",
  "Mental Health",
  "Pediatrics & Obstetrics",
  "Surgery",
  "Panchakarma",
  "PCOS",
  "Metabolic Health",
  "Diabetes Care",
];

const HeroSearch = ({
  search,
  onSearchChange,
  specialty,
  onSpecialtyChange,
}) => {
  const toggleSpecialty = (value) => {
    // Click again to clear (toggle off)
    onSpecialtyChange(specialty === value ? "" : value);
  };

 return (
  <div className="space-y-5">
    {/* ============================================ */}
    {/* 🟣 HERO SECTION */}
    {/* ============================================ */}
    <div className="relative pb-8 sm:pb-10">
      {/* Hero panel */}
      <div
        className="
          relative overflow-hidden
          bg-[#5A4F9F]
          rounded-[28px]
          px-5 sm:px-8 py-12 sm:py-16
          shadow-[0_10px_30px_rgba(78,67,145,0.18)]
        "
      >
        
        {/* 🔗 How to book — scrolls to the 3-step section */}
      <button
        type="button"
        onClick={() =>
          document.getElementById("how-to-book")?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 text-[11px] sm:text-xs font-semibold text-white/90 hover:text-white underline underline-offset-2 transition-colors"
      >
        How to book?
      </button>

      <h1 className="relative text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center tracking-tight">
        Find the right expert for your journey.
      </h1>
      <p className="relative text-white/80 text-center mt-3 text-sm sm:text-base">
          Connect with trusted doctors and specialists instantly.
        </p>
    </div>

      {/* Search Bar */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[95%] max-w-4xl px-2">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by symptom or specialty"
            className="
              w-full pl-6 pr-16 py-4 sm:py-5
              bg-white rounded-full
              text-sm sm:text-base text-[#1F2937] placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-[#4E4391]/30
              shadow-[0_10px_30px_rgba(0,0,0,0.08)]
              border border-[#ECEFF5]
            "
          />

          <button
            type="button"
            aria-label="Search"
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              w-11 h-11 sm:w-12 sm:h-12 rounded-full
              bg-[#4E4391] text-white
              flex items-center justify-center
              hover:bg-[#4E4391] transition-all duration-200
              shadow-md
            "
          >
            <Search size={18} />
          </button>
        </div>
      </div>
    </div>

    {/* ============================================ */}
    {/* 🏷️ SPECIALTY CHIPS */}
    {/* ============================================ */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {SPECIALTIES.map((item) => {
        const isActive = specialty === item;

        return (
          <button
            key={item}
            type="button"
            onClick={() => toggleSpecialty(item)}
            className={`
              w-full px-4 py-3 rounded-2xl
              text-xs sm:text-sm font-medium
              border transition-all duration-200
              ${
                isActive
                  ? "bg-[#4E4391] text-white border-[#4E4391] shadow-[0_6px_18px_rgba(78,67,145,0.22)]"
                  : "bg-white text-[#374151] border-[#E3DFF0] hover:border-[#4E4391]/40 hover:bg-[#EFEDFA]"
              }
            `}
          >
            {item}
          </button>
        );
      })}
    </div>

    {/* 🔄 Active filter */}
    {specialty && (
      <p className="text-sm text-[#6B7280]">
        Filtering by{" "}
        <span className="font-semibold text-[#4E4391]">
          {specialty}
        </span>
        {" — "}
        <button
          type="button"
          onClick={() => onSpecialtyChange("")}
          className="text-[#4E4391] hover:underline font-medium"
        >
          clear
        </button>
      </p>
    )}
  </div>
);
};

export default HeroSearch;