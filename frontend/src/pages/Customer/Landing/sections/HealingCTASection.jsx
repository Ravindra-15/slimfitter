// Yoga T20 - "Start your healing journey by Booking Health Expert" CTA

import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import doctorMale from "../../../../assets/doctor-consult-couple.png";
// Lady doctor sits in /public/images/ladyDoctor.png

const benefits = [
  "1-on-1 guidance",
  "Personalized plan",
  "Trusted by 10,000+ users",
];

export default function HealingCTASection() {
  const navigate = useNavigate();

  const handleBookConsultation = () => {
    navigate("/book-doctor");
  };

  return (
    <section className="py-12 sm:py-14 lg:py-20 bg-white">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wrapper with overflow visible so doctors can poke above the card */}
        <div className="relative">
          {/* Peach background card */}
          <div className="bg-[#EFEEFF] rounded-3xl relative overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] items-stretch min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]">
              {/* LEFT — Copy + CTA */}
              <div className="px-6 sm:px-10 lg:px-14 py-10 sm:py-12 lg:py-14 flex flex-col justify-center relative z-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#083B44] leading-snug mb-5">
                  Start your healing journey
                  <br />
                  by Booking{" "}
                  <span className="text-[#4F46E5]">Health Expert</span>
                </h2>

                <ul className="space-y-3 mb-7">
                  {benefits.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-[15px] sm:text-[16px] text-[#083B44] font-medium"
                    >
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        <Check
                          size={16}
                          className="text-black"
                          strokeWidth={2.5}
                        />
                      </span>

                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleBookConsultation}
                  className="
                bg-[#4F46E5]
                hover:bg-[#4338CA]
                text-white
                text-sm
                sm:text-[15px]
                font-semibold
                px-7
                py-3.5
                rounded-full
                shadow-[0_6px_18px_rgba(79,70,229,0.28)]
                transition-all
                self-start
              "
                >
                  Book Doctor Consultation
                </button>
              </div>
              {/* RIGHT — empty space (doctors floated absolutely below) */}
              <div className="hidden md:block" />
            </div>
          </div>

          {/* DOCTORS — positioned absolutely, poking above the card top */}
          <div className="absolute right-0 bottom-0 flex items-end pointer-events-none w-full md:w-1/2 h-full">
            {/* Lady doctor — back layer, bigger, behind male */}
            <img
              src="/images/ladyDoctor.png"
              alt="Female doctor"
              className="
              absolute right-[-10%] sm:right-[-13%] lg:right-[-25%]
              
              w-[180px] sm:w-[440px] lg:w-[580px] xl:w-[750px]
              h-auto object-contain
              -scale-x-100
              z-10
            "
            />

            {/* Male doctor — front layer */}
            <img
              src={doctorMale}
              alt="Male doctor"
              className="
    absolute right-[5%] sm:right-[12%] lg:right-[14%]
    
    w-[200px] sm:w-[440px] lg:w-[580px] xl:w-[680px]
    h-auto object-contain
    -scale-x-100
    z-20
  "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
