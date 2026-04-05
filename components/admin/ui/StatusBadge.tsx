const STATUS_STYLES: Record<string, Record<string, { label: string; color: string }>> = {
  order: {
    PENDING: { label: "Bekliyor", color: "bg-yellow-100 text-yellow-700" },
    CONFIRMED: { label: "Onaylandı", color: "bg-blue-100 text-blue-700" },
    PREPARING: { label: "Hazırlanıyor", color: "bg-indigo-100 text-indigo-700" },
    READY: { label: "Hazır", color: "bg-teal-100 text-teal-700" },
    OUT_FOR_DELIVERY: { label: "Yolda", color: "bg-cyan-100 text-cyan-700" },
    DELIVERED: { label: "Teslim Edildi", color: "bg-green-100 text-green-700" },
    CANCELLED: { label: "İptal", color: "bg-red-100 text-red-700" },
    REFUNDED: { label: "İade", color: "bg-purple-100 text-purple-700" },
  },
  booking: {
    PENDING: { label: "Bekliyor", color: "bg-yellow-100 text-yellow-700" },
    CONFIRMED: { label: "Onaylandı", color: "bg-blue-100 text-blue-700" },
    DEPOSIT_PAID: { label: "Depozit Ödendi", color: "bg-green-100 text-green-700" },
    COMPLETED: { label: "Tamamlandı", color: "bg-emerald-100 text-emerald-700" },
    CANCELLED: { label: "İptal", color: "bg-red-100 text-red-700" },
    NO_SHOW: { label: "Gelmedi", color: "bg-gray-100 text-gray-700" },
  },
  payment: {
    PAID: { label: "Ödendi", color: "bg-green-100 text-green-700" },
    PENDING: { label: "Bekliyor", color: "bg-yellow-100 text-yellow-700" },
    FAILED: { label: "Başarısız", color: "bg-red-100 text-red-700" },
    REFUNDED: { label: "İade Edildi", color: "bg-purple-100 text-purple-700" },
    PARTIALLY_REFUNDED: { label: "Kısmi İade", color: "bg-orange-100 text-orange-700" },
  },
  blog: {
    DRAFT: { label: "Taslak", color: "bg-gray-100 text-gray-700" },
    PUBLISHED: { label: "Yayında", color: "bg-green-100 text-green-700" },
    SCHEDULED: { label: "Zamanlanmış", color: "bg-blue-100 text-blue-700" },
  },
  review: {
    PENDING: { label: "Bekliyor", color: "bg-yellow-100 text-yellow-700" },
    APPROVED: { label: "Onaylı", color: "bg-green-100 text-green-700" },
    REJECTED: { label: "Reddedildi", color: "bg-red-100 text-red-700" },
  },
  product: {
    ACTIVE: { label: "Aktif", color: "bg-green-100 text-green-700" },
    INACTIVE: { label: "Pasif", color: "bg-gray-100 text-gray-700" },
    OUT_OF_STOCK: { label: "Stokta Yok", color: "bg-red-100 text-red-700" },
  },
}

interface StatusBadgeProps {
  status: string
  type: keyof typeof STATUS_STYLES
  size?: "sm" | "md"
}

export function StatusBadge({ status, type, size = "sm" }: StatusBadgeProps) {
  const style = STATUS_STYLES[type]?.[status] || {
    label: status,
    color: "bg-gray-100 text-gray-600",
  }

  return (
    <span
      className={`inline-block rounded-full font-medium ${style.color} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
    >
      {style.label}
    </span>
  )
}
