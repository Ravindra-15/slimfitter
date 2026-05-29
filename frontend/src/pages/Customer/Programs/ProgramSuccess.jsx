// Zealtho Programs - Program Success
// Shown after subscription created successfully
// Manual button navigation to dashboard (auto-redirect commented out)

import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import successIllustration from "../../../assets/image-Photoroom.png";

export default function ProgramSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const programName = state?.programName || "your program";
  const tenure = state?.tenure || "";

  // ============================================
  // 🔄 OPTIONAL AUTO-REDIRECT (currently disabled)
  // Uncomment below to auto-redirect to dashboard after 3 seconds
  // ============================================
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigate(`/programs/${id}/dashboard`);
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, [id, navigate]);

  return (
    <div className="min-h-screen bg-[#F6F8FC]0/60 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border-2 border-teal-400">
        <div className="h-1.5 w-full bg-gradient-to-r from-teal-400 to-teal-600" />

        <div className="px-12 py-14 flex flex-col items-center text-center">
          <div className="w-72 h-72 mb-8">
            <img
              src={successIllustration}
              alt="Success"
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Subscription Activated!
          </h2>

          <p className="text-[#6B7280] text-sm sm:text-base mb-10">
            Welcome to{" "}
            <span className="text-[#4F46E5] font-semibold">{programName}</span>
            {tenure && (
              <>
                {" "}
                <span className="text-[#374151]">— {tenure} Plan</span>
              </>
            )}{" "}
            🎉
          </p>

          <button
            onClick={() => navigate(`/programs/${id}/dashboard`)}
            className="w-full bg-[#4F46E5] hover:bg- [#4338CA] text-white font-semibold py-3.5 rounded-full transition-colors shadow-[0_6px_18px_rgba(79,70,229,0.28)]"
          >
            Go To Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}