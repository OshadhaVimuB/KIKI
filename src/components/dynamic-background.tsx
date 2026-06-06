"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export function DynamicBackground() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Liquid blobs animation
      gsap.to(".blob", {
        xPercent: () => gsap.utils.random(-10, 10),
        yPercent: () => gsap.utils.random(-10, 10),
        scale: () => gsap.utils.random(0.9, 1.1),
        duration: () => gsap.utils.random(10, 20),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 2,
          from: "random",
        },
      });

      // Particles animation
      gsap.to(".particles", {
        backgroundPosition: "100px 100px",
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
      aria-hidden="true"
    >
      <div className="blob absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[80px] opacity-60 bg-[rgba(64,41,112,0.4)]" />
      <div className="blob absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[80px] opacity-60 bg-[rgba(254,224,22,0.3)]" />
      <div className="blob absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full blur-[80px] opacity-60 bg-[rgba(209,188,255,0.3)]" />
      <div
        className="particles absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}
