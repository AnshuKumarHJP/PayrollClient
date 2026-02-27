
const ProgressCircle = ({
  open = false,
  progress = 0,          // 0 - 100
  title = "Uploading file",
  subtitle = "Please wait…",
  color = "#4f46e5",     // Dynamic color prop
}) => {
  if (!open) return null;

  const radius = 80;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[320px] rounded-xl bg-white p-6 shadow-2xl">
        {/* TITLE */}
        <div className="text-center">
          <h3 className="text-base font-semibold text-gray-800">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        </div>

        {/* PROGRESS CIRCLE */}
        <div className="relative mt-6 flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2}>
            {/* background ring */}
            <circle
              stroke="#e5e7eb"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />

            {/* progress ring */}
            <circle
              stroke={color}
              fill="transparent"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              style={{
                strokeDashoffset,
                transition: "stroke-dashoffset 0.4s ease",
              }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              transform={`rotate(-90 ${radius} ${radius})`}
            />
          </svg>

          {/* PERCENT TEXT */}
          <div className="absolute text-center">
            <div className="text-xl font-semibold text-gray-800">
              {progress}%
            </div>
            <div className="text-xs text-gray-500">
              uploading
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center text-xs text-gray-400">
          Do not close this window
        </div>
      </div>
    </div>
  );
};

export default ProgressCircle;
