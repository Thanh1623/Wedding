"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { wedding, type WeddingCopy } from "@/data/wedding";
import { Sparkles } from "./Sparkles";

const PACKS = [
  {
    id: "left",
    src: wedding.images.lixiLeft,
    tilt: "-3deg",
    delay: "0s",
  },
  {
    id: "right",
    src: wedding.images.lixiRight,
    tilt: "3deg",
    delay: "0.14s",
  },
] as const;

const SPARKS = [
  { dx: "-30px", dy: "-58px", color: "#e8c47a" },
  { dx: "26px", dy: "-64px", color: "#f9a8d4" },
  { dx: "-6px", dy: "-76px", color: "#fff7fb" },
  { dx: "34px", dy: "-38px", color: "#ca8a04" },
  { dx: "-38px", dy: "-30px", color: "#f472b6" },
];

const COLORS = ["#e8c47a", "#f9a8d4", "#fff7fb", "#f472b6", "#ca8a04"];

// Gold / pink fireworks behind the envelopes. Runs only while the slide is on screen.
function Fireworks({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !active) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    };
    let parts: P[] = [];
    let last = performance.now();
    let next = 0;
    let raf = 0;

    const burst = () => {
      const x = canvas.width * (0.12 + Math.random() * 0.76);
      const y = canvas.height * (0.1 + Math.random() * 0.45);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < 56; i++) {
        const a = (i / 56) * Math.PI * 2;
        const s = (1.4 + Math.random() * 2.4) * dpr;
        parts.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 1,
          color,
        });
      }
    };

    const frame = (t: number) => {
      const dt = Math.min(t - last, 50) / 16.7;
      last = t;
      // fade old frames to transparent so trails stay soft and the section background shows through
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      if (t > next) {
        burst();
        next = t + 650 + Math.random() * 900;
      }
      parts = parts.filter((p) => p.life > 0);
      for (const p of parts) {
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.035 * dpr * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= 0.011 * dt;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.9 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

export function LixiLoop({ copy }: { copy: WeddingCopy }) {
  const ref = useRef<HTMLElement>(null);
  const [still, setStill] = useState(false);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let onscreen = false;

    const apply = () => {
      const quiet = reduce.matches;
      setStill(quiet);
      setPaused(quiet || document.hidden || !onscreen);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onscreen = entry.isIntersecting;
        apply();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", apply);
    reduce.addEventListener("change", apply);
    apply();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", apply);
      reduce.removeEventListener("change", apply);
    };
  }, []);

  return (
    <section ref={ref} data-scene className="snap-scene bg-night">
      <div
        className={`lixi-loop relative flex flex-col justify-center overflow-hidden px-4 ${still ? "is-still" : ""} ${paused ? "is-paused" : ""}`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(640px_420px_at_50%_55%,rgba(232,196,122,0.22),transparent_65%),radial-gradient(720px_360px_at_50%_40%,rgba(219,39,119,0.28),transparent_62%),radial-gradient(520px_280px_at_80%_75%,rgba(202,138,4,0.16),transparent_58%)]"
          aria-hidden="true"
        />
        <Fireworks active={!paused && !still} />
        <Sparkles />
        <div className="scene-text relative z-10 text-center">
          <p className="font-sans text-xs tracking-[0.38em] text-gold-bright uppercase">
            {copy.lixiEyebrow}
          </p>
          <h2 className="mt-3 font-serif text-4xl md:text-6xl">
            {copy.lixiTitle}
          </h2>
        </div>
        <div className="lixi-loop-stage" aria-hidden="true">
          <div className="lixi-loop-stage-in">
            {PACKS.map((pack) => (
              <div
                key={pack.id}
                className={`lixi-loop-pack is-${pack.id}`}
                style={{ "--tilt": pack.tilt } as React.CSSProperties}
              >
                <div
                  className="lixi-loop-shake"
                  style={{ animationDelay: pack.delay }}
                >
                  <span
                    className="lixi-photo"
                    style={{ animationDelay: pack.delay }}
                  >
                    <Image
                      src={pack.src}
                      alt=""
                      fill
                      sizes="240px"
                      className="object-cover object-top"
                    />
                  </span>
                  <span className="lixi-body">
                    <span className="lixi-mark">Hỷ</span>
                  </span>
                  {SPARKS.map((spark) => (
                    <span
                      key={`${pack.id}-${spark.dx}`}
                      className="lixi-spark"
                      style={
                        {
                          background: spark.color,
                          animationDelay: pack.delay,
                          "--dx": spark.dx,
                          "--dy": spark.dy,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
