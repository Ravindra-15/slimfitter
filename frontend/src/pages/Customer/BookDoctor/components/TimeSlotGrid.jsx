/**
 * CUSTOMER MODULE — Time Slot Grid
 * 3-column grid of slot times. Selected = orange filled, available = gray, blocked = dimmed.
 * Receives slots from useDoctorDayAvailability and emits selection upward.
 */

import React from "react";
import { CalendarOff } from "lucide-react";
import { formatSlot24h } from "../../../../services/doctorAvailabilityService";

// ============================================
// 📋 COMPONENT
// ============================================
const TimeSlotGrid = ({
  slots = [],
  selectedTime,
  onSelect,
  loading = false,
  noDateSelected = false,
}) => {
  // ⏳ Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-[#EEF2FF] animate-pulse" />
        ))}
      </div>
    );
  }

  // 🚫 No date selected yet
  if (noDateSelected) {
    return (
      <div className="text-center py-10">
        <p className="text-xs text-gray-400">
          Select a date from the calendar to see available slots
        </p>
      </div>
    );
  }

  // 🚫 Empty (doctor not open this day, or fully booked/blocked)
  const hasAnyBookable = slots.some((s) => s.isBookable);
  if (!hasAnyBookable) {
    return (
      <div className="text-center py-10">
        <div className="w-10 h-10 rounded-full bg-[#F6F8FC] flex items-center justify-center mx-auto mb-3">
          <CalendarOff size={18} className="text-gray-400" />
        </div>
        <p className="text-sm font-medium text-[#374151] mb-1">
          No slots available
        </p>
        <p className="text-xs text-[#6B7280]">Try a different date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {slots
        .filter((slot) => slot.isBookable)
        .map((slot) => {
          const isSelected = selectedTime === slot.time;
          const disabled = !slot.isBookable;

          return (
            <button
              key={slot.time}
              type="button"
              onClick={() => !disabled && onSelect(slot.time)}
              disabled={disabled}
              className={`
              h-10 rounded-lg
              text-xs sm:text-sm font-semibold
              transition-colors border
              ${
                isSelected
                  ? "bg-[#5B4FF7] text-white border-[#5B4FF7] shadow-[0_8px_18px_rgba(91,79,247,0.22)]"
                  : disabled
                    ? "bg-[#F6F8FC] text-gray-300 border-[#E7EAF3] cursor-not-allowed"
                    : "bg-white text-[#374151] border-[#E7EAF3] hover:border-[#5B4FF7]/40 hover:bg-[#F7F8FF]"
              }
            `}
              aria-pressed={isSelected}
            >
              {formatSlot24h(slot.time)}
            </button>
          );
        })}
    </div>
  );
};

export default TimeSlotGrid;
