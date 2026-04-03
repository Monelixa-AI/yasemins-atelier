"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionHeader from "@/components/site/ui/SectionHeader";

const reviews = [
  {
    text: "K\u0131z\u0131m i\u00E7in ald\u0131\u011F\u0131m sebzeli krakerler harika. Renkli olmas\u0131 dikkatini \u00E7ekiyor, severek yiyor. \u0130\u00E7inde ne oldu\u011Funu bilmek \u00E7ok rahatlatici.",
    name: "Elif T.",
    occasion: "\u00C7ocuk Serisi",
    initials: "ET",
    rating: 5,
  },
  {
    text: "Granola ba\u011F\u0131ml\u0131s\u0131 oldum! Her sabah yo\u011Furdun \u00FCst\u00FCne koyuyorum. Markettekilerle kar\u015F\u0131la\u015Ft\u0131r\u0131nca ne kadar saf oldu\u011Fu hissediliyor.",
    name: "Burak S.",
    occasion: "Granola & Bar",
    initials: "BS",
    rating: 5,
  },
  {
    text: "Hediye kutusu olarak g\u00F6nderdim, alan ki\u015Fi \u00E7ok be\u011Fendi. Paketleme \u00E7ok \u015F\u0131k ve \u00FCr\u00FCnlerin tamam\u0131 ger\u00E7ekten lezzetli.",
    name: "Selin K.",
    occasion: "Hediye Kutusu",
    initials: "SK",
    rating: 5,
  },
];

export default function NaturelTestimonials() {
  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="M\u00FC\u015Fteri Deneyimi"
          title="Naturel Ailesi Ne Diyor?"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-8 border border-[#EAF3DE]"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    className="fill-[#B8975C] text-[#B8975C]"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="font-heading text-lg text-brown-deep italic leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#EAF3DE" }}
                >
                  <span
                    className="font-body text-xs font-medium"
                    style={{ color: "#4A7C3F" }}
                  >
                    {review.initials}
                  </span>
                </div>
                <div>
                  <p className="font-body text-sm text-brown-deep font-medium">
                    {review.name}
                  </p>
                  <p className="font-body text-xs text-brown-deep/50">
                    {review.occasion}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
