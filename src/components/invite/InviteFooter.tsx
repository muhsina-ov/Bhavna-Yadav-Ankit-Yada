import { motion } from "motion/react";
import { useRef } from "react";
import footerBg from "@/assets/footer-bg.jpg";
import { invite } from "@/config/invite";
import { useParallax } from "@/hooks/use-parallax";
import { ScriptNames } from "./Reveal";

export function InviteFooter() {
  const ref = useRef<HTMLElement>(null);
  // Slower, spring-smoothed drift so the marigold texture glides on touch.
  const { y } = useParallax(ref, [-70, 40], ["start end", "end end"]);

  return (
    <footer
      ref={ref}
      className="grain relative flex min-h-[70svh] items-center justify-center overflow-hidden px-6 pb-36 pt-24 text-center"
    >
      <motion.img
        src={footerBg}
        alt=""
        aria-hidden="true"
        width={1536}
        height={1024}
        loading="lazy"
        style={{ y }}
        className="absolute inset-0 size-full scale-125 object-cover will-change-transform"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-paper/72" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-paper via-transparent to-paper/90"
      />

      <div className="relative">
        <motion.p
          className="caps text-[0.58rem] text-sepia"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          {invite.closing}
        </motion.p>

        {/* Responsive names — stacked on mobile to avoid ornament overlap, inline on desktop */}
        <div className="script mt-5 flex flex-col items-center gap-1 leading-[1.1] text-ink sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-4">
          <span className="block max-w-full break-words text-center text-[2.6rem] sm:text-6xl">
            <ScriptNames text={invite.bride} />
          </span>
          <span className="block shrink-0 text-center text-[1.8rem] text-gold sm:text-[2.6rem]" aria-hidden="true">
            &amp;
          </span>
          <span className="block max-w-full break-words text-center text-[2.6rem] sm:text-6xl">
            <ScriptNames text={invite.groom} delay={0.3} />
          </span>
        </div>

        <motion.p
          className="caps mt-8 text-[0.5rem] text-sepia/80"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          {invite.dateLabel} · {invite.venue.name} · {(invite as unknown as { city?: string }).city ?? "Ludhiana, Punjab"}
        </motion.p>
        <motion.a
          href="https://www.instagram.com/invitestory.in/"
          target="_blank"
          rel="noreferrer"
          className="caps mt-4 inline-block text-[0.5rem] text-sepia/70 transition-colors hover:text-sepia"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          Follow @invitestory.in on Instagram
        </motion.a>
      </div>
    </footer>
  );
}
