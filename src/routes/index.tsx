import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import paper from "@/assets/paper.jpg";
import { ActionBar } from "@/components/invite/ActionBar";
import { AddToCalendar } from "@/components/invite/AddToCalendar";
import { AudioPlayer } from "@/components/invite/AudioPlayer";
import { Countdown } from "@/components/invite/Countdown";
import { Envelope } from "@/components/invite/Envelope";
import { Hero } from "@/components/invite/Hero";
import { InviteFooter } from "@/components/invite/InviteFooter";
import { Note } from "@/components/invite/Note";
import { PhotoSlide } from "@/components/invite/PhotoSlide";
import { ScrollThread } from "@/components/invite/ScrollThread";
import { Venue } from "@/components/invite/Venue";
import { invite } from "@/config/invite";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export const Route = createFileRoute("/")({
  component: Invitation,
});

function Invitation() {
  useSmoothScroll();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen />}
      </AnimatePresence>
      <Envelope onOpen={() => setOpened(true)} />
      <ScrollThread />
      <AudioPlayer />
      <main
        className={`grain relative min-h-screen bg-paper text-ink transition-colors duration-700 ${loading ? "opacity-0" : "opacity-100"}`}
        style={{ backgroundImage: `url(${paper})`, backgroundSize: "480px" }}
      >
        <Hero ready={opened && !loading} />
        <Note />
        <Countdown />
        <Venue />
        <PhotoSlide />
        <AddToCalendar />
        <InviteFooter />
      </main>
      <ActionBar />
    </>
  );
}
