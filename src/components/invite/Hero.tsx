import { motion, useReducedMotion, useTransform } from "motion/react";
import { useCallback, useRef, useState } from "react";
import welcomeImg from "@/assets/IMG-20260924-WA0053.jpg";
import { invite } from "@/config/invite";
import { useParallax } from "@/hooks/use-parallax";
import { getLenis } from "@/lib/lenis";
import { PetalBurst } from "./PetalBurst";
import { Petals } from "./Petals";
import { ScriptNames } from "./Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CornerFloret, Flourish } from "./Ornaments";

type Burst = { id: number; x: number; y: number };

export function Hero({ ready = true }: { ready?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { y, progress } = useParallax(ref, [0, 70]);
  const fade = useTransform(progress, [0, 0.75], [1, 0]);
  const [bursts, setBursts] = useState<Burst[]>([]);

  const ease = [0.22, 0.61, 0.36, 1] as const;
  const anim = ready ? "show" : "hidden";

  /** Tap anywhere on the hero to scatter petals — pure delight. */
  const scatter = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reduced) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const id = Date.now();
      setBursts((b) => [...b.slice(-2), { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      if (navigator.vibrate) navigator.vibrate(8);
      window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 2600);
    },
    [reduced],
  );

  const scrollOn = () => {
    const target = ref.current?.nextElementSibling as HTMLElement | null;
    if (!target) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.4, offset: -20 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      onPointerDown={scatter}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center select-none"
    >
      <ScrollProgress />
      <Petals />
      {/* Canvas decorative flourishes */}
      <Flourish className="absolute top-16 left-16 size-24 text-gold/10 rotate-[-15deg]" />
      <Flourish className="absolute bottom-16 right-16 size-20 text-gold/10 rotate-45" />
      <CornerFloret className="absolute top-8 right-8 size-12 text-gold/10" />
      <CornerFloret className="absolute bottom-8 left-8 size-12 text-gold/10 rotate-180" />
      {bursts.map((b) => (
        <PetalBurst key={b.id} x={b.x} y={b.y} count={14} spread={130} seed={b.id % 11} />
      ))}

      <motion.p
        className="caps text-[0.62rem] text-sepia sm:text-xs"
        initial={{ opacity: 0, y: 12 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 1, ease }}
      >
        Save the date
      </motion.p>

      <motion.p
        className="script mt-5 text-5xl tracking-[0.06em] text-ink sm:text-6xl"
        initial={{ opacity: 0, y: 16 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 1.1, delay: 0.15, ease }}
      >
        {invite.dateLabel}
      </motion.p>

      <motion.div style={{ y, opacity: fade }} className="mt-8 w-full max-w-xs sm:max-w-md">
        <motion.div
          className="relative mx-auto overflow-hidden rounded-2xl border-2 border-gold/40 p-2 bg-paper/60 shadow-[0_20px_50px_-20px_rgba(180,140,80,0.4)]"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
          transition={{ duration: 1.4, delay: 0.3, ease }}
        >
          <div className="relative overflow-hidden rounded-xl border border-gold/20">
            <motion.img
              src={welcomeImg}
              alt={`Welcome artwork — ${invite.groom} & ${invite.bride}`}
              width={1024}
              height={576}
              draggable={false}
              className="mx-auto w-full h-auto object-contain transition-transform duration-700 hover:scale-105 select-none max-h-[380px] sm:max-h-[460px]"
            />
            {/* Soft vignette gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-paper/30 via-transparent to-paper/20" />
            <CornerFloret className="absolute top-2 left-2 size-8 text-gold/70" />
            <CornerFloret className="absolute top-2 right-2 size-8 -scale-x-100 text-gold/70" />
            <CornerFloret className="absolute bottom-2 left-2 size-8 -scale-y-100 text-gold/70" />
            <CornerFloret className="absolute bottom-2 right-2 size-8 -scale-100 text-gold/70" />
          </div>
        </motion.div>
      </motion.div>

      <motion.p
        className="caps mt-6 max-w-xs text-[0.62rem] leading-[2.1] text-olive sm:text-xs"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        Join us for the engagement party of
      </motion.p>

      {/* Couple names — responsive: stacked on mobile to avoid overlap with florets/frames, inline on desktop.
          Prevents the WA0054 overlap where script names collided with the gold border / CornerFloret. */}
      <motion.h1
        className="script mt-4 flex w-full max-w-[22rem] flex-col items-center gap-0.5 px-4 leading-[1.1] text-ink sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-1 sm:px-6 sm:leading-[1.05]"
        initial="hidden"
        animate={anim}
      >
<span className="block max-w-full break-words text-center text-[2.8rem] leading-[1.1] sm:text-7xl sm:leading-[1.05]">
           <ScriptNames text={invite.groom} delay={0.85} trigger={anim} />
         </span>
         <span className="block shrink-0 text-center text-[2rem] leading-none text-gold sm:text-[3.2rem] sm:leading-none" aria-hidden="true">
           &amp;
         </span>
         <span className="block max-w-full break-words text-center text-[2.8rem] leading-[1.1] sm:text-7xl sm:leading-[1.05]">
           <ScriptNames text={invite.bride} delay={1.2} trigger={anim} />
        </span>
      </motion.h1>

      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          scrollOn();
        }}
        aria-label="Scroll to the invitation"
        className="group mt-10 flex min-h-14 flex-col items-center justify-end gap-2 px-8 pb-1 hover:scale-105 transition-transform duration-300"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 1.8 }}
        whileTap={{ scale: 0.94 }}
      >
        <span className="caps text-[0.55rem] text-sepia/70 group-hover:text-olive transition-colors duration-300">Scroll</span>
        <motion.span
          aria-hidden="true"
          className="h-10 w-px bg-gradient-to-b from-sepia/60 to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
          style={{ transformOrigin: "top" }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.button>
    </section>
  );
}
