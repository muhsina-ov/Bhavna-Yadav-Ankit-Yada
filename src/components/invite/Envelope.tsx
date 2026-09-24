import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import paper from "@/assets/paper.jpg";
import { invite } from "@/config/invite";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { CornerFloret, Flourish, MandalaRing } from "./Ornaments";
import { PetalBurst } from "./PetalBurst";
import { Petals } from "./Petals";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * The "wow" moment: the page opens as a sealed paper envelope — gold foil
 * frame, mandala guilloche, a wax seal with ribbon tails. Tapping the seal
 * cracks it, showers marigold petals and parts the paper.
 */
export function Envelope({ onOpen }: { onOpen?: () => void }) {
  const reduced = useReducedMotion();
  const [state, setState] = useState<"sealed" | "breaking" | "gone">("sealed");
  const monogram = `${invite.groom[0]}${invite.bride[0]}`;

  useEffect(() => {
    lockScroll();
    return () => unlockScroll();
  }, []);

  const open = () => {
    if (state !== "sealed") return;
    setState("breaking");
    window.dispatchEvent(new CustomEvent("play-wedding-music"));
    if (navigator.vibrate) navigator.vibrate([12, 40, 18]);
    window.setTimeout(
      () => {
        setState("gone");
        unlockScroll();
        onOpen?.();
      },
      reduced ? 200 : 1600,
    );
  };

  const parted = state !== "sealed";
  const paperStyle = { backgroundImage: `url(${paper})`, backgroundSize: "480px" };

  const half = (position: "top" | "bottom") => (
    <motion.div
      className={`absolute inset-x-0 h-1/2 overflow-hidden ${position === "top" ? "top-0" : "bottom-0"}`}
      initial={false}
      animate={
        parted
          ? { y: position === "top" ? "-102%" : "102%", rotate: position === "top" ? -1.2 : 1.2 }
          : { y: "0%", rotate: 0 }
      }
      transition={{ duration: reduced ? 0.2 : 1.3, ease: EASE, delay: parted && !reduced ? 0.4 : 0 }}
    >
      <div
        className="grain absolute inset-x-0 h-[100svh] bg-paper"
        style={{ ...paperStyle, [position === "top" ? "top" : "bottom"]: 0 }}
      >
        {/* warm candle-light glow behind the seal + edge vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 40% at 50% 50%, color-mix(in oklab, var(--gold) 16%, transparent) 0%, transparent 70%), radial-gradient(120% 90% at 50% 50%, transparent 55%, color-mix(in oklab, var(--sepia) 22%, transparent) 100%)",
          }}
        />

        {/* gold foil double frame with corner florets */}
        <div aria-hidden="true" className="absolute inset-4 sm:inset-6">
          <div className="absolute inset-0 border border-gold/45" />
          <div className="absolute inset-[6px] border border-gold/20" />
          <CornerFloret className="absolute -top-px -left-px size-16 text-gold/60 sm:size-20" />
          <CornerFloret className="absolute -top-px -right-px size-16 -scale-x-100 text-gold/60 sm:size-20" />
          <CornerFloret className="absolute -bottom-px -left-px size-16 -scale-y-100 text-gold/60 sm:size-20" />
          <CornerFloret className="absolute -right-px -bottom-px size-16 -scale-100 text-gold/60 sm:size-20" />
        </div>

        <div className="relative flex h-full flex-col items-center justify-center px-10 text-center">
          <p className="caps text-[0.55rem] text-sepia/90">Save the date</p>
          <Flourish className="mt-3 w-32 text-gold/70" />
          <p className="script mt-4 text-[3rem] leading-tight text-ink sm:text-[3.75rem]">
            You&apos;re invited
          </p>
          <p className="caps mt-3 text-[0.5rem] text-olive/80">{invite.groom} &amp; {invite.bride}</p>
          {/* reserved space for the wax seal that sits on the split line */}
          <div aria-hidden="true" className="h-64 shrink-0" />
          <Flourish className="w-24 rotate-180 text-gold/50" />
          <p className="caps mt-5 text-[0.6rem] text-ink/80">{invite.dateLabel}</p>
          <p className="caps mt-3 text-[0.48rem] text-sepia/75">{invite.venue.name}</p>
          <p className="caps mt-2 text-[0.44rem] text-sepia/50">Ludhiana, Punjab</p>
        </div>
      </div>

      {/* soft fold shadow along the tear line */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 h-8 ${position === "top" ? "bottom-0 bg-gradient-to-b from-transparent to-ink/10" : "top-0 bg-gradient-to-t from-transparent to-ink/6"}`}
      />
    </motion.div>
  );

  return (
    <AnimatePresence>
      {state !== "gone" && (
        <motion.div
          className="fixed inset-0 z-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {half("top")}
          {half("bottom")}

          {!reduced && state === "sealed" && (
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <Petals count={9} />
            </div>
          )}

          {/* seal + call to action sit above the split line */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
            <AnimatePresence>
              {state === "sealed" && (
                <motion.button
                  type="button"
                  onClick={open}
                  aria-label="Tap the seal to open the invitation"
                  className="relative grid size-44 shrink-0 place-items-center rounded-full"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.9, opacity: 0, rotate: 18 }}
                  transition={{ duration: 0.65, ease: EASE }}
                  whileTap={{ scale: 0.93 }}
                >
                  {/* slowly rotating mandala guilloche */}
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 text-gold/45"
                    animate={reduced ? {} : { rotate: 360 }}
                    transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                  >
                    <MandalaRing className="size-full" />
                  </motion.span>

                  {/* breathing halo */}
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-6 rounded-full border border-gold/50"
                    animate={reduced ? {} : { scale: [1, 1.4], opacity: [0.55, 0] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
                  />
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-8 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, color-mix(in oklab, var(--gold) 45%, transparent) 0%, transparent 70%)",
                    }}
                    animate={reduced ? {} : { opacity: [0.5, 0.9, 0.5], scale: [0.96, 1.05, 0.96] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* ribbon tails tucked under the wax */}
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 left-1/2 h-24 w-16 -translate-x-1/2 translate-y-4"
                    style={{
                      background:
                        "linear-gradient(180deg, color-mix(in oklab, var(--gold) 70%, transparent), transparent)",
                      clipPath: "polygon(28% 0, 72% 0, 100% 100%, 78% 84%, 50% 100%, 22% 84%, 0 100%)",
                      opacity: 0.55,
                    }}
                  />

                  {/* the wax seal */}
                  <motion.span
                    aria-hidden="true"
                    className="relative grid size-24 place-items-center overflow-hidden text-paper shadow-[0_18px_40px_-16px_oklch(0.5_0.1_70)]"
                    style={{
                      clipPath:
                        "polygon(50% 0%, 68% 8%, 88% 6%, 94% 26%, 100% 50%, 94% 74%, 88% 94%, 68% 92%, 50% 100%, 32% 92%, 12% 94%, 6% 74%, 0% 50%, 6% 26%, 12% 6%, 32% 8%)",
                      background:
                        "radial-gradient(120% 120% at 30% 22%, oklch(0.85 0.09 88) 0%, oklch(0.72 0.1 78) 45%, oklch(0.58 0.09 66) 100%)",
                    }}
                    animate={reduced ? {} : { rotate: [-1.2, 1.2, -1.2] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-[7px] rounded-full border border-paper/35"
                    />
                    <span className="script relative text-[1.9rem] leading-none tracking-tight drop-shadow-[0_1px_0_oklch(0.5_0.09_66)]">
                      {monogram}
                    </span>
                    {/* foil shimmer sweep */}
                    {!reduced && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-y-[-40%] w-10 -skew-x-12 bg-paper/35 blur-[6px]"
                        animate={{ x: ["-140%", "420%"] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 3.4,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </motion.span>
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {state === "sealed" && (
                <motion.span
                  className="caps flex items-center gap-3 text-[0.55rem] text-sepia"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  exit={{ opacity: 0, transition: { duration: 0.25, repeat: 0 } }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="h-px w-6 bg-gold/60" />
                  Tap to open
                  <span className="h-px w-6 bg-gold/60" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {state === "breaking" && !reduced && (
            <PetalBurst count={44} spread={340} seed={3} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
