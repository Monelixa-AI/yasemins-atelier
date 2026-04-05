import {
  Text,
  Section,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface BookingApprovedProps {
  bookingNumber: string;
  customerName: string;
  serviceName: string;
  bookedDate: string;
  startTime: string;
  adminNote?: string;
  calendarUrl: string;
}

export default function BookingApproved({
  bookingNumber = "RZ-20260405-0012",
  customerName = "Ayse",
  serviceName = "Ozel Yemek Deneyimi",
  bookedDate = "10 Nisan 2026",
  startTime = "19:00",
  adminNote,
  calendarUrl = "https://yaseminsatelier.com/calendar/add/RZ-20260405-0012",
}: BookingApprovedProps) {
  return (
    <EmailLayout previewText={`Rezervasyon #${bookingNumber} onaylandi!`}>
      {/* Green Check */}
      <Text style={checkIcon}>{"\u2705"}</Text>

      {/* Heading */}
      <Text style={heading}>Rezervasyonunuz Onaylandi!</Text>
      <Text style={greeting}>
        Merhaba {customerName}, rezervasyonunuz basariyla onaylandi.
        Bulusmamizi sabirsizlikla bekliyoruz!
      </Text>

      {/* Info Box */}
      <Section style={infoBox}>
        <Text style={infoLabel}>Rezervasyon</Text>
        <Text style={infoValue}>{bookingNumber}</Text>
        <Hr style={infoDivider} />
        <Text style={infoDetail}>
          <strong>Hizmet:</strong> {serviceName}
        </Text>
        <Text style={infoDetail}>
          <strong>Tarih:</strong> {bookedDate}
        </Text>
        <Text style={infoDetail}>
          <strong>Saat:</strong> {startTime}
        </Text>
      </Section>

      {/* Admin Note */}
      {adminNote && (
        <Section style={noteBox}>
          <Text style={noteTitle}>Yasemin&apos;den Not</Text>
          <Text style={noteText}>{adminNote}</Text>
        </Section>
      )}

      {/* Calendar CTA */}
      <Section style={{ textAlign: "center" as const, marginTop: "32px" }}>
        <Button href={calendarUrl} style={ctaButton}>
          Takvime Ekle
        </Button>
      </Section>

      <Text style={footerNote}>
        Sorulariniz veya degisiklik talepleriniz icin WhatsApp hattimizdan bize
        ulasabilirsiniz.
      </Text>
    </EmailLayout>
  );
}

const checkIcon: React.CSSProperties = {
  fontSize: "48px",
  textAlign: "center" as const,
  margin: "0 0 8px 0",
};

const heading: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "700",
  color: "#2D8C4E",
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

const infoBox: React.CSSProperties = {
  backgroundColor: "#F0FAF4",
  border: "1px solid #B8E6C8",
  borderRadius: "8px",
  padding: "20px",
};

const infoLabel: React.CSSProperties = {
  fontSize: "11px",
  color: "#2D8C4E",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 4px 0",
  textAlign: "center" as const,
};

const infoValue: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#3D1A0A",
  margin: "0",
  textAlign: "center" as const,
};

const infoDivider: React.CSSProperties = {
  borderColor: "#B8E6C8",
  margin: "16px 0",
};

const infoDetail: React.CSSProperties = {
  fontSize: "14px",
  color: "#555555",
  margin: "0 0 8px 0",
  lineHeight: "1.5",
};

const noteBox: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  borderLeft: "3px solid #B8975C",
  padding: "16px 20px",
  marginTop: "20px",
};

const noteTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#B8975C",
  margin: "0 0 8px 0",
};

const noteText: React.CSSProperties = {
  fontSize: "14px",
  color: "#555555",
  lineHeight: "1.6",
  margin: "0",
  fontStyle: "italic",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#2D8C4E",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "14px 32px",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
};

const footerNote: React.CSSProperties = {
  fontSize: "13px",
  color: "#999999",
  textAlign: "center" as const,
  marginTop: "24px",
  lineHeight: "1.5",
};
