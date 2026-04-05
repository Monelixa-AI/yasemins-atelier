import {
  Text,
  Section,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

type OrderStatus = "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED";

interface OrderStatusUpdateProps {
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  statusText: string;
  trackingNo?: string;
  carrier?: string;
}

const statusConfig: Record<
  OrderStatus,
  { emoji: string; heading: string; color: string }
> = {
  PREPARING: {
    emoji: "\uD83D\uDC68\u200D\uD83C\uDF73",
    heading: "Siparisiniz hazirlaniyor",
    color: "#B8975C",
  },
  OUT_FOR_DELIVERY: {
    emoji: "\uD83D\uDE9A",
    heading: "Siparisiniz yolda!",
    color: "#C4622D",
  },
  DELIVERED: {
    emoji: "\u2705",
    heading: "Teslim edildi!",
    color: "#2D8C4E",
  },
};

export default function OrderStatusUpdate({
  orderNumber = "YA-20260401-0042",
  customerName = "Ayse",
  status = "PREPARING",
  statusText = "Siparisiniz ozenle hazirlaniyor.",
  trackingNo,
  carrier,
}: OrderStatusUpdateProps) {
  const config = statusConfig[status];

  return (
    <EmailLayout previewText={`Siparis #${orderNumber}: ${config.heading}`}>
      {/* Status Icon */}
      <Text style={emojiStyle}>{config.emoji}</Text>

      {/* Heading */}
      <Text style={{ ...heading, color: config.color }}>{config.heading}</Text>

      <Text style={greeting}>
        Merhaba {customerName}, siparisiniz ({orderNumber}) hakkinda bir
        guncelleme var.
      </Text>

      {/* Status Box */}
      <Section style={statusBox}>
        <Text style={statusLabel}>Durum</Text>
        <Text style={{ ...statusValue, color: config.color }}>
          {statusText}
        </Text>
      </Section>

      {/* Tracking Info - only for OUT_FOR_DELIVERY */}
      {status === "OUT_FOR_DELIVERY" && trackingNo && (
        <Section style={trackingBox}>
          <Text style={trackingTitle}>Kargo Takip Bilgisi</Text>
          <Hr style={divider} />
          {carrier && (
            <Text style={trackingDetail}>
              <strong>Kargo Firmasi:</strong> {carrier}
            </Text>
          )}
          <Text style={trackingDetail}>
            <strong>Takip No:</strong> {trackingNo}
          </Text>
        </Section>
      )}

      {/* Delivered - Review CTA */}
      {status === "DELIVERED" && (
        <Section style={{ marginTop: "24px" }}>
          <Text style={deliveredText}>
            Siparisiniz basariyla teslim edildi. Umariz lezzetlerin tadini
            cikarirsiniz!
          </Text>
          <Text style={deliveredText}>
            Deneyiminizi bizimle paylasir misiniz?
          </Text>
          <Section style={{ textAlign: "center" as const, marginTop: "16px" }}>
            <Button
              href={`https://yaseminsatelier.com/orders/${orderNumber}/review`}
              style={ctaButton}
            >
              Degerlendirme Yapin
            </Button>
          </Section>
        </Section>
      )}

      {/* Track Order - for PREPARING and OUT_FOR_DELIVERY */}
      {status !== "DELIVERED" && (
        <Section style={{ textAlign: "center" as const, marginTop: "32px" }}>
          <Button
            href={`https://yaseminsatelier.com/orders/${orderNumber}`}
            style={ctaButton}
          >
            Siparisinizi Takip Edin
          </Button>
        </Section>
      )}
    </EmailLayout>
  );
}

const emojiStyle: React.CSSProperties = {
  fontSize: "48px",
  textAlign: "center" as const,
  margin: "0 0 8px 0",
};

const heading: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "700",
  textAlign: "center" as const,
  margin: "0 0 16px 0",
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
};

const greeting: React.CSSProperties = {
  fontSize: "15px",
  color: "#555555",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const statusBox: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  border: "1px solid #E8D5A3",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center" as const,
};

const statusLabel: React.CSSProperties = {
  fontSize: "12px",
  color: "#999999",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 4px 0",
};

const statusValue: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "600",
  margin: "0",
};

const trackingBox: React.CSSProperties = {
  backgroundColor: "#FAFAFA",
  border: "1px solid #EEEEEE",
  borderRadius: "8px",
  padding: "20px",
  marginTop: "16px",
};

const trackingTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#3D1A0A",
  margin: "0 0 8px 0",
};

const divider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "12px 0",
};

const trackingDetail: React.CSSProperties = {
  fontSize: "14px",
  color: "#555555",
  margin: "0 0 8px 0",
  lineHeight: "1.5",
};

const deliveredText: React.CSSProperties = {
  fontSize: "15px",
  color: "#555555",
  lineHeight: "1.6",
  margin: "0 0 8px 0",
  textAlign: "center" as const,
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#C4622D",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "14px 32px",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
};
