/**
 * DOCTOR MODULE — On-Break Overlay
 * Full-screen modal shown when doctor has an active multi-day range break.
 * Doctor can dismiss to view calendar (info only — bookings still blocked
 * server-side regardless of overlay).
 */

import React from "react";
import { X, Coffee } from "lucide-react";

const OnBreakOverlay = ({ onBreak, onDismiss, onEndBreak }) => {
  if (!onBreak) return null;

  const endDate = new Date(onBreak.endsAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl border border-[#E3DFF0] shadow-xl w-full max-w-md p-8 relative">
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-[#374151] hover:bg-[#EFEDFA] transition-colors"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>

        {/* Illustration placeholder — Coffee icon for now */}
        <div className="flex justify-center mb-5">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
            <Coffee size={36} className="text-[#4E4391]" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#1F2937] text-center tracking-tight">
          You're on Break
        </h2>
        <p className="mt-2 text-sm text-[#6B7280] text-center">
          See you soon!
        </p>
        <p className="mt-4 text-xs text-[#6B7280] text-center">
          Your break ends on{" "}
          <span className="font-semibold text-[#374151]">{endDate}</span>
          {onBreak.reason && (
            <>
              <br />Reason: <span className="text-[#374151]">{onBreak.reason}</span>
            </>
          )}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#374151] bg-[#EFEDFA] hover:bg-gray-100 transition-colors"
          >
            View Calendar
          </button>
          <button
            type="button"
            onClick={onEndBreak}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors"
          >
            End Break Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnBreakOverlay;