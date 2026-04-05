import {
  Text,
  Section,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface PasswordResetProps {
  customerName: string;
  resetLink: string;
}

export default function PasswordReset({
  customerName = "Ayse",
  resetLink = "https://yaseminsatelier.com/auth/reset?token=abc123",
}: PasswordResetProps) {
  return (
    <EmailLayout previewText="Sifre sifirlama talebiniz">
      {/* Lock Icon */}
      <Text style={lockIcon}>{"\uD83D\uDD12"}</Text>

      {/* Heading */}
      <Text style={heading}>Sifre Sifirlama</Text>
      <Text style={greeting}>
        Merhaba {customerName}, hesabiniz icin bir sifre sifirlama talebi
        aldik.
      </Text>

      {/* Warning */}
      <Section style={warningBox}>
        <Text style={warningText}>
          {"\u26A0\uFE0F"} Bu talebi siz yapmadiyseniz, bu e-postayi dikkate
          almayin. Hesabiniz guvendedir.
        </Text>
      </Section>

      {/* CTA */}
      <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
        <Text style={instructionText}>
          Sifrenizi sifirlamak icin asagidaki butona tiklayin:
        </Text>
        <Button href={resetLink} style={ctaButton}>
          Sifremi Sifirla
        </Button>
      </Section>

      <Hr style={divider} />

      {/* Validity Note */}
      <Section style={{ marginTop: "16px" }}>
        <Text style={validityNote}>
          {"\u23F0"} Bu baglanti 1 saat icinde gecerlilgini yitirecektir.
        </Text>
        <Text style={validityNote}>
          Baglanti suresi dolduysa, yeni bir sifre sifirlama talebi
          olusturabilirsiniz.
        </Text>
      </Section>
    </EmailLayout>
  );
}

const lockIcon: React.CSSProperties = {
  fontSize: "48px",
  textAlign: "center" as const,
  margin: "0 0 8px 0",
};

const heading: React.CSSProperties = {
  fontSize: "26px",
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
  margin: "0 0 20px 0",
};

const warningBox: React.CSSProperties = {
  backgroundColor: "#FFF3E0",
  border: "1px solid #FFE0B2",
  borderRadius: "8px",
  padding: "16px",
};

const warningText: React.CSSProperties = {
  fontSize: "14px",
  color: "#E65100",
  margin: "0",
  lineHeight: "1.5",
};

const instructionText: React.CSSProperties = {
  fontSize: "15px",
  color: "#555555",
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

const divider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "24px 0 0 0",
};

const validityNote: React.CSSProperties = {
  fontSize: "13px",
  color: "#999999",
  textAlign: "center" as const,
  margin: "0 0 4px 0",
  lineHeight: "1.5",
};
