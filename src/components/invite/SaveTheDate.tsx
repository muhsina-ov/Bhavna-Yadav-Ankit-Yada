import { invite } from "@/config/invite";
import { Divider } from "./Divider";
import { ScrollReveal } from "@/components/ui/MotionComponents";
import { Flourish, CornerFloret } from "./Ornaments";

export function SaveTheDate() {
  return (
    <section id="save-the-date" className="px-6 pb-20 text-center sm:pb-28">
      <ScrollReveal>
        <Divider className="mb-10" />
        <p className="caps text-[0.58rem] tracking-[0.32em] text-olive">Save the Date</p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="grain relative mx-auto mt-8 max-w-md overflow-hidden rounded-sm border border-gold/25 bg-paper-deep/60 px-6 py-10 shadow-[0_18px_40px_-32px_rgba(60,45,25,0.6)] sm:px-10 sm:py-12">
          {/* Corner florets — subtle, not overlapping text */}
          <CornerFloret className="absolute left-2 top-2 size-10 text-gold/15 sm:size-12" />
          <CornerFloret className="absolute right-2 top-2 size-10 -scale-x-100 text-gold/15 sm:size-12" />
          <CornerFloret className="absolute bottom-2 left-2 size-10 -scale-y-100 text-gold/15 sm:size-12" />
          <CornerFloret className="absolute bottom-2 right-2 size-10 -scale-100 text-gold/15 sm:size-12" />

          <p className="caps text-[0.5rem] tracking-[0.3em] text-sepia/70">You are cordially invited</p>

          <p className="script mt-4 text-[2.8rem] leading-none tracking-[0.04em] text-ink sm:text-6xl">
            {invite.dateLabel}
          </p>

          <Flourish className="mx-auto mt-5 w-24 text-gold/50 sm:w-32" />

          <p className="script mt-5 text-2xl text-highlight sm:text-3xl">{invite.dayLine}</p>
          <p className="caps mt-3 text-[0.6rem] text-sepia/80">{invite.timeLine}</p>
          <p className="caps mt-2 text-[0.5rem] tracking-[0.2em] text-sepia/60">
            {(invite as unknown as { city?: string }).city ?? "Ludhiana, Punjab"} · {invite.venue.name}
          </p>

          <div className="mx-auto mt-6 h-px w-16 bg-gold/20" />
          <p className="mx-auto mt-6 max-w-xs text-sm leading-relaxed text-ink/70">
            Join us as we celebrate love, laughter, and a beautiful beginning together.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
