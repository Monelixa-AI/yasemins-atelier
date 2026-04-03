"use client";

import { useState } from "react";
import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import MenuSidebar from "./MenuSidebar";
import MenuProductGrid from "./MenuProductGrid";

export default function MenuLayout() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState({ vegan: false, glutenFree: false });

  const handleFilterChange = (key: "vegan" | "glutenFree", val: boolean) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  // Get all category IDs that match (parent + children)
  const getCategoryIds = (id: string | null): string[] => {
    if (!id) return [];
    const cat = categories.find((c) => c.id === id);
    if (cat) return [cat.id, ...cat.children.map((ch) => ch.id)];
    // Might be a subcategory
    return [id];
  };

  const filtered = products.filter((p) => {
    if (selectedCategory) {
      const ids = getCategoryIds(selectedCategory);
      if (!ids.includes(p.categoryId)) return false;
    }
    if (filters.vegan && !p.isVegan) return false;
    if (filters.glutenFree && !p.isGlutenFree) return false;
    return true;
  });

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <MenuSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          <MenuProductGrid products={filtered} />
        </div>
      </div>
    </section>
  );
}
