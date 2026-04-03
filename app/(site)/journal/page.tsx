import type { Metadata } from "next";
import JournalPageClient from "@/components/site/journal/JournalPageClient";

export const metadata: Metadata = {
  title: "Atelier Journal | Gastronomi Notları",
  description: "Yasemin'in mutfak notları, mevsim hikayeleri ve sofra rehberleri.",
};

export default function JournalPage() {
  return <JournalPageClient />;
}
