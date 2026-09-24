/** Hand-drawn style gold line ornaments used on the envelope cover. */

export function CornerFloret({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" fill="none">
        <path d="M2 30C24 30 34 20 34 2" />
        <path d="M2 44C34 44 48 30 48 2" opacity="0.6" />
        <path d="M10 62c18-2 26-10 30-26 4 16 12 24 30 26-18 2-26 10-30 26-4-16-12-24-30-26Z" />
        <circle cx="40" cy="62" r="2.2" fill="currentColor" stroke="none" opacity="0.8" />
        <path d="M62 12c10 0 16 6 16 16" opacity="0.5" />
        <circle cx="80" cy="30" r="1.6" fill="currentColor" stroke="none" opacity="0.6" />
        <circle cx="18" cy="86" r="1.6" fill="currentColor" stroke="none" opacity="0.6" />
      </g>
    </svg>
  );
}

/** Concentric mandala that slowly rotates behind the wax seal. */
export function MandalaRing({ className = "" }: { className?: string }) {
  const petals = Array.from({ length: 24 }, (_, i) => i * 15);
  const spokes = Array.from({ length: 48 }, (_, i) => i * 7.5);
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" fill="none">
        <circle cx="100" cy="100" r="96" strokeWidth="0.4" opacity="0.5" />
        <circle cx="100" cy="100" r="78" strokeWidth="0.5" strokeDasharray="1 5" />
        <circle cx="100" cy="100" r="58" strokeWidth="0.4" opacity="0.7" />
        <circle cx="100" cy="100" r="40" strokeWidth="0.4" opacity="0.5" />
        {petals.map((a) => (
          <ellipse
            key={a}
            cx="100"
            cy="32"
            rx="5.5"
            ry="14"
            strokeWidth="0.5"
            opacity="0.65"
            transform={`rotate(${a} 100 100)`}
          />
        ))}
        {spokes.map((a) => (
          <line
            key={a}
            x1="100"
            y1="60"
            x2="100"
            y2="52"
            strokeWidth="0.4"
            opacity="0.55"
            transform={`rotate(${a} 100 100)`}
          />
        ))}
      </g>
    </svg>
  );
}

/** Thin gold rule with a centred diamond — used above/below the script line. */
export function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 12" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
        <path d="M2 6h78" />
        <path d="M140 6h78" />
        <path d="M92 6l6-4 6 4-6 4-6-4Z" />
        <path d="M116 6l6-4 6 4-6 4-6-4Z" />
        <circle cx="110" cy="6" r="1.6" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
