"use client";

import { useState } from "react";
import { blogPosts, blogCategories } from "@/lib/data/blog";
import JournalHero from "./JournalHero";
import JournalGrid from "./JournalGrid";

export default function JournalPageClient() {
  const [activeCategory, setActiveCategory] = useState("Tüm Yazılar");

  const filtered =
    activeCategory === "Tüm Yazılar"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <>
      <JournalHero
        categories={blogCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <JournalGrid posts={filtered} />
    </>
  );
}
