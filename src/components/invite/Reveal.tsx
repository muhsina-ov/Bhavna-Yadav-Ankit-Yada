import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Scroll-triggered fade + rise. Restrained, never bouncy. */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 1, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Letter-by-letter reveal used for the couple's names.
 * Pass `trigger` to drive it from a parent (e.g. after the envelope opens)
 * instead of from the viewport.
 */
export function ScriptNames({
  text,
  className,
  delay = 0,
  trigger,
}: {
  text: string;
  className?: string;
  delay?: number;
  trigger?: "hidden" | "show" | string;
}) {
  const chars = Array.from(text);
  const controlled = trigger !== undefined;
  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      {...(controlled ? { animate: trigger } : { whileInView: "show" })}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ staggerChildren: 0.045, delayChildren: delay }}
    >

      {chars.map((c, i) => (
        <motion.span
          key={`${c}-${i}`}
          aria-hidden="true"
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 16, rotate: -3 },
            show: { opacity: 1, y: 0, rotate: 0 },
          }}
          transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
    </motion.span>
  );
}
