import {
  Text,
  Section,
  Button,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface CorporateApplicationReceivedProps {
  companyName: string;
  contactName: string;
}

export default function CorporateApplicationReceived({
  companyName = "Ornek Sirket A.S.",
  contactName = "Mehmet",
}: CorporateApplicationReceivedProps) {
  return (
    <EmailLayout previewText={`${companyName} kurumsal basvurunuz alindi`}>
      {/* Heading */}
      <Text style={heading}>Basvurunuz Alindi</Text>
      <Text style={greeting}>Merhaba {contactName},</Text>
      <Text style={paragraph}>
        {companyName} icin kurumsal hesap basvurunuz basariyla alinmistir.
        Basvurunuzu en kisa surede degerlendirecegiz.
      </Text>

      {/* Info Box */}
      <Section style={infoBox}>
        <Text style={infoIcon}>{"\u23F3"}</Text>
        <Text style={infoText}>
          1-2 is gunu icinde degerlendirip size donus yapacagiz.
        </Text>
      </Section>

      <Hr style={divider} />

      {/* Next Steps */}
      <Text style={paragraph}>
        Bu surecte basvurunuzla ilgili ek bilgi veya belge talep edebiliriz.
        Lutfen kayitli e-posta adresinizi kontrol etmeye devam edin.
      </Text>

      {/* WhatsApp Contact */}
      <Section style={contactSection}>
        <Text style={contactTitle}>Sorulariniz icin</Text>
        <Text style={contactDesc}>
          Bize WhatsApp uzerinden ulasabilirsiniz:
        </Text>
        <Section style={{ textAlign: "center" as const, marginTop: "16px" }}>
          <Button
            href="https://wa.me/905551234567?text=Merhaba%2C%20kurumsal%20basvurum%20hakkinda%20bilgi%20almak%20istiyorum."
            style={whatsappButton}
          >
            WhatsApp ile Iletisime Gecin
          </Button>
        </Section>
      </Section>
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

const infoBox: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  border: "1px solid #E8D5A3",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center" as const,
  marginTop: "24px",
  marginBottom: "24px",
};

const infoIcon: React.CSSProperties = {
  fontSize: "28px",
  margin: "0 0 8px 0",
};

const infoText: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#3D1A0A",
  margin: "0",
  lineHeight: "1.5",
};

const divider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "24px 0",
};

const contactSection: React.CSSProperties = {
  marginTop: "24px",
};

const contactTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#3D1A0A",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 8px 0",
};

const contactDesc: React.CSSProperties = {
  fontSize: "14px",
  color: "#555555",
  margin: "0",
  lineHeight: "1.5",
};

const whatsappButton: React.CSSProperties = {
  backgroundColor: "#25D366",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  padding: "12px 28px",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
};
