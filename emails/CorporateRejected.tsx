import {
  Text,
  Section,
  Button,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface CorporateRejectedProps {
  companyName: string;
  contactName: string;
  reason?: string;
}

export default function CorporateRejected({
  companyName = "Ornek Sirket A.S.",
  contactName = "Mehmet",
  reason,
}: CorporateRejectedProps) {
  return (
    <EmailLayout previewText={`${companyName} kurumsal basvurunuz degerlendirildi`}>
      {/* Heading */}
      <Text style={heading}>Basvurunuz Degerlendirildi</Text>

      <Text style={greeting}>Merhaba {contactName},</Text>
      <Text style={paragraph}>
        {companyName} icin yaptiginiz kurumsal hesap basvurusu ekibimiz
        tarafindan degerlendirilmistir. Maalesef su an icin basvurunuzu
        onaylayamiyoruz.
      </Text>

      {/* Reason Box */}
      {reason && (
        <Section style={reasonBox}>
          <Text style={reasonLabel}>Degerlendirme Notu</Text>
          <Text style={reasonText}>{reason}</Text>
        </Section>
      )}

      <Hr style={divider} />

      {/* What to do next */}
      <Text style={paragraph}>
        Basvurunuzu guncelleyerek tekrar degerlendirme talep edebilirsiniz.
        Eksik bilgi veya belgeleri tamamladiktan sonra yeni bir basvuru
        yapmanizi oneririz.
      </Text>

      {/* Contact Info */}
      <Section style={contactBox}>
        <Text style={contactTitle}>Sorunuz varsa iletisime gecin</Text>
        <Text style={contactDetail}>
          {"\uD83D\uDCE7"}{" "}
          <Link href="mailto:kurumsal@yaseminsatelier.com" style={contactLink}>
            kurumsal@yaseminsatelier.com
          </Link>
        </Text>
        <Text style={contactDetail}>
          {"\uD83D\uDCDE"}{" "}
          <Link href="tel:+905551234567" style={contactLink}>
            0555 123 45 67
          </Link>
        </Text>
        <Text style={contactDetail}>
          {"\uD83D\uDCAC"}{" "}
          <Link
            href="https://wa.me/905551234567?text=Merhaba%2C%20kurumsal%20basvurum%20hakkinda%20bilgi%20almak%20istiyorum."
            style={contactLink}
          >
            WhatsApp
          </Link>
        </Text>
      </Section>

      <Section style={{ textAlign: "center" as const, marginTop: "28px" }}>
        <Button
          href="https://yaseminsatelier.com/kurumsal-basvuru"
          style={ctaButton}
        >
          Yeni Basvuru Yap
        </Button>
      </Section>

      <Text style={footerNote}>
        Ilginiz icin tesekkur ederiz. Sizinle calismak icin sabisizlaniyoruz.
      </Text>
    </EmailLayout>
  );
}

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
  margin: "0 0 16px 0",
};

const reasonBox: React.CSSProperties = {
  backgroundColor: "#FFF8F5",
  border: "1px solid #E8C5B5",
  borderRadius: "8px",
  padding: "16px 20px",
  marginTop: "16px",
  marginBottom: "16px",
};

const reasonLabel: React.CSSProperties = {
  fontSize: "12px",
  color: "#C4622D",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const reasonText: React.CSSProperties = {
  fontSize: "14px",
  color: "#555555",
  margin: "0",
  lineHeight: "1.6",
};

const divider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "24px 0",
};

const contactBox: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  borderRadius: "8px",
  padding: "20px",
  marginTop: "16px",
};

const contactTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#3D1A0A",
  margin: "0 0 12px 0",
};

const contactDetail: React.CSSProperties = {
  fontSize: "14px",
  color: "#555555",
  margin: "0 0 8px 0",
  lineHeight: "1.5",
};

const contactLink: React.CSSProperties = {
  color: "#C4622D",
  textDecoration: "none",
  fontWeight: "500",
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
