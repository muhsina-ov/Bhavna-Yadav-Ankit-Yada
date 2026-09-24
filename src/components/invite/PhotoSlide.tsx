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
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Corner Florets */}
              <CornerFloret className="absolute top-3 left-3 size-8 text-gold/80" />
              <CornerFloret className="absolute top-3 right-3 size-8 -scale-x-100 text-gold/80" />
              <CornerFloret className="absolute bottom-3 left-3 size-8 -scale-y-100 text-gold/80" />
              <CornerFloret className="absolute bottom-3 right-3 size-8 -scale-100 text-gold/80" />

              {/* Photo Overlay Caption */}
              <div className="absolute bottom-4 inset-x-0 text-center px-4">
                <Flourish className="mx-auto w-20 text-gold/80 mb-1" />
                <p className="script text-2xl text-paper drop-shadow-md sm:text-3xl">
                  {invite.groom} &amp; {invite.bride}
                </p>
                <p className="caps text-[0.52rem] text-gold/90 tracking-widest mt-0.5">
                  {invite.dayLine}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}

