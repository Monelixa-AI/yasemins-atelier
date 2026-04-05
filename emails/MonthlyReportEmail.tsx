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

interface MonthlyReportEmailProps {
  totalRevenue: string;
  totalOrders: number;
  avgOrderValue: string;
  topProduct: string;
  netRevenue: string;
  totalRefunds: string;
  dateRange: string;
}

export default function MonthlyReportEmail({
  totalRevenue = "0,00 TL",
  totalOrders = 0,
  avgOrderValue = "0,00 TL",
  topProduct = "-",
  netRevenue = "0,00 TL",
  totalRefunds = "0,00 TL",
  dateRange = "",
}: MonthlyReportEmailProps) {
  return (
    <EmailLayout previewText={`Aylik Rapor - ${dateRange}`}>
      <Text style={heading}>Aylik Rapor</Text>
      <Text style={subheading}>{dateRange}</Text>

      {/* Revenue Section */}
      <Section style={{ marginTop: "24px" }}>
        <Row>
          <Column style={metricColLeft}>
            <Section style={metricBoxHighlight}>
              <Text style={metricLabel}>Brut Gelir</Text>
              <Text style={metricValueLarge}>{totalRevenue}</Text>
            </Section>
          </Column>
          <Column style={metricColRight}>
            <Section style={metricBoxHighlight}>
              <Text style={metricLabel}>Net Gelir</Text>
              <Text style={metricValueLarge}>{netRevenue}</Text>
            </Section>
          </Column>
        </Row>
      </Section>

      {/* Order Metrics */}
      <Section style={{ marginTop: "12px" }}>
        <Row>
          <Column style={metricColLeft}>
            <Section style={metricBox}>
              <Text style={metricLabel}>Siparis Sayisi</Text>
              <Text style={metricValue}>{totalOrders}</Text>
            </Section>
          </Column>
          <Column style={metricColRight}>
            <Section style={metricBox}>
              <Text style={metricLabel}>Ort. Siparis Tutari</Text>
              <Text style={metricValue}>{avgOrderValue}</Text>
            </Section>
          </Column>
        </Row>
      </Section>

      {/* Refund & Top Product */}
      <Section style={{ marginTop: "12px" }}>
        <Row>
          <Column style={metricColLeft}>
            <Section style={metricBox}>
              <Text style={metricLabel}>Toplam Iade</Text>
              <Text style={metricValueRed}>{totalRefunds}</Text>
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

      {/* Comparison Note */}
      <Section style={{ marginTop: "20px" }}>
        <Text style={noteText}>
          Bu rapor, onceki ayla karsilastirmali verileri icerir.
          Detayli analiz ve grafiklere admin panelinden ulasabilirsiniz.
        </Text>
      </Section>

      {/* CTA */}
      <Section style={{ textAlign: "center" as const, marginTop: "20px" }}>
        <Button
          href="https://yaseminsatelier.com/admin/raporlar"
          style={ctaButton}
        >
          Detayli Raporu Gor
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

const metricBoxHighlight: React.CSSProperties = {
  backgroundColor: "#3D1A0A",
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

const metricValueLarge: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#B8975C",
  margin: "0",
};

const metricValueSmall: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#3D1A0A",
  margin: "0",
  lineHeight: "1.3",
};

const metricValueRed: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#DC2626",
  margin: "0",
};

const divider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "28px 0 0 0",
};

const noteText: React.CSSProperties = {
  fontSize: "13px",
  color: "#888888",
  lineHeight: "1.6",
  textAlign: "center" as const,
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
