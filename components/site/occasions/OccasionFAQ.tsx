"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { OccasionFAQ as FAQItem } from "@/lib/data/occasions";
import SectionHeader from "@/components/site/ui/SectionHeader";

export default function OccasionFAQ({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow="SSS" title="Sık Sorulan Sorular" />

        <div className="space-y-0">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-b border-gold-light">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="font-body text-[15px] text-brown-deep font-medium pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-gold shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-5" : "max-h-0"}`}>
                  <p className="font-body text-sm text-brown-mid leading-relaxed">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
