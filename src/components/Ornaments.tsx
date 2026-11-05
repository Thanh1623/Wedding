export function GoldRule({ className = "" }: { className?: string }) {
  return <div className={`gold-rule ${className}`} aria-hidden="true" />;
}

export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 88 88"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="44" cy="44" r="42" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="44" cy="44" r="36" stroke="currentColor" strokeWidth="0.4" opacity="0.7" />
      {/* N + T ligature: high-contrast strokes, T's crossbar runs through N's right stem, T's foot sweeps under both */}
      <g stroke="currentColor" fill="none">
        <path d="M20 26V60M42 28V60" strokeWidth="1.3" />
        <path d="M20 26L42 60M56 28V58" strokeWidth="3.6" />
        <path d="M33 26H69" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M56 58C54 68 34 70 15 60" strokeWidth="0.9" strokeLinecap="round" />
      </g>
      <circle cx="69" cy="26" r="1.6" fill="currentColor" />
      <circle cx="15" cy="60" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function WaxSeal({ letter = "Hỷ", className = "h-20 w-20" }: { letter?: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={`wax-seal ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id="wax" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#f6e2ac" />
          <stop offset="55%" stopColor="#e8c47a" />
          <stop offset="100%" stopColor="#a16207" />
        </radialGradient>
      </defs>
      <path
        fill="url(#wax)"
        d="M60 6c8 0 12 6 18 7s12-2 18 4 4 13 8 18 10 8 8 16-8 11-8 18-2 14-8 18-13 4-18 8-10 7-18 7-12-6-18-7-12 2-18-4-4-13-8-18-10-8-8-16 8-11 8-18 2-14 8-18 13-4 18-8 10-7 18-7z"
      />
      <circle cx="60" cy="60" r="28" fill="none" stroke="#7c1d3f" strokeWidth="1.2" opacity="0.6" />
      <text
        x="60"
        y="68"
        textAnchor="middle"
        fill="#7c1d3f"
        fontSize="28"
        fontFamily="serif"
      >
        {letter}
      </text>
    </svg>
  );
}

export function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <path
        d="M8 112c2-42 18-72 48-96M8 112c42-2 72-18 96-48"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M20 100c16-8 28-22 36-40"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.7"
      />
    </svg>
  );
}
