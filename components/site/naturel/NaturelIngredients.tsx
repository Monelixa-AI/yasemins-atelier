import SectionHeader from "@/components/site/ui/SectionHeader";

const marketIngredients = [
  "Yulaf ezmesi",
  "Glikoz-fruktoz şurubu",
  "Hidrojene bitkisel yağ",
  "Soya lesitini (E322)",
  "Sodyum benzoat (E211)",
  "Potasyum sorbat (E202)",
  "Yapay çilek aroması",
  "Mono ve digliserit (E471)",
  "Titanyum dioksit (E171)",
  "Karboksimetil selüloz (E466)",
  "BHT antioksidan (E321)",
  "Yapay renklendirici (E129)",
];

const naturelIngredients = ["Yulaf", "bal", "fındık", "tarçın."];

const redFlags = [
  "Glikoz-fruktoz şurubu",
  "Hidrojene bitkisel yağ",
  "Sodyum benzoat (E211)",
  "Potasyum sorbat (E202)",
  "Yapay çilek aroması",
  "Titanyum dioksit (E171)",
  "BHT antioksidan (E321)",
  "Yapay renklendirici (E129)",
];

export default function NaturelIngredients() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="ŞEFFAFLIK"
          title="İçindekiler Listesi Kısa Olmalı"
        />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-start max-w-4xl mx-auto">
          {/* Market Product */}
          <div className="bg-gray-100 border border-gray-200 p-6 lg:p-8">
            <p className="font-body text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-4">
              Market Ürünü
            </p>
            <h3 className="font-heading text-lg text-brown-deep mb-4">
              &ldquo;Doğal&rdquo; Granola
            </h3>
            <ul className="space-y-1.5">
              {marketIngredients.map((item) => {
                const isRed = redFlags.includes(item);
                return (
                  <li
                    key={item}
                    className={`font-body text-[13px] ${
                      isRed
                        ? "text-red-500 font-medium line-through decoration-red-300"
                        : "text-brown-deep/70"
                    }`}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
            <p className="font-body text-[11px] text-gray-400 mt-4">
              12 madde, çoğu tanınmaz.
            </p>
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center md:flex-col md:h-full">
            <div className="hidden md:block w-px h-full bg-gray-200" />
            <span
              className="font-heading text-[48px] font-bold px-4 md:py-4"
              style={{ color: "#C4622D" }}
            >
              VS
            </span>
            <div className="hidden md:block w-px h-full bg-gray-200" />
          </div>

          {/* Naturel Product */}
          <div
            className="p-6 lg:p-8"
            style={{
              backgroundColor: "#EAF3DE",
              border: "2px solid #4A7C3F",
            }}
          >
            <p
              className="font-body text-[11px] font-medium uppercase tracking-wider mb-4"
              style={{ color: "#4A7C3F" }}
            >
              Naturel Ürünümüz
            </p>
            <h3 className="font-heading text-lg text-brown-deep mb-4">
              Ev Yapımı Granola
            </h3>
            <p className="font-body text-[15px] text-brown-deep font-medium leading-relaxed">
              {naturelIngredients.join(" ")}
            </p>
            <p
              className="font-body text-[14px] font-semibold mt-4"
              style={{ color: "#4A7C3F" }}
            >
              Hepsi bu kadar. ✓
            </p>
          </div>
        </div>

        {/* Bottom Quote */}
        <p className="font-heading text-xl md:text-2xl italic text-center text-brown-deep/70 mt-12 max-w-2xl mx-auto">
          &ldquo;Eğer bir çocuğa içindekiler listesini okuyamıyorsanız,
          o ürünü yememeli.&rdquo;
        </p>
      </div>
    </section>
  );
}
