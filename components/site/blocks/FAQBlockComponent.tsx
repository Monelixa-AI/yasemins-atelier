"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQBlock } from "@/types/page-blocks";

export default function FAQBlockComponent({ block }: { block: FAQBlock }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="py-12 max-w-3xl mx-auto px-4">
      <h2 className="font-heading text-3xl text-brown-deep text-center mb-10">
        {block.title}
      </h2>

      <div className="space-y-0">
        {block.items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="border-b border-gold-light">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left"
              >
                <span className="font-body text-[15px] text-brown-deep font-medium pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gold shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-96 pb-5" : "max-h-0"
                }`}
              >
                <p className="font-body text-sm text-brown-mid leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
