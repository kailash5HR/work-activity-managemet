function ProgressRing({ percentage }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (percentage / 100) * circumference;

  return (
    <div className="progress-ring">
      <svg width="130" height="130">
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="var(--line)"
          strokeWidth="10"
        />

        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 65 65)"
        />
      </svg>

      <div className="progress-ring-value">
        {percentage}%
      </div>
    </div>
  );
}

export default ProgressRing;