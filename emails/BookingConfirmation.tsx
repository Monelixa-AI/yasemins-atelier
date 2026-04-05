import {
  Text,
  Section,
  Hr,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface BookingConfirmationProps {
  bookingNumber: string;
  customerName: string;
  serviceName: string;
  packageName: string;
  bookedDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  address?: string;
  depositAmount: number;
  totalAmount: number;
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(
    amount
  );

export default function BookingConfirmation({
  bookingNumber = "RZ-20260405-0012",
  customerName = "Ayse",
  serviceName = "Ozel Yemek Deneyimi",
  packageName = "Premium Paket",
  bookedDate = "10 Nisan 2026",
  startTime = "19:00",
  endTime = "22:00",
  guestCount = 8,
  address = "Nisantasi, Istanbul",
  depositAmount = 2500,
  totalAmount = 8500,
}: BookingConfirmationProps) {
  return (
    <EmailLayout previewText={`Rezervasyon #${bookingNumber} onaylandi`}>
      {/* Heading */}
      <Text style={heading}>Rezervasyonunuz Alindi!</Text>
      <Text style={greeting}>
        Merhaba {customerName}, rezervasyonunuz basariyla olusturuldu. Onay
        surecimiz tamamlandiktan sonra size bilgi verecegiz.
      </Text>

      {/* Reservation Card */}
      <Section style={reservationCard}>
        <Text style={cardLabel}>Rezervasyon Numarasi</Text>
        <Text style={cardValue}>{bookingNumber}</Text>
        <Hr style={cardDivider} />
        <Row style={cardRow}>
          <Column style={cardLeftCol}>
            <Text style={cardDetailLabel}>Hizmet</Text>
            <Text style={cardDetailValue}>{serviceName}</Text>
          </Column>
          <Column style={cardRightCol}>
            <Text style={cardDetailLabel}>Paket</Text>
            <Text style={cardDetailValue}>{packageName}</Text>
          </Column>
        </Row>
        <Row style={cardRow}>
          <Column style={cardLeftCol}>
            <Text style={cardDetailLabel}>Tarih</Text>
            <Text style={cardDetailValue}>{bookedDate}</Text>
          </Column>
          <Column style={cardRightCol}>
            <Text style={cardDetailLabel}>Saat</Text>
            <Text style={cardDetailValue}>
              {startTime} - {endTime}
            </Text>
          </Column>
        </Row>
        <Row style={cardRow}>
          <Column style={cardLeftCol}>
            <Text style={cardDetailLabel}>Kisi Sayisi</Text>
            <Text style={cardDetailValue}>{guestCount} kisi</Text>
          </Column>
          {address && (
            <Column style={cardRightCol}>
              <Text style={cardDetailLabel}>Adres</Text>
              <Text style={cardDetailValue}>{address}</Text>
            </Column>
          )}
        </Row>
      </Section>

      {/* Payment Summary */}
      <Section style={{ marginTop: "24px" }}>
        <Text style={sectionTitle}>Odeme Ozeti</Text>
        <Hr style={divider} />
        <Row style={summaryRow}>
          <Column style={summaryLabel}>
            <Text style={summaryText}>Kapora</Text>
          </Column>
          <Column style={summaryValueCol}>
            <Text style={summaryText}>{formatPrice(depositAmount)}</Text>
          </Column>
        </Row>
        <Row style={summaryRow}>
          <Column style={summaryLabel}>
            <Text style={summaryText}>Kalan Tutar</Text>
          </Column>
          <Column style={summaryValueCol}>
            <Text style={summaryText}>
              {formatPrice(totalAmount - depositAmount)}
            </Text>
          </Column>
        </Row>
        <Hr style={divider} />
        <Row style={summaryRow}>
          <Column style={summaryLabel}>
            <Text style={totalStyle}>Toplam</Text>
          </Column>
          <Column style={summaryValueCol}>
            <Text style={totalStyle}>{formatPrice(totalAmount)}</Text>
          </Column>
        </Row>
      </Section>

      {/* Important Notes */}
      <Section style={notesBox}>
        <Text style={notesTitle}>Onemli Bilgiler</Text>
        <Text style={noteItem}>
          - Rezervasyonunuz onay bekliyor. En gec 24 saat icinde size donus
          yapacagiz.
        </Text>
        <Text style={noteItem}>
          - Iptal islemleri etkinlik tarihinden en az 48 saat once
          yapilmalidir.
        </Text>
        <Text style={noteItem}>
          - Kalan odeme etkinlik gununde alinacaktir.
        </Text>
        <Text style={noteItem}>
          - Sorulariniz icin WhatsApp hattimizdan bize ulasabilirsiniz.
        </Text>
      </Section>
    </EmailLayout>
  );
}

const heading: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "700",
  color: "#3D1A0A",
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

const reservationCard: React.CSSProperties = {
  backgroundColor: "#3D1A0A",
  borderRadius: "12px",
  padding: "24px",
};

const cardLabel: React.CSSProperties = {
  fontSize: "11px",
  color: "#B8975C",
  textTransform: "uppercase" as const,
  letterSpacing: "1.5px",
  margin: "0 0 4px 0",
  textAlign: "center" as const,
};

const cardValue: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#ffffff",
  margin: "0",
  textAlign: "center" as const,
};

const cardDivider: React.CSSProperties = {
  borderColor: "#6B3520",
  margin: "16px 0",
};

const cardRow: React.CSSProperties = {
  padding: "6px 0",
};

const cardLeftCol: React.CSSProperties = {
  width: "50%",
  verticalAlign: "top" as const,
};

const cardRightCol: React.CSSProperties = {
  width: "50%",
  verticalAlign: "top" as const,
};

const cardDetailLabel: React.CSSProperties = {
  fontSize: "11px",
  color: "#B8975C",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 2px 0",
};

const cardDetailValue: React.CSSProperties = {
  fontSize: "15px",
  color: "#ffffff",
  margin: "0 0 8px 0",
  fontWeight: "500",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#3D1A0A",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 12px 0",
};

const divider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "12px 0",
};

const summaryRow: React.CSSProperties = {
  padding: "4px 0",
};

const summaryLabel: React.CSSProperties = {
  width: "70%",
};

const summaryValueCol: React.CSSProperties = {
  width: "30%",
  textAlign: "right" as const,
};

const summaryText: React.CSSProperties = {
  fontSize: "14px",
  color: "#666666",
  margin: "0",
};

const totalStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#3D1A0A",
  margin: "0",
};

const notesBox: React.CSSProperties = {
  backgroundColor: "#FFF9F0",
  border: "1px solid #E8D5A3",
  borderRadius: "8px",
  padding: "20px",
  marginTop: "24px",
};

const notesTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#C4622D",
  margin: "0 0 12px 0",
};

const noteItem: React.CSSProperties = {
  fontSize: "13px",
  color: "#666666",
  lineHeight: "1.6",
  margin: "0 0 6px 0",
};
