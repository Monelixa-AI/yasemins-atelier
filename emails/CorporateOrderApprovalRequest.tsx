import {
  Text,
  Section,
  Button,
  Hr,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface CorporateOrderApprovalRequestProps {
  approverName: string;
  orderNumber: string;
  requesterName: string;
  total: number;
  itemCount: number;
  approveUrl: string;
  rejectUrl: string;
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(
    amount
  );

export default function CorporateOrderApprovalRequest({
  approverName = "Mehmet",
  orderNumber = "YA-K-20260405-0012",
  requesterName = "Ayse Yilmaz",
  total = 3450,
  itemCount = 8,
  approveUrl = "https://yaseminsatelier.com/kurumsal/onay/12345?action=approve",
  rejectUrl = "https://yaseminsatelier.com/kurumsal/onay/12345?action=reject",
}: CorporateOrderApprovalRequestProps) {
  return (
    <EmailLayout previewText={`Onay bekleyen siparis: #${orderNumber}`}>
      {/* Heading */}
      <Section style={{ textAlign: "center" as const }}>
        <Text style={alertIcon}>{"\uD83D\uDD14"}</Text>
        <Text style={heading}>Onay Bekleyen Siparis</Text>
      </Section>

      <Text style={greeting}>Merhaba {approverName},</Text>
      <Text style={paragraph}>
        Ekibinizden bir siparis onayi beklemektedir. Lutfen asagidaki siparis
        detaylarini inceleyerek onaylayin veya reddedin.
      </Text>

      {/* Order Summary Card */}
      <Section style={orderCard}>
        <Text style={cardTitle}>Siparis Ozeti</Text>
        <Hr style={cardDivider} />

        <Row style={cardRow}>
          <Column style={cardLabel}>
            <Text style={labelText}>Siparis No</Text>
          </Column>
          <Column style={cardValue}>
            <Text style={valueText}>{orderNumber}</Text>
          </Column>
        </Row>

        <Row style={cardRow}>
          <Column style={cardLabel}>
            <Text style={labelText}>Siparis Veren</Text>
          </Column>
          <Column style={cardValue}>
            <Text style={valueText}>{requesterName}</Text>
          </Column>
        </Row>

        <Row style={cardRow}>
          <Column style={cardLabel}>
            <Text style={labelText}>Urun Sayisi</Text>
          </Column>
          <Column style={cardValue}>
            <Text style={valueText}>{itemCount} urun</Text>
          </Column>
        </Row>

        <Hr style={cardDivider} />

        <Row style={cardRow}>
          <Column style={cardLabel}>
            <Text style={totalLabel}>Toplam Tutar</Text>
          </Column>
          <Column style={cardValue}>
            <Text style={totalValue}>{formatPrice(total)}</Text>
          </Column>
        </Row>
      </Section>

      {/* Action Buttons */}
      <Section style={buttonsSection}>
        <Row>
          <Column style={{ width: "48%", textAlign: "center" as const }}>
            <Button href={approveUrl} style={approveButton}>
              Onayla
            </Button>
          </Column>
          <Column style={{ width: "4%" }}>&nbsp;</Column>
          <Column style={{ width: "48%", textAlign: "center" as const }}>
            <Button href={rejectUrl} style={rejectButton}>
              Reddet
            </Button>
          </Column>
        </Row>
      </Section>

      <Text style={footerNote}>
        Bu siparis sizin onayiniz olmadan islenmeye alinmayacaktir.
      </Text>
    </EmailLayout>
  );
}

const alertIcon: React.CSSProperties = {
  fontSize: "40px",
  margin: "0 0 8px 0",
  lineHeight: "1",
};

const heading: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "700",
  color: "#3D1A0A",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
};

const greeting: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#3D1A0A",
  margin: "0 0 8px 0",
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  color: "#555555",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const orderCard: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  border: "1px solid #E8D5A3",
  borderRadius: "8px",
  padding: "20px",
};

const cardTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#3D1A0A",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 8px 0",
};

const cardDivider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "12px 0",
};

const cardRow: React.CSSProperties = {
  padding: "6px 0",
};

const cardLabel: React.CSSProperties = {
  width: "45%",
  verticalAlign: "top" as const,
};

const cardValue: React.CSSProperties = {
  width: "55%",
  verticalAlign: "top" as const,
  textAlign: "right" as const,
};

const labelText: React.CSSProperties = {
  fontSize: "14px",
  color: "#777777",
  margin: "0",
};

const valueText: React.CSSProperties = {
  fontSize: "14px",
  color: "#3D1A0A",
  fontWeight: "600",
  margin: "0",
};

const totalLabel: React.CSSProperties = {
  fontSize: "16px",
  color: "#3D1A0A",
  fontWeight: "700",
  margin: "0",
};

const totalValue: React.CSSProperties = {
  fontSize: "18px",
  color: "#C4622D",
  fontWeight: "700",
  margin: "0",
};

const buttonsSection: React.CSSProperties = {
  marginTop: "28px",
  marginBottom: "24px",
};

const approveButton: React.CSSProperties = {
  backgroundColor: "#16A34A",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "700",
  padding: "14px 24px",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
  width: "100%",
  textAlign: "center" as const,
};

const rejectButton: React.CSSProperties = {
  backgroundColor: "#DC2626",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "700",
  padding: "14px 24px",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
  width: "100%",
  textAlign: "center" as const,
};

const footerNote: React.CSSProperties = {
  fontSize: "13px",
  color: "#999999",
  textAlign: "center" as const,
  lineHeight: "1.5",
};
