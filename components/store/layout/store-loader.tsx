"use client";

import { useEffect, useRef, useState } from "react";

export function StoreLoader() {
  const [visible, setVisible] = useState(true);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = false;
    video.volume = 1;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        setNeedsInteraction(true);
      }
    };

    void playVideo();
  }, []);

  const startWithSound = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = false;
    video.volume = 1;

    try {
      await video.play();
      setNeedsInteraction(false);
    } catch {
      setNeedsInteraction(true);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-black">
      <video
        ref={videoRef}
        src="/loader.mp4"
        autoPlay
        muted={false}
        playsInline
        preload="auto"
        onEnded={() => setVisible(false)}
        className="h-full w-full object-contain"
      />

      {needsInteraction && (
        <button
          type="button"
          onClick={startWithSound}
          className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-black text-sm font-bold text-white"
        >
          Tap to Enter Royal Chins
        </button>
      )}
    </div>
  );
}