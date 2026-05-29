/**
 * CUSTOMER MODULE — Refer & Earn Page
 * Route: /refer-and-earn (protected)
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Link2,
  Send,
  Users,
  Trophy,
  Copy,
  Check,
  Share2,
} from "lucide-react";

import CustomerNavbar from "../../../components/customer/layout/CustomerNavbar";
import CustomerFooter from "../../../components/customer/layout/CustomerFooter";
import { useAuth } from "../../../context/AuthContext";

export default function ReferAndEarnPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [copied, setCopied] = useState(false);

  // Static referral link
  const username = user?.nickName || user?.fullName?.split(" ")[0]?.toLowerCase() || "you";
  const referralLink = `zealtho.com/invite/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `Hey! Join Zealtho with my referral and get 30 days of Yoga T20 free: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col">
      <CustomerNavbar />

      <main className="flex-1 w-full">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10">
          {/* ============================================ */}
          {/* 🎉 HERO BANNER                                 */}
          {/* ============================================ */}
          <div className="relative overflow-hidden bg-white rounded-3xl border border-[#E7EAF3] px-6 sm:px-12 py-10 sm:py-14 mb-10">
            {/* Top-right decorative image */}
            <img
              src="/images/referandearn.png"
              alt=""
              className="absolute -top-6 -right-6 sm:-top-24 sm:-right-24 lg:-top-28 lg:-right-28 w-20 sm:w-64 lg:w-80 pointer-events-none select-none"
            />
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937] mb-2">
                Refer and Earn
              </h1>
              <p className="text-base sm:text-lg text-[#6B7280]">
                Wellness is better with friends{" "}
                <span className="inline-block">👋</span>
              </p>
            </div>

            {/* 3 steps with dashed connector */}
            <div className="relative z-10 mt-10 sm:mt-14">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 relative">
                {/* Dashed line — desktop only */}
                <div
                  className="hidden sm:block absolute top-6 left-[16.66%] right-[16.66%] border-t-2 border-dashed border-[#D9DDF0]"
                  aria-hidden
                />

                <StepCircle
                  icon={Send}
                  title="Share your"
                  subtitle="invite link"
                />
                <StepCircle
                  icon={Trophy}
                  title="Your friend gets 30"
                  subtitle="Days of Yoga T20"
                />
                <StepCircle
                  icon={Users}
                  title="You receive 30 Days of"
                  subtitle="Yoga T20 Subscription"
                />
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* 🔗 UNIQUE REFERRAL LINK                       */}
          {/* ============================================ */}
          <div className="bg-white rounded-3xl border border-[#E7EAF3] shadow-[0_10px_30px_rgba(15,23,42,0.05)] px-6 sm:px-10 py-10 sm:py-12 mb-10">
            <h2 className="text-xl sm:text-3xl font-bold text-[#1F2937] text-center mb-10">
              Your Unique Referral Link
            </h2>

            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <div className="flex-1 flex items-center gap-2 px-5 py-4 bg-[#F6F8FC] border border-[#D9DDF0] rounded-full">
                  <Link2 size={18} className="text-gray-400 shrink-0" />
                  <span className="text-base text-[#374151] truncate">
                    {referralLink}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#5B4FF7] hover:bg-[#4338CA] text-white text-sm font-semibold rounded-full shadow-[0_4px_14px_rgba(91,79,247,0.3)] transition-colors whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check size={15} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      Copy Link
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 border-t border-[#E7EAF3]" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 border-t border-[#E7EAF3]" />
              </div>

              <button
                onClick={handleWhatsAppShare}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-[#5B4FF7] hover:bg-[#4338CA] text-white text-sm sm:text-xl font-semibold rounded-full shadow-[0_4px_14px_rgba(91,79,247,0.3)] transition-colors"
              >
                <Share2 className="w-4 h-4 sm:w-8 sm:h-8" />
                Share directly to WhatsApp
              </button>

              <p className="text-sm sm:text-xl text-[#6B7280] text-center mt-4">
                Share on social media, email, or messaging apps
              </p>
            </div>
          </div>

          {/* ============================================ */}
          {/* 📊 YOUR REFERRAL PROGRESS                     */}
          {/* ============================================ */}
          <h2 className="text-xl sm:text-3xl font-bold text-[#1F2937] text-center mb-10 mt-12">
            Your Referral Progress
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-[1400px] mx-auto">
            <ProgressCard icon={Send} label="Invites Sent" value={12} />
            <ProgressCard icon={Users} label="Friends Joined" value={3} />
            <ProgressCard
              icon={Trophy}
              label="Free Months Earned"
              value={3}
              highlight
              footer={
                <div className="mt-4 bg-white/20 rounded-xl px-4 py-2.5 text-center">
                  <p className="text-xs font-medium text-white/90">
                    Next billing
                  </p>
                  <p className="text-sm font-semibold text-white">Oct 2026</p>
                </div>
              }
            />
          </div>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}

// ============================================
// 🔹 STEP CIRCLE
// ============================================
const StepCircle = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center text-center relative z-10">
    <div className="w-12 h-12 rounded-full bg-white border border-[#D9DDF0] flex items-center justify-center shadow-sm mb-3">
      <Icon size={18} className="text-[#6B7280]" />
    </div>
    <p className="text-sm font-medium text-[#1F2937]">{title}</p>
    <p className="text-sm text-[#6B7280]">{subtitle}</p>
  </div>
);

// ============================================
// 🔹 PROGRESS CARD
// ============================================
const ProgressCard = ({ icon: Icon, label, value, highlight, footer }) => {
  if (highlight) {
    return (
      <div className="bg-gradient-to-br from-[#5B4FF7] to-[#4338CA] rounded-2xl p-8 sm:p-10 text-white shadow-[0_12px_35px_rgba(91,79,247,0.22)] flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-4">
          <Icon size={22} className="text-white" />
        </div>
        <p className="text-base font-medium text-white/90 text-center">{label}</p>
        <p className="text-5xl font-bold text-white text-center mt-3">{value}</p>
        {footer}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E7EAF3] shadow-[0_4px_20px_rgba(16,24,40,0.06)] p-8 sm:p-10 flex flex-col items-center justify-center min-h-[240px]">
      <div className="w-14 h-14 rounded-full bg-[#F5F7FF] flex items-center justify-center mb-4">
        <Icon size={22} className="text-[#5B4FF7]" />
      </div>
      <p className="text-base font-medium text-[#6B7280] text-center">{label}</p>
      <p className="text-5xl font-bold text-[#1F2937] text-center mt-3">{value}</p>
    </div>
  );
};