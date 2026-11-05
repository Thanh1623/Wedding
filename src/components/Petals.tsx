"use client";

import { useEffect, useRef } from "react";

type Petal = {
  x: number;
  y: number;
  r: number;
  a: number;
  v: number;
  spin: number;
  tone: number;
};

const PINKS = [
  "rgba(253, 242, 248, 0.72)",
  "rgba(249, 168, 212, 0.62)",
  "rgba(244, 114, 182, 0.5)",
  "rgba(232, 196, 122, 0.5)",
  "rgba(255, 255, 255, 0.55)",
];

export function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const petals: Petal[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    for (let i = 0; i < 26; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 5 + Math.random() * 8,
        a: Math.random() * Math.PI * 2,
        v: 0.35 + Math.random() * 0.7,
        spin: 0.004 + Math.random() * 0.012,
        tone: Math.floor(Math.random() * PINKS.length),
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of petals) {
        p.y += p.v;
        p.x += Math.sin(p.a) * 0.55;
        p.a += p.spin;
        if (p.y > canvas.height + 12) {
          p.y = -12;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.fillStyle = PINKS[p.tone];
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(p.r * 0.35, 0, p.r * 0.72, p.r * 0.32, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
      aria-hidden="true"
    />
  );
}
