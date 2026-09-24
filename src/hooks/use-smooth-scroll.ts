import { useEffect } from "react";
import { setLenis } from "@/lib/lenis";

/**
 * Lenis smooth scrolling, tuned for touch devices:
 * `syncTouch` makes finger-scrolling run through the same eased loop as the
 * wheel, which removes the "native fling vs. animated parallax" mismatch that
 * makes parallax feel laggy on phones. Disabled for reduced-motion users.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let cancelled = false;
    let instance: { destroy: () => void } | null = null;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        lerp: 0.12,
        wheelMultiplier: 1,
        // Touch: route native touch scrolling through Lenis for consistent easing
        syncTouch: true,
        syncTouchLerp: 0.09,
        touchInertiaExponent: 1.7,
        touchMultiplier: 1.1,
        gestureOrientation: "vertical",
        overscroll: false,
        autoRaf: false,
      });
      instance = lenis;
      setLenis(lenis as never);

      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      setLenis(null);
      instance?.destroy();
    };
  }, []);
}
