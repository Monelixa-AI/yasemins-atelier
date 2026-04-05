import {
  Text,
  Section,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface WinBackEmailProps {
  customerName: string;
  lastOrderDate: string;
  discountCode: string;
  discountValue: string;
}

export default function WinBackEmail({
  customerName = "Ayse",
  lastOrderDate = "15 Ocak 2026",
  discountCode = "GERIDON20",
  discountValue = "%20",
}: WinBackEmailProps) {
  return (
    <EmailLayout previewText="Sizi ozledik! Ozel indirim kodunuz icerde.">
      {/* Heart Icon */}
      <Text style={heartIcon}>{"\uD83D\uDC9B"}</Text>

      {/* Heading */}
      <Text style={heading}>Sizi Ozledik!</Text>
      <Text style={greeting}>
        Merhaba {customerName}, sizi bir suredir goremiyoruz. Son siparisiniz{" "}
        {lastOrderDate} tarihindeydi. Sizi yeniden agirlamak icin
        sabirsizlaniyoruz!
      </Text>

      {/* Discount Box */}
      <Section style={discountBox}>
        <Text style={discountTitle}>Size Ozel Indirim</Text>
        <Text style={discountAmount}>{discountValue}</Text>
        <Text style={discountDesc}>
          Tum siparislerde gecerli indirim kodunuz:
        </Text>
        <Section style={codeBox}>
          <Text style={codeText}>{discountCode}</Text>
        </Section>
      </Section>

      {/* CTA */}
      <Section style={{ textAlign: "center" as const, marginTop: "32px" }}>
        <Button
          href="https://yaseminsatelier.com/menu"
          style={ctaButton}
        >
          Siparis Ver
        </Button>
      </Section>

      <Text style={footerNote}>
        En taze tatlar ve ozel lezzetler sizi bekliyor. {"\uD83C\uDF3F"}
      </Text>
    </EmailLayout>
  );
}

const heartIcon: React.CSSProperties = {
  fontSize: "48px",
  textAlign: "center" as const,
  margin: "0 0 8px 0",
};

const heading: React.CSSProperties = {
  fontSize: "30px",
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

const discountBox: React.CSSProperties = {
  backgroundColor: "#3D1A0A",
  borderRadius: "12px",
  padding: "32px 24px",
  textAlign: "center" as const,
};

const discountTitle: React.CSSProperties = {
  fontSize: "14px",
  color: "#B8975C",
  textTransform: "uppercase" as const,
  letterSpacing: "1.5px",
  margin: "0 0 8px 0",
};

const discountAmount: React.CSSProperties = {
  fontSize: "48px",
  fontWeight: "700",
  color: "#E8D5A3",
  margin: "0 0 8px 0",
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
};

const discountDesc: React.CSSProperties = {
  fontSize: "14px",
  color: "#dddddd",
  margin: "0 0 16px 0",
};

const codeBox: React.CSSProperties = {
  backgroundColor: "#6B3520",
  borderRadius: "6px",
  padding: "12px 24px",
  display: "inline-block" as const,
};

const codeText: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#E8D5A3",
  letterSpacing: "3px",
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

const footerNote: React.CSSProperties = {
  fontSize: "14px",
  color: "#B8975C",
  textAlign: "center" as const,
  marginTop: "24px",
  lineHeight: "1.5",
  fontStyle: "italic",
};
