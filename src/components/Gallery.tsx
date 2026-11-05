"use client";

import { useEffect } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { wedding, type WeddingCopy, type Lang } from "@/data/wedding";

type GalleryProps = {
  copy: WeddingCopy;
  lang: Lang;
  active: number | null;
  setActive: (index: number | null) => void;
};

export function Gallery({ copy, lang, active, setActive }: GalleryProps) {
  const photos = wedding.gallery;

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((active + 1) % photos.length);
      if (e.key === "ArrowLeft") {
        setActive((active - 1 + photos.length) % photos.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, photos.length, setActive]);

  return (
    <section id="album" className="snap-scene paper px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl" data-reveal>
        <p className="font-sans text-[11px] tracking-[0.38em] text-gold-deep uppercase">
          {copy.galleryEyebrow}
        </p>
        <h2 className="mt-3 max-w-xl font-serif text-4xl text-ink md:text-5xl">
          {copy.galleryTitle}
        </h2>
        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setActive(index)}
              className="shine-card group mb-4 block w-full cursor-pointer overflow-hidden break-inside-avoid"
            >
              <span className="relative block aspect-[4/5] overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt[lang]}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      {active !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photos[active].alt[lang]}
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/92 p-4"
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute top-4 right-4 cursor-pointer p-3 text-ivory"
            aria-label={copy.close}
          >
            <X size={22} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setActive((active - 1 + photos.length) % photos.length)}
            className="absolute left-2 cursor-pointer p-3 text-ivory md:left-6"
            aria-label={copy.prev}
          >
            <CaretLeft size={28} aria-hidden="true" />
          </button>
          <div className="relative h-[78vh] w-full max-w-5xl">
            <Image
              src={photos[active].src}
              alt={photos[active].alt[lang]}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button
            type="button"
            onClick={() => setActive((active + 1) % photos.length)}
            className="absolute right-2 cursor-pointer p-3 text-ivory md:right-6"
            aria-label={copy.next}
          >
            <CaretRight size={28} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
