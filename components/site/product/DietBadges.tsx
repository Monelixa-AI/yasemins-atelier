interface DietBadgesProps {
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isLactoseFree?: boolean;
  isHalal?: boolean;
}

const badges = [
  { key: "isVegan", label: "Vegan", bg: "bg-[#EAF3DE]", text: "text-[#3B6D11]" },
  { key: "isGlutenFree", label: "Glutensiz", bg: "bg-[#FEF9C3]", text: "text-[#854D0E]" },
  { key: "isLactoseFree", label: "Laktozsuz", bg: "bg-[#EFF6FF]", text: "text-[#1E40AF]" },
  { key: "isHalal", label: "Helal", bg: "bg-[#F0FDF4]", text: "text-[#166534]" },
] as const;

export default function DietBadges(props: DietBadgesProps) {
  const active = badges.filter((b) => props[b.key as keyof DietBadgesProps]);
  if (active.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {active.map((b) => (
        <span
          key={b.key}
          className={`${b.bg} ${b.text} font-body text-[10px] font-medium px-2 py-0.5 rounded-sm`}
        >
          {b.label}
        </span>
      ))}
    </div>
  );
}
