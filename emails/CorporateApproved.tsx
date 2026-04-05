import {
  Text,
  Section,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface CorporateApprovedProps {
  companyName: string;
  contactName: string;
  priceGroupName?: string;
  portalUrl: string;
}

export default function CorporateApproved({
  companyName = "Ornek Sirket A.S.",
  contactName = "Mehmet",
  priceGroupName,
  portalUrl = "https://yaseminsatelier.com/kurumsal",
}: CorporateApprovedProps) {
  return (
    <EmailLayout previewText={`${companyName} kurumsal hesabiniz onaylandi!`}>
      {/* Heading with Checkmark */}
      <Section style={{ textAlign: "center" as const }}>
        <Text style={checkmark}>{"\u2705"}</Text>
        <Text style={heading}>Kurumsal Hesabiniz Onaylandi!</Text>
      </Section>

      <Text style={greeting}>Merhaba {contactName},</Text>
      <Text style={paragraph}>
        {companyName} icin kurumsal hesap basvurunuz onaylanmistir. Artik
        kurumsal portalimiz uzerinden siparis verebilir, ekip uyelerinizi davet
        edebilir ve ozel fiyatlandirmalardan yararlanabilirsiniz.
      </Text>

      {/* Price Group Info */}
      {priceGroupName && (
        <Section style={priceGroupBox}>
          <Text style={priceGroupLabel}>Fiyat Grubunuz</Text>
          <Text style={priceGroupValue}>{priceGroupName}</Text>
          <Text style={priceGroupDesc}>
            Kurumsal fiyatlandirmaniz otomatik olarak tanimlanmistir.
          </Text>
        </Section>
      )}

      {/* Portal Button */}
      <Section style={{ textAlign: "center" as const, marginTop: "28px" }}>
        <Button href={portalUrl} style={ctaButton}>
          Kurumsal Portale Giris
        </Button>
      </Section>

      <Hr style={divider} />

      {/* First Steps */}
      <Section style={stepsSection}>
        <Text style={stepsTitle}>Ilk Adimlar</Text>

        <Section style={stepRow}>
          <Text style={stepNumber}>1</Text>
          <Section style={stepContent}>
            <Text style={stepHeading}>Portale giris yapin</Text>
            <Text style={stepDesc}>
              Kayitli e-posta adresiniz ve sifrenizle giris yapin.
            </Text>
          </Section>
        </Section>

        <Section style={stepRow}>
          <Text style={stepNumber}>2</Text>
          <Section style={stepContent}>
            <Text style={stepHeading}>Ekip uyelerini davet edin</Text>
            <Text style={stepDesc}>
              Calisanlarinizi hesabiniza ekleyerek siparis yetkisi verin.
            </Text>
          </Section>
        </Section>

        <Section style={stepRow}>
          <Text style={stepNumber}>3</Text>
          <Section style={stepContent}>
            <Text style={stepHeading}>Siparis sablonu olusturun</Text>
            <Text style={stepDesc}>
              Sik siparis ettiginiz urunlerle sablon olusturarak zaman kazanin.
            </Text>
          </Section>
        </Section>
      </Section>

      <Text style={footerNote}>
        Herhangi bir sorunuz varsa kurumsal destek hattimizdan bize
        ulasabilirsiniz.
      </Text>
    </EmailLayout>
  );
}

const checkmark: React.CSSProperties = {
  fontSize: "48px",
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
  margin: "0 0 16px 0",
};

const priceGroupBox: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  border: "1px solid #E8D5A3",
  borderRadius: "8px",
  padding: "16px 20px",
  textAlign: "center" as const,
  marginTop: "20px",
};

const priceGroupLabel: React.CSSProperties = {
  fontSize: "12px",
  color: "#999999",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 4px 0",
};

const priceGroupValue: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#B8975C",
  margin: "0 0 4px 0",
};

const priceGroupDesc: React.CSSProperties = {
  fontSize: "13px",
  color: "#999999",
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

const stepsSection: React.CSSProperties = {
  marginBottom: "24px",
};

const stepsTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#3D1A0A",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 16px 0",
};

const stepRow: React.CSSProperties = {
  marginBottom: "16px",
};

const stepNumber: React.CSSProperties = {
  display: "inline-block" as const,
  width: "28px",
  height: "28px",
  lineHeight: "28px",
  backgroundColor: "#C4622D",
  color: "#ffffff",
  borderRadius: "50%",
  textAlign: "center" as const,
  fontSize: "14px",
  fontWeight: "700",
  margin: "0 12px 0 0",
  verticalAlign: "top" as const,
};

const stepContent: React.CSSProperties = {
  display: "inline-block" as const,
  width: "calc(100% - 44px)",
  verticalAlign: "top" as const,
};

const stepHeading: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#3D1A0A",
  margin: "0 0 2px 0",
};

const stepDesc: React.CSSProperties = {
  fontSize: "13px",
  color: "#777777",
  margin: "0",
  lineHeight: "1.5",
};

const footerNote: React.CSSProperties = {
  fontSize: "13px",
  color: "#999999",
  textAlign: "center" as const,
  marginTop: "8px",
  lineHeight: "1.5",
};
