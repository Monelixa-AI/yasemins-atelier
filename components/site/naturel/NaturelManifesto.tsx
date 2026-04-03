"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import ImagePlaceholder from "@/components/site/ui/ImagePlaceholder";

const checkItems = [
  "Her \u00FCr\u00FCn\u00FC bizzat kendisi test eder",
  "Sadece mevsiminde, yerel \u00FCreticilerden tedarik",
  "Hi\u00E7bir koruyucu veya aroma kullanmaz",
];

export default function NaturelManifesto() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <ImagePlaceholder
              aspectRatio="aspect-[3/4]"
              label="Yasemin mutfakta"
              className="w-full"
            />

            {/* Floating Quote Card */}
            <div
              className="absolute -bottom-6 -right-4 lg:right-8 max-w-[260px] p-6 shadow-xl"
              style={{ backgroundColor: "#2D4A1E" }}
            >
              <p className="font-heading text-[17px] text-white italic leading-relaxed">
                &ldquo;Eline ald\u0131\u011F\u0131n \u00FCr\u00FCn\u00FCn i\u00E7indekiler listesini okumak zorunda kalmamal\u0131s\u0131n.&rdquo;
              </p>
              <p className="font-body text-[11px] text-white/60 mt-3 uppercase tracking-wider">
                &mdash; Yasemin
              </p>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {/* Eyebrow */}
            <p
              className="font-body text-[10px] font-medium uppercase tracking-[0.2em] mb-3"
              style={{ color: "#4A7C3F" }}
            >
              NATUREL MAN\u0130FESTO
            </p>

            {/* Heading */}
            <h2 className="font-heading text-[36px] md:text-[48px] font-semibold text-brown-deep leading-tight italic">
              Bir etiketi okumak zorunda kalmamal\u0131s\u0131n\u0131z.
            </h2>

            {/* Paragraphs */}
            <div className="mt-6 space-y-4">
              <p className="font-body text-[15px] text-brown-deep/80 leading-relaxed">
                Market raflar\u0131ndaki \u00FCr\u00FCnlerin \u00E7o\u011Fu, i\u00E7indekiler listesinde
                tan\u0131yamayaca\u011F\u0131n\u0131z onlarca madde bar\u0131nd\u0131r\u0131r. Koruyucular,
                yapay aromalar, stabilizat\u00F6rler... Bunlar\u0131n hi\u00E7biri sofralar\u0131m\u0131za ait
                de\u011Fil.
              </p>
              <p className="font-body text-[15px] text-brown-deep/80 leading-relaxed">
                Naturel, bu duruma bir alternatif olarak do\u011Fdu. Her \u00FCr\u00FCn\u00FCm\u00FCzde
                sadece bildi\u011Finiz, tan\u0131d\u0131\u011F\u0131n\u0131z malzemeler var. Yulaf, bal,
                f\u0131nd\u0131k, tar\u00E7\u0131n &mdash; hepsi bu kadar.
              </p>
              <p className="font-body text-[15px] text-brown-deep/80 leading-relaxed">
                \u00C7ocuklar\u0131n\u0131za g\u00F6n\u00FCl rahatl\u0131\u011F\u0131yla verebilece\u011Finiz,
                ailenizle payla\u015Fabilece\u011Finiz lezzetler. Daha az\u0131 ger\u00E7ekten daha
                \u00E7oktur.
              </p>
            </div>

            {/* Check Items */}
            <div className="mt-8 space-y-3">
              {checkItems.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#EAF3DE" }}
                  >
                    <Check size={14} style={{ color: "#4A7C3F" }} />
                  </div>
                  <span className="font-body text-[14px] text-brown-deep font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
