import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * A thin gold thread that fills as you scroll, with a bead riding along it.
 * Doubles as reading progress.
 */
export function ScrollThread() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const top = useTransform(progress, (v) => `${Math.min(1, Math.max(0, v)) * 100}%`);

  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-2 top-0 z-30 h-full w-px"
    >
      <div className="absolute inset-0 bg-border/60" />
      <motion.div
        className="absolute inset-x-0 top-0 h-full origin-top bg-gold"
        style={{ scaleY: progress }}
      />
      <motion.span
        className="absolute -left-[3px] size-[7px] -translate-y-1/2 rounded-full bg-gold shadow-[0_0_0_4px_oklch(0.72_0.09_82/0.18)]"
        style={{ top }}
      />
    </div>
  );
}
