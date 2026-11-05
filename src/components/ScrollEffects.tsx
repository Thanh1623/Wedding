"use client";

import { useEffect } from "react";

// Scroll effects: fades elements marked [data-reveal] in as they enter the viewport,
// publishes --p (page progress) and --hs (hero scroll 0..1) for CSS, and renders a progress bar.
export function ScrollEffects() {
  useEffect(() => {
    // Full-screen "page by page" snapping (kept for reduced-motion users too; it is not an animation).
    document.documentElement.classList.add("snap-on");
    const cleanupSnap = () => document.documentElement.classList.remove("snap-on");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return cleanupSnap;

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    // Scenes replay their entrance every time they become the current screen (scrolling down or back up).
    const sceneIo = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.target.classList.toggle("is-active", e.isIntersecting)),
      { threshold: 0.55 },
    );
    document.querySelectorAll("[data-scene]").forEach((el) => sceneIo.observe(el));

    const root = document.documentElement;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = root.scrollHeight - innerHeight;
      root.style.setProperty("--p", String(max > 0 ? scrollY / max : 0));
      root.style.setProperty("--hs", String(Math.min(1, scrollY / innerHeight)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      sceneIo.disconnect();
      cleanupSnap();
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="scroll-progress pointer-events-none fixed top-0 left-0 z-50 h-[3px] w-full origin-left bg-gold-bright"
    />
  );
}
