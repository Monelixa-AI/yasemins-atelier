"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  ClipboardList,
  Tags,
  Search,
  CheckCircle,
  XCircle,
  Plus,
  Save,
  Eye,
} from "lucide-react";

interface Account { id: string; companyName: string; contactName: string; contactEmail: string; priceGroup: string; monthlySpend: number; status: string }
interface Application { id: string; companyName: string; contactName: string; contactEmail: string; contactPhone: string; estimatedVolume: string; needs: string[]; createdAt: string }
interface PriceGroup { id: string; name: string; discountType: "PERCENT" | "FIXED"; discountValue: number }

const tabs = [
  { id: "accounts", label: "Hesaplar", icon: Building2 },
  { id: "applications", label: "Başvurular", icon: ClipboardList },
  { id: "priceGroups", label: "Fiyat Grupları", icon: Tags },
] as const;

type TabId = (typeof tabs)[number]["id"];

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  SUSPENDED: "bg-red-100 text-red-700",
};
const statusLabels: Record<string, string> = {
  ACTIVE: "Aktif", PENDING: "Bekliyor", SUSPENDED: "Askıda",
};

export default function AdminKurumsalPage() {
  const [tab, setTab] = useState<TabId>("accounts");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl text-[#3D1A0A]">Kurumsal B2B Yönetimi</h1>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-[#B8975C]/10 pb-px overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 font-body text-sm whitespace-nowrap transition-colors border-b-2 ${
              tab === t.id
                ? "border-[#C4622D] text-[#C4622D]"
                : "border-transparent text-[#3D1A0A]/50 hover:text-[#3D1A0A]"
            }`}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "accounts" && <AccountsTab />}
      {tab === "applications" && <ApplicationsTab />}
      {tab === "priceGroups" && <PriceGroupsTab />}
    </div>
  );
}

/* -- Hesaplar Tab -- */
function AccountsTab() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/corporate/accounts")
      .then((r) => r.json()).then((d) => setAccounts(Array.isArray(d) ? d : []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? accounts.filter((a) => a.companyName.toLowerCase().includes(search.toLowerCase()))
    : accounts;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg border border-[#B8975C]/20 px-3 py-2 bg-white w-72">
        <Search size={14} className="text-[#3D1A0A]/30" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 font-body text-sm focus:outline-none" placeholder="Şirket adı ara..." />
      </div>

      <div className="bg-white rounded-xl border border-[#B8975C]/10 overflow-hidden">
        {loading ? <Spinner /> : filtered.length === 0 ? <Empty text="Hesap bulunamadı" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-[#B8975C]/10 bg-[#FDF6EE]/50">
                  {["Şirket", "İletişim", "Fiyat Grubu", "Aylık Harcama", "Durum", ""].map((h) => (
                    <th key={h} className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b border-[#B8975C]/5 last:border-0 hover:bg-[#FDF6EE]/30">
                    <td className="px-4 py-3 font-body text-sm text-[#3D1A0A] font-medium">{a.companyName}</td>
                    <td className="px-4 py-3">
                      <span className="font-body text-sm text-[#3D1A0A]">{a.contactName}</span>
                      <br /><span className="font-body text-xs text-[#3D1A0A]/50">{a.contactEmail}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#B8975C]/10 text-[#B8975C] text-xs font-medium">{a.priceGroup}</span>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-[#3D1A0A]">{a.monthlySpend.toLocaleString("tr-TR")} TL</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[a.status] || "bg-gray-100 text-gray-500"}`}>
                        {statusLabels[a.status] || a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-[#C4622D] hover:text-[#C4622D]/70"><Eye size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* -- Başvurular Tab -- */
function ApplicationsTab() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/corporate/applications")
      .then((r) => r.json()).then((d) => setApps(Array.isArray(d) ? d : []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleAction(id: string, action: "approve" | "reject") {
    try {
      await fetch(`/api/admin/corporate/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch {}
  }

  return (
    <div className="space-y-4">
      {loading ? <Spinner /> : apps.length === 0 ? <Empty text="Bekleyen başvuru yok" /> : (
        <div className="space-y-4">
          {apps.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-[#B8975C]/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-heading text-lg text-[#3D1A0A]">{a.companyName}</h3>
                  <p className="font-body text-sm text-[#3D1A0A]/60">
                    {a.contactName} &middot; {a.contactEmail} &middot; {a.contactPhone}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {a.needs.map((n) => (
                      <span key={n} className="px-2 py-0.5 rounded-full bg-[#FDF6EE] text-[#3D1A0A]/60 text-xs">{n}</span>
                    ))}
                  </div>
                  <p className="font-body text-xs text-[#3D1A0A]/40 mt-2">
                    Hacim: {a.estimatedVolume} &middot; {new Date(a.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(a.id, "approve")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-body text-sm rounded-lg transition-colors">
                    <CheckCircle size={14} /> Onayla
                  </button>
                  <button onClick={() => handleAction(a.id, "reject")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-body text-sm rounded-lg transition-colors">
                    <XCircle size={14} /> Reddet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -- Fiyat Grupları Tab -- */
function PriceGroupsTab() {
  const [groups, setGroups] = useState<PriceGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [discountValue, setDiscountValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/corporate/price-groups")
      .then((r) => r.json()).then((d) => setGroups(Array.isArray(d) ? d : []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/corporate/price-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, discountType, discountValue: Number(discountValue) }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setGroups((prev) => [...prev, created]);
      setName(""); setDiscountValue(""); setShowForm(false);
    } catch {} finally { setSaving(false); }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#C4622D] hover:bg-[#C4622D]/90 text-white font-body text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} /> Yeni Fiyat Grubu
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-[#FDF6EE] rounded-xl p-5 border border-[#B8975C]/10 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[180px]">
            <label className="block font-body text-xs text-[#3D1A0A]/60 mb-1">Grup Adı *</label>
            <input required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[#B8975C]/20 px-3 py-2 font-body text-sm bg-white focus:outline-none focus:border-[#C4622D]" />
          </div>
          <div className="w-40">
            <label className="block font-body text-xs text-[#3D1A0A]/60 mb-1">İndirim Tipi</label>
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value as "PERCENT" | "FIXED")}
              className="w-full rounded-lg border border-[#B8975C]/20 px-3 py-2 font-body text-sm bg-white focus:outline-none focus:border-[#C4622D]">
              <option value="PERCENT">Yüzde (%)</option>
              <option value="FIXED">Sabit (TL)</option>
            </select>
          </div>
          <div className="w-32">
            <label className="block font-body text-xs text-[#3D1A0A]/60 mb-1">Değer *</label>
            <input type="number" required min={0} value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="w-full rounded-lg border border-[#B8975C]/20 px-3 py-2 font-body text-sm bg-white focus:outline-none focus:border-[#C4622D]" />
          </div>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[#3D1A0A] hover:bg-[#3D1A0A]/90 disabled:opacity-50 text-white font-body text-sm font-medium rounded-lg transition-colors">
            <Save size={14} /> {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      )}

      {loading ? <Spinner /> : groups.length === 0 ? <Empty text="Fiyat grubu yok" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((g) => (
            <div key={g.id} className="bg-white rounded-xl border border-[#B8975C]/10 p-5">
              <h3 className="font-heading text-lg text-[#3D1A0A] mb-1">{g.name}</h3>
              <p className="font-body text-2xl text-[#C4622D] font-semibold">
                {g.discountType === "PERCENT" ? `%${g.discountValue}` : `${g.discountValue} TL`}
              </p>
              <p className="font-body text-xs text-[#3D1A0A]/40 mt-1">
                {g.discountType === "PERCENT" ? "Yüzde indirim" : "Sabit indirim"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- shared helpers ---- */
function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-7 h-7 border-2 border-[#C4622D] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl border border-[#B8975C]/10">
      <p className="font-body text-sm text-[#3D1A0A]/50">{text}</p>
    </div>
  );
}
