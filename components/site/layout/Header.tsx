"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CartButton from "@/components/site/cart/CartButton";

const navLinks = [
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/occasions", label: "Özel Günler" },
  { href: "/menu", label: "Menü" },
  { href: "/atelier", label: "Atelier" },
  { href: "/journal", label: "Journal" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "h-[70px] bg-cream/90 backdrop-blur-md shadow-sm"
            : "h-[90px] bg-cream"
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Yasemin's Atelier"
              width={320}
              height={96}
              className={`transition-all duration-300 object-contain ${
                scrolled ? "h-[56px] w-auto" : "h-[70px] w-auto"
              }`}
              priority
            />
            <span className="hidden sm:block font-body text-[11px] text-gold tracking-[0.2em] uppercase leading-tight border-l border-gold/30 pl-3">
              Gastronomi
              <br />
              Atölyesi
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-[15px] text-brown-deep hover:text-terracotta transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/siparis"
              className="font-body text-[15px] text-white bg-terracotta px-5 py-2 rounded-full hover:bg-terracotta-dark transition-colors duration-200"
            >
              Sipariş
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Arama"
              className="hidden sm:flex w-9 h-9 items-center justify-center text-brown-deep hover:text-terracotta transition-colors"
            >
              <Search size={18} />
            </button>
            <Link
              href="/favoriler"
              className="hidden sm:flex relative w-9 h-9 items-center justify-center text-brown-deep hover:text-terracotta transition-colors"
            >
              <Heart size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta text-white text-[10px] font-body rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
            <CartButton />
            <button
              aria-label="Hesap"
              className="hidden sm:flex w-9 h-9 items-center justify-center text-brown-deep hover:text-terracotta transition-colors"
            >
              <User size={18} />
            </button>

            {/* Mobile Hamburger */}
            <button
              aria-label="Menü"
              className="lg:hidden w-9 h-9 flex items-center justify-center text-brown-deep"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed inset-0 z-[60] bg-cream flex flex-col"
          >
            <div className="flex items-center justify-between px-4 h-[80px]">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
              >
                <Image
                  src="/images/logo.png"
                  alt="Yasemin's Atelier"
                  width={280}
                  height={84}
                  className="h-[64px] w-auto object-contain"
                />
              </Link>
              <button
                aria-label="Kapat"
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 flex items-center justify-center text-brown-deep"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center items-center gap-8 px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-heading text-3xl text-brown-deep hover:text-terracotta transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/siparis"
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-lg text-white bg-terracotta px-8 py-3 rounded-full hover:bg-terracotta-dark transition-colors"
                >
                  Sipariş
                </Link>
              </motion.div>
            </nav>

            <div className="flex justify-center gap-6 pb-10">
              <Link href="/favoriler" onClick={() => setMobileOpen(false)}>
                <Heart size={20} className="text-brown-deep" />
              </Link>
              <Link href="/sepet" onClick={() => setMobileOpen(false)}>
                <ShoppingBag size={20} className="text-brown-deep" />
              </Link>
              <button aria-label="Hesap">
                <User size={20} className="text-brown-deep" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
