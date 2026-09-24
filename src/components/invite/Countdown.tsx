import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { invite } from "@/config/invite";
import { Reveal } from "./Reveal";

const target = new Date(`${invite.start}${invite.timeZoneOffset}`).getTime();

function parts(diff: number) {
  const s = Math.max(0, Math.floor(diff / 1000));
  return {
    Days: Math.floor(s / 86400),
    Hours: Math.floor((s % 86400) / 3600),
    Minutes: Math.floor((s % 3600) / 60),
    Seconds: s % 60,
  };
}

function Unit({ label, value }: { label: string; value: number }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex min-w-[3.75rem] flex-col items-center sm:min-w-[5rem]">
      <div className="relative h-12 overflow-hidden sm:h-16">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="block text-4xl tabular-nums text-ink sm:text-5xl"
            initial={{ y: "70%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-70%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="caps mt-2 text-[0.5rem] text-sepia sm:text-[0.55rem]">{label}</span>
    </div>
  );
}

export function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = parts(now === null ? 0 : target - now);

  return (
    <section className="px-6 pb-20 sm:pb-28">
      <Reveal>
        <div className="grain mx-auto max-w-md rounded-sm border border-border bg-paper-deep/60 px-5 py-9 text-center shadow-[0_18px_40px_-32px_rgba(60,45,25,0.6)] sm:px-10">
          <p className="caps text-[0.58rem] text-olive">Counting down to the evening</p>
          <div
            className="mt-7 flex items-start justify-center gap-1 sm:gap-3"
            suppressHydrationWarning
          >
            {(Object.keys(t) as Array<keyof typeof t>).map((k, i) => (
              <div key={k} className="flex items-start">
                {i > 0 && <span className="mt-1 px-1 text-3xl text-gold/50 sm:text-4xl">·</span>}
                <Unit label={k} value={t[k]} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
