"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/site/ui/SectionHeader";

const timelineItems = [
  {
    year: "2005",
    title: "Gastronomi Eğitimi Başlangıcı",
    desc: "İstanbul'da gastronomi programına başladı. Temel teknikler, mutfak kimyası ve lezzet bilimi.",
  },
  {
    year: "2008",
    title: "Avrupa Stajı",
    desc: "Fransa ve İtalya'da çeşitli restoranlar ve atölyelerde staj. Akdeniz mutfağı uzmanlığı.",
  },
  {
    year: "2010",
    title: "Gastronomi Diploması",
    desc: "Bölüm birincisi olarak mezuniyet. Uluslararası mutfak teknikleri sertifikası.",
  },
  {
    year: "2012",
    title: "Özel Etkinlikler & Catering",
    desc: "Kurumsal ve özel etkinlikler için catering hizmeti vermeye başladı.",
  },
  {
    year: "2018",
    title: "Yasemin's Atelier Kuruluşu",
    desc: "Kendi markasını ve atölyesini kurdu. El yapımı, sipariş üzerine üretim modeli.",
  },
  {
    year: "2024",
    title: "Bugün",
    desc: "500+ mutlu sofra, 40+ meze çeşidi, İstanbul'un en sevilen gastronomi atölyesi.",
  },
];

export default function AtelierTimeline() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="Yolculuk"
          title="Eğitim & Deneyim Yolculuğu"
        />

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gold-light lg:-translate-x-px" />

          {timelineItems.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative flex items-start mb-12 last:mb-0 ${
                  isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-6 lg:left-1/2 w-4 h-4 rounded-full bg-terracotta border-4 border-white -translate-x-1/2 mt-1 z-10" />

                {/* Content */}
                <div
                  className={`ml-14 lg:ml-0 lg:w-[calc(50%-2rem)] ${
                    isLeft ? "lg:pr-12 lg:text-right" : "lg:pl-12"
                  }`}
                >
                  <span className="font-heading text-3xl font-bold text-terracotta">
                    {item.year}
                  </span>
                  <h3 className="font-heading text-[22px] text-brown-deep mt-1">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-brown-mid mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
