import { invite } from "@/config/invite";
import { Divider } from "./Divider";
import { ScrollReveal } from "@/components/ui/MotionComponents";
import { Flourish } from "./Ornaments";

export function Note() {
  return (
    <section id="baat-pakki" className="px-7 py-20 text-center sm:py-28">
      <ScrollReveal>
        <Divider className="mb-10" />
      </ScrollReveal>
      <ScrollReveal delay={0.08}>
        <p className="caps text-[0.58rem] tracking-[0.32em] text-olive">Baat Pakki</p>
        <p className="caps mt-2 text-[0.55rem] text-sepia/70">With the blessings of our families</p>
      </ScrollReveal>

      {/* Elegant ornamental illustration — replaces the audio/volume control for a clean look.
          Uses the same gold-foil, paper-grain language as the rest of the invitation.
          If a client image (WA0053) is placed at /public/baat-pakki.jpg it will be used automatically. */}
      <ScrollReveal delay={0.14}>
        <div className="mx-auto mt-8 flex max-w-[280px] flex-col items-center gap-4">
          <div className="relative flex w-full items-center justify-center">
            <Flourish className="w-28 text-gold/60 sm:w-32" />
          </div>
          {/* Optional client-provided artwork — gracefully falls back to ornamental flourishes if not present */}
          <div className="relative hidden w-full overflow-hidden rounded-xl border border-gold/20 bg-paper-deep/40 p-2 shadow-[0_10px_30px_-20px_rgba(180,140,80,0.5)] [&:has(img[src])]:block">
            <img
              src="/baat-pakki.jpg"
              alt="Baat Pakki illustration"
              width={540}
              height={360}
              loading="lazy"
              className="hidden w-full rounded-lg object-cover [&[src]]:block"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                const wrap = el.parentElement as HTMLElement | null;
                if (wrap) wrap.style.display = "none";
              }}
            />
          </div>
          {/* Pure-CSS gold emblem when image is absent — keeps section clean & on-brand */}
          <div
            aria-hidden="true"
            className="flex items-center justify-center gap-2 text-gold/60"
          >
            <span className="h-px w-8 bg-gold/30" />
            <span className="grid size-7 place-items-center rounded-full border border-gold/30 bg-gold/5 text-gold">
              <svg viewBox="0 0 24 24" fill="none" className="size-3.5" stroke="currentColor" strokeWidth="1.2">
                <path d="M12 21s-6-4.2-6-9a3.7 3.7 0 0 1 6-2.8A3.7 3.7 0 0 1 18 12c0 4.8-6 9-6 9Z" />
              </svg>
            </span>
            <span className="h-px w-8 bg-gold/30" />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <p className="mx-auto mt-7 max-w-md text-lg leading-[1.9] text-ink/85 sm:text-xl">
          {invite.invitationNote}
        </p>
      </ScrollReveal>
      <ScrollReveal delay={0.3}>
        <p className="script mt-8 text-3xl text-sepia">{invite.dayLine}</p>
        <p className="caps mt-4 text-[0.6rem] text-sepia">{invite.timeLine}</p>
        <p className="caps mt-3 text-[0.5rem] tracking-[0.22em] text-sepia/60">{(invite as unknown as { city?: string }).city ?? "Ludhiana, Punjab"}</p>
      </ScrollReveal>
    </section>
  );
}
