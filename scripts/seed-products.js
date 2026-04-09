const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding categories...");

  const categories = [
    { name: "Soğuk Mezeler", slug: "soguk-mezeler", description: "Soğuk meze çeşitlerimiz" },
    { name: "Su Böreği", slug: "su-boregi", description: "El açması su böreği" },
    { name: "Hediye Kutuları", slug: "hediye-kutulari", description: "Özel günler için hazır setler" },
    { name: "Türk Tatlıları", slug: "turk-tatlilar", description: "Geleneksel Türk tatlıları" },
    { name: "Kanepe & Finger Food", slug: "kanepe", description: "Kokteyl ve etkinlikler için" },
    { name: "Özel Kekler", slug: "ozel-kekler", description: "Kişiselleştirilmiş pasta ve kekler" },
    { name: "Premium Hediye", slug: "premium-hediye", description: "Premium hediye kutuları" },
    { name: "Kurumsal Hediye", slug: "kurumsal-hediye-k", description: "Kurumsal hediye setleri" },
    { name: "Kahvaltı Setleri", slug: "kahvalti-setleri", description: "Hafta sonu kahvaltı sofrası" },
    { name: "Salata Setleri", slug: "salata-setleri", description: "Taze ve mevsimlik salatalar" },
    { name: "Mini Börekler", slug: "mini-borekler", description: "Glutensiz ve mini börekler" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`  ${categories.length} kategori eklendi.`);

  // Get category map
  const allCats = await prisma.category.findMany();
  const catMap = {};
  for (const c of allCats) {
    catMap[c.slug] = c.id;
  }

  console.log("Seeding products...");

  const products = [
    {
      name: "Klasik Meze Tabağı", slug: "klasik-meze-tabagi",
      shortDesc: "8 çeşit soğuk meze, haydari, patlıcan ezmesi, kalamar ve daha fazlası.",
      basePrice: 280, categoryId: catMap["soguk-mezeler"],
      isFeatured: true, isVegan: false, isGlutenFree: false, allergens: ["süt", "yumurta"],
      avgRating: 4.9, reviewCount: 47,
    },
    {
      name: "Ev Yapımı Su Böreği", slug: "ev-yapimi-su-boregi",
      shortDesc: "İnce yufka, peynirli veya kıymalı. El açması, fırında.",
      basePrice: 320, categoryId: catMap["su-boregi"],
      isFeatured: true, isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt", "yumurta"],
      avgRating: 4.8, reviewCount: 62,
    },
    {
      name: "Misafir Ağırlama Seti", slug: "misafir-agirma-seti",
      shortDesc: "4 meze + 1 börek + 1 tatlı. 8 kişilik tam sofra seti.",
      basePrice: 680, categoryId: catMap["hediye-kutulari"],
      isFeatured: true, isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt", "yumurta"],
      avgRating: 5.0, reviewCount: 28,
    },
    {
      name: "Baklava Çeşitleri", slug: "baklava-cesitleri",
      shortDesc: "Antep fıstıklı, cevizli ve sütlü baklava karışık tabak.",
      basePrice: 240, categoryId: catMap["turk-tatlilar"],
      isFeatured: false, isVegan: false, isGlutenFree: false, allergens: ["gluten", "fıstık", "ceviz"],
      avgRating: 4.9, reviewCount: 83,
    },
    {
      name: "Mini Finger Food Seti", slug: "mini-finger-food-seti",
      shortDesc: "20 çeşit tek ısırımlık kanepe ve finger food. Parti için ideal.",
      basePrice: 380, categoryId: catMap["kanepe"],
      isFeatured: true, isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt"],
      avgRating: 4.7, reviewCount: 35,
    },
    {
      name: "Özel Doğum Günü Keki", slug: "ozel-dogum-gunu-keki",
      shortDesc: "Kişiselleştirilmiş tasarım, seçilen krem ve kat sayısı.",
      basePrice: 450, categoryId: catMap["ozel-kekler"],
      isFeatured: false, isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt", "yumurta"],
      requiresCustomOrder: true, avgRating: 5.0, reviewCount: 19,
    },
    {
      name: "Acılı Ezme & Humus Tabağı", slug: "acili-ezme-humus-tabagi",
      shortDesc: "Ev yapımı acılı ezme, humus ve tahin sosu. Lavaş eşliğinde.",
      basePrice: 160, categoryId: catMap["soguk-mezeler"],
      isFeatured: false, isVegan: true, isGlutenFree: true, allergens: ["susam"],
      avgRating: 4.8, reviewCount: 54,
    },
    {
      name: "Premium Hediye Kutusu", slug: "premium-hediye-kutusu",
      shortDesc: "Özel tasarım kutuda 6 çeşit el yapımı ürün. En anlamlı hediye.",
      basePrice: 480, categoryId: catMap["premium-hediye"],
      isFeatured: false, isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt", "fıstık"],
      avgRating: 4.9, reviewCount: 22,
    },
    {
      name: "Dolma Çeşitleri", slug: "dolma-cesitleri",
      shortDesc: "Zeytinyağlı yaprak sarma ve biber dolması.",
      basePrice: 180, categoryId: catMap["soguk-mezeler"],
      isFeatured: false, isVegan: true, isGlutenFree: true, allergens: [],
      avgRating: 4.7, reviewCount: 41,
    },
    {
      name: "Ramazan Özel Seti", slug: "ramazan-ozel-seti",
      shortDesc: "İftar sofrası için özel hazırlanmış set.",
      basePrice: 520, categoryId: catMap["hediye-kutulari"],
      isFeatured: false, isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt"],
      avgRating: 5.0, reviewCount: 14,
    },
    {
      name: "Kurumsal Hediye Seti", slug: "kurumsal-hediye-seti",
      shortDesc: "Logo baskılı kutuda özel ürün seçkisi.",
      basePrice: 380, categoryId: catMap["kurumsal-hediye-k"],
      isFeatured: false, isVegan: false, isGlutenFree: false, allergens: ["gluten"],
      avgRating: 4.8, reviewCount: 9,
    },
    {
      name: "Kahvaltı Sepeti", slug: "kahvalti-sepeti",
      shortDesc: "Reçel, peynir, zeytin, börek ve poğaça.",
      basePrice: 290, categoryId: catMap["kahvalti-setleri"],
      isFeatured: false, isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt"],
      avgRating: 4.9, reviewCount: 33,
    },
    {
      name: "Ev Yapımı Reçel Seti", slug: "ev-yapimi-recel-seti",
      shortDesc: "3 çeşit mevsimlik meyve reçeli.",
      basePrice: 120, categoryId: catMap["kahvalti-setleri"],
      isFeatured: false, isVegan: true, isGlutenFree: true, allergens: [],
      avgRating: 4.6, reviewCount: 28,
    },
    {
      name: "Açık Büfe Kahvaltı Seti", slug: "acik-bufe-kahvalti-seti",
      shortDesc: "10 kişilik tam kahvaltı sofrası.",
      basePrice: 680, categoryId: catMap["kahvalti-setleri"],
      isFeatured: false, isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt", "yumurta"],
      avgRating: 4.9, reviewCount: 17,
    },
    {
      name: "Vegan Meze Tabağı", slug: "vegan-meze-tabagi",
      shortDesc: "Tamamen bitkisel, 6 çeşit meze.",
      basePrice: 220, categoryId: catMap["soguk-mezeler"],
      isFeatured: false, isVegan: true, isGlutenFree: true, allergens: [],
      avgRating: 4.7, reviewCount: 21,
    },
    {
      name: "Protein Salata Seti", slug: "protein-salata-seti",
      shortDesc: "Izgara tavuklu, kinoa ve taze sebzeli özel salata.",
      basePrice: 180, categoryId: catMap["salata-setleri"],
      isFeatured: false, isVegan: false, isGlutenFree: true, allergens: [],
      avgRating: 4.5, reviewCount: 12,
    },
    {
      name: "Glutensiz Börek", slug: "glutensiz-borek",
      shortDesc: "Glutensiz una özel hazırlanmış, peynirli iç harçlı börek.",
      basePrice: 280, categoryId: catMap["mini-borekler"],
      isFeatured: false, isVegan: false, isGlutenFree: true, allergens: ["süt", "yumurta"],
      avgRating: 4.6, reviewCount: 8,
    },
  ];

  const imageMap = {
    "klasik-meze-tabagi": [
      "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&q=80",
      "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80",
    ],
    "ev-yapimi-su-boregi": [
      "https://images.unsplash.com/photo-1628735090933-82e21a951dfa?w=800&q=80",
      "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=800&q=80",
    ],
    "misafir-agirma-seti": [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    ],
    "baklava-cesitleri": [
      "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=800&q=80",
    ],
    "mini-finger-food-seti": [
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    ],
    "ozel-dogum-gunu-keki": [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    ],
    "acili-ezme-humus-tabagi": [
      "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=800&q=80",
    ],
    "premium-hediye-kutusu": [
      "https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=800&q=80",
    ],
    "dolma-cesitleri": [
      "https://images.unsplash.com/photo-1619683548293-0e78baf0e389?w=800&q=80",
    ],
    "ramazan-ozel-seti": [
      "https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=800&q=80",
    ],
    "kurumsal-hediye-seti": [
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80",
    ],
    "kahvalti-sepeti": [
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
    ],
    "ev-yapimi-recel-seti": [
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
    ],
    "acik-bufe-kahvalti-seti": [
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
    ],
    "vegan-meze-tabagi": [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    ],
    "protein-salata-seti": [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    ],
    "glutensiz-borek": [
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80",
    ],
  };

  let count = 0;
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        shortDesc: p.shortDesc,
        basePrice: p.basePrice,
        categoryId: p.categoryId,
        isFeatured: p.isFeatured,
        isVegan: p.isVegan,
        isGlutenFree: p.isGlutenFree,
        allergens: p.allergens,
        requiresCustomOrder: p.requiresCustomOrder || false,
        avgRating: p.avgRating,
        reviewCount: p.reviewCount,
        status: "ACTIVE",
      },
    });

    // Add images
    const images = imageMap[p.slug] || [];
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.upsert({
        where: {
          id: `img-${product.id}-${i}`,
        },
        update: {},
        create: {
          id: `img-${product.id}-${i}`,
          productId: product.id,
          url: images[i],
          altText: p.name,
          isPrimary: i === 0,
          sortOrder: i,
        },
      });
    }

    count++;
  }
  console.log(`  ${count} ürün eklendi.`);

  console.log("Seeding occasions...");
  const occasions = [
    { slug: "MISAFIR_AGIRMA", name: "Misafir Ağırlama", description: "Özel misafirleriniz için sofra" },
    { slug: "KADIN_GUNLERI", name: "Kadın Günleri", description: "Kadın buluşmaları için lezzetler" },
    { slug: "DOGUM_GUNU", name: "Doğum Günü", description: "Doğum günü kutlaması için" },
    { slug: "IS_YEMEGI", name: "İş Yemeği", description: "Profesyonel iş yemekleri" },
    { slug: "KURUMSAL_HEDIYE", name: "Kurumsal Hediye", description: "Kurumsal hediye seçenekleri" },
    { slug: "EV_PARTISI", name: "Ev Partisi", description: "Ev partileri için" },
    { slug: "KAHVALTI", name: "Kahvaltı", description: "Kahvaltı sofraları" },
    { slug: "SAGLIKLI", name: "Sağlıklı", description: "Sağlıklı beslenme" },
    { slug: "MEVSIMSEL", name: "Mevsimsel", description: "Mevsime özel lezzetler" },
  ];

  for (const occ of occasions) {
    await prisma.occasion.upsert({
      where: { slug: occ.slug },
      update: {},
      create: {
        slug: occ.slug,
        name: occ.name,
        description: occ.description,
        isActive: true,
      },
    });
  }
  console.log(`  ${occasions.length} occasion eklendi.`);

  console.log("\n✅ Seed tamamlandı!");
}

main()
  .catch((e) => {
    console.error("Seed hatası:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
