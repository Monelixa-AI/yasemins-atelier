"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionHeader from "@/components/site/ui/SectionHeader";

const reviews = [
  {
    text: "Kızım için aldığım sebzeli krakerler harika. Renkli olması dikkatini çekiyor, severek yiyor. İçinde ne olduğunu bilmek çok rahatlatici.",
    name: "Elif T.",
    occasion: "Çocuk Serisi",
    initials: "ET",
    rating: 5,
  },
  {
    text: "Granola bağımlısı oldum! Her sabah yoğurdun üstüne koyuyorum. Markettekilerle karşılaştırınca ne kadar saf olduğu hissediliyor.",
    name: "Burak S.",
    occasion: "Granola & Bar",
    initials: "BS",
    rating: 5,
  },
  {
    text: "Hediye kutusu olarak gönderdim, alan kişi çok beğendi. Paketleme çok şık ve ürünlerin tamamı gerçekten lezzetli.",
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
          eyebrow="Müşteri Deneyimi"
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
