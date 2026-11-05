"use client";

import { wedding, type Lang } from "@/data/wedding";
import { downloadIcs } from "@/lib/calendar";
import { createMusicBox, type MusicBox } from "@/lib/music-box";
import {
  CalendarBlank,
  MapPin,
  SpeakerHigh,
  SpeakerSlash,
  Translate,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Envelope } from "./Envelope";
// import { Gallery } from "./Gallery";
import { LixiLoop } from "./LixiLoop";
import { GoldRule, Monogram } from "./Ornaments";
import { Petals } from "./Petals";
import { RsvpBoard } from "./RsvpBoard";
import { Scene } from "./Scene";
import { ScrollEffects } from "./ScrollEffects";

const NAV = [
  { id: "couple", vi: "Cặp đôi", en: "Couple" },
  { id: "events", vi: "Lịch", en: "Schedule" },
  // { id: "album", vi: "Album", en: "Album" },
  { id: "rsvp", vi: "RSVP", en: "RSVP" },
];

function useCountdown(target: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = now === null ? 0 : Math.max(0, new Date(target).getTime() - now);
  return {
    done: now !== null && diff === 0,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function Invitation() {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [lang, setLang] = useState<Lang>("vi");
  const [guestName, setGuestName] = useState("");
  const [ready, setReady] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  // const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const music = useRef<MusicBox | null>(null);
  const copy = wedding.copy[lang];
  const count = useCountdown(wedding.dateISO);
  const calendarTitle = "Hồng Ngọc & Duy Thành";

  const units = useMemo(
    () =>
      [
        [count.days, copy.days],
        [count.hours, copy.hours],
        [count.minutes, copy.minutes],
        [count.seconds, copy.seconds],
      ] as const,
    [copy, count],
  );

  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get("to") ?? "";
    setTimeout(() => {
      setGuestName(to);
    }, 1000);
    setTimeout(() => {
      setReady(true);
    }, 2000);
    music.current = createMusicBox();
    return () => {
      void music.current?.dispose();
    };
  }, []);

  const open = async () => {
    setOpening(true);
    setMusicOn(true);
    await music.current?.play();
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.setTimeout(
      () => {
        setOpened(true);
        window.setTimeout(
          () => document.getElementById("invitation")?.focus(),
          50,
        );
      },
      reduce ? 0 : 900,
    );
  };

  const toggleMusic = async () => {
    if (musicOn) {
      await music.current?.pause();
      setMusicOn(false);
    } else {
      await music.current?.play();
      setMusicOn(true);
    }
  };

  if (!opened) {
    return (
      <>
        <a
          href="#invitation"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-ivory focus:px-3 focus:py-2 focus:text-ink"
          onClick={() => setOpened(true)}
        >
          {copy.skipToContent}
        </a>
        <button
          type="button"
          onClick={() => setLang(lang === "vi" ? "en" : "vi")}
          className="fixed top-4 right-4 z-40 cursor-pointer rounded-full border border-gold/40 px-3 py-2 font-sans text-[10px] tracking-[0.22em] text-gold-bright uppercase"
        >
          {copy.lang}
        </button>
        <Petals />
        <Envelope
          copy={copy}
          guestName={ready ? guestName : " "}
          isOpen={opening}
          onOpen={open}
        />
      </>
    );
  }

  return (
    <div className="bg-night text-ivory">
      <Petals />
      <ScrollEffects />
      <a
        href="#invitation"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50"
      >
        {copy.skipToContent}
      </a>

      <div className="fixed right-4 bottom-5 z-40 flex gap-2 md:top-4 md:bottom-auto">
        <button
          type="button"
          onClick={() => setLang(lang === "vi" ? "en" : "vi")}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gold/40 bg-night/50 px-3 py-2 font-sans text-[10px] tracking-[0.22em] text-gold-bright uppercase backdrop-blur-sm transition-transform duration-200 hover:scale-105"
          aria-label={copy.lang}
        >
          <Translate size={14} aria-hidden="true" />
          {copy.lang}
        </button>
        <button
          type="button"
          onClick={toggleMusic}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gold/40 bg-night/50 px-3 py-2 font-sans text-[10px] tracking-[0.22em] text-gold-bright uppercase backdrop-blur-sm transition-transform duration-200 hover:scale-105"
          aria-pressed={musicOn}
          aria-label={musicOn ? copy.musicPause : copy.musicPlay}
        >
          {musicOn ? (
            <SpeakerHigh size={14} aria-hidden="true" />
          ) : (
            <SpeakerSlash size={14} aria-hidden="true" />
          )}
        </button>
      </div>

      <nav
        aria-label="Sections"
        className="fixed top-1/2 left-4 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex"
      >
        {NAV.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="nav-dot h-2 w-2 rounded-full bg-ivory/35 transition-transform duration-200"
            aria-label={item[lang]}
          />
        ))}
      </nav>

      <section
        data-scene
        className="snap-scene relative h-dvh overflow-hidden bg-ivory"
      >
        <Image
          src={wedding.images.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-zoom z-0 object-cover object-top"
        />
        <div
          className="hero-scrim pointer-events-none absolute inset-0 z-[1]"
          aria-hidden="true"
        />
        <div className="hero-copy-out relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          <p className="hero-kicker hero-gold font-sans text-sm font-medium tracking-[0.36em] uppercase md:text-base">
            {copy.saveTheDate}
          </p>
          <Monogram className="hero-gold mt-5 h-20 w-20 drop-shadow-[0_2px_10px_rgba(26,10,18,0.8)] md:mt-6 md:h-24 md:w-24" />
          <h1
            id="invitation"
            tabIndex={-1}
            className="hero-title mt-4 font-serif text-[clamp(3.75rem,15vw,8.5rem)] leading-[0.95] font-semibold tracking-tight md:mt-6"
          >
            <span className="block">Hồng Ngọc</span>
            <span className="hero-gold font-script my-1 inline-block text-[0.55em] font-normal">
              {copy.and}
            </span>
            <span className="block">Duy Thành</span>
          </h1>
          <p className="hero-kicker mt-5 max-w-md font-serif text-2xl font-medium italic md:mt-6 md:text-3xl">
            {copy.together}
          </p>
          <GoldRule className="mt-6 w-32 md:mt-8" />
          <p className="hero-kicker hero-gold mt-5 font-sans text-sm font-medium tracking-[0.22em] uppercase md:mt-6 md:text-base">
            {copy.heroDate}
          </p>
          <p className="hero-kicker float-cue mt-12 font-sans text-xs font-medium tracking-[0.3em] uppercase md:mt-16 md:text-sm">
            {copy.scroll}
          </p>
        </div>
      </section>

      <Scene src={wedding.images.intro} position="object-[18%_20%]">
        <p className="font-sans text-xs tracking-[0.38em] text-gold-bright uppercase">
          {copy.introEyebrow}
        </p>
        <h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">
          {copy.introTitle}
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/90">
          {copy.introBody}
        </p>
      </Scene>

      <Scene src={wedding.images.quote} position="object-[50%_30%]" flip>
        <Monogram className="h-14 w-14 text-gold-bright" />
        <blockquote className="mt-6 max-w-lg font-serif text-2xl leading-snug italic md:text-4xl">
          {copy.quote}
        </blockquote>
        <p className="mt-5 font-sans text-xs tracking-[0.3em] text-gold-bright uppercase">
          {copy.quoteBy}
        </p>
      </Scene>

      <LixiLoop copy={copy} />

      {[
        {
          id: "couple",
          person: copy.groom,
          src: wedding.images.groom,
          pos: "object-[50%_25%]",
        },
        {
          id: undefined,
          person: copy.bride,
          src: wedding.images.bride,
          pos: "object-[50%_35%]",
        },
      ].map(({ id, person, src, pos }, i) => (
        <Scene
          key={person.name}
          id={id}
          src={src}
          position={pos}
          flip={i === 1}
        >
          <p className="font-sans text-xs tracking-[0.34em] text-gold-bright uppercase">
            {person.role}
          </p>
          <h3 className="mt-3 font-serif text-5xl leading-tight md:text-6xl">
            {person.name}
          </h3>
          {person.parents ? (
            <p className="mt-3 text-sm text-ivory/70">{person.parents}</p>
          ) : null}
          <p className="mt-5 max-w-md text-lg leading-7 text-ivory/90">
            {person.bio}
          </p>
        </Scene>
      ))}

      <Scene
        id="events"
        src={wedding.images.events}
        position="object-[60%_30%]"
      >
        <p className="font-sans text-xs tracking-[0.38em] text-gold-bright uppercase">
          {copy.eventsEyebrow}
        </p>
        <div className="mt-3 flex items-end gap-5">
          <p className="font-serif text-6xl leading-none text-gold-bright md:text-8xl">
            {copy.event.time}
          </p>
          <div className="pb-1">
            <p className="font-serif text-xl md:text-3xl">{copy.event.date}</p>
            <p className="font-sans text-xs tracking-[0.18em] text-ivory/75 uppercase md:text-sm">
              {copy.event.lunar}
            </p>
          </div>
        </div>
        <div className="mt-5 border-t border-ivory/25 pt-4">
          <h2 className="font-sans text-xs tracking-[0.3em] text-gold-bright uppercase">
            {copy.event.title}
          </h2>
          <p className="mt-2 font-serif text-2xl md:text-4xl">
            {copy.event.place}
          </p>
          <p className="mt-1 text-ivory/80">{copy.event.address}</p>
        </div>
        <a
          href={copy.event.map}
          target="_blank"
          rel="noreferrer"
          aria-label={`${copy.openMap}: ${copy.event.place}`}
          className="group relative mt-5 block h-32 max-w-md overflow-hidden rounded-lg border border-gold/50 md:h-48"
        >
          <iframe
            src={copy.event.mapEmbed}
            title={copy.event.place}
            loading="lazy"
            tabIndex={-1}
            className="pointer-events-none h-full w-full border-0"
          />
          <span className="absolute right-2 bottom-2 inline-flex items-center gap-2 rounded-full bg-night/85 px-3 py-2 font-sans text-[11px] tracking-[0.18em] text-gold-bright uppercase transition-transform duration-200 group-hover:scale-105">
            <MapPin size={14} aria-hidden="true" />
            {copy.openMap}
          </span>
        </a>
      </Scene>

      <Scene src={wedding.images.countdown} position="object-[50%_30%]" flip>
        <p className="font-sans text-xs tracking-[0.38em] text-gold-bright uppercase">
          {copy.countdownEyebrow}
        </p>
        <h2 className="mt-3 font-serif text-3xl md:text-5xl">
          {count.done ? copy.countdownDone : copy.countdownTitle}
        </h2>
        <p className="mt-3 font-sans text-sm tracking-[0.16em] text-gold-bright uppercase">
          {copy.event.date} · {copy.event.time}
        </p>
        <div className="mt-6 grid max-w-md grid-cols-4 gap-2 md:gap-3">
          {units.map(([value, label]) => (
            <div
              key={label}
              className="rounded-lg border border-gold/50 bg-night/70 px-1 py-3 text-center backdrop-blur-sm"
            >
              <p className="font-sans text-3xl leading-none font-medium text-gold-bright md:text-5xl">
                <span
                  key={String(value)}
                  className="tick inline-block tabular-nums"
                >
                  {String(value).padStart(2, "0")}
                </span>
              </p>
              <p className="mt-2 font-sans text-[10px] tracking-[0.24em] text-ivory/80 uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => downloadIcs(calendarTitle, wedding.dateISO, 10)}
          className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-2 self-start rounded-full border border-gold/60 px-5 font-sans text-[11px] tracking-[0.22em] text-gold-bright uppercase transition-colors duration-200 hover:bg-gold/15"
        >
          <CalendarBlank size={14} aria-hidden="true" />
          {copy.addToCalendar}
        </button>
      </Scene>

      {/* Album slide — bỏ comment block dưới khi cần hiển thị lại
      <Gallery
        copy={copy}
        lang={lang}
        active={activePhoto}
        setActive={setActivePhoto}
      />
      */}
      <RsvpBoard copy={copy} guestName={guestName} />

      <footer className="snap-scene relative flex min-h-dvh flex-col justify-center overflow-hidden bg-night px-5 py-28 text-center">
        <Image
          src={wedding.images.night}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="relative z-10 mx-auto max-w-2xl" data-reveal>
          <Monogram className="mx-auto h-14 w-14 text-gold-bright" />
          <h2 className="mt-6 font-serif text-4xl md:text-6xl">
            {copy.thanksTitle}
          </h2>
          <p className="mt-6 text-lg leading-8 text-ivory/85">
            {copy.thanksBody}
          </p>
          <p className="mt-10 font-sans text-[11px] tracking-[0.28em] text-gold-bright uppercase">
            {wedding.hashtag}
          </p>
          <p className="mt-16 text-sm text-ivory/50">{copy.footerNote}</p>
        </div>
      </footer>
    </div>
  );
}
