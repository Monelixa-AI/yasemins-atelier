"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionHeader from "@/components/site/ui/SectionHeader";

const reviews = [
  {
    text: "Kadın günümüz için sipariş verdik, herkes hayran kaldı. Tabakların sunumu mükemmeldi.",
    name: "Ayşe K.",
    occasion: "Kadın Günleri",
    initials: "AK",
  },
  {
    text: "İş yemeğimiz için son dakika sipariş verdik. Yasemin hanım bizi hiç mahçup etmedi.",
    name: "Mehmet B.",
    occasion: "İş Yemeği",
    initials: "MB",
  },
  {
    text: "Annemin doğum günü için özel kek istedik. Tam hayal ettiğimiz gibi oldu.",
    name: "Zeynep A.",
    occasion: "Doğum Günü",
    initials: "ZA",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="Müşteri Deneyimi"
          title="Sofralarından Duydukları"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-8 border border-gold-light"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    className="text-gold fill-gold"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="font-heading text-lg text-brown-deep italic leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
                  <span className="font-body text-xs font-medium text-terracotta">
                    {review.initials}
                  </span>
                </div>
                <div>
                  <p className="font-body text-sm text-brown-deep font-medium">
                    {review.name}
                  </p>
                  <p className="font-body text-xs text-brown-mid">
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
