"use client";

import { wedding, type WeddingCopy } from "@/data/wedding";
import Image from "next/image";
import { CornerFlourish, GoldRule, Monogram, WaxSeal } from "./Ornaments";
import { Sparkles } from "./Sparkles";

type EnvelopeProps = {
  copy: WeddingCopy;
  guestName: string;
  isOpen?: boolean;
  onOpen: () => void;
};

const CORNERS = [
  "top-5 left-5 -scale-y-100",
  "top-5 right-5 scale-[-1]",
  "bottom-5 left-5",
  "right-5 bottom-5 -scale-x-100",
];

export function Envelope({ copy, guestName, isOpen, onOpen }: EnvelopeProps) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center overflow-x-hidden overflow-y-auto px-4 pb-14 pt-6 text-ivory sm:pt-8">
      <Image
        src={wedding.images.hero}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />
      <Sparkles />

      {/* thin gold double frame + corner flourishes */}
      <div className="pointer-events-none absolute inset-3 border border-gold/35" />
      <div className="pointer-events-none absolute inset-[18px] border border-gold/15" />
      {CORNERS.map((pos) => (
        <CornerFlourish
          key={pos}
          className={`pointer-events-none absolute h-12 w-12 text-gold-bright/70 ${pos}`}
        />
      ))}

      <header className="relative z-10 flex w-full max-w-lg flex-col items-center pt-2 text-center">
        <Monogram className="h-14 w-14 text-gold-bright sm:h-16 sm:w-16" />
        <p className="mt-3 font-sans text-[11px] tracking-[0.42em] text-gold-bright uppercase">
          {copy.envelopeKicker}
        </p>
        <GoldRule className="mt-3 w-24" />
      </header>

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center py-6 sm:py-8">
        <div className="envelope-scene">
          <div
            className={`envelope relative mx-auto shadow-[0_30px_60px_rgba(0,0,0,0.55)] ring-1 ring-gold/60 ${isOpen ? "is-open" : ""}`}
          >
            <div
              className="absolute inset-0 overflow-hidden rounded-[3px] bg-cover bg-center [container-type:inline-size]"
              style={{ backgroundImage: "url(/lixi/thiep.jpg)" }}
            >
              {/* sits in the empty centre of the artwork; sizes follow the card width */}
              <div className="absolute inset-x-[29%] top-[54%] bottom-[7%] flex flex-col items-center justify-center text-center text-ink">
                <p className="font-serif text-[clamp(1.05rem,7.2cqw,2.1rem)] leading-[1.1] font-medium">
                  {copy.bride.name}
                </p>
                <span className="font-script -my-0.5 text-[clamp(0.9rem,5.6cqw,1.6rem)] leading-none text-gold-deep">
                  {copy.and}
                </span>
                <p className="font-serif text-[clamp(1.05rem,7.2cqw,2.1rem)] leading-[1.1] font-medium">
                  {copy.groom.name}
                </p>
                <GoldRule className="mx-auto my-[2cqw] w-[14cqw]" />
                <p className="font-serif text-[clamp(0.8rem,4.4cqw,1.25rem)] leading-none font-semibold tracking-[0.03em] whitespace-nowrap text-ink-soft">
                  {copy.event.date}
                </p>
              </div>
            </div>

            <div className="envelope-flap pointer-events-none absolute top-0 left-[28%] z-10 h-[46%] w-[44%] drop-shadow-[0_8px_10px_rgba(60,10,30,0.35)]">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="flap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#fbd0d9" />
                    <stop offset="0.6" stopColor="#ee94aa" />
                    <stop offset="1" stopColor="#c9456b" />
                  </linearGradient>
                </defs>
                <polygon points="0,0 100,0 50,100" fill="url(#flap)" />
                <polygon
                  points="9,0 91,0 50,84"
                  fill="none"
                  stroke="#e8c47a"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                />
                <polygon
                  points="0,0 100,0 50,100"
                  fill="none"
                  stroke="#ca8a04"
                  strokeWidth="1.2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <div
              className={`absolute top-[43%] left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transition-[opacity,scale] duration-500 ${isOpen ? "scale-75 opacity-0" : ""}`}
            >
              <WaxSeal className="h-14 w-14 sm:h-16 sm:w-16" />
            </div>
          </div>
        </div>

        <p className="mt-8 font-sans text-[10px] tracking-[0.4em] text-gold-bright/80 uppercase sm:mt-10">
          {copy.envelopeInvite}
        </p>
        <p className="mt-2 min-h-[2.25rem] font-serif text-2xl text-ivory italic sm:text-3xl">
          {guestName || copy.envelopeGuestFallback}
        </p>

        <button
          type="button"
          onClick={onOpen}
          disabled={isOpen}
          className="invite-cta mt-8 cursor-pointer rounded-full bg-linear-to-b from-gold-bright to-gold px-10 py-3.5 font-sans text-[11px] font-medium tracking-[0.34em] text-night uppercase shadow-[0_10px_30px_rgba(202,138,4,0.35)] hover:brightness-110 disabled:opacity-60"
        >
          {copy.openInvite}
        </button>
      </div>
    </div>
  );
}
