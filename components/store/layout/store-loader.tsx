"use client";

import { useEffect, useRef, useState } from "react";

export function StoreLoader() {
  const [visible, setVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const playVideo = async () => {
      video.currentTime = 0;
      video.volume = 1;
      video.muted = false;

      try {
        // First try autoplay WITH sound
        await video.play();
      } catch {
        // Browser blocked unmuted autoplay.
        // Continue automatically without a button.
        video.muted = true;

        try {
          await video.play();
        } catch {
          setVisible(false);
        }
      }
    };

    void playVideo();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-black">
      <video
        ref={videoRef}
        src="/loader.mp4"
        playsInline
        preload="auto"
        onEnded={() => setVisible(false)}
        onError={() => setVisible(false)}
        className="h-full w-full object-contain"
      />
    </div>
  );
}