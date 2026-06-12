/**
 * CUSTOMER MODULE — How to Book section
 *
 * 3-step explainer: Discover → Reserve → Secure.
 * Static content; pure visual section.
 */

import React from "react";
import { Search, Calendar, Sparkles } from "lucide-react";

// ============================================
// 📋 3 STEPS
// ============================================
const STEPS = [
  {
    icon: Search,
    title: "Discover & Select",
    description:
      "Browse a vetted directory of healthcare professionals specialized in your concern.",
  },
  {
    icon: Calendar,
    title: "Reserve Your Slot",
    description:
      "View real-time availability calendars and select a consultation slot that fits your daily routine.",
  },
  {
    icon: Sparkles,
    title: "Secure Your Booking",
    description:
      "Complete your booking with a $20 consultation fee. Get instant confirmation by email.",
  },
];

const HowToBook = () => {
  return (
    <section className="py-12 sm:py-16">
  {/* 🏷️ Heading */}
  <div className="text-center mb-12">
    <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] tracking-tight">
      How to book{" "}
      <span className="text-[#4E4391]">
        Doctor Consultation !
      </span>
    </h2>

    <p className="text-sm text-[#6B7280] mt-2">
      Book a Doctor with Simple 3 Steps
    </p>

    {/* 🔝 Back to search bar */}
    <button
      type="button"
      onClick={() =>
        document.getElementById("search-top")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      className="mt-3 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#4E4391] hover:opacity-80 hover:underline transition-all"
    >
      ↑ Back to search
    </button>
  </div>

  {/* ============================================ */}
  {/* 🔢 STEPS GRID */}
  {/* ============================================ */}
  <div className="relative max-w-5xl mx-auto">
    {/* 📏 Connecting dotted line */}
    <div
      className="
        hidden md:block absolute
        top-10 left-[16.66%] right-[16.66%]
        h-px border-t-2 border-dashed
        border-[#D6D1EC]
        pointer-events-none
      "
      aria-hidden="true"
    />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative">
      {STEPS.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="text-center flex flex-col items-center"
        >
          {/* Icon */}
          <div
            className="
              relative z-10
              w-[78px] h-[78px]
              rounded-full
              bg-gradient-to-r from-[#4E4391] to-[#4E4391]
              flex items-center justify-center
              shadow-[0_10px_25px_rgba(78,67,145,0.22)]
              ring-4 ring-white
            "
          >
            <Icon size={28} className="text-white" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-[#1F2937] mt-5">
            {title}
          </h3>

          {/* Description */}
          <p
            className="
              text-sm text-[#6B7280]
              mt-2 max-w-[270px]
              mx-auto leading-relaxed
            "
          >
            {description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
  );
};

export default HowToBook;