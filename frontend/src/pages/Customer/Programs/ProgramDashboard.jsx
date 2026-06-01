// Diabmukt Programs - Program Dashboard
// Single daily video stream (no yoga-type queues) + 24hr cooldown
// Uses real clinical videos from admin CMS + real upcoming appointment

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Check, Plus, Bell, Calendar } from "lucide-react";
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

export default function ProgramDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const programTitle = programTitles[id] || "Program";

  const [videoData, setVideoData] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [userName, setUserName] = useState(""); // logged-in user's display name
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
        const result = await listMyAppointments({
          bucket: "upcoming",
          limit: 5,
        });

        if (!mounted) return;

        const appointments = result?.appointments || [];

        const sorted = [...appointments].sort(
          (a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt),
        );

        setNextAppointment(sorted[0] || null);
      } catch (err) {
        console.error("Failed to load appointments:", err);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // 📥 Load the logged-in user's name for the greeting
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const profile = await fetchMyProfile();
        if (mounted) {
          setUserName(profile?.fullName || profile?.nickName || "");
        }
      } catch {
        // soft fail — greeting shows without a name
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
    <div className="min-h-screen bg-[#EFEDFA] flex flex-col">
      <CustomerNavbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
          {/* Greeting Card */}
          <div className="bg-white rounded-[28px] border border-[#E3DFF0] shadow-[0_10px_30px_rgba(15,23,42,0.05)] px-6 py-7 sm:px-8">
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
                  onClick={() => navigate(`/programs/${id}/add-progress`)}
                  className="mt-5 flex items-center gap-2 bg-[#4E4391] hover:bg-[#4E4391] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-[0_8px_20px_rgba(78,67,145,0.22)] transition-all duration-200"
                >
                  <Plus size={15} />
                  Add Progress
                </button>
              </div>

              <div className="shrink-0 mx-auto sm:mx-0">
                <ProgressRing />
              </div>
            </div>
          </div>

          {/* Video Card */}
          <div className="bg-white rounded-[28px] border border-[#E3DFF0] shadow-[0_10px_30px_rgba(15,23,42,0.05)] p-5">
            {loadingVideo ? (
              <p className="py-10 text-center text-sm text-[#9CA3AF]">
                Loading video...
              </p>
            ) : !video ? (
              <div className="py-10 text-center">
                <p className="text-sm text-[#6B7280] mb-2">
                  No videos available yet.
                </p>

                <p className="text-xs text-[#9CA3AF]">
                  Check back soon — new content is uploaded regularly.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start gap-5">
                {/* Thumbnail */}
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-full sm:w-52 h-32 rounded-2xl overflow-hidden shrink-0 group"
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
                    <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                      <Play
                        size={18}
                        className="text-white ml-0.5"
                        fill="white"
                      />
                    </div>
                  </div>
                </a>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
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
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      {video.duration}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 mt-4">
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#4E4391] hover:bg-[#4E4391] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-[0_8px_20px_rgba(78,67,145,0.22)] transition-all duration-200"
                    >
                      <Play size={13} fill="white" />
                      Play Video
                    </a>

                    <button
                      onClick={handleMarkComplete}
                      disabled={completedToday || markingComplete}
                      className={`inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-full border transition-colors disabled:cursor-not-allowed ${
                        completedToday
                          ? "bg-[#ECFDF3] border-[#ABEFC6] text-[#027A48]"
                          : "border-[#D6D1EC] text-[#6B7280] hover:border-[#4E4391] hover:text-[#4E4391]"
                      }`}
                    >
                      <Check size={13} />

                      {completedToday
                        ? "Completed ✓"
                        : markingComplete
                          ? "Saving..."
                          : "Mark as Complete"}
                    </button>
                  </div>

                  {completedToday && (
                    <p className="text-xs text-[#9CA3AF] mt-3">
                      Great job! Your next video unlocks tomorrow.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Next Consultation */}
          <div className="bg-white rounded-[28px] border border-[#E3DFF0] shadow-[0_10px_30px_rgba(15,23,42,0.05)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[#EFEDFA] rounded-lg flex items-center justify-center">
                <Calendar size={15} className="text-[#4E4391]" />
              </div>

              <span className="font-semibold text-[#1F2937] text-sm">
                Next Doctor Consultation
              </span>
            </div>

            {nextAppointment ? (
              <div className="bg-[#EFEDFA] rounded-2xl px-5 py-4 border border-[#E3DFF0]">
                <p className="text-xs text-[#6B7280] flex items-center gap-1 mb-1">
                  <Bell size={11} className="text-[#4E4391]" />
                  Upcoming Check-in
                </p>

                <p className="text-sm font-medium text-[#374151]">
                  {nextAppointment.doctorName ||
                    nextAppointment.doctor?.fullName ||
                    "Doctor"}{" "}
                  — {formatAppointmentDate(nextAppointment.scheduledAt)}
                </p>
              </div>
            ) : (
              <div className="bg-[#EFEDFA] rounded-2xl px-5 py-4 text-center border border-[#E3DFF0]">
                <p className="text-sm text-[#6B7280]">
                  No upcoming appointments. Book a doctor consultation anytime.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}
