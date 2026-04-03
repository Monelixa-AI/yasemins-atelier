"use client";

import { motion } from "framer-motion";
import type { ServiceData } from "@/lib/data/services";
import SafeImage from "@/components/site/ui/SafeImage";

export default function ServiceHero({ service }: { service: ServiceData }) {
  return (
    <section className="relative min-h-[60vh] overflow-hidden" style={{ backgroundColor: service.colorBg }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col justify-center p-8 lg:p-16 relative z-10"
        >
          <span className="text-5xl mb-4">{service.icon}</span>
          <h1 className="font-heading text-5xl lg:text-7xl text-white leading-[1.05]">
            {service.name}
          </h1>
          <p className="font-heading text-2xl text-white/80 italic mt-4">
            {service.tagline}
          </p>
          <p className="font-body text-base text-white/70 leading-[1.8] mt-6 max-w-md">
            {service.description}
          </p>
          <a
            href="#packages"
            className="inline-flex items-center justify-center mt-8 w-fit font-body text-sm font-medium bg-white px-8 py-4 rounded-none hover:bg-cream transition-colors"
            style={{ color: service.colorBg }}
          >
            Paketleri İncele ↓
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative min-h-[300px] lg:min-h-0"
        >
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r to-transparent z-10" style={{ background: `linear-gradient(to right, ${service.colorBg}, transparent)` }} />
          <SafeImage src={service.imageUrl} alt={service.name} aspectRatio="" className="absolute inset-0 w-full h-full" fallbackLabel={service.name} />
        </motion.div>
      </div>
    </section>
  );
}
