import SectionHeader from "@/components/site/ui/SectionHeader";

const marketIngredients = [
  "Yulaf ezmesi",
  "Glikoz-fruktoz \u015Furubu",
  "Hidrojene bitkisel ya\u011F",
  "Soya lesitini (E322)",
  "Sodyum benzoat (E211)",
  "Potasyum sorbat (E202)",
  "Yapay \u00E7ilek aromas\u0131",
  "Mono ve digliserit (E471)",
  "Titanyum dioksit (E171)",
  "Karboksimetil sel\u00FCloz (E466)",
  "BHT antioksidan (E321)",
  "Yapay renklendirici (E129)",
];

const naturelIngredients = ["Yulaf", "bal", "f\u0131nd\u0131k", "tar\u00E7\u0131n."];

const redFlags = [
  "Glikoz-fruktoz \u015Furubu",
  "Hidrojene bitkisel ya\u011F",
  "Sodyum benzoat (E211)",
  "Potasyum sorbat (E202)",
  "Yapay \u00E7ilek aromas\u0131",
  "Titanyum dioksit (E171)",
  "BHT antioksidan (E321)",
  "Yapay renklendirici (E129)",
];

export default function NaturelIngredients() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="\u015EEFFAFLIK"
          title="\u0130\u00E7indekiler Listesi K\u0131sa Olmal\u0131"
        />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-start max-w-4xl mx-auto">
          {/* Market Product */}
          <div className="bg-gray-100 border border-gray-200 p-6 lg:p-8">
            <p className="font-body text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-4">
              Market \u00DCr\u00FCn\u00FC
            </p>
            <h3 className="font-heading text-lg text-brown-deep mb-4">
              &ldquo;Do\u011Fal&rdquo; Granola
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
              12 madde, \u00E7o\u011Fu tan\u0131nmaz.
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
              Naturel \u00DCr\u00FCn\u00FCm\u00FCz
            </p>
            <h3 className="font-heading text-lg text-brown-deep mb-4">
              Ev Yap\u0131m\u0131 Granola
            </h3>
            <p className="font-body text-[15px] text-brown-deep font-medium leading-relaxed">
              {naturelIngredients.join(" ")}
            </p>
            <p
              className="font-body text-[14px] font-semibold mt-4"
              style={{ color: "#4A7C3F" }}
            >
              Hepsi bu kadar. \u2713
            </p>
          </div>
        </div>

        {/* Bottom Quote */}
        <p className="font-heading text-xl md:text-2xl italic text-center text-brown-deep/70 mt-12 max-w-2xl mx-auto">
          &ldquo;E\u011Fer bir \u00E7ocu\u011Fa i\u00E7indekiler listesini okuyam\u0131yorsan\u0131z,
          o \u00FCr\u00FCn\u00FC yememeli.&rdquo;
        </p>
      </div>
    </section>
  );
}
