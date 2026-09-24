import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

/** Loading skeleton that transitions smoothly to content. */
export function LoadingSkeleton() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!loaded ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="min-h-screen bg-paper"
        >
          <div className="mx-auto max-w-md space-y-6 px-6 py-20">
            {/* Hero skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-24 rounded-full bg-gold/20" />
              <div className="h-12 w-64 rounded bg-ink/10" />
              <div className="h-[200px] w-full rounded-lg bg-gold/10" />
              <div className="h-8 w-48 rounded bg-ink/10" />
            </div>
            {/* Content skeleton */}
            <div className="space-y-6">
              <div className="h-4 w-full rounded bg-gold/10" />
              <div className="h-4 w-3/4 rounded bg-gold/10" />
              <div className="h-32 w-full rounded-lg bg-gold/10" />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="min-h-screen bg-paper" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { LoadingSkeleton as LoadingScreen };

