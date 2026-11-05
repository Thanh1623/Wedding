const DOTS = [
  { top: "12%", left: "18%", delay: "0s" },
  { top: "22%", left: "78%", delay: "0.6s" },
  { top: "38%", left: "8%", delay: "1.1s" },
  { top: "48%", left: "92%", delay: "0.3s" },
  { top: "64%", left: "14%", delay: "1.6s" },
  { top: "72%", left: "84%", delay: "0.9s" },
  { top: "16%", left: "52%", delay: "1.4s" },
  { top: "86%", left: "46%", delay: "0.2s" },
];

export function Sparkles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {DOTS.map((dot) => (
        <span
          key={`${dot.top}-${dot.left}`}
          className="sparkle"
          style={{ top: dot.top, left: dot.left, animationDelay: dot.delay }}
        />
      ))}
    </div>
  );
}
