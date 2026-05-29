// Diabmukt - "Why Choose us?" Section

import { BarChart3, Stethoscope, ShieldCheck } from "lucide-react";

const features = [
  {
    id: 1,
    icon: BarChart3,
    title: "Scientific Monitoring",
    description: "Track Blood Sugar, HbA1c, And BP With Expert Accuracy",
  },
  {
    id: 2,
    icon: Stethoscope,
    title: "Clinical Oversight",
    description: "1-On-1 Consultations With Vetted Medical Professionals",
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: "Identity Protection",
    description:
      "Your Data Is Protected By Our Secure Identity Shielding Protocol",
  },
];

export default function OurStructureSection() {
  return (
   <section className="pt-2 sm:pt-4 lg:pt-6 pb-10 sm:pb-12 lg:pb-14 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADING */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A]">
            Why Choose <span className="text-[#4F46E5]">us?</span>
          </h2>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-14 lg:gap-20">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="flex flex-col items-center text-center"
              >
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Icon size={22} className="text-[#4F46E5]" strokeWidth={2.2} />
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#0F172A]">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-[#475569] text-sm sm:text-[13px] lg:text-sm font-medium leading-relaxed max-w-[220px]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}