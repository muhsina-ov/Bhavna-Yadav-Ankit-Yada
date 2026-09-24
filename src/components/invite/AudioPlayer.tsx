import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
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

      {/* Clean, minimal floating audio control — elegant, non-intrusive, matches wedding paper & gold theme */}
      <div className="fixed bottom-6 right-4 z-50 select-none sm:bottom-6 sm:right-6">
        <motion.button
          type="button"
          onClick={toggleMusic}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          aria-label={playing ? "Pause music" : "Play music"}
          className={`relative flex size-11 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 cursor-pointer shadow-[0_8px_20px_-10px_rgba(60,45,25,0.4)] ${
            playing
              ? "border-gold/40 bg-paper/90 text-gold"
              : "border-gold/20 bg-paper/85 text-sepia/70 hover:border-gold/30 hover:bg-paper hover:text-sepia"
          }`}
        >
          {playing ? (
            <Volume2 className="size-[18px]" strokeWidth={1.75} />
          ) : (
            <VolumeX className="size-[18px]" strokeWidth={1.75} />
          )}

          {/* Subtle pulse ring when playing — soft gold, not aggressive */}
          {playing && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-gold/25"
              animate={{ scale: [1, 1.35], opacity: [0.45, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </motion.button>
      </div>
    </>
  );
}


