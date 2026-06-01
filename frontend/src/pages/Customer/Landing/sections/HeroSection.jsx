// Slimfitter - Hero Section

import { useNavigate } from "react-router-dom";
import { getSubscriptionRedirect } from "../../../../utils/subscriptionGuard";

export default function HeroSection() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    const intendedPath = "/programs/slimfitter/tenure";
    const redirect = getSubscriptionRedirect(intendedPath);
    navigate(redirect || intendedPath);
  };

  const handleConsultDoctor = () => {
    navigate("/book-doctor");
  };

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-10 lg:px-16 pt-8 sm:pt-12 lg:pt-16 pb-10 sm:pb-14 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-12">
          {/* LEFT — Copy + CTAs */}
          <div className="relative z-10 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-[32px] sm:text-[44px] lg:text-[56px] leading-[1.1] font-bold text-[#1F2937] mb-4 sm:mb-5">
              Lose weight <br />
              <span className="text-[#4E4391]">sustainably</span>
            </h1>

            <p className="text-[#475569] text-[14px] sm:text-[16px] lg:text-[18px] font-medium leading-[1.6] mb-7 sm:mb-9">
              Yoga + tracking + expert <br />
              consultations in one plan
            </p>

            <div className="flex flex-col gap-3 sm:gap-4 max-w-[280px] sm:max-w-[320px] mx-auto lg:mx-0">
              <button
                onClick={handleStartJourney}
                className="bg-[#4E4391] hover:bg-[#4E4391] text-white text-[14px] sm:text-[15px] font-semibold px-6 py-3 sm:py-3.5 rounded-full shadow-[0_8px_24px_rgba(90,79,159,0.25)] transition-all"
              >
                Start Your Transformation
              </button>

              <button
                onClick={handleConsultDoctor}
                className="border border-gray-300 hover:border-[#4E4391] hover:text-[#4E4391] text-[#1F2937] text-[14px] sm:text-[15px] font-semibold px-6 py-3 sm:py-3.5 rounded-full bg-white transition-all"
              >
                Consult A Doctor Now
              </button>
            </div>
          </div>

          {/* RIGHT — Before / After cards */}
          <div className="flex items-center justify-center gap-4 sm:gap-5 lg:gap-14 order-1 lg:order-2">
            {/* BEFORE */}
            <div className="relative w-[190px] sm:w-[280px] lg:w-[380px] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(15,23,42,0.1)]">
              <img
                src="/images/beforeslim.png"
                alt="Before"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-white text-[#1F2937] text-[11px] sm:text-[13px] font-semibold px-3 py-1 rounded-full shadow-sm">
                Before
              </span>
            </div>

            {/* AFTER */}
            <div className="relative w-[190px] sm:w-[280px] lg:w-[380px] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(15,23,42,0.1)]">
              <img
                src="/images/afterslim.png"
                alt="After"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-white text-[#1F2937] text-[11px] sm:text-[13px] font-semibold px-3 py-1 rounded-full shadow-sm">
                After
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}