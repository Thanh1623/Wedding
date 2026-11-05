"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#f9a8d4", "#f472b6", "#e8c47a", "#fff7fb", "#fb7185", "#facc15"];

type Rocket = { x: number; y: number; ty: number; vy: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string };

// Fireworks that only run while their screen is visible. Fills its (relative) parent.
export function Fireworks() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];
    let raf = 0;
    let last = 0;
    let wait = 0.3;
    let visible = false;

    const burst = (x: number, y: number) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const alt = COLORS[Math.floor(Math.random() * COLORS.length)];
      const n = 70;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.1;
        const v = 70 + Math.random() * 130;
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          life: 0,
          max: 1.1 + Math.random() * 0.8,
          color: i % 3 === 0 ? alt : color,
        });
      }
    };

    const frame = (t: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min((t - last) / 1000 || 0, 0.05);
      last = t;

      wait -= dt;
      if (wait <= 0) {
        rockets.push({ x: w * (0.12 + Math.random() * 0.76), y: h, ty: h * (0.1 + Math.random() * 0.35), vy: -(380 + Math.random() * 140) });
        wait = 0.7 + Math.random() * 1.1;
      }

      // fade the previous frame so sparks leave trails
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy * dt;
        ctx.fillStyle = "#fff7fb";
        ctx.fillRect(r.x - 1, r.y, 2, 8);
        if (r.y <= r.ty) {
          burst(r.x, r.y);
          rockets.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        if (s.life >= s.max) {
          sparks.splice(i, 1);
          continue;
        }
        s.vy += 110 * dt;
        s.vx *= 0.985;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        ctx.globalAlpha = 1 - s.life / s.max;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf && visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) start();
        else ctx.clearRect(0, 0, w, h);
      },
      { threshold: 0.3 },
    );
    io.observe(canvas);
    document.addEventListener("visibilitychange", start);
    window.addEventListener("resize", resize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", start);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      aria-hidden="true"
    />
  );
}
