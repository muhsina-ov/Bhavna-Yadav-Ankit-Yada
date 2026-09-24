import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, Music, Disc } from "lucide-react";
import { invite } from "@/config/invite";
import defaultMusic from "@/assets/music.mp3";

// Vite asset import guarantees valid path resolution in both dev and production
const AUDIO_SRC = defaultMusic || invite.musicFileUrl || "/music.mp3";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const startPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;
    audio.loop = true;

    audio
      .play()
      .then(() => {
        setPlaying(true);
      })
      .catch((err) => {
        console.log("Autoplay waiting for user interaction:", err);
        setPlaying(false);
      });
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Try playing immediately
    startPlayback();

    // Handler when envelope is opened or user taps anywhere
    const handleUserGesture = () => {
      setUserInteracted(true);
      const currentAudio = audioRef.current;
      if (currentAudio && currentAudio.paused) {
        currentAudio
          .play()
          .then(() => setPlaying(true))
          .catch(() => {});
      }
    };

    // Custom event dispatched from envelope seal click
    const handleCustomEvent = () => {
      handleUserGesture();
    };

    window.addEventListener("play-wedding-music", handleCustomEvent);
    window.addEventListener("click", handleUserGesture, { capture: true });
    window.addEventListener("touchstart", handleUserGesture, { capture: true });
    window.addEventListener("pointerdown", handleUserGesture, { capture: true });

    return () => {
      window.removeEventListener("play-wedding-music", handleCustomEvent);
      window.removeEventListener("click", handleUserGesture, { capture: true });
      window.removeEventListener("touchstart", handleUserGesture, { capture: true });
      window.removeEventListener("pointerdown", handleUserGesture, { capture: true });
      audio.pause();
    };
  }, [startPlayback]);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch((err) => console.error("Play failed:", err));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  if (!AUDIO_SRC) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        className="hidden"
      />

      <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2 select-none">
        {/* Helper badge indicating music status */}
        <AnimatePresence>
          {!playing && (
            <motion.button
              type="button"
              onClick={toggleMusic}
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full bg-paper/95 border border-gold/50 px-3.5 py-2 shadow-lg backdrop-blur-md cursor-pointer hover:bg-gold/10 transition-colors"
            >
              <Music className="size-3.5 text-gold animate-bounce" />
              <span className="text-[0.65rem] font-caps tracking-wider text-ink font-medium">
                Tap for Music 🎵
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Floating audio toggle button */}
        <motion.button
          type="button"
          onClick={toggleMusic}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08 }}
          aria-label={playing ? "Pause music" : "Play music"}
          className={`relative flex size-13 items-center justify-center rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 cursor-pointer ${
            playing
              ? "border-gold/60 bg-gold/25 text-ink ring-2 ring-gold/40 shadow-gold/20"
              : "border-sepia/30 bg-paper/90 text-sepia hover:bg-gold/15"
          }`}
        >
          {playing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Disc className="size-6 text-gold" />
            </motion.div>
          ) : (
            <VolumeX className="size-6 text-sepia/80" />
          )}

          {/* Soundwave animation ring when playing */}
          {playing && (
            <>
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-gold/60"
                animate={{ scale: [1, 1.45, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute inset-[-4px] rounded-full border border-gold/30"
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
            </>
          )}
        </motion.button>
      </div>
    </>
  );
}


