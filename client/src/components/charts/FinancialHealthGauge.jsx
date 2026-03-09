export default function FinancialHealthGauge({ score }) {

  const percentage = Math.min(score, 100);

  return (
    <div className="flex flex-col items-center mt-4">

      <div className="relative w-32 h-32">

        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="54"
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />

          <circle
            cx="64"
            cy="64"
            r="54"
            stroke="#065f46"
            strokeWidth="12"
            fill="none"
            strokeDasharray="339"
            strokeDashoffset={339 - (339 * percentage) / 100}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">
          {score}
        </div>

      </div>

      <p className="text-sm text-gray-500 mt-2">
        Financial Health Score
      </p>

    </div>
  );
}