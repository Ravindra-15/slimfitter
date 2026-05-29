// Diabmukt - Pricing Section

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Phone } from "lucide-react";
import { getSubscriptionRedirect } from "../../../../utils/subscriptionGuard";
import { getPublicProgramPlans } from "../../../../services/programPlanPublicService";

const PROGRAM_ID = "diabmukt";

// 🏷️ Hardcoded per-program feature bullets (Diabmukt)
const features = [
  "Community Sessions",
  "health activity tracking",
  "sleep/water/steps/exercise tracking",
  "stand and move reminder",
];

const formatPrice = (n) => `$${Number(n || 0).toLocaleString("en-US")}`;

// 🧮 Monthly display price — handles both fixed and weekly plans
const calcMonthlyPrice = (plan) => {
  // Weekly plan: price at minWeeks, converted to per-month
  if ((plan.pricingType || "fixed") === "weekly") {
    const base = Number(plan.baseRatePerWeek) || 0;
    const weeks = Number(plan.minWeeks) || 1;

    // best discount applicable at minWeeks
    let discount = 0;
    if (Array.isArray(plan.breakpoints)) {
      plan.breakpoints.forEach((bp) => {
        if (weeks >= bp.minWeeks && bp.discountPercent > discount) {
          discount = bp.discountPercent;
        }
      });
    }
    const total = base * weeks * (1 - discount / 100);
    const months = Math.max(1, Math.round(weeks / 4));
    return Math.round(total / months);
  }

  // Fixed plan
  let months = 1;
  if (plan.durationMonths && Number(plan.durationMonths) > 0) {
    months = Number(plan.durationMonths);
  } else {
    const name = String(plan.planName || "");
    const m = name.match(/(\d+)\s*month/i);
    const w = name.match(/(\d+)\s*week/i);
    if (m) months = parseInt(m[1], 10);
    else if (w) months = Math.max(1, Math.round(parseInt(w[1], 10) / 4));
  }
  if (months <= 0) return plan.offerPrice;
  return Math.round(plan.offerPrice / months);
};

export default function PricingSection() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const fetched = await getPublicProgramPlans(PROGRAM_ID, {
          landingOnly: true,
        });
        if (!mounted) return;
        setPlans(fetched || []);
      } catch (err) {
        console.error("Failed to load plans:", err);
        if (mounted) setPlans([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // 🎯 Pick the cheapest visible plan for landing display
  const cheapestPlan =
    plans.length > 0
      ? [...plans].sort(
          (a, b) => calcMonthlyPrice(a) - calcMonthlyPrice(b)
        )[0]
      : null;

  const handleGetStarted = () => {
    const intendedPath = `/programs/${PROGRAM_ID}/tenure`;
    const redirect = getSubscriptionRedirect(intendedPath);
    navigate(redirect || intendedPath);
  };

  const handleConnect = () => {
    // 🔗 Scroll to callback section on landing
    const el = document.getElementById("callback");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADING */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A]">
            Simple,{" "}
            <span className="text-[#4F46E5]">transparent pricing</span>
          </h2>
        </div>

        {/* CARDS ROW */}
        {loading ? (
          <p className="text-center text-sm text-gray-400 py-10">
            Loading plans...
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 sm:gap-6 items-stretch">
            {/* LEFT — Price + Features Card */}
            <div className="bg-white rounded-3xl border border-[#D9DDF0] px-6 sm:px-8 lg:px-10 py-7 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
              {/* Price block */}
              <div className="flex flex-col items-start">
                <div className="flex items-start">
                  <span className="text-[36px] sm:text-[42px] lg:text-[48px] font-bold text-[#0F172A] leading-none">
                    {cheapestPlan
                      ? formatPrice(calcMonthlyPrice(cheapestPlan))
                      : "$0"}
                  </span>
                  <span className="text-[12px] sm:text-[13px] text-[#475569] font-medium ml-1 mt-2">
                    /month
                  </span>
                  <span className="text-red-500 text-xs ml-0.5 mt-1">*</span>
                </div>

                <button
                  onClick={handleGetStarted}
                  className="mt-5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[13px] sm:text-sm font-semibold px-6 sm:px-7 py-2.5 rounded-full shadow-[0_6px_18px_rgba(79,70,229,0.28)] transition-all"
                >
                  Get Started
                </button>
              </div>

              {/* Features list */}
              <ul className="flex flex-col gap-2.5 sm:gap-3 w-full sm:w-auto">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-[#0F172A] text-sm lg:text-xl sm:text-[15px] font-medium"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-[#4F46E5] flex-shrink-0"
                      strokeWidth={2.2}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT — Contact Us Card */}
            <div className="bg-gradient-to-br from-[#4F46E5] to-[#6366F1] rounded-3xl px-6 sm:px-7 py-7 sm:py-8 flex flex-col items-center text-center text-white shadow-[0_8px_24px_rgba(79,70,229,0.22)]">
              <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center mb-3">
                <Phone size={20} className="text-white" strokeWidth={2.2} />
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Contact Us !
              </h3>

              <p className="text-white/90 text-xs sm:text-sm leading-relaxed mb-5 max-w-[260px]">
                Not sure about selecting the program tenure , Dont worry we
                will help you out !
              </p>

              <button
                onClick={handleConnect}
                className="bg-white hover:bg-[#F6F8FC] text-[#4F46E5] text-sm font-semibold px-7 py-2.5 rounded-full transition-colors shadow-sm"
              >
                Connect
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}