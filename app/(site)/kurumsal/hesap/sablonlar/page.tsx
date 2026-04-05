"use client";

import { useState, useEffect } from "react";
import {
  LayoutTemplate,
  Plus,
  ShoppingBag,
  Pencil,
  Trash2,
  Search,
  X,
  Save,
} from "lucide-react";

interface TemplateItem {
  productId: string;
  productName: string;
  quantity: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  items: TemplateItem[];
  lastUsed: string;
}

interface ProductHit {
  id: string;
  name: string;
}

export default function SablonlarPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  /* form state */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<ProductHit[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/corporate/templates")
      .then((r) => r.json())
      .then((d) => setTemplates(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* product search */
  useEffect(() => {
    if (search.length < 2) { setSearchResults([]); return; }
    const t = setTimeout(() => {
      fetch(`/api/admin/products?search=${encodeURIComponent(search)}&limit=5`)
        .then((r) => r.json())
        .then((d) => setSearchResults(Array.isArray(d) ? d : d.products || []))
        .catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  function addItem(p: ProductHit) {
    if (items.find((i) => i.productId === p.id)) return;
    setItems((prev) => [...prev, { productId: p.id, productName: p.name, quantity: 1 }]);
    setSearch("");
    setSearchResults([]);
  }

  function removeItem(pid: string) {
    setItems((prev) => prev.filter((i) => i.productId !== pid));
  }

  function updateQty(pid: string, qty: number) {
    setItems((prev) =>
      prev.map((i) => (i.productId === pid ? { ...i, quantity: Math.max(1, qty) } : i))
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/corporate/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, items }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setTemplates((prev) => [created, ...prev]);
      resetForm();
    } catch {} finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu şablonu silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/corporate/templates/${id}`, { method: "DELETE" });
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch {}
  }

  function resetForm() {
    setName(""); setDescription(""); setItems([]);
    setShowForm(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <LayoutTemplate size={28} className="text-[#C4622D]" />
          <h1 className="font-heading text-3xl text-[#3D1A0A]">Sipariş Şablonları</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#C4622D] hover:bg-[#C4622D]/90 text-white font-body text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          Yeni Şablon
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-[#FDF6EE] rounded-xl p-6 border border-[#B8975C]/10 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs text-[#3D1A0A]/60 mb-1">Şablon Adı *</label>
              <input required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[#B8975C]/20 px-3 py-2 font-body text-sm bg-white focus:outline-none focus:border-[#C4622D]" />
            </div>
            <div>
              <label className="block font-body text-xs text-[#3D1A0A]/60 mb-1">Açıklama</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-[#B8975C]/20 px-3 py-2 font-body text-sm bg-white focus:outline-none focus:border-[#C4622D]" />
            </div>
          </div>

          {/* Product search */}
          <div className="relative">
            <label className="block font-body text-xs text-[#3D1A0A]/60 mb-1">Ürün Ekle</label>
            <div className="flex items-center gap-2 rounded-lg border border-[#B8975C]/20 px-3 py-2 bg-white">
              <Search size={14} className="text-[#3D1A0A]/30" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                className="flex-1 font-body text-sm focus:outline-none" placeholder="Ürün adı ara..." />
            </div>
            {searchResults.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-[#B8975C]/15 rounded-lg shadow-lg overflow-hidden">
                {searchResults.map((p) => (
                  <li key={p.id}>
                    <button type="button" onClick={() => addItem(p)}
                      className="w-full text-left px-4 py-2 font-body text-sm hover:bg-[#FDF6EE] transition-colors">
                      {p.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Items */}
          {items.length > 0 && (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 border border-[#B8975C]/10">
                  <span className="flex-1 font-body text-sm text-[#3D1A0A]">{item.productName}</span>
                  <input type="number" min={1} value={item.quantity}
                    onChange={(e) => updateQty(item.productId, Number(e.target.value))}
                    className="w-16 rounded border border-[#B8975C]/20 px-2 py-1 font-body text-sm text-center focus:outline-none" />
                  <button type="button" onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={saving || items.length === 0}
              className="flex items-center gap-2 px-5 py-2 bg-[#C4622D] hover:bg-[#C4622D]/90 disabled:opacity-50 text-white font-body text-sm font-medium rounded-lg transition-colors">
              <Save size={14} /> {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button type="button" onClick={resetForm}
              className="px-5 py-2 border border-[#3D1A0A]/20 text-[#3D1A0A]/60 font-body text-sm rounded-lg hover:bg-[#3D1A0A]/5 transition-colors">
              İptal
            </button>
          </div>
        </form>
      )}

      {/* Template cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-[#C4622D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-[#B8975C]/10">
          <LayoutTemplate size={48} className="text-[#B8975C]/30 mx-auto mb-3" />
          <p className="font-body text-sm text-[#3D1A0A]/50">Henüz şablon oluşturulmadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-[#B8975C]/10 p-5 hover:border-[#B8975C]/30 transition-colors">
              <h3 className="font-heading text-lg text-[#3D1A0A] mb-1">{t.name}</h3>
              <p className="font-body text-xs text-[#3D1A0A]/50 mb-4">
                {t.items.length} ürün &middot; Son: {t.lastUsed}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#C4622D] hover:bg-[#C4622D]/90 text-white font-body text-xs font-medium rounded-lg transition-colors">
                  <ShoppingBag size={13} /> Sipariş Ver
                </button>
                <button className="px-3 py-2 border border-[#B8975C]/20 text-[#3D1A0A]/60 hover:bg-[#FDF6EE] rounded-lg transition-colors">
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(t.id)}
                  className="px-3 py-2 border border-red-200 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
