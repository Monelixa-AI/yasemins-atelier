import {
  Text,
  Section,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface WelcomeEmailProps {
  customerName: string;
  discountCode?: string;
}

export default function WelcomeEmail({
  customerName = "Ayse",
  discountCode,
}: WelcomeEmailProps) {
  return (
    <EmailLayout previewText="Yasemin's Atelier ailesine hos geldiniz!">
      {/* Heading */}
      <Text style={heading}>Hos Geldiniz!</Text>
      <Text style={greeting}>
        Merhaba {customerName}, Yasemin&apos;s Atelier ailesine katildiginiz
        icin cok mutluyuz. Sizin icin en ozel lezzetleri hazirlamak icin
        sabirsizlaniyoruz.
      </Text>

      {/* Benefits */}
      <Section style={benefitsSection}>
        <Text style={benefitsTitle}>Hesabinizin Avantajlari</Text>
        <Hr style={divider} />
        <Text style={benefitItem}>
          {"\uD83C\uDF1F"} Ozel kampanya ve indirimlerden ilk siz haberdar olun
        </Text>
        <Text style={benefitItem}>
          {"\uD83C\uDF82"} Dogum gununuzde ozel surprizler
        </Text>
        <Text style={benefitItem}>
          {"\uD83C\uDFC6"} Sadakat programi ile kazanin
        </Text>
        <Text style={benefitItem}>
          {"\uD83D\uDE9A"} Siparis takibi ve gecmis siparis goruntuleme
        </Text>
        <Text style={benefitItem}>
          {"\uD83D\uDCC5"} Ozel etkinlik ve atolye rezervasyonlari
        </Text>
      </Section>

      {/* Discount Box */}
      {discountCode && (
        <Section style={discountBox}>
          <Text style={discountTitle}>Hos Geldin Hediyeniz!</Text>
          <Text style={discountDesc}>
            Ilk siparisinizde gecerli ozel indirim kodunuz:
          </Text>
          <Section style={codeBox}>
            <Text style={codeText}>{discountCode}</Text>
          </Section>
        </Section>
      )}

      {/* CTA */}
      <Section style={{ textAlign: "center" as const, marginTop: "32px" }}>
        <Button
          href="https://yaseminsatelier.com/menu"
          style={ctaButton}
        >
          Menuyu Kesfet
        </Button>
      </Section>

      <Text style={footerNote}>
        Her sorunuzda WhatsApp hattimizdan bize ulasabilirsiniz. Afiyetle!
      </Text>
    </EmailLayout>
  );
}

const heading: React.CSSProperties = {
  fontSize: "30px",
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

const benefitsSection: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  borderRadius: "8px",
  padding: "20px",
};

const benefitsTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#3D1A0A",
  margin: "0 0 8px 0",
};

const divider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "12px 0",
};

const benefitItem: React.CSSProperties = {
  fontSize: "14px",
  color: "#555555",
  lineHeight: "1.6",
  margin: "0 0 10px 0",
};

const discountBox: React.CSSProperties = {
  backgroundColor: "#3D1A0A",
  borderRadius: "12px",
  padding: "24px",
  marginTop: "24px",
  textAlign: "center" as const,
};

const discountTitle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#B8975C",
  margin: "0 0 8px 0",
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
  fontSize: "13px",
  color: "#999999",
  textAlign: "center" as const,
  marginTop: "24px",
  lineHeight: "1.5",
};
