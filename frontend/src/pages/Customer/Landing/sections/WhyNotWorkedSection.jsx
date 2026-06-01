// Slimfitter - "Why It Hasn't Worked Yet" Section

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reasons = [
  {
    title: "Tried Dieting But Failed ?",
    image: "/images/dietingfailed.png",
  },
  {
    title: "Lack Of Consistency ?",
    image: "/images/consistency.png",
  },
  {
    title: "No Expert Guidance ?",
    image: "/images/expertguidence.png",
  },
];

// 🃏 Single card — `active` controls hover/pop styling
const ReasonCard = ({ c, active }) => (
  <div
    className={`rounded-2xl overflow-hidden border bg-white transition-all duration-300 ${
      active
        ? "border-[#C9C3E8] shadow-[0_12px_32px_rgba(90,79,159,0.18)]"
        : "border-gray-100 shadow-[0_1px_3px_rgba(16,24,40,0.04)]"
    }`}
  >
    <div className="w-full h-[220px] sm:h-[240px] lg:h-[250px] flex items-start justify-center">
      <img
        src={c.image}
        alt={c.title}
        className="w-full h-full object-cover object-center"
      />
    </div>

    <div className="px-5 sm:px-6 py-4 text-center">
      <h3 className="font-bold text-[#1F2937] text-[15px] sm:text-[17px] leading-tight">
        {c.title}
      </h3>
    </div>
  </div>
);

export default function WhyNotWorkedSection() {
  const [active, setActive] = useState(1);
  const scrollRef = useRef(null);
  const isProgrammatic = useRef(false);

  // 📱 Scroll mobile row so card `index` is centered
  const centerCard = (index, behavior = "smooth") => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-card]");
    const target = cards[index];
    if (!target) return;
    const left =
      target.offsetLeft + target.offsetWidth / 2 - el.clientWidth / 2;

    isProgrammatic.current = true;
    el.scrollTo({ left, behavior });
    setTimeout(() => {
      isProgrammatic.current = false;
    }, 450);
  };

  const prev = () => {
    const target = active === 0 ? reasons.length - 1 : active - 1;
    setActive(target);
    centerCard(target);
  };

  const next = () => {
    const target = active === reasons.length - 1 ? 0 : active + 1;
    setActive(target);
    centerCard(target);
  };

  // 📱 Initial center on mount — wait for images so widths are real
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const doCenter = () => centerCard(1, "instant");

    doCenter();
    const imgs = el.querySelectorAll("img");
    let pending = imgs.length;
    if (pending === 0) return;
    imgs.forEach((img) => {
      if (img.complete) {
        pending -= 1;
        if (pending === 0) doCenter();
      } else {
        img.addEventListener("load", () => {
          pending -= 1;
          if (pending === 0) doCenter();
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 📱 Update active from manual scroll — debounced, ignored while programmatic
  const scrollTimer = useRef(null);
  const handleScroll = () => {
    if (isProgrammatic.current) return;
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const el = scrollRef.current;
      if (!el) return;
      const containerCenter = el.scrollLeft + el.clientWidth / 2;
      const cards = el.querySelectorAll("[data-card]");
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(cardCenter - containerCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActive(closest);
    }, 120);
  };

  return (
    <section className="py-8 sm:py-12 lg:py-2 bg-white">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-10 lg:px-16">
        {/* 💻 DESKTOP / TABLET — 3-card grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
          {reasons.map((c, i) => (
            <ReasonCard key={c.title} c={c} active={i === 1} />
          ))}
        </div>

        {/* 📱 MOBILE — horizontal scroll, center card highlighted */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="md:hidden flex gap-4 overflow-x-auto pb-4 mb-6 scrollbar-hide -mx-5 px-5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reasons.map((c, i) => (
            <div
              key={c.title}
              data-card
              className="flex-shrink-0 w-[78%]"
            >
              <ReasonCard c={c} active={i === active} />
            </div>
          ))}
        </div>

        {/* Arrows — mobile only */}
        <div className="md:hidden flex justify-center gap-3">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#4E4391] hover:text-[#4E4391] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#4E4391] hover:text-[#4E4391] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}