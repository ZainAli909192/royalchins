"use client";

import { useState } from "react";

export function StoreLoader() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-black">
      <video
        src="/loader.mp4"
        autoPlay
        
        playsInline
        preload="auto"
        onEnded={() => setVisible(false)}
        className="h-full w-full object-contain"
      />
    </div>
  );
}