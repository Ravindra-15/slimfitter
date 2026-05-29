/**
 * CUSTOMER MODULE — Enquiry API Service
 * Public endpoint — no auth required.
 * Used by CallbackSection on landing pages.
 */

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// 🌐 Public instance (no token interceptor)
const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ============================================
// 📩 SUBMIT CALLBACK ENQUIRY (public)
// ============================================
/**
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} [payload.email]
 * @param {string} payload.phone
 * @param {string} [payload.message]
 * @param {string} [payload.source] - zealtho | yogat20 | diabmukt | mommyfit | slimfitter
 */
export const submitEnquiry = async (payload) => {
  const response = await publicApi.post("/customer/enquiries", payload);
  return response.data;
};

// 🔒 Auth'd instance — attaches user JWT (for status check + linked enquiries)
const authApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

authApi.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ============================================
// 📩 SUBMIT CALLBACK ENQUIRY (logged-in / subscription)
// Sends token so backend links the enquiry to the user.
// ============================================
export const submitSubscriptionCallback = async (payload) => {
  const response = await authApi.post("/customer/enquiries", {
    ...payload,
    type: "subscription",
  });
  return response.data;
};

// ============================================
// 🔎 CHECK IF USER ALREADY REQUESTED A CALLBACK
// ============================================
export const checkSubscriptionCallback = async (source) => {
  const response = await authApi.get("/customer/enquiries/check", {
    params: { source },
  });
  return response.data?.data?.alreadyRequested || false;
};