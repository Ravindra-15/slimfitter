/**
 * ADMIN MODULE — Appointment Table
 * Renders patient, doctor, date/time, payment, status.
 * Desktop: traditional table | Mobile: stacked cards.
 * Pure display — no row actions yet (booking module not built).
 */

import React from "react";
import { CalendarX } from "lucide-react";
import { TableSkeleton } from "../../../../components/admin/common/AdminSkeleton";

// ============================================
// 🎨 STATUS PILL CONFIG
// ============================================
const STATUS_STYLES = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-600 border-amber-100",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  completed: {
    label: "Completed",
    className: "bg-blue-50 text-blue-600 border-blue-100",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-500 border-red-100",
  },
  no_show: {
    label: "No-show",
    className: "bg-gray-100 text-[#6B7280] border-[#D9DDF0]",
  },
};

const StatusPill = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1
        text-xs font-semibold rounded-full border
        ${style.className}
      `}
    >
      {style.label}
    </span>
  );
};

// ============================================
// 💰 Format currency
// ============================================
const formatFee = (fee, currency = "USD") => {
  if (fee === null || fee === undefined) return "—";
  const symbols = { USD: "$", INR: "₹", EUR: "€", GBP: "£" };
  const sym = symbols[currency] || "$";
  // Match Figma "20$" style for USD; otherwise "₹20"
  return currency === "USD" ? `${fee}${sym}` : `${sym}${fee}`;
};

// ============================================
// 🗓️ Format date
// ============================================
const formatDateTime = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// ============================================
// 📋 MAIN TABLE
// ============================================
const AppointmentTable = ({ appointments = [], loading = false }) => {
  if (loading) return <TableSkeleton rows={5} />;

  if (!appointments || appointments.length === 0) {
    return (
      <div
        className="
          bg-white rounded-2xl border border-[#E7EAF3]
          shadow-[0_1px_3px_rgba(16,24,40,0.04)]
          px-6 py-16 text-center
        "
      >
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
          <CalendarX size={20} className="text-gray-400" />
        </div>
        <p className="text-sm font-medium text-[#374151] mb-1">
          No appointments found
        </p>
        <p className="text-xs text-[#6B7280]">
          Try adjusting your search or status filter.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        bg-white rounded-2xl border border-[#E7EAF3]
        shadow-[0_1px_3px_rgba(16,24,40,0.04)]
        overflow-hidden
      "
    >
      {/* ============================================ */}
      {/* 💻 DESKTOP TABLE */}
      {/* ============================================ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E7EAF3] bg-[#F6F8FC]/40">
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold tracking-wider text-[#6B7280] uppercase">
                Patient
              </th>
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold tracking-wider text-[#6B7280] uppercase">
                Doctor
              </th>
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold tracking-wider text-[#6B7280] uppercase">
                Date & Time
              </th>
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold tracking-wider text-[#6B7280] uppercase">
                Payment
              </th>
              <th className="px-6 py-3.5 text-center text-[11px] font-semibold tracking-wider text-[#6B7280] uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt, idx) => (
              <tr
                key={apt._id}
                className={`
                  hover:bg-[#F6F8FC]/50 transition-colors
                  ${idx !== appointments.length - 1 ? "border-b border-[#E7EAF3]" : ""}
                `}
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-[#1F2937]">
                    {apt.patientName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[#374151]">{apt.doctorName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[#374151]">
                    {formatDateTime(apt.scheduledAt)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-indigo-600">
                    {formatFee(apt.fee, apt.currency)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusPill status={apt.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ============================================ */}
      {/* 📱 MOBILE STACKED CARDS */}
      {/* ============================================ */}
      <div className="md:hidden divide-y divide-gray-100">
        {appointments.map((apt) => (
          <div key={apt._id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <p className="text-sm font-semibold text-[#1F2937] truncate">
                {apt.patientName}
              </p>
              <StatusPill status={apt.status} />
            </div>
            <p className="text-xs text-[#6B7280] truncate mb-2">
              with {apt.doctorName}
            </p>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-[#374151]">{formatDateTime(apt.scheduledAt)}</span>
              <span className="font-semibold text-indigo-600">
                {formatFee(apt.fee, apt.currency)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentTable;