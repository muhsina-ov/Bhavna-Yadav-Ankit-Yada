import { invite } from "@/config/invite";
import { Divider } from "./Divider";
import { ScrollReveal } from "@/components/ui/MotionComponents";
import { CornerFloret } from "./Ornaments";
import baatPakkiImg from "@/assets/IMG-20260924-WA0053.jpg";

export function Note() {
  return (
    <section id="baat-pakki" className="px-5 py-16 text-center sm:px-7 sm:py-24">
      <ScrollReveal>
        <Divider className="mb-8 sm:mb-10" />
      </ScrollReveal>
      <ScrollReveal delay={0.08}>
        <p className="caps text-[0.58rem] tracking-[0.32em] text-olive">Baat Pakki</p>
        <p className="caps mt-2 text-[0.55rem] text-sepia/70">With the blessings of our families</p>
      </ScrollReveal>

      {/* Customer provided Baat Pakki artwork (IMG-20260924-WA0053.jpg) */}
      <ScrollReveal delay={0.14}>
        <div className="mx-auto mt-6 w-full max-w-sm sm:max-w-md">
          <div className="relative overflow-hidden rounded-2xl border-2 border-gold/40 p-2 bg-paper/70 shadow-[0_20px_50px_-20px_rgba(180,140,80,0.4)] backdrop-blur-sm">
            <div className="relative overflow-hidden rounded-xl border border-gold/25">
              <img
                src={baatPakkiImg}
                alt="Baat Pakki — Ankit Yadav & Bhavna Yadav"
                width={1024}
                height={576}
                loading="eager"
                className="w-full h-auto object-contain select-none transition-transform duration-700 hover:scale-[1.02]"
              />
              <CornerFloret className="absolute top-2 left-2 size-7 text-gold/70 sm:size-8" />
              <CornerFloret className="absolute top-2 right-2 size-7 -scale-x-100 text-gold/70 sm:size-8" />
              <CornerFloret className="absolute bottom-2 left-2 size-7 -scale-y-100 text-gold/70 sm:size-8" />
              <CornerFloret className="absolute bottom-2 right-2 size-7 -scale-100 text-gold/70 sm:size-8" />
            </div>
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
