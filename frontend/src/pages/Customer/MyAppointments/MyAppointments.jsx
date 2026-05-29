/**
 * CUSTOMER MODULE — My Appointments Page
 * Lists upcoming + past appointments. Shows body-profile banner if not completed.
 * Auth-gated; guides users to body profile wizard.
 */

import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";

import CustomerNavbar from "../../../components/customer/layout/CustomerNavbar";
import CustomerFooter from "../../../components/customer/layout/CustomerFooter";
import AppointmentCard from "./components/AppointmentCard";

import useMyAppointments from "../../../hooks/useMyAppointments";
import useMyBodyProfile from "../../../hooks/useMyBodyProfile";
import {
  isCustomerLoggedIn,
  buildLoginRedirect,
} from "../../../utils/customerAuthHelper";

// ============================================
// 🚫 EMPTY STATE
// ============================================
const EmptyBucket = ({ label }) => (
  <div className="px-6 py-12 text-center">
    <p className="text-sm text-[#6B7280]">No {label} appointments yet.</p>
  </div>
);

// ============================================
// 💀 SKELETON LOADER
// ============================================
const ListSkeleton = () => (
  <div className="space-y-3">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="bg-white rounded-[24px] border border-[#E7EAF3] p-5 h-24 animate-pulse"
      />
    ))}
  </div>
);

// ============================================
// 📋 MAIN PAGE
// ============================================
const MyAppointments = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔒 Auth gate
  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      navigate(buildLoginRedirect(location.pathname), { replace: true });
    }
  }, [navigate, location]);

  const upcoming = useMyAppointments({ bucket: "upcoming", initialLimit: 20 });
  const past = useMyAppointments({ bucket: "past", initialLimit: 20 });
  const { isComplete, loading: profileLoading } = useMyBodyProfile();

  // 🎯 Show banner only if profile is loaded AND not yet complete
  const showBodyProfileBanner = !profileLoading && !isComplete;

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col">
      <CustomerNavbar />

      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-10 space-y-6">
          {/* 🔙 Back link */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#5B4FF7] transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* 🏷️ Page title */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
              My Appointments
            </h1>
            <p className="text-xs text-[#6B7280] mt-1">
              Manage your consultations and follow-ups
            </p>
          </div>

          {/* ============================================ */}
          {/* 🟧 BODY PROFILE BANNER                        */}
          {/* ============================================ */}
          {showBodyProfileBanner && (
            <div
              className="
                relative overflow-hidden
                bg-gradient-to-r from-[#5B4FF7] to-[#4338CA]
                rounded-2xl p-5 sm:p-6
                text-center
                shadow-[0_12px_30px_rgba(91,79,247,0.22)]
              "
            >
              <p className="text-base sm:text-lg font-bold text-white">
                Your doctor may need this before the consultation
              </p>

              <button
                type="button"
                onClick={() => navigate("/body-profile")}
                className="
                  mt-4 inline-flex items-center gap-1.5
                  px-5 py-2 rounded-full
                  text-sm font-semibold text-[#5B4FF7]
                  bg-white hover:bg-[#F6F8FC]
                  transition-colors
                  shadow-[0_4px_14px_rgba(0,0,0,0.1)]
                "
              >
                Complete now
                <ChevronRight size={14} />
              </button>

              <p className="text-[11px] text-white/80 mt-3">
                *Requires 120 Seconds
              </p>
            </div>
          )}

          {/* ============================================ */}
          {/* 📋 UPCOMING APPOINTMENTS                      */}
          {/* ============================================ */}
          <section
            className="
              bg-white rounded-[28px]
                border border-[#E7EAF3]
                shadow-[0_10px_30px_rgba(15,23,42,0.05)]
              p-5 sm:p-6
            "
          >
            <p className="text-sm font-bold text-[#1F2937] mb-4">
              Upcoming Appointments
            </p>

            {upcoming.loading ? (
              <ListSkeleton />
            ) : upcoming.appointments.length === 0 ? (
              <EmptyBucket label="upcoming" />
            ) : (
              <div className="space-y-3">
                {upcoming.appointments.map((apt) => (
                  <AppointmentCard
                    key={apt._id}
                    appointment={apt}
                    isUpcoming
                    onUpdated={() => {
                      upcoming.refetch?.();
                      past.refetch?.();
                    }}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ============================================ */}
          {/* 📋 PAST APPOINTMENTS                          */}
          {/* ============================================ */}
          <section
            className="
             bg-white rounded-[28px]
                border border-[#E7EAF3]
                shadow-[0_10px_30px_rgba(15,23,42,0.05)]
              p-5 sm:p-6
            "
          >
            <p className="text-sm font-bold text-[#1F2937] mb-4">
              Past Appointments
            </p>

            {past.loading ? (
              <ListSkeleton />
            ) : past.appointments.length === 0 ? (
              <EmptyBucket label="past" />
            ) : (
              <div className="space-y-3">
                {past.appointments.map((apt) => (
                  <AppointmentCard
                    key={apt._id}
                    appointment={apt}
                    isUpcoming={false}
                    onUpdated={() => {
                      upcoming.refetch?.();
                      past.refetch?.();
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
};

export default MyAppointments;
