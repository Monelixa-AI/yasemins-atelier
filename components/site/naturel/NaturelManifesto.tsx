"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import ImagePlaceholder from "@/components/site/ui/ImagePlaceholder";

const checkItems = [
  "Her ürünü bizzat kendisi test eder",
  "Sadece mevsiminde, yerel üreticilerden tedarik",
  "Hiçbir koruyucu veya aroma kullanmaz",
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
                &ldquo;Eline aldığın ürünün içindekiler listesini okumak zorunda kalmamalısın.&rdquo;
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
              NATUREL MANİFESTO
            </p>

            {/* Heading */}
            <h2 className="font-heading text-[36px] md:text-[48px] font-semibold text-brown-deep leading-tight italic">
              Bir etiketi okumak zorunda kalmamalısınız.
            </h2>

            {/* Paragraphs */}
            <div className="mt-6 space-y-4">
              <p className="font-body text-[15px] text-brown-deep/80 leading-relaxed">
                Market raflarındaki ürünlerin çoğu, içindekiler listesinde
                tanıyamayacağınız onlarca madde barındırır. Koruyucular,
                yapay aromalar, stabilizatörler... Bunların hiçbiri sofralarımıza ait
                değil.
              </p>
              <p className="font-body text-[15px] text-brown-deep/80 leading-relaxed">
                Naturel, bu duruma bir alternatif olarak doğdu. Her ürünümüzde
                sadece bildiğiniz, tanıdığınız malzemeler var. Yulaf, bal,
                fındık, tarçın &mdash; hepsi bu kadar.
              </p>
              <p className="font-body text-[15px] text-brown-deep/80 leading-relaxed">
                Çocuklarınıza gönül rahatlığıyla verebileceğiniz,
                ailenizle paylaşabileceğiniz lezzetler. Daha azı gerçekten daha
                çoktur.
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
