"use client";

import { categories } from "@/lib/data/categories";

interface MenuSidebarProps {
  selectedCategory: string | null;
  onCategoryChange: (id: string | null) => void;
  filters: { vegan: boolean; glutenFree: boolean };
  onFilterChange: (key: "vegan" | "glutenFree", val: boolean) => void;
}

export default function MenuSidebar({
  selectedCategory,
  onCategoryChange,
  filters,
  onFilterChange,
}: MenuSidebarProps) {
  return (
    <aside className="bg-cream p-6 border-r border-gold-light lg:sticky lg:top-[100px] h-fit">
      <h3 className="font-body text-[11px] font-medium uppercase tracking-[0.15em] text-gold mb-4">
        Kategoriler
      </h3>

      <button
        onClick={() => onCategoryChange(null)}
        className={`block w-full text-left font-body text-sm py-1.5 transition-colors ${
          selectedCategory === null ? "text-terracotta font-medium" : "text-brown-deep hover:text-terracotta"
        }`}
      >
        Tüm Ürünler
      </button>

      <div className="space-y-1 mt-2">
        {categories.map((cat) => (
          <div key={cat.id}>
            <button
              onClick={() => onCategoryChange(cat.id)}
              className={`block w-full text-left font-body text-sm py-1.5 transition-colors ${
                selectedCategory === cat.id
                  ? "text-terracotta font-medium bg-terracotta-light/50 px-2 -mx-2"
                  : "text-brown-deep hover:text-terracotta"
              }`}
            >
              {cat.name}
              <span className="text-gold text-xs ml-1">({cat.productCount})</span>
            </button>
            {cat.children.length > 0 && (
              <div className="ml-3 space-y-0.5">
                {cat.children.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => onCategoryChange(sub.id)}
                    className={`block w-full text-left font-body text-xs py-1 transition-colors ${
                      selectedCategory === sub.id
                        ? "text-terracotta font-medium"
                        : "text-brown-mid hover:text-terracotta"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-8 pt-6 border-t border-gold-light">
        <h3 className="font-body text-[11px] font-medium uppercase tracking-[0.15em] text-gold mb-4">
          Filtreler
        </h3>

        <label className="flex items-center gap-2 py-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.vegan}
            onChange={(e) => onFilterChange("vegan", e.target.checked)}
            className="w-4 h-4 accent-terracotta"
          />
          <span className="font-body text-sm text-brown-deep">Vegan</span>
        </label>
        <label className="flex items-center gap-2 py-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.glutenFree}
            onChange={(e) => onFilterChange("glutenFree", e.target.checked)}
            className="w-4 h-4 accent-terracotta"
          />
          <span className="font-body text-sm text-brown-deep">Glutensiz</span>
        </label>

        <button
          onClick={() => {
            onCategoryChange(null);
            onFilterChange("vegan", false);
            onFilterChange("glutenFree", false);
          }}
          className="font-body text-xs text-terracotta hover:text-terracotta-dark transition-colors mt-4"
        >
          Filtreleri Temizle
        </button>
      </div>
    </aside>
  );
}
