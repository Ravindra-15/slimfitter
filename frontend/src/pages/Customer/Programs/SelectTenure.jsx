/**
 * Customer — Select Tenure / Design Your Recovery Path
 * Weekly programs (diabmukt/mommyfit/slimfitter): slider to pick weeks.
 * Fixed programs (yogat20): falls back to plan cards.
 */

import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar } from "lucide-react";
import { getPublicProgramPlans } from "../../../services/programPlanPublicService";
import { getSubscriptionRedirect } from "../../../utils/subscriptionGuard";
import SubscriptionCallbackCTA from "./components/SubscriptionCallbackCTA";

const programNames = {
  yogat20: "Yoga T20",
  diabmukt: "Diabmukt",
  mommyfit: "MommyFit",
  slimfitter: "Slimfitter",
};

const formatPrice = (n) => `$${Number(n || 0).toLocaleString("en-US")}`;

// 🧮 Discount for a given weeks count (mirrors backend logic)
const getDiscount = (breakpoints, weeks) => {
  let discount = 0;
  let badge = "";
  if (Array.isArray(breakpoints)) {
    breakpoints.forEach((bp) => {
      if (weeks >= bp.minWeeks && bp.discountPercent > discount) {
        discount = bp.discountPercent;
        badge = bp.badgeText || `${bp.discountPercent}% off`;
      }
    });
  }
  return { discount, badge };
};

const calcWeeklyPrice = (plan, weeks) => {
  const base = Number(plan.baseRatePerWeek) || 0;
  const { discount } = getDiscount(plan.breakpoints, weeks);
  return Math.round(base * weeks * (1 - discount / 100));
};

