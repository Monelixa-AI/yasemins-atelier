"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  LayoutTemplate,
  Users,
  FileText,
  Package,
  TrendingUp,
  CreditCard,
  Wallet,
  Clock,
  ArrowRight,
  Building2,
} from "lucide-react";

const navItems = [
  { id: "ozet", label: "Özet", icon: LayoutDashboard, href: "/kurumsal/hesap" },
  { id: "siparisler", label: "Siparişlerim", icon: ShoppingBag, href: "/kurumsal/hesap" },
  { id: "sablonlar", label: "Şablonlarım", icon: LayoutTemplate, href: "/kurumsal/hesap/sablonlar" },
  { id: "ekip", label: "Ekip", icon: Users, href: "/kurumsal/hesap/ekip" },
  { id: "faturalar", label: "Faturalarım", icon: FileText, href: "/kurumsal/hesap/faturalar" },
  { id: "toplu", label: "Toplu Sipariş", icon: Package, href: "/kurumsal/hesap" },
];

interface Account {
  companyName: string;
  status: string;
  priceGroup: string;
  monthlyOrders: number;
  monthlySpend: number;
  creditLimit: number;
  creditUsed: number;
  pendingApprovals: number;
  recentOrders: {
    id: string; orderNumber: string; total: string; status: string; date: string;
  }[];
  templates: {
    id: string; name: string; itemCount: number; lastUsed: string;
  }[];
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  SUSPENDED: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Aktif",
  PENDING: "Onay Bekliyor",
  SUSPENDED: "Askıda",
};

export default function KurumsalHesapPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/corporate/account")
      .then((r) => r.json())
      .then(setAccount)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const metrics = account
    ? [
        { icon: ShoppingBag, label: "Bu Ay Sipariş", value: account.monthlyOrders },
        { icon: TrendingUp, label: "Bu Ay Harcama", value: `${account.monthlySpend.toLocaleString("tr-TR")} TL` },
        { icon: CreditCard, label: "Kredi Limiti", value: `${account.creditLimit.toLocaleString("tr-TR")} TL`, progress: account.creditLimit > 0 ? (account.creditUsed / account.creditLimit) * 100 : 0 },
        { icon: Clock, label: "Bekleyen Onay", value: account.pendingApprovals },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-body text-sm whitespace-nowrap transition-colors ${
                item.id === "ozet"
                  ? "bg-[#C4622D] text-white"
                  : "text-[#3D1A0A]/70 hover:bg-[#FDF6EE]"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Content */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#C4622D] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !account ? (
            <div className="text-center py-20">
              <Building2 size={48} className="text-[#B8975C]/40 mx-auto mb-4" />
              <p className="font-body text-[#3D1A0A]/60">Kurumsal hesap bulunamadı.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="font-heading text-3xl text-[#3D1A0A]">
                  {account.companyName}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[account.status] || "bg-gray-100 text-gray-600"}`}>
                  {statusLabels[account.status] || account.status}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#B8975C]/10 text-[#B8975C] text-xs font-semibold">
                  {account.priceGroup}
                </span>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m) => (
                  <div key={m.label} className="bg-white rounded-xl border border-[#B8975C]/10 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <m.icon size={16} className="text-[#C4622D]" />
                      <span className="font-body text-xs text-[#3D1A0A]/50">{m.label}</span>
                    </div>
                    <p className="font-heading text-2xl text-[#3D1A0A]">{m.value}</p>
                    {"progress" in m && typeof m.progress === "number" && (
                      <div className="mt-2 h-1.5 bg-[#FDF6EE] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C4622D] rounded-full transition-all"
                          style={{ width: `${Math.min(m.progress, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl text-[#3D1A0A]">Son Siparişler</h2>
                  <button className="flex items-center gap-1 text-[#C4622D] font-body text-sm hover:underline">
                    Tümünü Gör <ArrowRight size={14} />
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-[#B8975C]/10 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#B8975C]/10 bg-[#FDF6EE]/50">
                        <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">Sipariş No</th>
                        <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">Tarih</th>
                        <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">Tutar</th>
                        <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {account.recentOrders.map((o) => (
                        <tr key={o.id} className="border-b border-[#B8975C]/5 last:border-0">
                          <td className="px-4 py-3 font-body text-sm text-[#3D1A0A]">{o.orderNumber}</td>
                          <td className="px-4 py-3 font-body text-sm text-[#3D1A0A]/60">{o.date}</td>
                          <td className="px-4 py-3 font-body text-sm text-[#3D1A0A]">{o.total}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#B8975C]/10 text-[#B8975C]">
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {account.recentOrders.length === 0 && (
                        <tr><td colSpan={4} className="px-4 py-8 text-center font-body text-sm text-[#3D1A0A]/40">Henüz sipariş yok</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Active templates */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl text-[#3D1A0A]">Aktif Şablonlar</h2>
                  <Link href="/kurumsal/hesap/sablonlar" className="flex items-center gap-1 text-[#C4622D] font-body text-sm hover:underline">
                    Tümünü Gör <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {account.templates.map((t) => (
                    <div key={t.id} className="bg-white rounded-xl border border-[#B8975C]/10 p-5">
                      <Wallet size={20} className="text-[#B8975C] mb-2" />
                      <h3 className="font-heading text-base text-[#3D1A0A] mb-1">{t.name}</h3>
                      <p className="font-body text-xs text-[#3D1A0A]/50">
                        {t.itemCount} ürün &middot; Son: {t.lastUsed}
                      </p>
                    </div>
                  ))}
                  {account.templates.length === 0 && (
                    <p className="font-body text-sm text-[#3D1A0A]/40 col-span-3">Henüz şablon yok</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
