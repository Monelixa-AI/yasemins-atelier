"use client";

import { motion } from "framer-motion";
import { GraduationCap, Leaf, Truck, Clock } from "lucide-react";

const items = [
  { icon: GraduationCap, text: "Gastronomi Mezunu Şef" },
  { icon: Leaf, text: "El Seçimi Malzemeler" },
  { icon: Truck, text: "İstanbul Geneli Teslimat" },
  { icon: Clock, text: "Her Gün Taze Hazırlanır" },
];

export default function TrustBar() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-brown-deep py-3"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:flex lg:items-center lg:justify-center gap-3 lg:gap-0">
          {items.map((item, i) => (
            <div key={item.text} className="flex items-center justify-center">
              {i > 0 && (
                <span className="hidden lg:inline text-gold mx-5 text-sm select-none">
                  |
                </span>
              )}
              <item.icon size={14} className="text-gold mr-2 shrink-0" />
              <span className="font-body text-xs text-white whitespace-nowrap">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