export default function SelectTenure() {
  const { id } = useParams();
  const navigate = useNavigate();
  const programName = programNames[id] || id;

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeks, setWeeks] = useState(null);

  // 🙋 First name for heading
  let firstName = "";
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;
    firstName = user?.nickName || user?.fullName?.split(" ")[0] || "";
  } catch {
    firstName = "";
  }

  // 📥 Fetch plans
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetched = await getPublicProgramPlans(id);
        if (!mounted) return;
        setPlans(fetched || []);
      } catch (err) {
        console.error("Failed to load plans:", err);
        if (mounted) setError("Failed to load plans. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (id) load();
    return () => {
      mounted = false;
    };
  }, [id]);

  // 🟦 The weekly plan (if this program is weekly)
  const weeklyPlan = useMemo(
    () => plans.find((p) => (p.pricingType || "fixed") === "weekly") || null,
    [plans]
  );

  // 🟧 Fixed plans (yogat20)
  const fixedPlans = useMemo(
    () => plans.filter((p) => (p.pricingType || "fixed") === "fixed"),
    [plans]
  );

  // 🎚️ Initialize slider to minWeeks once weekly plan loads
  useEffect(() => {
    if (weeklyPlan && weeks === null) {
      setWeeks(weeklyPlan.minWeeks || 5);
    }
  }, [weeklyPlan, weeks]);

  // 🟦 WEEKLY: continue to checkout
  const handleWeeklyContinue = () => {
    const amount = calcWeeklyPrice(weeklyPlan, weeks);
    const intendedPath = `/programs/${id}/checkout`;
    const redirect = getSubscriptionRedirect(intendedPath);
    if (redirect) {
      navigate(redirect);
      return;
    }
    navigate(intendedPath, {
      state: {
        programId: id,
        programName,
        pricingType: "weekly",
        weeks,
        tenure: `${weeks} Weeks`,
        price: amount,
      },
    });
  };

  // 🟧 FIXED: select a plan
  const handleFixedSelect = (plan) => {
    navigate(`/programs/${id}/checkout`, {
      state: {
        programId: id,
        programName,
        pricingType: "fixed",
        tenure: plan.planName,
        price: plan.offerPrice,
        originalPrice: plan.originalPrice,
        offerBadge: plan.offerBadge,
        planId: plan._id,
      },
    });
  };

  // ════════ LOADING / ERROR ════════
  if (loading) {
    return (
      <div className="min-h-screen bg-[#EEEAF7] flex items-center justify-center px-4">
        <p className="text-sm text-gray-500">Loading plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EEEAF7] flex items-center justify-center px-4">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  // ════════════════════════════════════════
  // 🟦 WEEKLY SLIDER VIEW
  // ════════════════════════════════════════
  if (weeklyPlan && weeks !== null) {
    const min = weeklyPlan.minWeeks || 5;
    const max = weeklyPlan.maxWeeks || 24;
    const amount = calcWeeklyPrice(weeklyPlan, weeks);
    const pct = max > min ? ((weeks - min) / (max - min)) * 100 : 0;

    // Marker positions for each breakpoint (for the red badges under track)
    const markers = (weeklyPlan.breakpoints || [])
      .filter((bp) => bp.minWeeks >= min && bp.minWeeks <= max)
      .map((bp) => ({
        ...bp,
        left: max > min ? ((bp.minWeeks - min) / (max - min)) * 100 : 0,
      }));

    return (
      <div className="min-h-screen bg-[#EEEAF7] px-4 py-10">
        <div className="w-full max-w-[820px] mx-auto flex flex-col gap-5">
        <div className="bg-white rounded-3xl shadow-xl w-full px-6 sm:px-10 py-9">
          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">
              Design your Recovery Path
            </h2>
            <p className="text-sm text-[#6B7280]">
              {firstName ? (
                <>
                  Hey{" "}
                  <span className="text-[#4E4391] font-semibold">
                    {firstName}
                  </span>
                  ,{" "}
                </>
              ) : null}
              Select your Program Duration . Minimum Commitment should be{" "}
              {min} weeks
            </p>
          </div>

          {/* Selected tenure box */}
          <div className="border border-[#D6D1EC] rounded-2xl px-5 py-4 flex items-center justify-between mb-8 max-w-sm mx-auto">
            <span className="text-sm text-gray-400">Selected Tenure</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#0F172A]">
                {weeks} Weeks
              </span>
              <Calendar size={20} className="text-[#4E4391]" />
            </div>
          </div>

          {/* Slider */}
          <div className="px-2 mb-2">
            <input
              type="range"
              min={min}
              max={max}
              step={1}
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="w-full accent-[#4E4391] cursor-pointer"
              style={{
                background: `linear-gradient(to right, #4E4391 ${pct}%, #E5E7EB ${pct}%)`,
              }}
            />
          </div>

          {/* Breakpoint markers */}
          <div className="relative h-12 mb-6 px-2">
            {markers.map((m) => (
              <div
                key={m.minWeeks}
                className="absolute -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${m.left}%` }}
              >
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mb-1 whitespace-nowrap">
                  {m.badgeText || `${m.discountPercent}% off`}
                </span>
                <span className="text-[10px] text-gray-500 whitespace-nowrap">
                  {m.minWeeks}w
                </span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="text-center mb-7">
            <span className="text-[34px] sm:text-[40px] font-bold text-[#0F172A] leading-none">
              {formatPrice(amount)}
            </span>
            <p className="text-xs text-gray-400 mt-1">
              for {weeks} weeks ({formatPrice(weeklyPlan.baseRatePerWeek)}/week
              base)
            </p>
          </div>

         {/* Continue */}
          <button
            onClick={handleWeeklyContinue}
            className="w-full bg-[#4E4391] hover:bg-[#4E4391] text-white text-sm font-semibold py-3.5 rounded-full transition-colors shadow-[0_6px_18px_rgba(90,79,159,0.3)]"
          >
            Continue
          </button>
       </div>

        {/* Callback CTA below the slider card */}
        <SubscriptionCallbackCTA programId={id} />
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════
  // 🟧 FIXED PLAN VIEW (yogat20)
  // ════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-900/80 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl px-6 sm:px-10 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">
            Select your Tenure
          </h2>
          <p className="text-sm text-[#6B7280]">
            {firstName ? (
              <>
                Hey{" "}
                <span className="text-[#4E4391] font-semibold">
                  {firstName}
                </span>
                ,{" "}
              </>
            ) : null}
            Select your Program Duration
          </p>
        </div>

        {fixedPlans.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-10">
            No plans available for this program yet.
          </p>
        ) : (
          <div
            className={`grid gap-4 ${
              fixedPlans.length === 1
                ? "grid-cols-1 max-w-sm mx-auto"
                : fixedPlans.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {fixedPlans.map((plan) => {
              const hasDiscount =
                plan.originalPrice && plan.originalPrice > plan.offerPrice;
              return (
                <div
                  key={plan._id}
                  onClick={() => handleFixedSelect(plan)}
                  className="border border-[#D6D1EC] rounded-2xl p-5 hover:border-[#4E4391] hover:shadow-[0_8px_22px_rgba(90,79,159,0.18)] transition-all cursor-pointer flex flex-col"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#0F172A] text-base">
                      {plan.planName}
                    </span>
                    {plan.offerBadge && (
                      <span className="bg-[#4E4391] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {plan.offerBadge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs text-gray-400 line-through mb-1 ${
                      hasDiscount ? "" : "invisible"
                    }`}
                  >
                    {formatPrice(plan.originalPrice)}
                  </p>
                  <p className="text-2xl font-bold text-[#0F172A] mb-4">
                    {formatPrice(plan.offerPrice)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFixedSelect(plan);
                    }}
                    className="mt-auto w-full bg-[#4E4391] hover:bg-[#4E4391] text-white text-sm font-semibold py-2.5 rounded-full transition-colors shadow-[0_4px_14px_rgba(90,79,159,0.32)]"
                  >
                    Select Plan
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}