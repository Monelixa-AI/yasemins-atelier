"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AtelierContact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Randevu talebi:", form);
    setForm({ name: "", email: "", phone: "", date: "", guests: "", notes: "" });
  };

  return (
    <section className="py-20 bg-terracotta">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-4xl lg:text-5xl text-white">
            Büyük Bir Etkinlik mi Planlıyorsunuz?
          </h2>
          <p className="font-body text-base text-white/80 mt-4">
            Yasemin ile bire bir menü planlaması için randevu alın.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white max-w-lg mx-auto mt-10 p-8"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ad Soyad"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gold-light px-4 py-3 font-body text-sm text-brown-deep placeholder:text-brown-mid/40 rounded-none focus:outline-none focus:border-terracotta"
              required
            />
            <input
              type="email"
              placeholder="E-posta"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gold-light px-4 py-3 font-body text-sm text-brown-deep placeholder:text-brown-mid/40 rounded-none focus:outline-none focus:border-terracotta"
              required
            />
            <input
              type="tel"
              placeholder="Telefon"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gold-light px-4 py-3 font-body text-sm text-brown-deep placeholder:text-brown-mid/40 rounded-none focus:outline-none focus:border-terracotta"
              required
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border border-gold-light px-4 py-3 font-body text-sm text-brown-deep rounded-none focus:outline-none focus:border-terracotta"
              required
            />
            <select
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: e.target.value })}
              className="w-full border border-gold-light px-4 py-3 font-body text-sm text-brown-deep rounded-none focus:outline-none focus:border-terracotta appearance-none bg-white"
              required
            >
              <option value="">Kişi Sayısı</option>
              <option value="2-5">2-5 kişi</option>
              <option value="5-10">5-10 kişi</option>
              <option value="10-20">10-20 kişi</option>
              <option value="20-50">20-50 kişi</option>
              <option value="50+">50+ kişi</option>
            </select>
            <textarea
              placeholder="Notlar (isteğe bağlı)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={4}
              className="w-full border border-gold-light px-4 py-3 font-body text-sm text-brown-deep placeholder:text-brown-mid/40 rounded-none focus:outline-none focus:border-terracotta resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-terracotta text-white font-body text-sm font-medium py-4 rounded-none hover:bg-terracotta-dark transition-colors"
          >
            Randevu Talep Et
          </button>

          <p className="font-body text-xs text-brown-mid mt-4">
            En geç 24 saat içinde dönüş yapılır.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
