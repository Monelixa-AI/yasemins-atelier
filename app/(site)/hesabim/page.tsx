"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Calendar, Heart, MapPin, Star, User, FileText } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/site/product/ProductCard";

interface OrderRow {
  id: string
  orderNumber: string
  total: string
  status: string
  paymentStatus: string
  createdAt: string
  adminNote: string | null
}

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
          {activeTab === "orders" && <OrdersTab />}

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

/* ── Orders Tab with invoice download ── */

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Bekliyor", color: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "Onaylandı", color: "bg-blue-100 text-blue-700" },
  PREPARING: { label: "Hazırlanıyor", color: "bg-indigo-100 text-indigo-700" },
  READY: { label: "Hazır", color: "bg-teal-100 text-teal-700" },
  OUT_FOR_DELIVERY: { label: "Yolda", color: "bg-cyan-100 text-cyan-700" },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "İptal", color: "bg-red-100 text-red-700" },
  REFUNDED: { label: "İade", color: "bg-purple-100 text-purple-700" },
}

function OrdersTab() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch user's orders
    // For now, show the empty state
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-brown-mid font-body text-sm">Yükleniyor...</div>
  }

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="font-heading text-2xl text-brown-deep mb-6">Siparişlerim</h2>
        <div className="bg-cream p-8 text-center">
          <Package size={40} className="text-gold-light mx-auto mb-3" />
          <p className="font-body text-sm text-brown-mid">Henüz siparişiniz yok.</p>
          <Link href="/menu" className="inline-block mt-4 font-body text-sm text-terracotta hover:text-terracotta-dark underline underline-offset-4">Menüyü Keşfet</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-heading text-2xl text-brown-deep mb-6">Siparişlerim</h2>
      <div className="space-y-4">
        {orders.map((order) => {
          const status = STATUS_MAP[order.status] || { label: order.status, color: "bg-gray-100 text-gray-600" }
          return (
            <div key={order.id} className="border border-gold-light p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-sm font-medium text-brown-deep">{order.orderNumber}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>{status.label}</span>
                </div>
                <p className="font-body text-xs text-brown-mid">
                  {new Date(order.createdAt).toLocaleDateString("tr-TR")} — {parseFloat(order.total).toFixed(0)}₺
                </p>
                {order.adminNote && order.adminNote.startsWith("Kargo:") && (
                  <p className="font-body text-xs text-cyan-600 mt-1">{order.adminNote}</p>
                )}
              </div>
              <div className="flex gap-2">
                {(order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_REFUNDED") && (
                  <a
                    href={`/api/invoices/${order.id}`}
                    className="inline-flex items-center gap-1.5 border border-terracotta text-terracotta font-body text-xs px-3 py-2 hover:bg-terracotta hover:text-white transition-colors"
                  >
                    <FileText size={14} />
                    Fatura İndir
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
