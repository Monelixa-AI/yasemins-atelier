"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeader from "@/components/site/ui/SectionHeader";

export default function AtelierBio() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — image with floating cards */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src="/images/chef-market.jpg"
                alt="Yasemin — Pazar Alışverişi"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Floating stat — bottom left */}
            <div className="absolute bottom-6 left-6 bg-white p-4 shadow-sm">
              <p className="font-heading text-4xl font-bold text-terracotta">15+</p>
              <p className="font-body text-xs text-brown-mid">Yıl Deneyim</p>
            </div>

            {/* Floating stat — top right */}
            <div className="absolute top-6 right-6 bg-terracotta p-4">
              <p className="font-heading text-4xl font-bold text-white">500+</p>
              <p className="font-body text-xs text-white/80">Mutlu Sofra</p>
            </div>
          </motion.div>

          {/* Right — bio text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:pl-4"
          >
            <SectionHeader
              eyebrow="Hikaye"
              title="Gastronomi bir tutku,"
              subtitle="zanaat ise bir yaşam biçimidir."
              centered={false}
            />

            <div className="space-y-6">
              <p className="font-body text-[15px] text-brown-mid leading-[1.9]">
                Yasemin, İstanbul&apos;un köklü mutfak geleneğini çağdaş
                gastronomi bilimiyle harmanlayan bir şeftir. Küçük yaştan
                itibaren mutfakta büyüdü — büyükannesinin ellerinden öğrendiği
                tarifler, bugün akademik eğitimiyle pekişti.
              </p>
              <p className="font-body text-[15px] text-brown-mid leading-[1.9]">
                Gastronomi eğitimi boyunca öğrendiği teknikler, her tabakta
                kendini gösteriyor. Malzeme seçiminden sunuma, lezzet
                dengesinden görsel kompozisyona — her adım bilinçli ve özenli.
              </p>
              <p className="font-body text-[15px] text-brown-mid leading-[1.9]">
                2018 yılında kurduğu Yasemin&apos;s Atelier ile İstanbul&apos;un
                seçkin sofralarına girmeye başladı. Bugün özel günler, iş
                yemekleri ve misafir ağırlama sofralarının vazgeçilmez adresi.
              </p>
            </div>

            {/* Signature */}
            <div className="mt-10">
              <svg
                viewBox="0 0 200 50"
                className="h-12 text-terracotta"
                fill="currentColor"
              >
                <text
                  x="0"
                  y="38"
                  fontFamily="Georgia, serif"
                  fontSize="36"
                  fontStyle="italic"
                >
                  Yasemin
                </text>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
