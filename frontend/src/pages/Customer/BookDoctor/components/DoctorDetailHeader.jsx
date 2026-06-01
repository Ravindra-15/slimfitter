/**
 * CUSTOMER MODULE — Doctor Detail Header Card
 * Shows doctor avatar, name, specialty, About bio + specialization tags.
 * Top of the doctor detail / slot picker page.
 */

import React from "react";
import { CheckCircle2, User } from "lucide-react";
import { buildDoctorPhotoUrl } from "../../../../services/customerDoctorService";

const DoctorDetailHeader = ({ doctor }) => {
  const photoUrl = buildDoctorPhotoUrl(doctor.photo, doctor.updatedAt);
  const tags = (doctor.specializations || []).slice(0, 6);

  // 📝 Strip any HTML stored in shortBio
  // 📝 Strip HTML tags + decode common HTML entities (&nbsp;, &amp;, etc.)
  const bioPlain = (doctor.shortBio || "")
    .replace(/<[^>]+>/g, " ") // tags → space
    .replace(/&nbsp;/gi, " ") // non-breaking space
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();
  return (
    <div
      className="
                    bg-white rounded-[28px]
            border border-[#E3DFF0]
            shadow-[0_10px_30px_rgba(15,23,42,0.05)]
        p-5 sm:p-6
        flex flex-col lg:flex-row gap-5
      "
    >
      {/* 👤 Avatar + Name + Specialty */}
      <div className="flex flex-col items-center text-center lg:w-44 flex-shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-[#D6D1EC] bg-gradient-to-br from-[#EFEDFA] to-[#EFEDFA]">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={doctor.fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#4E4391]">
              <User size={28} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 mt-3">
          <h2 className="text-sm font-bold text-[#1F2937]">
            {doctor.fullName}
          </h2>
          <CheckCircle2 size={14} className="text-[#4E4391]" />
        </div>
        {doctor.domain && (
          <p className="text-xs text-[#6B7280]mt-0.5">{doctor.domain}</p>
        )}
      </div>

      {/* 📖 About + tags */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-[#1F2937] mb-2">About</h3>
        {bioPlain ? (
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
            {bioPlain}
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-[#9CA3AF] italic">
            Bio not yet provided.
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="
               inline-flex items-center
                px-3 py-1 rounded-full
                text-[11px] font-semibold
                bg-[#EFEDFA]
                text-[#4E4391]
                border border-[#D6D1EC]
                "
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {doctor.qualifications && (
          <p className="mt-3 text-xs text-[#6B7280]">
            <span className="font-semibold text-[#374151]">Qualifications:</span>{" "}
            {doctor.qualifications}
          </p>
        )}

        {typeof doctor.yearsOfExperience === "number" &&
          doctor.yearsOfExperience > 0 && (
            <p className="text-xs text-[#6B7280] mt-1">
              <span className="font-semibold text-[#374151]">Experience:</span>{" "}
              {doctor.yearsOfExperience} years
            </p>
          )}
      </div>
    </div>
  );
};

export default DoctorDetailHeader;
