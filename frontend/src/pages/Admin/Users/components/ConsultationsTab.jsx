/**
 * ADMIN MODULE — Consultations Tab
 *
 * Lists user's past consultations (doctor, duration, date, fee).
 * Empty state when none exist.
 */

import React from "react";
import { CalendarX } from "lucide-react";

// ============================================
// 🗓️ Format date
// ============================================
const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ============================================
// 💰 Format fee
// ============================================
const formatFee = (fee) => {
  if (fee === null || fee === undefined) return "—";
  return `₹${Number(fee).toLocaleString()}`;
};

// ============================================
// 🩺 Single consultation row
// ============================================
const ConsultationRow = ({ consultation }) => {
  const { doctorName, durationMinutes, consultedAt, fee } = consultation;

  return (
    <div
      className="
        flex flex-col sm:flex-row sm:items-center sm:justify-between
        gap-2 px-5 py-4
        hover:bg-[#F6F8FC]/50 transition-colors
      "
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#1F2937] truncate">
          Doctor: {doctorName}
        </p>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Duration: {durationMinutes} mins
        </p>
      </div>

      <div className="flex sm:flex-col sm:items-end gap-3 sm:gap-1 text-xs">
        <p className="font-semibold text-[#374151]">{formatDate(consultedAt)}</p>
        <p className="font-bold text-indigo-600">{formatFee(fee)}</p>
      </div>
    </div>
  );
};

// ============================================
// 🚫 Empty state
// ============================================
const EmptyState = () => (
  <div className="px-6 py-16 text-center">
    <div className="w-12 h-12 rounded-full bg-[#F6F8FC] flex items-center justify-center mx-auto mb-3">
      <CalendarX size={20} className="text-gray-400" />
    </div>
    <p className="text-sm font-medium text-[#374151] mb-1">
      No consultations yet
    </p>
    <p className="text-xs text-[#6B7280] max-w-xs mx-auto">
      This user hasn't had any consultations. Records will appear here once
      they book and complete one.
    </p>
  </div>
);

// ============================================
// 📋 MAIN COMPONENT
// ============================================
const ConsultationsTab = ({ consultations = [] }) => {
  return (
    <div
      className="
        bg-white rounded-2xl border border-[#E7EAF3]
        shadow-[0_1px_3px_rgba(16,24,40,0.04)]
        overflow-hidden
      "
    >
      {/* Section header */}
      <div className="px-5 py-4 border-b border-[#E7EAF3]">
        <h3 className="text-sm font-bold text-[#1F2937]">
          Consultation History
        </h3>
        <p className="text-xs text-[#6B7280] mt-0.5">
          {consultations.length} record{consultations.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* List */}
      {consultations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="divide-y divide-gray-100">
          {consultations.map((c) => (
            <ConsultationRow key={c._id} consultation={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationsTab;