// Diabmukt Programs - Program Dashboard
// Single daily video stream (no yoga-type queues) + 24hr cooldown
// Uses real clinical videos from admin CMS + real upcoming appointment
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

import { Play, Check, Plus, Bell, Calendar, ChevronUp, Stethoscope, Lock, Gift, Video, Clock, X } from "lucide-react";
import HabitTrackerForm from "./components/HabitTrackerForm";
import toast from "react-hot-toast";

import CustomerNavbar from "../../../components/customer/layout/CustomerNavbar";
import CustomerFooter from "../../../components/customer/layout/CustomerFooter";

import {
  getCurrentVideo,
  markVideoComplete,
  buildThumbnailSrc,
} from "../../../services/clinicalVideoService";

import { listMyAppointments } from "../../../services/customerAppointmentService";
import { fetchMyProfile } from "../../../services/customerProfileService";
import { fetchMySubscription } from "../../../services/customerBillingService";

const programTitles = {
  yogat20: "Yoga T20",
  diabmukt: "Diabmukt",
  mommyfit: "MommyFit",
  slimfitter: "Slimfitter",
};

// ─────────────────────────────────────────────
// Progress Ring
// ─────────────────────────────────────────────
function ProgressRing() {
  const SIZE = 200;
  const CX = 100;
  const STROKE = 13;

  const rings = [
    { label: "Sleep", color: "#F97316", value: 75, r: 84 },
    { label: "Mind", color: "#A855F7", value: 60, r: 67 },
    { label: "Water", color: "#3B82F6", value: 45, r: 50 },
    { label: "Steps", color: "#22C55E", value: 85, r: 33 },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {rings.map(({ color, value, r }) => {
          const circ = 2 * Math.PI * r;
          const dash = (value / 100) * circ;

          return (
            <g key={r}>
              <circle
                cx={CX}
                cy={CX}
                r={r}
                fill="none"
                stroke={color}
                strokeWidth={STROKE}
                opacity={0.12}
              />

              <circle
                cx={CX}
                cy={CX}
                r={r}
                fill="none"
                stroke={color}
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {rings.map(({ label, color, value, r }) => (
          <div key={r} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />

            <span className="text-xs text-[#6B7280] font-medium">
              {label}{" "}
              <span className="font-bold" style={{ color }}>
                {value}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const formatToday = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "2-digit",
  });

  // 🕒 Returns "Good Morning/Afternoon/Evening" based on current hour
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const formatAppointmentDate = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const now = new Date();

  const diffDays = Math.round((d - now) / (1000 * 60 * 60 * 24));

  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffDays === 0) return `Today, ${timeStr}`;
  if (diffDays === 1) return `Tomorrow, ${timeStr}`;
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days, ${timeStr}`;

  return `${d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}, ${timeStr}`;
};

// 🎁 Free consultations entitled by plan tenure.
// Monthly: floor(months/3). Weekly: floor(weeks/12). Capped at 4 for display.
const entitlementFromSubscription = (sub) => {
  if (!sub || !sub.isActive) return 0;
  const weekMatch = String(sub.tenure || "").match(/(\d+)\s*week/i);
  if (weekMatch) return Math.min(4, Math.floor(parseInt(weekMatch[1], 10) / 12));
  const monthMatch = String(sub.tenure || "").match(/(\d+)\s*month/i);
  if (monthMatch) return Math.min(4, Math.floor(parseInt(monthMatch[1], 10) / 3));
  return 0;
};

export default function ProgramDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const programTitle = programTitles[id] || "Program";
 // 📈 inline Add-Progress expand state
  const [showProgress, setShowProgress] = useState(false);
  const topRef = useRef(null); // scroll target after saving
  const progressRef = useRef(null); // scroll target when auto-opening from navbar

  const [searchParams, setSearchParams] = useSearchParams();

  // called after habits saved → collapse + scroll user to top
  const handleProgressSaved = () => {
    setShowProgress(false);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // auto-open the habit form + scroll to it when arriving with ?openProgress=1
  useEffect(() => {
    if (searchParams.get("openProgress") === "1") {
      setShowProgress(true);
      // clear the param so refresh/back doesn't re-trigger
      searchParams.delete("openProgress");
      setSearchParams(searchParams, { replace: true });
      // wait for expand animation to start, then scroll to the form
      const t = setTimeout(() => {
        progressRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
      return () => clearTimeout(t);
    }
  }, [searchParams, setSearchParams]);

  const [videoData, setVideoData] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [userName, setUserName] = useState(""); // logged-in user's display name

  // 🩺 free-consultation cards state
  const [upcomingAppointments, setUpcomingAppointments] = useState([]); // plan-credit bookings (this program)
  const [allUpcoming, setAllUpcoming] = useState([]); // every upcoming appointment
  const [entitlement, setEntitlement] = useState(0);
  const [planCreditsLeft, setPlanCreditsLeft] = useState(0);

  // 🔔 plan-expiry welcome popup
  const [expiryPopupOpen, setExpiryPopupOpen] = useState(false);
  const [expiryInfo, setExpiryInfo] = useState(null);
  const expiryTimerRef = useRef(null);

  // auto-close the expiry popup after 5s
  useEffect(() => {
    if (!expiryPopupOpen) return;
    expiryTimerRef.current = setTimeout(() => setExpiryPopupOpen(false), 5000);
    return () => clearTimeout(expiryTimerRef.current);
  }, [expiryPopupOpen]);

  // close popup early + clear timer
  const closeExpiryPopup = () => {
    if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
    setExpiryPopupOpen(false);
  };
  // ─────────────────────────────────────────────
  // Load Today's Video
  // ─────────────────────────────────────────────
  const loadVideo = useCallback(async () => {
    setLoadingVideo(true);

    try {
      const data = await getCurrentVideo(id);
      setVideoData(data);
    } catch (err) {
      console.error("Failed to load video:", err);
      setVideoData(null);
    } finally {
      setLoadingVideo(false);
    }
  }, [id]);

  useEffect(() => {
    loadVideo();
  }, [loadVideo]);

  // ─────────────────────────────────────────────
  // Load Next Appointment
  // ─────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        // fetch ALL appointments so cancelled/completed free consults still hold a card
        const result = await listMyAppointments({
          bucket: "all",
          limit: 50,
        });

        if (!mounted) return;

        const appointments = result?.appointments || [];

        // free-consult appointments for THIS program (any state) → fill cards, oldest first
        const planAppts = appointments
          .filter((a) => a.paidWithPlanCredit && a.platform === id)
          .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
        setUpcomingAppointments(planAppts);

        // upcoming (any booking, not cancelled) → separate "Upcoming Appointment" card
        const upcoming = appointments
          .filter(
            (a) =>
              new Date(a.scheduledAt) >= new Date() &&
              ["pending", "confirmed"].includes(a.status),
          )
          .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
        setNextAppointment(upcoming[0] || null);
        setAllUpcoming(upcoming);
      } catch (err) {
        console.error("Failed to load appointments:", err);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // 📥 Load the logged-in user's name + plan free-consult credits
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const profile = await fetchMyProfile();
        if (mounted) {
          setUserName(profile?.fullName || profile?.nickName || "");
          // read only THIS program's plan credits from the per-program map
          setPlanCreditsLeft(profile?.planFreeConsults?.[id] || 0);
        }
      } catch {
        // soft fail — greeting shows without a name
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 📥 Load active subscription → compute free-consult entitlement + expiry popup
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchMySubscription(id);
        const sub = res?.subscription || null;
        if (!mounted) return;
        setEntitlement(entitlementFromSubscription(sub));

        // 🔔 show expiry popup ONCE per session (not on every refresh/visit)
        const sessionTag = (localStorage.getItem("token") || sessionStorage.getItem("token") || "").slice(-12);
        const popupKey = `expiryPopupShown_${id}_${sessionTag}`;
        const alreadyShown = sessionStorage.getItem(popupKey) === "1";
        if (
          !alreadyShown &&
          sub?.isActive &&
          typeof sub.daysUntilExpiry === "number" &&
          sub.daysUntilExpiry <= 7 &&
          !res?.pendingRenewal
        ) {
          setExpiryInfo({
            daysLeft: sub.daysUntilExpiry,
            endDate: sub.endDate,
            programName: sub.programName,
          });
          setExpiryPopupOpen(true);
          sessionStorage.setItem(popupKey, "1"); // mark shown for this session
        }
      } catch {
        // soft fail — no cards shown if subscription can't load
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);
  // ─────────────────────────────────────────────
  // Mark Complete
  // ─────────────────────────────────────────────
  const handleMarkComplete = async () => {
    if (!videoData?.video || videoData.completedToday || markingComplete)
      return;

    setMarkingComplete(true);

    try {
      await markVideoComplete(videoData.video._id);

      toast.success("Video marked as complete! See you tomorrow.");

      await loadVideo();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to mark complete");
    } finally {
      setMarkingComplete(false);
    }
  };

  const video = videoData?.video;
  const completedToday = videoData?.completedToday;

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col">
      {/* 🔔 PLAN-EXPIRY WELCOME POPUP (auto-closes in 5s) */}
      {expiryPopupOpen && expiryInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md px-7 py-8 text-center relative">
            <button
              type="button"
              onClick={closeExpiryPopup}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EEF2FF] to-[#F5F7FF] flex items-center justify-center mx-auto mb-4 ring-8 ring-[#F5F7FF]/60">
              <Clock size={28} className="text-[#5B4FF7]" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              {expiryInfo.daysLeft <= 0
                ? "Your plan expires today"
                : expiryInfo.daysLeft === 1
                ? "Your plan expires tomorrow"
                : `Your plan expires in ${expiryInfo.daysLeft} days`}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Renew your {expiryInfo.programName} plan to keep your videos,
              progress tracking, and free consultations going without a break.
            </p>

            <button
              type="button"
              onClick={() => {
                closeExpiryPopup();
                navigate("/my-plans-and-billings");
              }}
              className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#4E4391] hover:bg-[#3E356F] transition-colors"
            >
              Renew Now
            </button>
          </div>
        </div>
      )}

      {/* blink animation for active free-consult card border */}
      <style>{`
        @keyframes consultBlink {
          0%, 100% { border-color: #CFCBE6; box-shadow: 0 0 0 0 rgba(78,67,145,0); }
          50% { border-color: #4E4391; box-shadow: 0 0 0 4px rgba(78,67,145,0.15); }
        }
        .consult-blink { animation: consultBlink 1.4s ease-in-out infinite; }
      `}</style>
      <CustomerNavbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
          {/* Greeting Card */}
          <div ref={topRef} className="bg-white rounded-[28px] border border-[#E3DFF0] shadow-[0_10px_30px_rgba(15,23,42,0.05)] px-6 py-7 sm:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <p className="text-[#4E4391] font-semibold text-sm mb-1">
                  {programTitle}
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] leading-tight">
                  {getGreeting()},{" "}
                  <span className="text-[#4E4391]">
                    {userName || "there"}
                  </span>
                </h2>
                
                <p className="text-[#9CA3AF] text-sm mt-1">
                  Let's track your wellness journey for today
                </p>
                {/* 📊 ring shown here on mobile only (below greeting) */}
                <div className="sm:hidden mt-5 flex justify-center">
                  <ProgressRing />
                </div>

               <button
                  onClick={() => navigate(`/programs/${id}/progress-report`)}
                  className="mt-5 bg-[#EFEDFA] border border-[#E3DFF0] rounded-2xl px-4 py-3 inline-flex items-center gap-4 w-full sm:w-auto text-left hover:border-[#4E4391] transition-colors"
                >
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-0.5">
                      Today
                    </p>
                    <p className="font-bold text-[#1F2937] text-sm leading-tight">
                      {formatToday()}
                    </p>
                    <p className="text-xm text-[#76787c] mt-1">
                      Click to view your past logs
                    </p>
                  </div>
                  <img
                    src="/images/calendar.png"
                    alt="calendar"
                    className="w-20 h-20 object-contain shrink-0"
                  />
                </button>

                <button
                  onClick={() => setShowProgress((v) => !v)}
                  className="mt-5 flex items-center gap-2 bg-[#4E4391] hover:bg-[#4E4391] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-[0_8px_20px_rgba(78,67,145,0.22)] transition-all duration-200"
                >
                  {showProgress ? <ChevronUp size={15} /> : <Plus size={15} />}
                  {showProgress ? "Hide Progress" : "Add Progress"}
                </button>
              </div>

              {/* Right — progress ring (desktop only; mobile renders it under the greeting) */}
              <div className="shrink-0 mx-auto sm:mx-0 hidden sm:block">
                <ProgressRing />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* 📈 INLINE ADD-PROGRESS (animated expand)            */}
          {/* ══════════════════════════════════════════════════ */}
          <div
            ref={progressRef}
            className={`grid transition-all duration-300 ease-in-out ${
              showProgress ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="pt-1 pb-1">
                <p className="text-sm font-bold text-gray-800 mb-3 px-1">
                  Log Today's Progress
                </p>
                <HabitTrackerForm programId={id} onSaved={handleProgressSaved} />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* 🎬 VIDEO CARD                                       */}

          {/* ══════════════════════════════════════════════════ */}
{/* 🎬 VIDEO CARD + DAILY MOTIVATION                    */}
{/* ══════════════════════════════════════════════════ */}
{(() => {
  // Opens today's video AND starts the 24hr countdown (advances the queue).
  // Visiting the video IS the trigger — no separate "Mark Complete".
  const startVideo = () => {
    if (!video?.videoUrl) return;
    // open synchronously so the browser doesn't block the popup
    window.open(video.videoUrl, "_blank", "noopener,noreferrer");
    if (completedToday || markingComplete) return;
    setMarkingComplete(true);
    markVideoComplete(video._id)
      .then(() => loadVideo())
      .catch(() => {})
      .finally(() => setMarkingComplete(false));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
      {/* ── LEFT: Video Card ───────────────────────── */}
      <div className="bg-white rounded-[28px] border border-[#E3DFF0] shadow-[0_10px_30px_rgba(15,23,42,0.05)] p-5 sm:p-6 flex flex-col">
        {loadingVideo ? (
          <div className="flex-1 flex items-center justify-center py-10">
            <p className="text-sm text-[#9CA3AF]">Loading video...</p>
          </div>
        ) : !video ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-[#6B7280] mb-2">No videos available yet.</p>
            <p className="text-xs text-[#9CA3AF]">
              Check back soon — new content is uploaded regularly.
            </p>
          </div>
        ) : (
          <>
            {/* Thumbnail (click = start) */}
            <button
              type="button"
              onClick={startVideo}
              className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden group"
            >
              <img
                src={buildThumbnailSrc(video.thumbnailUrl)}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80";
                }}
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <Play size={20} className="text-white ml-0.5" fill="white" />
                </div>
              </div>
            </button>

            {/* Info + CTA */}
            <div className="mt-4 flex-1 flex flex-col">
              <p className="text-[#4E4391] font-semibold text-sm">
                {programTitle}
                {videoData?.isScheduled && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-md bg-[#EFEDFA] text-[#4E4391] text-[10px] font-bold">
                    Today's Special
                  </span>
                )}
              </p>

              <p className="text-[#1F2937] font-semibold text-base mt-0.5 leading-snug">
                {video.title}
              </p>

              {video.duration && (
                <p className="text-xs text-[#9CA3AF] mt-1">{video.duration}</p>
              )}

              <div className="mt-auto pt-4">
                <button
                  type="button"
                  onClick={startVideo}
                  disabled={markingComplete}
                  className={`inline-flex items-center gap-2 text-sm font-semibold px-8 py-2.5 rounded-full transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${
                    completedToday
                      ? "bg-[#ECFDF3] border border-[#ABEFC6] text-[#027A48]"
                      : "bg-[#4E4391] hover:bg-[#3E356F] text-white shadow-[0_8px_20px_rgba(78,67,145,0.22)]"
                  }`}
                >
                  <Play size={13} fill={completedToday ? "#027A48" : "white"} />
                  {markingComplete
                    ? "Opening..."
                    : completedToday
                      ? "Watch Again"
                      : "Start"}
                </button>

                {completedToday && (
                  <p className="text-xs text-[#9CA3AF] mt-3">
                    Great job! Your next video unlocks tomorrow.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── RIGHT: Daily Motivation (desktop only) ──── */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden rounded-[28px] p-8 text-white bg-gradient-to-br from-[#4E4391] to-[#3E356F] shadow-[0_10px_30px_rgba(78,67,145,0.25)]">
        {/* decorative circles */}
        <div className="absolute -top-12 -right-10 w-44 h-44 rounded-full bg-white/10" />
        <div className="absolute -bottom-14 -left-10 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase bg-white/15 px-3 py-1 rounded-full">
            ✨ Daily Motivation
          </span>

          <h3 className="text-2xl font-bold mt-5 leading-snug">
            Small steps, big change.
          </h3>

          <p className="text-white/85 text-sm mt-3 leading-relaxed">
            {
              [
                "Rest fuels progress — a calm mind today sets up a strong week.",
                "Fresh week, fresh start. One small habit today compounds into big change.",
                "Consistency beats intensity — just show up today, even for a few minutes.",
                "Halfway through the week. Keep the momentum going with today's session.",
                "Progress isn't always visible, but every day counts. Stay with it.",
                "Finish the week strong — your future self will thank you.",
                "A little movement today keeps your streak alive. You've got this.",
              ][new Date().getDay()]
            }
          </p>
        </div>

        <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-white/90">
          <span className="text-lg leading-none">←</span>
          Today's session is waiting
        </div>
      </div>
    </div>
  );
})()}

         {/* 📅 UPCOMING APPOINTMENT (any booking) */}
          {/* <div className="bg-white rounded-[28px] border border-[#E3DFF0] shadow-[0_10px_30px_rgba(15,23,42,0.05)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[#EFEDFA] rounded-lg flex items-center justify-center">
                <Calendar size={15} className="text-[#4E4391]" />
              </div>
              <span className="font-semibold text-[#1F2937] text-sm">
                Upcoming Appointment
              </span>
            </div>

            {allUpcoming.length > 0 ? (
              <div className="bg-[#EFEDFA] rounded-2xl px-5 py-4 border border-[#E3DFF0] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-[#6B7280] flex items-center gap-1 mb-1">
                    <Bell size={11} className="text-[#4E4391]" />
                    Upcoming Check-in
                  </p>
                  <p className="text-sm font-medium text-[#374151] truncate">
                    {allUpcoming[0].doctorName ||
                      allUpcoming[0].doctor?.fullName ||
                      "Doctor"}{" "}
                    — {formatAppointmentDate(allUpcoming[0].scheduledAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/my-appointments")}
                  className="text-xs font-semibold text-[#4E4391] hover:underline shrink-0"
                >
                  View all
                </button>
              </div>
            ) : (
              <div className="bg-[#EFEDFA] rounded-2xl px-5 py-4 text-center border border-[#E3DFF0]">
                <p className="text-sm text-[#6B7280]">
                  No upcoming appointments yet.
                </p>
              </div>
            )}
          </div> */}

          {/* 🩺 FREE DOCTOR CONSULTATIONS (plan benefit) */}
          <div className="bg-white rounded-[28px] border border-[#E3DFF0] shadow-[0_10px_30px_rgba(15,23,42,0.05)] p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 bg-[#EFEDFA] rounded-lg flex items-center justify-center">
                <Stethoscope size={15} className="text-[#4E4391]" />
              </div>
              <span className="font-semibold text-[#1F2937] text-sm">
                Your Free Consultations
              </span>
            </div>

            {entitlement === 0 ? (
              <div className="mt-4 bg-[#EFEDFA] rounded-2xl px-5 py-4 text-center border border-[#E3DFF0]">
                <p className="text-sm text-[#6B7280]">
                  Purchase a plan to unlock free doctor consultations.
                </p>
              </div>
            ) : (
              <>
                {planCreditsLeft > 0 && (
                  <div className="mt-3 mb-4 rounded-2xl bg-gradient-to-r from-[#4E4391] to-[#3E356F] px-4 py-3 flex items-center gap-2 shadow-[0_6px_18px_rgba(78,67,145,0.25)]">
                    <Gift size={16} className="text-white shrink-0" />
                    <p className="text-sm font-semibold text-white">
                      Book Your Free Doctor Consultation
                      {planCreditsLeft > 1 ? "s" : ""} ({planCreditsLeft} left).
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {Array.from({ length: 4 }).map((_, i) => {
                    const isWithinPlan = i < entitlement;
                    const appt = upcomingAppointments[i];
                    const slotNo = i + 1;
                    const cardBase =
                      "rounded-2xl border-2 px-5 py-5 min-h-[120px] flex flex-col justify-center transition-all";

                    if (!isWithinPlan) {
                      return (
                        <div
                          key={i}
                          className={`${cardBase} border-dashed border-[#E3DFF0] bg-[#EFEDFA]/60 opacity-70`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-200/70 flex items-center justify-center shrink-0">
                              <Lock size={16} className="text-gray-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-400">
                                Consultation {slotNo}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                Upgrade your plan to unlock
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (appt) {
                      const isCancelled = appt.status === "cancelled";
                      const isCompleted = appt.status === "completed";
                      // show Join only for active (not cancelled/completed) bookings with a sent link
                      const canJoin =
                        !isCancelled &&
                        !isCompleted &&
                        !!appt.meetingLink &&
                        !!appt.meetingLinkSentAt;
                      const tone = isCancelled
                        ? { border: "border-gray-200", bg: "bg-gray-50", icon: "bg-gray-100", iconColor: "text-gray-400", badge: "text-gray-500 bg-gray-100", label: "Cancelled" }
                        : isCompleted
                        ? { border: "border-emerald-200", bg: "bg-emerald-50/50", icon: "bg-emerald-100", iconColor: "text-emerald-600", badge: "text-emerald-700 bg-emerald-100", label: "Completed" }
                        : { border: "border-emerald-200", bg: "bg-emerald-50/50", icon: "bg-emerald-100", iconColor: "text-emerald-600", badge: "text-emerald-700 bg-emerald-100", label: "Booked" };

                      return (
                        <div
                          key={i}
                          className={`${cardBase} ${tone.border} ${tone.bg} ${isCancelled ? "opacity-80" : ""}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${tone.icon} flex items-center justify-center shrink-0`}>
                              <Calendar size={16} className={tone.iconColor} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-bold truncate ${isCancelled ? "text-gray-500 line-through" : "text-gray-800"}`}>
                                {appt.doctorName || appt.doctor?.fullName || "Doctor"}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {formatAppointmentDate(appt.scheduledAt)}
                              </p>
                            </div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${tone.badge}`}>
                              {tone.label}
                            </span>
                          </div>

                          {/* 🔗 meeting link + Join Now (once doctor sends it) */}
                         {canJoin && (
                            <div className="mt-3 pt-3 border-t border-emerald-100 space-y-2">
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                <Video size={12} className="text-[#4E4391] shrink-0" />
                                <a
                                  href={appt.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#4E4391] text-xs hover:underline truncate"
                                  title={appt.meetingLink}
                                >
                                  {appt.meetingLink}
                                </a>
                              </div>
                              <a
                                href={appt.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#4E4391] hover:bg-[#3E356F] transition-colors shadow-[0_4px_10px_rgba(249,115,22,0.25)]"
                              >
                                <Video size={12} />
                                Join Now
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (planCreditsLeft > 0) {
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => navigate("/book-doctor")}
                          className={`${cardBase} text-left border-[#CFCBE6] bg-[#EFEDFA]/60 hover:bg-[#EFEDFA] consult-blink`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#EFEDFA] flex items-center justify-center shrink-0">
                              <Stethoscope size={16} className="text-[#4E4391]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-[#1F2937]">
                                Free Consultation {slotNo}
                              </p>
                              <p className="text-xs text-[#4E4391] font-medium mt-0.5">
                                Tap to book your free consultation →
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    }

                    return (
                      <div
                        key={i}
                        className={`${cardBase} border-dashed border-[#E3DFF0] bg-[#EFEDFA]/60 opacity-70`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-200/70 flex items-center justify-center shrink-0">
                            <Lock size={16} className="text-gray-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-400">
                              Consultation {slotNo}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              No free consultation available
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}
