import Image from "next/image";
import type { ReactNode } from "react";

// One full-screen "screen" of the invitation: photo + text.
// Phone: photo fills the screen, text sits on a dark gradient at the bottom.
// Desktop: photo takes one half, text the other (flip swaps sides).
export function Scene({
  id,
  src,
  position = "object-center",
  flip = false,
  children,
}: {
  id?: string;
  src: string;
  position?: string;
  flip?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-scene
      className="snap-scene relative flex h-dvh items-end overflow-hidden bg-night md:items-stretch"
    >
      <div
        className={`absolute inset-0 overflow-hidden md:relative md:inset-auto md:w-1/2 ${flip ? "md:order-2" : ""}`}
      >
        <div className="scene-photo absolute inset-0">
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover ${position}`}
          />
        </div>
        <div
          className="absolute inset-0 bg-linear-to-t from-night from-25% via-night/80 via-50% to-transparent to-85% md:hidden"
          aria-hidden="true"
        />
      </div>
      <div className="scene-text relative z-10 w-full px-6 pb-16 md:flex md:w-1/2 md:flex-col md:justify-center md:px-16 md:pb-0">
        {children}
      </div>
    </section>
  );
}
