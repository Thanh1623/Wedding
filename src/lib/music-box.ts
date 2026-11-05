import { wedding } from "@/data/wedding";

// Original 8-bar music-box motif for Solenne. Not a cover.
const MOTIF = [
  [0, 64],
  [0.5, 68],
  [1, 71],
  [1.5, 76],
  [2.25, 71],
  [2.75, 68],
  [3.5, 64],
  [4.25, 69],
  [4.75, 73],
  [5.5, 76],
  [6.25, 73],
  [7, 69],
  [7.75, 64],
];

function midiToFreq(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function createSynth() {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0.08;
  master.connect(ctx.destination);

  let timer: number | null = null;
  let playing = false;

  const strike = (time: number, midi: number) => {
    const osc = ctx.createOscillator();
    const partial = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    partial.type = "triangle";
    osc.frequency.value = midiToFreq(midi);
    partial.frequency.value = midiToFreq(midi) * 2;
    const partialGain = ctx.createGain();
    partialGain.gain.value = 0.12;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.9, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.4);
    osc.connect(gain);
    partial.connect(partialGain);
    partialGain.connect(gain);
    gain.connect(master);
    osc.start(time);
    partial.start(time);
    osc.stop(time + 2.5);
    partial.stop(time + 2.5);
  };

  const loop = () => {
    if (!playing) return;
    const start = ctx.currentTime + 0.05;
    for (const [beat, midi] of MOTIF) {
      strike(start + beat * 0.72, midi);
    }
    timer = window.setTimeout(loop, 6400);
  };

  return {
    async play() {
      if (playing) return;
      playing = true;
      if (ctx.state === "suspended") await ctx.resume();
      loop();
    },
    async pause() {
      playing = false;
      if (timer) window.clearTimeout(timer);
      timer = null;
      await ctx.suspend();
    },
    async dispose() {
      playing = false;
      if (timer) window.clearTimeout(timer);
      await ctx.close();
    },
  };
}

type YTPlayer = { playVideo(): void; pauseVideo(): void; destroy(): void };

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: object) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeApi() {
  return new Promise<void>((resolve) => {
    if (window.YT?.Player) return resolve();
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!document.querySelector("script[src*='youtube.com/iframe_api']")) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
}

// Plays the wedding song through a hidden YouTube player (looped).
// ponytail: if the video is blocked or fails, falls back to the built-in music-box tune.
export function createMusicBox() {
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText =
    "position:fixed;bottom:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden";
  document.body.appendChild(host);

  let player: YTPlayer | null = null;
  let synth: ReturnType<typeof createSynth> | null = null;
  let wantPlay = false;
  let disposed = false;

  const fallback = () => {
    synth ??= createSynth();
    if (wantPlay) void synth.play();
  };

  void loadYouTubeApi().then(() => {
    if (disposed || !window.YT) return;
    const mount = document.createElement("div");
    host.appendChild(mount);
    player = new window.YT.Player(mount, {
      width: 1,
      height: 1,
      videoId: wedding.musicYoutubeId,
      playerVars: {
        playsinline: 1,
        controls: 0,
        loop: 1,
        playlist: wedding.musicYoutubeId,
      },
      events: {
        onReady: () => {
          if (wantPlay) player?.playVideo();
        },
        onError: fallback,
      },
    });
  });

  return {
    // must stay synchronous up to playVideo() so mobile browsers keep the user gesture
    async play() {
      wantPlay = true;
      if (synth) return synth.play();
      player?.playVideo?.();
    },
    async pause() {
      wantPlay = false;
      player?.pauseVideo?.();
      await synth?.pause();
    },
    async dispose() {
      disposed = true;
      wantPlay = false;
      player?.destroy?.();
      host.remove();
      await synth?.dispose();
    },
  };
}

export type MusicBox = ReturnType<typeof createMusicBox>;
