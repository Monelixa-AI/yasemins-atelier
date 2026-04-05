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

interface WeeklyReportEmailProps {
  totalRevenue: string;
  totalOrders: number;
  avgOrderValue: string;
  topProduct: string;
  dateRange: string;
}

export default function WeeklyReportEmail({
  totalRevenue = "0,00 TL",
  totalOrders = 0,
  avgOrderValue = "0,00 TL",
  topProduct = "-",
  dateRange = "",
}: WeeklyReportEmailProps) {
  return (
    <EmailLayout previewText={`Haftalik Rapor - ${dateRange}`}>
      <Text style={heading}>Haftalik Rapor</Text>
      <Text style={subheading}>{dateRange}</Text>

      {/* Metric Boxes */}
      <Section style={{ marginTop: "24px" }}>
        <Row>
          <Column style={metricColLeft}>
            <Section style={metricBox}>
              <Text style={metricLabel}>Toplam Gelir</Text>
              <Text style={metricValue}>{totalRevenue}</Text>
            </Section>
          </Column>
          <Column style={metricColRight}>
            <Section style={metricBox}>
              <Text style={metricLabel}>Siparis Sayisi</Text>
              <Text style={metricValue}>{totalOrders}</Text>
            </Section>
          </Column>
        </Row>
        <Row style={{ marginTop: "12px" }}>
          <Column style={metricColLeft}>
            <Section style={metricBox}>
              <Text style={metricLabel}>Ort. Siparis Tutari</Text>
              <Text style={metricValue}>{avgOrderValue}</Text>
            </Section>
          </Column>
          <Column style={metricColRight}>
            <Section style={metricBox}>
              <Text style={metricLabel}>En Cok Satan Urun</Text>
              <Text style={metricValueSmall}>{topProduct}</Text>
            </Section>
          </Column>
        </Row>
      </Section>

      <Hr style={divider} />

      {/* CTA */}
      <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
        <Text style={ctaText}>
          Detayli rapor icin admin paneline girin.
        </Text>
        <Button
          href="https://yaseminsatelier.com/admin/raporlar"
          style={ctaButton}
        >
          Admin Paneli
        </Button>
      </Section>
    </EmailLayout>
  );
}

const heading: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "700",
  color: "#3D1A0A",
  textAlign: "center" as const,
  margin: "0 0 4px 0",
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
};

const subheading: React.CSSProperties = {
  fontSize: "14px",
  color: "#999999",
  textAlign: "center" as const,
  margin: "0 0 8px 0",
};

const metricColLeft: React.CSSProperties = {
  width: "50%",
  paddingRight: "6px",
  verticalAlign: "top" as const,
};

const metricColRight: React.CSSProperties = {
  width: "50%",
  paddingLeft: "6px",
  verticalAlign: "top" as const,
};

const metricBox: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  border: "1px solid #E8D5A3",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center" as const,
};

const metricLabel: React.CSSProperties = {
  fontSize: "11px",
  color: "#999999",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 4px 0",
};

const metricValue: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#3D1A0A",
  margin: "0",
};

const metricValueSmall: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#3D1A0A",
  margin: "0",
  lineHeight: "1.3",
};

const divider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "28px 0 0 0",
};

const ctaText: React.CSSProperties = {
  fontSize: "14px",
  color: "#666666",
  margin: "0 0 16px 0",
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
