import type { Metadata } from "next";
import { Be_Vietnam_Pro, Cormorant_Infant, Great_Vibes } from "next/font/google";
import { wedding } from "@/data/wedding";
import "./globals.css";

const cormorant = Cormorant_Infant({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://solenne.vercel.app"),
  title: wedding.copy.vi.siteTitle,
  description: wedding.copy.vi.siteDescription,
  openGraph: {
    title: wedding.copy.vi.siteTitle,
    description: wedding.copy.vi.siteDescription,
    images: [wedding.images.hero],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${cormorant.variable} ${greatVibes.variable} ${beVietnam.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-night font-serif text-ivory">{children}</body>
    </html>
  );
}
