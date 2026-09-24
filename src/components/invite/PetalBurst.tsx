import { motion } from "motion/react";
import { useMemo } from "react";

const PALETTE = [
  "bg-gold/80",
  "bg-gold/60",
  "bg-olive/50",
  "bg-sepia/50",
  "bg-[oklch(0.72_0.15_45)]/70",
];

/**
 * A one-shot burst of marigold petals radiating from a point.
 * Rendered inside a `pointer-events-none` layer.
 */
export function PetalBurst({
  x = "50%",
  y = "50%",
  count = 26,
  spread = 220,
  seed = 0,
}: {
  x?: number | string;
  y?: number | string;
  count?: number;
  spread?: number;
  seed?: number;
}) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + ((seed % 7) * 0.21);
        const dist = spread * (0.45 + (((i * 37 + seed * 13) % 55) / 100));
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist * 0.85 + dist * 0.35,
          size: 6 + ((i * 11 + seed) % 8),
          rot: ((i * 73) % 360) + 180,
          duration: 1.5 + (((i * 17) % 9) / 10),
          color: PALETTE[(i + seed) % PALETTE.length],
        };
      }),
    [count, spread, seed],
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className={`absolute rounded-[60%_40%_55%_45%] ${p.color}`}
          style={{ left: x, top: y, width: p.size, height: p.size * 0.7 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.5, rotate: 0 }}
          animate={{
            x: p.dx,
            y: [0, p.dy * 0.55, p.dy + 90],
            opacity: [1, 1, 0],
            scale: [0.5, 1, 0.85],
            rotate: p.rot,
          }}
          transition={{ duration: p.duration, ease: [0.16, 0.7, 0.3, 1] }}
        />
      ))}
    </div>
  );
}
