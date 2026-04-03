"use client";

const items = [
  "🌿 Katkı Maddesi Yok",
  "🧂 Doğal Hammadde",
  "👩‍🍳 Yasemin Tarifi",
  "📦 Türkiye Geneli Kargo",
  "🔄 Abonelik Seçeneği",
];

export default function NaturelTrustBar() {
  const content = items.join("  ·  ");

  return (
    <section className="py-3 overflow-hidden" style={{ backgroundColor: "#2D4A1E" }}>
      <div className="flex whitespace-nowrap">
        <div className="flex shrink-0 animate-[scroll_30s_linear_infinite]">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="font-body text-xs text-white px-8">{content}</span>
          ))}
        </div>
        <div className="flex shrink-0 animate-[scroll_30s_linear_infinite]">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="font-body text-xs text-white px-8">{content}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
