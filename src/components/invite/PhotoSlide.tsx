import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "./Reveal";
import { invite } from "@/config/invite";
import coupleImg from "@/assets/image1.jpeg";
import { CornerFloret, Flourish } from "./Ornaments";

export function PhotoSlide() {
  const reduced = useReducedMotion();

  return (
    <section className="px-6 py-20 text-center sm:py-28">
      <Reveal>
        <p className="caps text-[0.6rem] text-olive">A glimpse of love</p>
        <motion.h2
          className="script mt-4 text-4xl text-ink sm:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
        >
          Moments We Cherish
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-md text-base leading-relaxed text-sepia sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Every frame tells our story — filled with love, laughter, and lifelong memories.
        </motion.p>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mx-auto mt-10 max-w-md">
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-2xl border border-gold/40 bg-paper/80 p-3.5 shadow-[0_20px_45px_-18px_rgba(180,140,80,0.35)] backdrop-blur-sm"
          >
            {/* Outer gold border flourish */}
            <div className="relative overflow-hidden rounded-xl border border-gold/30 bg-paper">
              <motion.img
                src={coupleImg}
                alt={`${invite.groom} and ${invite.bride} photo`}
                width={1200}
                height={900}
                loading="lazy"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105 select-none max-h-[500px]"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-85 group-hover:opacity-70 transition-opacity" />

              {/* Corner Florets — inset slightly more and reduced opacity so names never collide (WA0054 fix) */}
              <CornerFloret className="absolute top-2.5 left-2.5 size-7 text-gold/70 sm:size-8" />
              <CornerFloret className="absolute top-2.5 right-2.5 size-7 -scale-x-100 text-gold/70 sm:size-8" />
              <CornerFloret className="absolute bottom-2.5 left-2.5 size-7 -scale-y-100 text-gold/50 sm:size-8 sm:text-gold/70" />
              <CornerFloret className="absolute bottom-2.5 right-2.5 size-7 -scale-100 text-gold/50 sm:size-8 sm:text-gold/70" />

              {/* Photo Overlay Caption — inset higher and with pill backdrop to avoid floret overlap; names wrap cleanly */}
              <div className="absolute inset-x-3 bottom-3 text-center sm:inset-x-4 sm:bottom-4">
                <div className="mx-auto max-w-[92%] rounded-xl bg-ink/45 px-3 py-2.5 backdrop-blur-[2px] sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
                  <Flourish className="mx-auto mb-1 hidden w-16 text-gold/70 sm:block sm:w-20" />
                  <p className="script text-balance break-words text-[1.35rem] leading-none text-paper drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] sm:text-3xl">
                    {invite.groom} &amp; {invite.bride}
                  </p>
                  <p className="caps mt-1 text-[0.5rem] tracking-[0.18em] text-gold/90 sm:mt-0.5 sm:text-[0.52rem]">
                    {invite.dayLine}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}

