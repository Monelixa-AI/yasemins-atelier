import {
  Text,
  Section,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface BirthdayEmailProps {
  customerName: string;
  discountCode: string;
  validUntil: string;
}

export default function BirthdayEmail({
  customerName = "Ayse",
  discountCode = "DGUNUN25",
  validUntil = "15 Nisan 2026",
}: BirthdayEmailProps) {
  return (
    <EmailLayout previewText={`Mutlu yillar ${customerName}! Dogum gunu hediyeniz icerde.`}>
      {/* Cake Icon */}
      <Text style={cakeIcon}>{"\uD83C\uDF82"}</Text>

      {/* Heading */}
      <Text style={heading}>Mutlu Yillar!</Text>
      <Text style={greeting}>
        Sevgili {customerName}, dogum gununuz kutlu olsun! Bu ozel gunde sizinle
        birlikte kutlama yapmak istiyoruz.
      </Text>

      <Text style={personalMessage}>
        Yasemin&apos;s Atelier ailesi olarak, sizin icin her zaman en guzel
        tatlari hazirliyoruz. Bu ozel gunde kucuk bir hediyemiz var:
      </Text>

      {/* Discount Box */}
      <Section style={discountBox}>
        <Text style={discountTitle}>{"\uD83C\uDF81"} Dogum Gunu Hediyeniz</Text>
        <Section style={codeBox}>
          <Text style={codeText}>{discountCode}</Text>
        </Section>
        <Text style={discountDesc}>
          Tum siparislerde gecerli ozel indirim kodunuz
        </Text>
        <Hr style={discountDivider} />
        <Text style={validityText}>
          Son kullanim: {validUntil}
        </Text>
      </Section>

      {/* CTA */}
      <Section style={{ textAlign: "center" as const, marginTop: "32px" }}>
        <Button
          href="https://yaseminsatelier.com/menu"
          style={ctaButton}
        >
          Hediyenizi Kullanin
        </Button>
      </Section>

      <Text style={footerNote}>
        Saginizla ve afiyetle gecireceginiz guzel bir yil dileriz! {"\uD83C\uDF3F"}
      </Text>
    </EmailLayout>
  );
}

const cakeIcon: React.CSSProperties = {
  fontSize: "56px",
  textAlign: "center" as const,
  margin: "0 0 8px 0",
};

const heading: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#C4622D",
  textAlign: "center" as const,
  margin: "0 0 16px 0",
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
};

const greeting: React.CSSProperties = {
  fontSize: "16px",
  color: "#3D1A0A",
  lineHeight: "1.6",
  margin: "0 0 12px 0",
  textAlign: "center" as const,
};

const personalMessage: React.CSSProperties = {
  fontSize: "15px",
  color: "#555555",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const discountBox: React.CSSProperties = {
  background: "linear-gradient(135deg, #3D1A0A 0%, #6B3520 100%)",
  backgroundColor: "#3D1A0A",
  borderRadius: "12px",
  padding: "32px 24px",
  textAlign: "center" as const,
};

const discountTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#B8975C",
  margin: "0 0 16px 0",
};

const codeBox: React.CSSProperties = {
  backgroundColor: "#6B3520",
  borderRadius: "6px",
  padding: "14px 28px",
  display: "inline-block" as const,
  marginBottom: "12px",
};

const codeText: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#E8D5A3",
  letterSpacing: "3px",
  margin: "0",
};

const discountDesc: React.CSSProperties = {
  fontSize: "14px",
  color: "#dddddd",
  margin: "0 0 12px 0",
};

const discountDivider: React.CSSProperties = {
  borderColor: "#6B3520",
  margin: "12px 0",
};

const validityText: React.CSSProperties = {
  fontSize: "12px",
  color: "#B8975C",
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
