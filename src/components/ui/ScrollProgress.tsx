import { motion, useReducedMotion, useTransform, useScroll } from "motion/react";
import { useEffect, useState, useCallback } from "react";

/** Scroll progress bar — thin, gold, smooth. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[10000] h-[3px] origin-left bg-gradient-to-r from-gold via-gold/80 to-gold/40"
      style={{ scaleX }}
    />
  );
}
