"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useDropzone } from "react-dropzone"
import { AdminHeader } from "@/components/admin/AdminHeader"
import {
  Loader2, Upload, X, GripVertical, ImageIcon, Save,
} from "lucide-react"

/* ---------- types ---------- */
interface Category {
  id: string
  name: string
  slug: string
}

interface FormState {
  /* tab 1 - temel */
  name: string
  slug: string
  shortDesc: string
  status: "ACTIVE" | "INACTIVE"
  categoryId: string

  /* tab 2 - fiyat & stok */
  basePrice: string
  costPrice: string
  isNaturel: boolean
  stockCount: string
  lowStockAlert: string
  weightGrams: string
  isShippable: boolean
  maxDailyOrders: string
  leadTimeHours: string

  /* tab 3 - görseller */
  images: { url: string; uploading?: boolean }[]

  /* tab 4 - diyet */
  vegan: boolean
  vegetarian: boolean
  glutenFree: boolean
  lactoseFree: boolean
  halal: boolean
  allergens: string[]
  ingredients: string
  shelfLifeHours: string

  /* tab 5 - seo */
  metaTitle: string
  metaDesc: string
}

const INITIAL_STATE: FormState = {
  name: "",
  slug: "",
  shortDesc: "",
  status: "ACTIVE",
  categoryId: "",
  basePrice: "",
  costPrice: "",
  isNaturel: false,
  stockCount: "",
  lowStockAlert: "5",
  weightGrams: "",
  isShippable: true,
  maxDailyOrders: "",
  leadTimeHours: "",
  images: [],
  vegan: false,
  vegetarian: false,
  glutenFree: false,
  lactoseFree: false,
  halal: false,
  allergens: [],
  ingredients: "",
  shelfLifeHours: "",
  metaTitle: "",
  metaDesc: "",
}

const ALLERGEN_LIST = [
  "Gluten",
  "Süt",
  "Yumurta",
  "Balık",
  "Kabuklu deniz ürünleri",
  "Fındık/Sert kabuklu meyveler",
  "Yer fıstığı",
  "Soya",
  "Kereviz",
  "Hardal",
  "Susam",
  "Kükürt dioksit",
  "Acı bakla (Lupin)",
  "Yumuşakça",
]

const TABS = [
  { key: "temel", label: "Temel" },
  { key: "fiyat", label: "Fiyat & Stok" },
  { key: "gorseller", label: "Görseller" },
  { key: "diyet", label: "Diyet" },
  { key: "seo", label: "SEO" },
]

