"use client";

import Link from "next/link";
import Image from "next/image";
import { Camera, MessageCircle, Play, Send } from "lucide-react";
import { useState } from "react";

const footerLinks = {
  kesfet: [
    { href: "/occasions", label: "Özel Günler" },
    { href: "/menu", label: "Menü" },
    { href: "/menu?filter=koleksiyonlar", label: "Koleksiyonlar" },
    { href: "/menu?filter=haftanin-seckileri", label: "Bu Haftanın Seçkileri" },
  ],
  bilgi: [
    { href: "/atelier", label: "Yasemin'i Tanı" },
    { href: "/journal", label: "Atelier Journal" },
    { href: "/sss", label: "SSS" },
    { href: "/iletisim", label: "İletişim" },
  ],
  legal: [
    { href: "/gizlilik", label: "Gizlilik" },
    { href: "/kvkk", label: "KVKK" },
    { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
    { href: "/cerez-politikasi", label: "Çerez Politikası" },
    { href: "/iptal-iade", label: "İptal & İade" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-brown-deep text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1 — Brand */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Yasemin's Atelier"
                width={300}
                height={90}
                className="h-[84px] w-auto object-contain brightness-0 invert opacity-90"
              />
            </Link>
            <p className="font-heading text-lg text-gold italic mt-3">
              &ldquo;Her sofra, bir sanat eseridir.&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com/yaseminsatelier"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/60 hover:text-gold transition-colors"
              >
                <Camera size={20} />
              </a>
              <a
                href="https://wa.me/905XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-white/60 hover:text-gold transition-colors"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-white/60 hover:text-gold transition-colors"
              >
                <Play size={20} />
              </a>
              {/* TikTok — lucide doesn't have it, using a simple text icon */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-white/60 hover:text-gold transition-colors font-body text-xs font-bold"
              >
                TT
              </a>
            </div>
          </div>

          {/* Column 2 — Keşfet */}
          <div>
            <h4 className="font-body text-xs font-medium uppercase tracking-[0.15em] text-gold mb-5">
              Keşfet
            </h4>
            <ul className="space-y-3">
              {footerLinks.kesfet.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Bilgi */}
          <div>
            <h4 className="font-body text-xs font-medium uppercase tracking-[0.15em] text-gold mb-5">
              Bilgi
            </h4>
            <ul className="space-y-3">
              {footerLinks.bilgi.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Bülten */}
          <div>
            <h4 className="font-body text-xs font-medium uppercase tracking-[0.15em] text-gold mb-5">
              Bülten
            </h4>
            <p className="font-body text-sm text-white/70 mb-4">
              Sofra sırları posta kutunuza gelsin
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="flex"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                className="flex-1 bg-white/10 border border-white/20 px-4 py-2.5 font-body text-sm text-white placeholder:text-white/40 rounded-none focus:outline-none focus:border-gold"
                required
              />
              <button
                type="submit"
                className="bg-terracotta px-4 py-2.5 text-white hover:bg-terracotta-dark transition-colors rounded-none"
                aria-label="Abone ol"
              >
                <Send size={16} />
              </button>
            </form>
            <p className="font-body text-xs text-gold mt-3">
              İlk siparişinizde %10 indirim
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/50">
            © 2026 Yasemin&apos;s Atelier · Tüm hakları saklıdır
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-xs text-white/50 hover:text-white/80 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="font-body text-xs text-white/50">
            Made with ♥ in Istanbul
          </p>
        </div>
      </div>
    </footer>
  );
}
