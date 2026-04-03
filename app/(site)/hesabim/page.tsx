"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Calendar, Heart, MapPin, Star, User } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/site/product/ProductCard";

const tabs = [
  { id: "orders", label: "Siparişlerim", icon: Package },
  { id: "bookings", label: "Rezervasyonlarım", icon: Calendar },
  { id: "wishlist", label: "Favorilerim", icon: Heart },
  { id: "addresses", label: "Adreslerim", icon: MapPin },
  { id: "loyalty", label: "Puanlarım", icon: Star },
  { id: "profile", label: "Profil", icon: User },
];

export default function HesabimPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [mounted, setMounted] = useState(false);
  const wishlistItems = useWishlistStore((s) => s.items);

  useEffect(() => setMounted(true), []);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <h1 className="font-heading text-4xl text-brown-deep mb-8">Hesabım</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-body text-sm whitespace-nowrap transition-colors ${activeTab === tab.id ? "bg-terracotta text-white" : "text-brown-mid hover:bg-cream"}`}>
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div>
          {activeTab === "orders" && (
            <div>
              <h2 className="font-heading text-2xl text-brown-deep mb-6">Siparişlerim</h2>
              <div className="bg-cream p-8 text-center">
                <Package size={40} className="text-gold-light mx-auto mb-3" />
                <p className="font-body text-sm text-brown-mid">Henüz siparişiniz yok.</p>
                <Link href="/menu" className="inline-block mt-4 font-body text-sm text-terracotta hover:text-terracotta-dark underline underline-offset-4">Menüyü Keşfet</Link>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h2 className="font-heading text-2xl text-brown-deep mb-6">Rezervasyonlarım</h2>
              <div className="bg-cream p-8 text-center">
                <Calendar size={40} className="text-gold-light mx-auto mb-3" />
                <p className="font-body text-sm text-brown-mid">Henüz rezervasyonunuz yok.</p>
                <Link href="/hizmetler" className="inline-block mt-4 font-body text-sm text-terracotta hover:text-terracotta-dark underline underline-offset-4">Hizmetleri Keşfet</Link>
              </div>
            </div>
          )}

          {activeTab === "wishlist" && mounted && (
            <div>
              <h2 className="font-heading text-2xl text-brown-deep mb-6">Favorilerim ({wishlistItems.length})</h2>
              {wishlistItems.length === 0 ? (
                <div className="bg-cream p-8 text-center">
                  <Heart size={40} className="text-gold-light mx-auto mb-3" />
                  <p className="font-body text-sm text-brown-mid">Favori ürün eklemediniz.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.filter((p) => wishlistItems.includes(p.id)).map((p) => (
                    <ProductCard key={p.id} product={{ slug: p.slug, name: p.name, category: "", shortDesc: p.shortDesc, price: p.basePrice, imageUrl: p.images[0] ?? "" }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "addresses" && (
            <div>
              <h2 className="font-heading text-2xl text-brown-deep mb-6">Adreslerim</h2>
              <div className="bg-cream p-8 text-center">
                <MapPin size={40} className="text-gold-light mx-auto mb-3" />
                <p className="font-body text-sm text-brown-mid">Kayıtlı adresiniz yok.</p>
                <button className="mt-4 font-body text-sm bg-terracotta text-white px-6 py-2 hover:bg-terracotta-dark transition-colors">Adres Ekle</button>
              </div>
            </div>
          )}

          {activeTab === "loyalty" && (
            <div>
              <h2 className="font-heading text-2xl text-brown-deep mb-6">Puanlarım</h2>
              <div className="bg-cream p-8 text-center">
                <p className="font-heading text-6xl font-bold text-terracotta">0</p>
                <p className="font-body text-sm text-brown-mid mt-2">puan</p>
                <div className="inline-block mt-4 px-4 py-1 bg-[#CD7F32] text-white font-body text-xs rounded-full">Bronz Üye</div>
                <p className="font-body text-xs text-brown-mid mt-4">Sonraki seviye (Gümüş) için 500 puan gerekli</p>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h2 className="font-heading text-2xl text-brown-deep mb-6">Profil Bilgilerim</h2>
              <form className="max-w-md space-y-4">
                <input type="text" placeholder="Ad Soyad" className="w-full border border-gold-light px-4 py-3 font-body text-sm rounded-none focus:outline-none focus:border-terracotta" />
                <input type="email" placeholder="E-posta" className="w-full border border-gold-light px-4 py-3 font-body text-sm rounded-none focus:outline-none focus:border-terracotta" disabled />
                <input type="tel" placeholder="Telefon" className="w-full border border-gold-light px-4 py-3 font-body text-sm rounded-none focus:outline-none focus:border-terracotta" />
                <input type="date" className="w-full border border-gold-light px-4 py-3 font-body text-sm rounded-none focus:outline-none focus:border-terracotta" />
                <button type="submit" className="bg-terracotta text-white font-body text-sm font-medium px-8 py-3 hover:bg-terracotta-dark transition-colors">Güncelle</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
