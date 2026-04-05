import {
  Text,
  Section,
  Button,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface BookingReminderProps {
  customerName: string;
  serviceName: string;
  bookedDate: string;
  startTime: string;
  address?: string;
  contactPhone: string;
}

export default function BookingReminder({
  customerName = "Ayse",
  serviceName = "Ozel Yemek Deneyimi",
  bookedDate = "5 Nisan 2026",
  startTime = "19:00",
  address = "Nisantasi, Istanbul",
  contactPhone = "+905551234567",
}: BookingReminderProps) {
  return (
    <EmailLayout previewText="Yarin rezervasyonunuz var!">
      {/* Bell Icon */}
      <Text style={bellIcon}>{"\uD83D\uDD14"}</Text>

      {/* Heading */}
      <Text style={heading}>Yarin Rezervasyonunuz Var!</Text>
      <Text style={greeting}>
        Merhaba {customerName}, yarin icin bir rezervasyonunuz oldugunu
        hatirlatmak isteriz.
      </Text>

      {/* Compact Info */}
      <Section style={infoCard}>
        <Text style={infoItem}>
          <strong>Hizmet:</strong> {serviceName}
        </Text>
        <Hr style={cardDivider} />
        <Text style={infoItem}>
          <strong>Tarih:</strong> {bookedDate}
        </Text>
        <Hr style={cardDivider} />
        <Text style={infoItem}>
          <strong>Saat:</strong> {startTime}
        </Text>
        {address && (
          <>
            <Hr style={cardDivider} />
            <Text style={infoItem}>
              <strong>Adres:</strong> {address}
            </Text>
          </>
        )}
      </Section>

      {/* WhatsApp Link */}
      <Section style={{ textAlign: "center" as const, marginTop: "32px" }}>
        <Text style={contactText}>
          Soru veya degisiklik talepleriniz icin bize ulasin:
        </Text>
        <Button
          href={`https://wa.me/${contactPhone.replace(/\+/g, "")}`}
          style={whatsappButton}
        >
          WhatsApp ile Iletisime Gecin
        </Button>
      </Section>

      <Text style={footerNote}>
        Gorusmek uzere! {"\uD83C\uDF3F"}
      </Text>
    </EmailLayout>
  );
}

const bellIcon: React.CSSProperties = {
  fontSize: "48px",
  textAlign: "center" as const,
  margin: "0 0 8px 0",
};

const heading: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "700",
  color: "#C4622D",
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

const infoCard: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  border: "1px solid #E8D5A3",
  borderRadius: "8px",
  padding: "20px",
};

const infoItem: React.CSSProperties = {
  fontSize: "15px",
  color: "#3D1A0A",
  margin: "0",
  lineHeight: "1.6",
};

const cardDivider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "10px 0",
};

const contactText: React.CSSProperties = {
  fontSize: "14px",
  color: "#666666",
  margin: "0 0 12px 0",
};

const whatsappButton: React.CSSProperties = {
  backgroundColor: "#25D366",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "14px 32px",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
};

const footerNote: React.CSSProperties = {
  fontSize: "15px",
  color: "#B8975C",
  textAlign: "center" as const,
  marginTop: "24px",
  fontStyle: "italic",
};
