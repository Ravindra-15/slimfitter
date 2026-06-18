/**
 * ============================================
 * CUSTOMER MODULE — Clinical Video API Service
 * ============================================
 * Used by the YogaT20 dashboard video section.
 *
 * Endpoints:
 *  - getCurrentVideo(programId, yogaType) → current video to display
 *  - markVideoComplete(videoId) → user clicked "Mark as Complete"
 * ============================================
 */

import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// 🔒 Auth'd instance — attaches customer JWT
const customerApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

customerApi.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🎬 Extract the 11-char YouTube ID from any standard YouTube URL.
const parseYouTubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m && m[1]) return m[1];
  }
  return null;
};

// 🖼️ Build a YouTube thumbnail URL from a video link (or null if not YT).
export const deriveYouTubeThumb = (videoUrl) => {
  const id = parseYouTubeId(videoUrl);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
};

// 🌐 Resolve a thumbnail source.
// Accepts either a stored path/URL string OR the whole video object.
// Priority: explicit http(s) thumbnail → derive from YouTube URL → backend file path.
export const buildThumbnailSrc = (input) => {
  // If given the video object, prefer deriving from its YouTube URL.
  if (input && typeof input === "object") {
    const fromYt = deriveYouTubeThumb(input.videoUrl);
    if (fromYt) return fromYt;
    input = input.thumbnailUrl || "";
  }

  if (!input) return "";

  // Already an absolute URL (incl. the derived YouTube thumb stored by backend)
  if (input.startsWith("http")) return input;

  // Legacy backend-served file path: "/uploads/clinical-videos/xxx.jpg"
  const serverRoot = BASE_URL.replace(/\/api\/?$/, "");
  return `${serverRoot}${input}`;
};

// ============================================
// 🎬 GET CURRENT VIDEO FOR QUEUE
// ============================================
/**
 * @param {string} programId - yogat20 | diabmukt | mommyfit | slimfitter
 * @param {string} [yogaType] - optional; omit for weekly programs (defaults to normal_yoga)
 */
export const getCurrentVideo = async (programId, yogaType) => {
  const params = { programId };
  if (yogaType) params.yogaType = yogaType;

  const response = await customerApi.get("/customer/clinical-videos/current", {
    params,
  });
  return response.data.data;
};
// ============================================
// ✅ MARK VIDEO COMPLETE
// ============================================
/**
 * @param {string} videoId - Video _id
 */
export const markVideoComplete = async (videoId) => {
  const response = await customerApi.post(
    `/customer/clinical-videos/${videoId}/complete`
  );
  return response.data;
};