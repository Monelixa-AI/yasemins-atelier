"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard, Package, CalendarDays, CreditCard,
  ShoppingBag, Leaf, FolderTree, Gift, Sparkles, Ticket,
  FileText, FileEdit, Image, Target, ChefHat,
  Users, Tags, Star,
  Megaphone, Mail, MessageSquare, Bell,
  Calendar, Truck, Settings, BarChart3,
  ExternalLink, Menu, X,
} from "lucide-react"

const NAV_GROUPS = [
  {
    label: "GENEL",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/siparisler", icon: Package, label: "Siparişler" },
      { href: "/admin/rezervasyonlar", icon: CalendarDays, label: "Rezervasyonlar" },
      { href: "/admin/odemeler", icon: CreditCard, label: "Ödemeler" },
    ],
  },
  {
    label: "KATALOG",
    items: [
      { href: "/admin/urunler", icon: ShoppingBag, label: "Ürünler" },
      { href: "/admin/naturel", icon: Leaf, label: "Naturel" },
      { href: "/admin/kategoriler", icon: FolderTree, label: "Kategoriler" },
      { href: "/admin/paketler", icon: Gift, label: "Paketler" },
      { href: "/admin/koleksiyonlar", icon: Sparkles, label: "Koleksiyonlar" },
      { href: "/admin/indirim-kodlari", icon: Ticket, label: "İndirim Kodları" },
    ],
  },
  {
    label: "İÇERİK",
    items: [
      { href: "/admin/blog", icon: FileText, label: "Blog" },
      { href: "/admin/sayfalar", icon: FileEdit, label: "Sayfalar" },
      { href: "/admin/medya", icon: Image, label: "Medya" },
      { href: "/admin/occasions", icon: Target, label: "Occasions" },
      { href: "/admin/hizmetler", icon: ChefHat, label: "Hizmetler" },
    ],
  },
  {
    label: "MÜŞTERİLER",
    items: [
      { href: "/admin/musteriler", icon: Users, label: "Müşteriler" },
      { href: "/admin/segmentler", icon: Tags, label: "Segmentler" },
      { href: "/admin/yorumlar", icon: Star, label: "Yorumlar" },
    ],
  },
  {
    label: "PAZARLAMA",
    items: [
      { href: "/admin/kampanyalar", icon: Megaphone, label: "Kampanyalar" },
      { href: "/admin/eposta", icon: Mail, label: "E-posta" },
      { href: "/admin/sms", icon: MessageSquare, label: "SMS" },
      { href: "/admin/popup", icon: Bell, label: "Pop-up & Banner" },
    ],
  },
  {
    label: "SİSTEM",
    items: [
      { href: "/admin/musaitlik", icon: Calendar, label: "Müsaitlik" },
      { href: "/admin/teslimat", icon: Truck, label: "Teslimat" },
      { href: "/admin/ayarlar", icon: Settings, label: "Ayarlar" },
      { href: "/admin/raporlar", icon: BarChart3, label: "Raporlar" },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebar = (
    <aside className="flex h-screen w-64 flex-col border-r border-[#5A2D1A] bg-[#3D1A0A] text-[#FDF6EE] shrink-0">
      {/* Brand */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-[#5A2D1A]">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#B8975C]">YA</span>
          <span className="text-sm font-medium text-[#E8D5A3]">Admin</span>
        </Link>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden text-[#E8D5A3]">
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-[#B8975C]/60 uppercase">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-[#FDF6EE]/10 text-[#E8D5A3] font-medium border-l-[3px] border-[#C4622D] -ml-[3px] pl-[15px]"
                        : "text-[#FDF6EE]/70 hover:bg-[#FDF6EE]/5 hover:text-[#FDF6EE]"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#5A2D1A]">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-sm text-[#B8975C] hover:text-[#E8D5A3] transition-colors"
        >
          <ExternalLink size={14} />
          Siteyi Görüntüle
        </a>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-[#3D1A0A] text-[#E8D5A3] rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setMobileOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>{sidebar}</div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">{sidebar}</div>
    </>
  )
}
