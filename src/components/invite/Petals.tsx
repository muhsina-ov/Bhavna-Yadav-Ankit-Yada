import { motion } from "motion/react";
import { useMemo } from "react";

/** Slow drifting marigold petals — decorative only. */
export function Petals({ count = 14 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (i * 37) % 100,
        size: 6 + ((i * 13) % 9),
        delay: (i * 1.7) % 14,
        duration: 16 + ((i * 5) % 12),
        drift: ((i % 5) - 2) * 26,
      })),
    [count],
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-[60%_40%_55%_45%] bg-gold/35"
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.72, top: -20 }}
          initial={{ y: -30, opacity: 0, rotate: 0 }}
          animate={{
            y: ["-5vh", "108vh"],
            x: [0, p.drift, -p.drift * 0.6, 0],
            opacity: [0, 0.85, 0.85, 0],
            rotate: [0, 190, 340],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
