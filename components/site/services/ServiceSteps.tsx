"use client";

import { motion } from "framer-motion";
import type { ServiceStep } from "@/lib/data/services";
import SectionHeader from "@/components/site/ui/SectionHeader";

export default function ServiceSteps({ steps }: { steps: ServiceStep[] }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow="Süreç" title="Nasıl Çalışır?" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full bg-terracotta text-white font-heading text-2xl font-bold flex items-center justify-center mx-auto">
                {step.step}
              </div>
              <h3 className="font-heading text-xl text-brown-deep mt-4">{step.title}</h3>
              <p className="font-body text-sm text-brown-mid mt-2 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
