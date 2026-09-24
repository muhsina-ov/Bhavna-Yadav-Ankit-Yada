/** Tiny singleton so any component can pause/resume the smooth scroller. */
type LenisLike = {
  raf: (t: number) => void;
  destroy: () => void;
  stop: () => void;
  start: () => void;
  scrollTo: (target: string | number | HTMLElement, opts?: Record<string, unknown>) => void;
};

let current: LenisLike | null = null;
let locked = false;

export function setLenis(instance: LenisLike | null) {
  current = instance;
  if (instance && locked) instance.stop();
}

export function getLenis() {
  return current;
}

/** Locks page scrolling (works even before Lenis has loaded). */
export function lockScroll() {
  locked = true;
  current?.stop();
  if (typeof document !== "undefined") document.documentElement.classList.add("scroll-locked");
}

export function unlockScroll() {
  locked = false;
  current?.start();
  if (typeof document !== "undefined") document.documentElement.classList.remove("scroll-locked");
}

export function scrollToTop() {
  if (current) current.scrollTo(0, { duration: 1.2 });
  else if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
}
