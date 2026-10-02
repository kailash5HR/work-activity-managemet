export default function Logo() {
  return (
    <div className="logo">
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2.6" />
        <path d="M16 3a13 13 0 0 1 13 13" stroke="#1E6A4C" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="16" cy="16" r="3.6" fill="currentColor" />
      </svg>
      <strong>Daily Activity</strong>
    </div>
  );
}