/* ---------- helpers ---------- */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[âçığöşüÂÇİĞÖŞÜ]/g, (c) => {
      const map: Record<string, string> = {
        "â": "a", "ç": "c", "ı": "i",
        "ğ": "g", "ö": "o", "ş": "s",
        "ü": "u",
        "Â": "a", "Ç": "c", "İ": "i",
        "Ğ": "g", "Ö": "o", "Ş": "s",
        "Ü": "u",
      }
      return map[c] || c
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/* ---------- component ---------- */
export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [categories, setCategories] = useState<Category[]>([])
  const [activeTab, setActiveTab] = useState("temel")
  const [saving, setSaving] = useState(false)
  const [uploadingCount, setUploadingCount] = useState(0)

  /* fetch categories */
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? d ?? []))
      .catch(() => {})
  }, [])

  /* helpers */
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  /* auto-slug from name */
  const handleNameChange = (value: string) => {
    const prev = form.name
    const prevSlug = slugify(prev)
    set("name", value)
    if (form.slug === "" || form.slug === prevSlug) {
      set("slug", slugify(value))
    }
  }

  /* image upload */
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      setUploadingCount((c) => c + 1)
      const placeholder = { url: "", uploading: true }
      setForm((prev) => ({ ...prev, images: [...prev.images, placeholder] }))

      try {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })
        if (res.ok) {
          const data = await res.json()
          setForm((prev) => ({
            ...prev,
            images: prev.images.map((img) =>
              img === placeholder ? { url: data.url } : img
            ),
          }))
        } else {
          setForm((prev) => ({
            ...prev,
            images: prev.images.filter((img) => img !== placeholder),
          }))
        }
      } catch {
        setForm((prev) => ({
          ...prev,
          images: prev.images.filter((img) => img !== placeholder),
        }))
      } finally {
        setUploadingCount((c) => c - 1)
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: true,
  })

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  /* toggle allergen */
  const toggleAllergen = (allergen: string) => {
    setForm((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter((a) => a !== allergen)
        : [...prev.allergens, allergen],
    }))
  }

  /* save */
  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Ürün adı zorunludur.")
      return
    }
    if (!form.basePrice) {
      alert("Fiyat zorunludur.")
      return
    }

    setSaving(true)
    try {
      const body = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        shortDesc: form.shortDesc,
        status: form.status,
        categoryId: form.categoryId || null,
        basePrice: parseFloat(form.basePrice),
        costPrice: form.costPrice ? parseFloat(form.costPrice) : null,
        isNaturel: form.isNaturel,
        stockCount: form.isNaturel && form.stockCount ? parseInt(form.stockCount) : null,
        lowStockAlert: form.isNaturel && form.lowStockAlert ? parseInt(form.lowStockAlert) : null,
        weightGrams: form.isNaturel && form.weightGrams ? parseInt(form.weightGrams) : null,
        isShippable: form.isNaturel ? form.isShippable : false,
        maxDailyOrders: form.maxDailyOrders ? parseInt(form.maxDailyOrders) : null,
        leadTimeHours: form.leadTimeHours ? parseInt(form.leadTimeHours) : null,
        images: form.images.filter((img) => img.url).map((img, i) => ({
          url: img.url,
          isPrimary: i === 0,
          sortOrder: i,
        })),
        vegan: form.vegan,
        vegetarian: form.vegetarian,
        glutenFree: form.glutenFree,
        lactoseFree: form.lactoseFree,
        halal: form.halal,
        allergens: form.allergens,
        ingredients: form.ingredients,
        shelfLifeHours: form.shelfLifeHours ? parseInt(form.shelfLifeHours) : null,
        metaTitle: form.metaTitle,
        metaDesc: form.metaDesc,
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        router.push("/admin/urunler")
      } else {
        const errData = await res.json()
        alert(errData.error || "Ürün oluşturulamadı.")
      }
    } catch {
      alert("Bağlantı hatası")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pb-24">
      {/* header */}
      <AdminHeader
        title="Yeni Ürün Ekle"
        breadcrumb={["Ürünler", "Yeni"]}
        actions={
          <Link
            href="/admin/urunler"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            İptal
          </Link>
        }
      />

      {/* tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={"px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors " + (activeTab === tab.key
              ? "text-[#C4622D] border-b-2 border-[#C4622D] -mb-px"
              : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ----- TAB 1: TEMEL ----- */}
      {activeTab === "temel" && (
        <div className="space-y-6 max-w-2xl">
          {/* name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ürün Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Örnek: Feyzi'nin Cheesecake'i"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
            />
          </div>

          {/* slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">/urunler/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] font-mono"
              />
            </div>
          </div>

          {/* shortDesc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kısa Açıklama
              <span className="text-xs text-gray-400 ml-2">
                {form.shortDesc.length}/160
              </span>
            </label>
            <textarea
              value={form.shortDesc}
              onChange={(e) => {
                if (e.target.value.length <= 160) set("shortDesc", e.target.value)
              }}
              rows={3}
              placeholder="Ürün hakkında kısa açıklama..."
              className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
            />
          </div>

          {/* status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durum
            </label>
            <div className="flex gap-4">
              {(["ACTIVE", "INACTIVE"] as const).map((s) => (
                <label key={s} className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={form.status === s}
                    onChange={() => set("status", s)}
                    className="accent-[#C4622D]"
                  />
                  <span className="text-sm">{s === "ACTIVE" ? "Aktif" : "Pasif"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
            >
              <option value="">Kategori seçin...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ----- TAB 2: FIYAT & STOK ----- */}
      {activeTab === "fiyat" && (
        <div className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            {/* basePrice */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Satış Fiyat (₺) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.basePrice}
                onChange={(e) => set("basePrice", e.target.value)}
                placeholder="0.00"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
              />
            </div>

            {/* costPrice */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maliyet Fiyat (₺)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.costPrice}
                onChange={(e) => set("costPrice", e.target.value)}
                placeholder="0.00"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
              />
            </div>
          </div>

          {/* isNaturel toggle */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isNaturel}
                onChange={(e) => set("isNaturel", e.target.checked)}
                className="w-4 h-4 accent-[#4A7C3F]"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Naturel Ürün</p>
                <p className="text-xs text-gray-500">
                  Stok, ağırlık ve kargo bilgileri aktif olur.
                </p>
              </div>
            </label>
          </div>

          {/* naturel fields */}
          {form.isNaturel && (
            <div className="space-y-4 pl-4 border-l-2 border-green-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stok Adedi
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.stockCount}
                    onChange={(e) => set("stockCount", e.target.value)}
                    placeholder="0"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Düşük Stok Uyarısı
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.lowStockAlert}
                    onChange={(e) => set("lowStockAlert", e.target.value)}
                    placeholder="5"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ağırlık (gram)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.weightGrams}
                    onChange={(e) => set("weightGrams", e.target.value)}
                    placeholder="0"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isShippable}
                      onChange={(e) => set("isShippable", e.target.checked)}
                      className="w-4 h-4 accent-[#4A7C3F]"
                    />
                    <span className="text-sm text-gray-700">Kargoya Verilebilir</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maks. Günlük Sipariş
              </label>
              <input
                type="number"
                min="0"
                value={form.maxDailyOrders}
                onChange={(e) => set("maxDailyOrders", e.target.value)}
                placeholder="Sınır yok"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hazırlama Süresi (saat)
              </label>
              <input
                type="number"
                min="0"
                value={form.leadTimeHours}
                onChange={(e) => set("leadTimeHours", e.target.value)}
                placeholder="0"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ----- TAB 3: GÖRSELLER ----- */}
      {activeTab === "gorseller" && (
        <div className="space-y-6 max-w-3xl">
          {/* dropzone */}
          <div
            {...getRootProps()}
            className={"border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors " + (isDragActive
              ? "border-[#C4622D] bg-[#C4622D]/5"
              : "border-gray-300 hover:border-gray-400"
            )}
          >
            <input {...getInputProps()} />
            <Upload size={32} className="mx-auto text-gray-400 mb-3" />
            {isDragActive ? (
              <p className="text-sm text-[#C4622D]">Görselleri bırakın...</p>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Görselleri sürükle bırakın veya tıkla
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WEBP (maks. 5MB)
                </p>
              </>
            )}
          </div>

          {/* image grid */}
          {form.images.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-3">
                İlk görsel ana görsel olarak kullanılır.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {form.images.map((img, index) => (
                  <div
                    key={index}
                    className={"relative group rounded-lg overflow-hidden border-2 " + (index === 0 ? "border-[#C4622D]" : "border-gray-200")}
                  >
                    {img.uploading ? (
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        <Loader2 size={24} className="animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <>
                        <img
                          src={img.url}
                          alt={"Görsel " + (index + 1)}
                          className="aspect-square object-cover w-full"
                        />
                        {index === 0 && (
                          <span className="absolute top-2 left-2 bg-[#C4622D] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                            Ana
                          </span>
                        )}
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----- TAB 4: DIYET ----- */}
      {activeTab === "diyet" && (
        <div className="space-y-6 max-w-2xl">
          {/* diet checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Diyet Özellikleri
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: "vegan" as const, label: "Vegan" },
                { key: "vegetarian" as const, label: "Vejetaryen" },
                { key: "glutenFree" as const, label: "Glütensiz" },
                { key: "lactoseFree" as const, label: "Laktozsuz" },
                { key: "halal" as const, label: "Helal" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => set(key, e.target.checked)}
                    className="w-4 h-4 accent-[#C4622D]"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* allergens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Alerjenler
              <span className="text-xs text-gray-400 ml-2">
                ({form.allergens.length} seçili)
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ALLERGEN_LIST.map((allergen) => (
                <label
                  key={allergen}
                  className={"flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm transition-colors " + (form.allergens.includes(allergen)
                    ? "bg-red-50 border border-red-200"
                    : "hover:bg-gray-50 border border-transparent"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={form.allergens.includes(allergen)}
                    onChange={() => toggleAllergen(allergen)}
                    className="w-4 h-4 accent-red-500"
                  />
                  {allergen}
                </label>
              ))}
            </div>
          </div>

          {/* ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İçindekiler
            </label>
            <textarea
              value={form.ingredients}
              onChange={(e) => set("ingredients", e.target.value)}
              rows={4}
              placeholder="Ürün içeriğindeki malzemeleri yazin..."
              className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
            />
          </div>

          {/* shelfLifeHours */}
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Raf Ömrü (saat)
            </label>
            <input
              type="number"
              min="0"
              value={form.shelfLifeHours}
              onChange={(e) => set("shelfLifeHours", e.target.value)}
              placeholder="Örnek: 72"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
            />
          </div>
        </div>
      )}

      {/* ----- TAB 5: SEO ----- */}
      {activeTab === "seo" && (
        <div className="space-y-6 max-w-2xl">
          {/* metaTitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Başlık
              <span className={"text-xs ml-2 " + (form.metaTitle.length > 60 ? "text-red-500" : "text-gray-400")}>
                {form.metaTitle.length}/60
              </span>
            </label>
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
              placeholder={form.name || "Ürün adı"}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
            />
            {form.metaTitle.length > 60 && (
              <p className="text-xs text-red-500 mt-1">
                Meta başlık 60 karakteri geçmemeli.
              </p>
            )}
          </div>

          {/* metaDesc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Açıklama
              <span className={"text-xs ml-2 " + (form.metaDesc.length > 160 ? "text-red-500" : "text-gray-400")}>
                {form.metaDesc.length}/160
              </span>
            </label>
            <textarea
              value={form.metaDesc}
              onChange={(e) => set("metaDesc", e.target.value)}
              rows={3}
              placeholder="Arama motorları için açıklama..."
              className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
            />
            {form.metaDesc.length > 160 && (
              <p className="text-xs text-red-500 mt-1">
                Meta açıklama 160 karakteri geçmemeli.
              </p>
            )}
          </div>

          {/* slug display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Önizleme
            </label>
            <div className="bg-gray-50 border rounded-lg px-3 py-2">
              <p className="text-sm text-green-700 font-mono">
                yaseminsatelier.com/urunler/{form.slug || "..."}
              </p>
            </div>
          </div>

          {/* seo preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Önizleme
            </label>
            <div className="bg-white border rounded-lg p-4 space-y-1">
              <p className="text-blue-700 text-lg hover:underline cursor-pointer truncate">
                {form.metaTitle || form.name || "Ürün Adı"}
              </p>
              <p className="text-green-700 text-sm font-mono truncate">
                yaseminsatelier.com/urunler/{form.slug || "..."}
              </p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {form.metaDesc || form.shortDesc || "Ürün açıklaması burada görünecek..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ----- STICKY FOOTER ----- */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t px-6 py-4 flex items-center justify-between z-30">
        <div className="text-xs text-gray-400">
          {uploadingCount > 0 && (
            <span className="flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" />
              {uploadingCount} görsel yükleniyor...
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving || uploadingCount > 0}
          className="inline-flex items-center gap-2 bg-[#C4622D] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#A34F22] transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save size={16} />
              Kaydet
            </>
          )}
        </button>
      </div>
    </div>
  )
}
