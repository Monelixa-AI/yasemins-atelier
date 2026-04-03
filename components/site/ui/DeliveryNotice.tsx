import { Truck, Package, MapPin } from "lucide-react";

type NoticeType = "fresh" | "naturel" | "services";

const notices: Record<NoticeType, { icon: typeof Truck; bg: string; border: string; text: string; message: string }> = {
  fresh: {
    icon: MapPin,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    message: "⚠️ Taze ürünlerimiz şimdilik sadece Kadıköy ve Ataşehir ilçelerine teslim edilmektedir.",
  },
  naturel: {
    icon: Package,
    bg: "bg-[#EAF3DE]",
    border: "border-[#4A7C3F]/20",
    text: "text-[#2D4A1E]",
    message: "📦 Naturel ürünler Türkiye geneline kargo ile gönderilir. 750₺ üzeri ücretsiz kargo.",
  },
  services: {
    icon: Truck,
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    message: "👩‍🍳 Özel hizmetlerimiz İstanbul genelinde sunulmaktadır.",
  },
};

export default function DeliveryNotice({ type }: { type: NoticeType }) {
  const n = notices[type];
  const Icon = n.icon;

  return (
    <div className={`${n.bg} ${n.border} border px-4 py-3 flex items-start gap-3`}>
      <Icon size={16} className={`${n.text} shrink-0 mt-0.5`} />
      <p className={`font-body text-xs ${n.text} leading-relaxed`}>{n.message}</p>
    </div>
  );
}
