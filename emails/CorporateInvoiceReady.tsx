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

interface CorporateInvoiceReadyProps {
  companyName: string;
  contactName: string;
  invoiceNo: string;
  period: string;
  total: number;
  dueDate?: string;
  downloadUrl: string;
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(
    amount
  );

export default function CorporateInvoiceReady({
  companyName = "Ornek Sirket A.S.",
  contactName = "Mehmet",
  invoiceNo = "FTR-2026-0042",
  period = "Mart 2026",
  total = 12500,
  dueDate = "15 Nisan 2026",
  downloadUrl = "https://yaseminsatelier.com/kurumsal/faturalar/FTR-2026-0042",
}: CorporateInvoiceReadyProps) {
  return (
    <EmailLayout previewText={`Faturaniz hazir: ${invoiceNo}`}>
      {/* Heading */}
      <Section style={{ textAlign: "center" as const }}>
        <Text style={docIcon}>{"\uD83D\uDCC4"}</Text>
        <Text style={heading}>Faturaniz Hazir</Text>
      </Section>

      <Text style={greeting}>Merhaba {contactName},</Text>
      <Text style={paragraph}>
        {companyName} icin duzenlenen faturaniz hazirlanmistir. Asagida fatura
        detaylarini inceleyebilir ve indirebilirsiniz.
      </Text>

      {/* Invoice Summary Card */}
      <Section style={invoiceCard}>
        <Text style={cardTitle}>Fatura Detaylari</Text>
        <Hr style={cardDivider} />

        <Row style={cardRow}>
          <Column style={cardLabel}>
            <Text style={labelText}>Fatura No</Text>
          </Column>
          <Column style={cardValue}>
            <Text style={valueText}>{invoiceNo}</Text>
          </Column>
        </Row>

        <Row style={cardRow}>
          <Column style={cardLabel}>
            <Text style={labelText}>Donem</Text>
          </Column>
          <Column style={cardValue}>
            <Text style={valueText}>{period}</Text>
          </Column>
        </Row>

        {dueDate && (
          <Row style={cardRow}>
            <Column style={cardLabel}>
              <Text style={labelText}>Vade Tarihi</Text>
            </Column>
            <Column style={cardValue}>
              <Text style={valueText}>{dueDate}</Text>
            </Column>
          </Row>
        )}

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

      {/* Download Button */}
      <Section style={{ textAlign: "center" as const, marginTop: "28px" }}>
        <Button href={downloadUrl} style={ctaButton}>
          Faturayi Indir
        </Button>
      </Section>

      {/* Payment Info */}
      {dueDate && (
        <>
          <Hr style={divider} />
          <Section style={paymentInfoBox}>
            <Text style={paymentTitle}>Odeme Bilgisi</Text>
            <Text style={paymentDetail}>
              Vade tarihi: <strong>{dueDate}</strong>
            </Text>
            <Text style={paymentDesc}>
              Lutfen odemenizi vade tarihine kadar gerceklestiriniz. Odeme
              detaylari fatura uzerinde belirtilmistir.
            </Text>
          </Section>
        </>
      )}

      <Text style={footerNote}>
        Fatura ile ilgili sorulariniz icin kurumsal destek ekibimizle iletisime
        gecebilirsiniz.
      </Text>
    </EmailLayout>
  );
}

const docIcon: React.CSSProperties = {
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

const invoiceCard: React.CSSProperties = {
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

const divider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "28px 0",
};

const paymentInfoBox: React.CSSProperties = {
  backgroundColor: "#3D1A0A",
  borderRadius: "8px",
  padding: "20px",
};

const paymentTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#B8975C",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 12px 0",
};

const paymentDetail: React.CSSProperties = {
  fontSize: "15px",
  color: "#E8D5A3",
  margin: "0 0 8px 0",
};

const paymentDesc: React.CSSProperties = {
  fontSize: "13px",
  color: "#aaaaaa",
  margin: "0",
  lineHeight: "1.6",
};

const footerNote: React.CSSProperties = {
  fontSize: "13px",
  color: "#999999",
  textAlign: "center" as const,
  marginTop: "24px",
  lineHeight: "1.5",
};
