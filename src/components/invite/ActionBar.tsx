import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { invite } from "@/config/invite";
import { downloadIcs } from "@/lib/calendar";
import { directionsUrl } from "@/config/invite";

/**
 * Thumb-reachable action bar. Every target is >= 56px tall so it works with
 * one hand on a phone. Appears once the hero has scrolled past.
 */
export function ActionBar() {
  const [visible, setVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tap = () => {
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const share = async () => {
    tap();
    const data = {
      title: `${invite.groom} & ${invite.bride}`,
      text: `You're invited — ${invite.dayLine}, ${invite.venue.name}`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(data.url);
    } catch {
      /* dismissed */
    }
  };

  return (
    <motion.nav
      aria-label="Invitation actions"
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      initial={false}
      animate={{ y: visible ? 0 : 120, opacity: visible ? 1 : 0 }}
      transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 0.61, 0.36, 1] }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <div className="mx-auto flex max-w-md items-stretch gap-2 rounded-full border border-border/80 bg-paper/85 p-1.5 shadow-[0_18px_40px_-24px_rgba(60,45,25,0.7)] backdrop-blur-md">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => {
            tap();
            downloadIcs();
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2500);
          }}
          className="caps flex min-h-14 flex-1 items-center justify-center rounded-full bg-ink px-3 text-[0.5rem] text-paper transition-all duration-200 hover:shadow-lg hover:shadow-ink/20"
        >
          {saved ? "Saved" : "Save date"}
        </motion.button>

        <motion.a
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.03 }}
          onClick={tap}
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="caps flex min-h-14 flex-1 items-center justify-center rounded-full border border-ink/20 px-3 text-[0.5rem] text-ink transition-all duration-200 hover:border-ink hover:bg-ink hover:text-paper hover:shadow-lg"
        >
          Directions
        </motion.a>

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.03 }}
          onClick={share}
          className="caps flex min-h-14 min-w-14 items-center justify-center rounded-full border border-ink/20 px-4 text-[0.5rem] text-ink transition-all duration-200 hover:border-ink hover:bg-ink hover:text-paper hover:shadow-lg"
        >
          {canShare ? "Share" : "Copy"}
        </motion.button>
      </div>
    </motion.nav>
  );
}
