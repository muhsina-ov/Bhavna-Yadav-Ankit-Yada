import { type MotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { RefObject } from "react";

/**
 * Spring-smoothed parallax. Raw scroll progress is stiff on touch devices
 * (finger flings arrive in bursts); the spring keeps movement continuous so
 * layers glide instead of stepping.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  outputRange: [number, number],
  offset: [string, string] = ["start start", "end start"],
): { y: MotionValue<number>; progress: MotionValue<number> } {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref as RefObject<HTMLElement>,
    offset: offset as never,
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.35,
    restDelta: 0.0005,
  });
  const range: [number, number] = reduced ? [0, 0] : outputRange;
  const y = useTransform(smooth, [0, 1], range);
  return { y, progress: smooth };
}
