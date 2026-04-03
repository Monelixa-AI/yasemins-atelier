import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Categories
  const catData = [
    { name: "Mezeler", slug: "mezeler", description: "Soğuk ve sıcak meze çeşitlerimiz", sortOrder: 1, children: [
      { name: "Soğuk Mezeler", slug: "soguk-mezeler", sortOrder: 1 },
      { name: "Sıcak Mezeler", slug: "sicak-mezeler", sortOrder: 2 },
      { name: "Deniz Ürünlü", slug: "deniz-urunlu-mezeler", sortOrder: 3 },
    ]},
    { name: "Börekler & Hamurlar", slug: "borekler", description: "El açması börek çeşitlerimiz", sortOrder: 2, children: [
      { name: "Su Böreği", slug: "su-boregi", sortOrder: 1 },
      { name: "Kol Böreği", slug: "kol-boregi", sortOrder: 2 },
      { name: "Mini Börekler", slug: "mini-borekler", sortOrder: 3 },
    ]},
    { name: "Kek & Tatlılar", slug: "tatlilar", description: "Özel sipariş kekler ve tatlılar", sortOrder: 3, children: [
      { name: "Özel Kekler", slug: "ozel-kekler", sortOrder: 1 },
      { name: "Türk Tatlıları", slug: "turk-tatlilar", sortOrder: 2 },
    ]},
    { name: "Kanepe & Finger Food", slug: "kanepe", description: "Kokteyl ve etkinlikler için", sortOrder: 4, children: [] },
    { name: "Kahvaltı Setleri", slug: "kahvalti-setleri", description: "Hafta sonu kahvaltı sofrası", sortOrder: 5, children: [] },
    { name: "Salata Setleri", slug: "salata-setleri", description: "Taze ve mevsimlik salatalar", sortOrder: 6, children: [] },
    { name: "Hediye Kutuları", slug: "hediye-kutulari", description: "Özel günler için hazır setler", sortOrder: 7, children: [
      { name: "Standart", slug: "standart-hediye", sortOrder: 1 },
      { name: "Premium", slug: "premium-hediye", sortOrder: 2 },
      { name: "Kurumsal", slug: "kurumsal-hediye-kutu", sortOrder: 3 },
    ]},
  ];

  for (const cat of catData) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: { name: cat.name, slug: cat.slug, description: cat.description, sortOrder: cat.sortOrder },
    });
    for (const child of cat.children) {
      await prisma.category.upsert({
        where: { slug: child.slug },
        update: { name: child.name, parentId: parent.id, sortOrder: child.sortOrder },
        create: { name: child.name, slug: child.slug, parentId: parent.id, sortOrder: child.sortOrder },
      });
    }
  }
  console.log("✅ Categories seeded");

  // 2. Occasions
  const occData = [
    { slug: "MISAFIR_AGIRMA", name: "Misafir Ağırlama", sortOrder: 1 },
    { slug: "KADIN_GUNLERI", name: "Kadın Günleri", sortOrder: 2 },
    { slug: "DOGUM_GUNU", name: "Doğum Günü", sortOrder: 3 },
    { slug: "IS_YEMEGI", name: "İş Yemeği", sortOrder: 4 },
    { slug: "KURUMSAL_HEDIYE", name: "Kurumsal Hediye", sortOrder: 5 },
    { slug: "EV_PARTISI", name: "Ev Partisi", sortOrder: 6 },
    { slug: "KAHVALTI", name: "Kahvaltı Sofrası", sortOrder: 7 },
    { slug: "SAGLIKLI", name: "Sağlıklı & Diyet", sortOrder: 8 },
    { slug: "MEVSIMSEL", name: "Mevsimsel & Özel", sortOrder: 9 },
  ];

  for (const occ of occData) {
    await prisma.occasion.upsert({
      where: { slug: occ.slug as any },
      update: { name: occ.name, sortOrder: occ.sortOrder },
      create: { slug: occ.slug as any, name: occ.name, sortOrder: occ.sortOrder },
    });
  }
  console.log("✅ Occasions seeded");

  // 3. Products
  const productData = [
    { name: "Klasik Meze Tabağı", slug: "klasik-meze-tabagi", shortDesc: "8 çeşit soğuk meze, haydari, patlıcan ezmesi ve daha fazlası.", basePrice: 280, catSlug: "soguk-mezeler", isFeatured: true, isVegan: false, isGlutenFree: false, allergens: ["süt", "yumurta"], occasions: ["MISAFIR_AGIRMA", "IS_YEMEGI"], variants: [{ name: "2 Kişilik", priceAdd: 0 }, { name: "4 Kişilik", priceAdd: 120 }, { name: "8 Kişilik", priceAdd: 280 }] },
    { name: "Ev Yapımı Su Böreği", slug: "ev-yapimi-su-boregi", shortDesc: "İnce yufka, peynirli veya kıymalı. El açması, fırında.", basePrice: 320, catSlug: "su-boregi", isFeatured: true, isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt", "yumurta"], occasions: ["MISAFIR_AGIRMA", "IS_YEMEGI", "KAHVALTI"], variants: [{ name: "Küçük Tepsi", priceAdd: 0 }, { name: "Büyük Tepsi", priceAdd: 180 }] },
    { name: "Misafir Ağırlama Seti", slug: "misafir-agirma-seti", shortDesc: "4 meze + 1 börek + 1 tatlı. 8 kişilik tam sofra seti.", basePrice: 680, catSlug: "hediye-kutulari", isFeatured: true, isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt", "yumurta"], occasions: ["MISAFIR_AGIRMA"], variants: [{ name: "8 Kişilik", priceAdd: 0 }, { name: "12 Kişilik", priceAdd: 240 }] },
    { name: "Baklava Çeşitleri", slug: "baklava-cesitleri", shortDesc: "Antep fıstıklı, cevizli ve sütlü baklava karışık tabak.", basePrice: 240, catSlug: "turk-tatlilar", isFeatured: false, isVegan: false, isGlutenFree: false, allergens: ["gluten", "fıstık", "ceviz"], occasions: ["DOGUM_GUNU", "MISAFIR_AGIRMA", "MEVSIMSEL"], variants: [{ name: "500g", priceAdd: 0 }, { name: "1kg", priceAdd: 220 }] },
    { name: "Mini Finger Food Seti", slug: "mini-finger-food-seti", shortDesc: "20 çeşit tek ısırımlık kanepe ve finger food.", basePrice: 380, catSlug: "kanepe", isFeatured: true, isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt"], occasions: ["KADIN_GUNLERI", "EV_PARTISI", "IS_YEMEGI"], variants: [{ name: "20 Adet", priceAdd: 0 }, { name: "40 Adet", priceAdd: 340 }] },
  ];

  for (const p of productData) {
    const cat = await prisma.category.findUnique({ where: { slug: p.catSlug } });
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { name: p.name, shortDesc: p.shortDesc, basePrice: p.basePrice, categoryId: cat?.id, isFeatured: p.isFeatured, isVegan: p.isVegan, isGlutenFree: p.isGlutenFree, allergens: p.allergens },
      create: { name: p.name, slug: p.slug, shortDesc: p.shortDesc, basePrice: p.basePrice, categoryId: cat?.id, isFeatured: p.isFeatured, isVegan: p.isVegan, isGlutenFree: p.isGlutenFree, allergens: p.allergens },
    });

    // Variants
    for (const v of p.variants) {
      const existing = await prisma.productVariant.findFirst({ where: { productId: product.id, name: v.name } });
      if (!existing) {
        await prisma.productVariant.create({ data: { productId: product.id, name: v.name, priceAdd: v.priceAdd } });
      }
    }

    // Occasion links
    for (const occSlug of p.occasions) {
      const occ = await prisma.occasion.findUnique({ where: { slug: occSlug as any } });
      if (occ) {
        await prisma.occasionProduct.upsert({
          where: { occasionId_productId: { occasionId: occ.id, productId: product.id } },
          update: {},
          create: { occasionId: occ.id, productId: product.id },
        });
      }
    }
  }
  console.log("✅ Products seeded");
  console.log("🎉 Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
