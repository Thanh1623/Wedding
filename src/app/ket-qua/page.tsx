import type { Metadata } from "next";
import { RsvpInbox } from "@/components/RsvpInbox";

export const metadata: Metadata = {
  title: "Xác nhận khách mời",
  robots: { index: false, follow: false },
};

export default function KetQuaPage() {
  return <RsvpInbox />;
}
