// Diabmukt - Hero Section

import { useNavigate } from "react-router-dom";
import { getSubscriptionRedirect } from "../../../../utils/subscriptionGuard";

export default function HeroSection() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    const intendedPath = "/programs/diabmukt/tenure";
    const redirect = getSubscriptionRedirect(intendedPath);
    navigate(redirect || intendedPath);
  };

  const handleConsultDoctor = () => {
    navigate("/book-doctor");
  };

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-5 sm:px-10 lg:px-16 pt-8 sm:pt-12 lg:pt-16 pb-10 sm:pb-14 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-8">
          {/* LEFT — Copy + CTAs */}
          <div className="relative z-10 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-[32px] sm:text-[44px] lg:text-[56px] leading-[1.1] font-bold text-[#0F172A] mb-4 sm:mb-5">
              Reverse Diabetes <br />
              <span className="text-[#4F46E5]">Naturally</span>
            </h1>

            <p className="text-[#475569] text-[14px] sm:text-[16px] lg:text-[17px] font-semibold leading-[1.6] mb-7 sm:mb-9">
              Reverse Diabetes Naturally Or <br />
              Talk To A Doctor <br />
              Start Your Journey Today
            </p>

            <div className="flex flex-col gap-3 sm:gap-4 max-w-[280px] sm:max-w-[300px] mx-auto lg:mx-0">
              <button
                onClick={handleStartJourney}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[14px] sm:text-[15px] font-semibold px-6 py-3 sm:py-3.5 rounded-full shadow-[0_8px_24px_rgba(79,70,229,0.25)] transition-all"
              >
                Start Weekly Program
              </button>

              <button
                onClick={handleConsultDoctor}
                className="border border-gray-300 hover:border-[#4F46E5] hover:text-[#4F46E5] text-[#0F172A] text-[14px] sm:text-[15px] font-semibold px-6 py-3 sm:py-3.5 rounded-full bg-white transition-all"
              >
                Consult A Doctor Now
              </button>
            </div>
          </div>

          {/* RIGHT — Pill-shaped windows */}
          {/* RIGHT — Exact Figma Layout */}
          <div className="relative flex items-center justify-center order-1 lg:order-2">
            <div
              className="
                relative
                w-[320px] h-[320px]
                sm:w-[430px] sm:h-[430px]
                lg:w-[520px] lg:h-[520px]
                rounded-full
                bg-[#EEEBFB]
                flex items-center justify-center
              "
            >
              <div className="relative flex items-center justify-center gap-2 lg:gap-3">
                {/* LEFT PILL */}
                <div
                  className="
                relative
                overflow-hidden
                rounded-[999px]
                w-[140px] h-[230px]
                sm:w-[175px] sm:h-[290px]
                lg:w-[195px] lg:h-[320px]
                shrink-0
              "
                >
                  <img
                    src="/images/halfman.png"
                    alt="Couple"
                    className="absolute inset-0 h-full max-w-none object-cover"
                    style={{
                      width: "200%",
                      left: "-120%",
                      objectPosition: "left center",
                    }}
                  />
                </div>

                {/* RIGHT PILL */}
                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-[999px]
                    w-[92px] h-[180px]
                    sm:w-[118px] sm:h-[230px]
                    lg:w-[130px] lg:h-[260px]
                    shrink-0
                  "
                >
                  <img
                    src="/images/halfwoman.png"
                    alt="Couple"
                    className="absolute inset-0 h-full max-w-none object-cover"
                    style={{
                      width: "320%",
                      left: "-195%",
                      objectPosition: "right center",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
