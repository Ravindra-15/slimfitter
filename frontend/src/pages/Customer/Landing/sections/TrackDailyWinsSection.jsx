// MommyFit - "Track Your Daily Wins" Section

const rings = [
  { id: 1, label: "Yoga", color: "#F2994A", radius: 132, progress: 0.74 },
  { id: 2, label: "Sleep", color: "#A06CD5", radius: 104, progress: 0.67 },
  { id: 3, label: "Water", color: "#56CCF2", radius: 76, progress: 0.58 },
  { id: 4, label: "Steps", color: "#27AE60", radius: 48, progress: 0.46 },
];

const STROKE = 20;
const SIZE = 340;
const CENTER = SIZE / 2;

const ActivityRings = () => (
  <svg
    viewBox={`0 0 ${SIZE} ${SIZE}`}
    className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] lg:w-[400px] lg:h-[350px]"
  >
    {rings.map((ring) => {
      const circumference = 2 * Math.PI * ring.radius;
      const dash = circumference * ring.progress;
      // Center the filled arc on the TOP:
      // rotate so the arc's midpoint sits at the top (12 o'clock)
      const startAngle = -90 - (ring.progress * 360) / 2;
      return (
        <g key={ring.id}>
          {/* Track */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={ring.radius}
            fill="none"
            stroke={ring.color}
            strokeOpacity="0.18"
            strokeWidth={STROKE}
          />
          {/* Progress — arc centered on the top, bottom stays unfilled */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={ring.radius}
            fill="none"
            stroke={ring.color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            transform={`rotate(${startAngle} ${CENTER} ${CENTER})`}
          />
          {/* Label — white text sits on the colored arc at the top */}
          <text
            x={CENTER}
            y={CENTER - ring.radius + STROKE / 2 - 3}
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="#FFFFFF"
          >
            {ring.label}
          </text>
        </g>
      );
    })}
  </svg>
);

export default function TrackDailyWinsSection() {
  return (
    <section className="py-8 sm:py-12 lg:py-8  bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* HEADING */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-[24px] sm:text-[34px] lg:text-[40px] font-bold text-[#2D3D4A]">
            Track Your Daily Wins in{" "}
            <span className="text-[#5A4F9F]">Under 30 Seconds</span>
          </h2>
          <p className="mt-2 text-[#2D3D4A] text-[13px] sm:text-[16px] lg:text-[17px] font-medium">
            "Consistency is hard. We make it easy with our simple 3-step system.
          </p>
        </div>

        {/* CARD CONTAINER */}
        <div className="rounded-[28px] sm:rounded-[36px] border border-[#5A4F9F] bg-white px-5 sm:px-12 lg:px-20 py-6 sm:py-10 lg:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
            {/* LEFT — Today card */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[520px] bg-white rounded-2xl border border-[#ECECEC] shadow-[0_12px_35px_rgba(90,79,159,0.16)] px-8 sm:px-10 py-9 sm:py-11">
                <div className="flex items-center justify-between gap-5">
                  {/* Text */}
                  <div className="text-left">
                    <p className="text-[#9AA5AD] text-[15px] sm:text-[16px] font-medium">
                      Today
                    </p>
                    <p className="text-[#1F2937] text-[20px] sm:text-[26px] font-bold mt-1">
                      Monday, Feb 23
                    </p>
                    <p className="text-[#2D3D4A] text-[14px] sm:text-[16px] mt-4 leading-snug">
                      Click to view your
                      <br />
                      past logs
                    </p>
                  </div>
                  {/* Calendar image */}
                  <img
                    src="/images/calendar.png"
                    alt="Calendar"
                    className="w-[110px] sm:w-[150px] h-auto object-contain shrink-0"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT — Activity rings */}
            <div className="flex items-center justify-center">
              <ActivityRings />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}