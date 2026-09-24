import { motion } from "motion/react";
import { useState } from "react";
import { downloadIcs, googleCalendarUrl, outlookCalendarUrl } from "@/lib/calendar";
import { Divider } from "./Divider";
import { Reveal } from "./Reveal";

const tapFeedback = () => {
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
};

export function AddToCalendar() {
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleIcs = () => {
    tapFeedback();
    downloadIcs();
    setStatusMsg("Calendar event downloaded! Tap to open in your phone calendar.");
    setTimeout(() => setStatusMsg(null), 4000);
  };

  return (
    <section id="add-to-calendar" className="px-6 pb-24 text-center sm:pb-32">
      <Reveal>
        <Divider className="mb-10" />
        <p className="caps text-[0.6rem] text-olive">Save the Date to Your Calendar</p>
        <h3 className="script mt-3 text-3xl text-ink sm:text-4xl">Keep the Evening Free</h3>
      </Reveal>

      <Reveal delay={0.12}>
        <div className="mx-auto mt-7 flex max-w-xs flex-col items-stretch gap-3 sm:max-w-sm">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleIcs}
            className="caps flex min-h-14 items-center justify-center gap-2 rounded-full bg-ink px-7 text-[0.58rem] text-paper shadow-md transition-all duration-300 hover:bg-ink/90"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-4 text-gold" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            Apple / Phone Calendar (.ics)
          </motion.button>

          <motion.a
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={tapFeedback}
            href={googleCalendarUrl}
            target="_blank"
            rel="noreferrer"
            className="caps flex min-h-14 items-center justify-center gap-2 rounded-full border border-ink/25 bg-paper-deep/40 px-7 text-[0.58rem] text-ink transition-all duration-300 hover:border-ink hover:bg-paper-deep"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-4 text-olive" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v4l3 3" />
            </svg>
            Google Calendar
          </motion.a>

          <motion.a
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={tapFeedback}
            href={outlookCalendarUrl}
            target="_blank"
            rel="noreferrer"
            className="caps flex min-h-14 items-center justify-center gap-2 rounded-full border border-ink/15 px-7 text-[0.55rem] text-sepia transition-all duration-300 hover:border-ink/40 hover:text-ink"
          >
            Outlook Calendar
          </motion.a>
        </div>

        {statusMsg && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-xs font-medium text-olive"
          >
            {statusMsg}
          </motion.p>
        )}

        <div className="mx-auto mt-6 max-w-sm rounded-xl border border-gold/20 bg-paper-deep/30 px-4 py-3 text-center">
          <p className="text-xs text-sepia/90 leading-relaxed">
            <span className="font-semibold text-ink">Note for Guests:</span> Tap any button above to add the wedding date, time, and venue to your phone&apos;s calendar app. A reminder will notify you 1 day before the event.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
