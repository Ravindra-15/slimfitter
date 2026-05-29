// Diabmukt - "Track Your Daily Wins" Section

import { useRef, useEffect } from "react";
import { PersonStanding, Moon, Droplet, Footprints } from "lucide-react";

const trackingItems = [
  {
    id: 1,
    icon: PersonStanding,
    title: "Yoga Tracking",
    description:
      "Cultivate mental clarity and physical flexibility through structured daily practice",
  },
  {
    id: 2,
    icon: Moon,
    title: "Sleep Monitoring",
    description:
      "Optimize your body's natural recovery and metabolic repair through quality",
  },
  {
    id: 3,
    icon: Droplet,
    title: "Water Intake",
    description:
      "Maintain peak cellular hydration to support detoxification and steady energy levels",
  },
  {
    id: 4,
    icon: Footprints,
    title: "Step Counter",
    description:
      "Drive active fat loss and heart health through consistent, low-impact movement",
  },
];

export default function TrackDailyWinsSection() {
  const scrollRef = useRef(null);

  // Auto-center the 2nd card on mobile mount
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (window.innerWidth >= 640) return; // only on mobile

    const secondCard = el.children[1];
    if (secondCard) {
      const scrollLeft =
        secondCard.offsetLeft - (el.clientWidth - secondCard.clientWidth) / 2;
      el.scrollTo({ left: scrollLeft, behavior: "instant" });
    }
  }, []);

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* HEADING */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A]">
            Track Your Daily Wins in{" "}
            <span className="text-[#4F46E5]">Under 30 Seconds</span>
          </h2>
        </div>

        {/* DESKTOP / TABLET GRID — hidden on mobile */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {trackingItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E7EAF3] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)] transition-shadow px-5 py-7 sm:px-6 sm:py-8 flex flex-col items-center text-center min-h-[260px] sm:min-h-[280px] lg:min-h-[300px]"
              >
                <div className="mb-4 sm:mb-5">
                  <Icon size={32} className="text-[#4F46E5]" strokeWidth={2} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-3 sm:mb-4">
                  {item.title}
                </h3>
                <p className="text-[#475569] text-xl leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE HORIZONTAL SCROLL — full screen width, no max container */}
      <div className="sm:hidden mt-2">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-[18%] py-6"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {trackingItems.map((item, idx) => {
            const Icon = item.icon;
            const isCenter = idx === 1;
            return (
              <div
                key={item.id}
                className={`flex-shrink-0 w-[72%] snap-center bg-white rounded-2xl border border-[#E7EAF3] px-5 py-6 flex flex-col items-center text-center min-h-[230px] transition-transform duration-300 ${
                  isCenter
                    ? "scale-[1.06] shadow-[0_0_40px_rgba(79,70,229,0.20)] border-[#E0DEFB]"
                    : "scale-100 shadow-[0_0_20px_rgba(0,0,0,0.05)]"
                }`}
              >
                <div className="mb-4">
                  <Icon size={32} className="text-[#4F46E5]" strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#475569] text-sm leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hide scrollbar across browsers */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
