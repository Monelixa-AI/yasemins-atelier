import {
  Text,
  Section,
  Button,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface NewsletterConfirmationProps {
  confirmUrl: string;
}

export default function NewsletterConfirmation({
  confirmUrl = "https://yaseminsatelier.com/newsletter/confirm?token=abc123",
}: NewsletterConfirmationProps) {
  return (
    <EmailLayout previewText="Bulten aboneliginizi onaylayin">
      {/* Mail Icon */}
      <Text style={mailIcon}>{"\u2709\uFE0F"}</Text>

      {/* Heading */}
      <Text style={heading}>Aboneliginizi Onaylayin</Text>
      <Text style={description}>
        Yasemin&apos;s Atelier bultenine abone olmak istediginiz icin tesekkur
        ederiz. Aboneliginizi tamamlamak icin asagidaki butona tiklayin.
      </Text>

      {/* Benefits preview */}
      <Section style={benefitsBox}>
        <Text style={benefitsTitle}>Bultenimizde neler var?</Text>
        <Text style={benefitItem}>
          {"\uD83C\uDF7D\uFE0F"} Haftalik ozel menu ve lezzetler
        </Text>
        <Text style={benefitItem}>
          {"\uD83C\uDF81"} Abonelere ozel indirimler ve kampanyalar
        </Text>
        <Text style={benefitItem}>
          {"\uD83D\uDCC5"} Etkinlik ve atolye duyurulari
        </Text>
        <Text style={benefitItem}>
          {"\uD83D\uDCD6"} Yasemin&apos;den tarifler ve ipuclari
        </Text>
      </Section>

      {/* CTA */}
      <Section style={{ textAlign: "center" as const, marginTop: "32px" }}>
        <Button href={confirmUrl} style={ctaButton}>
          Aboneligi Onayla
        </Button>
      </Section>

      <Text style={footerNote}>
        Bu e-postayi siz talep etmediyseniz, dikkate almaniza gerek yoktur.
      </Text>
    </EmailLayout>
  );
}

const mailIcon: React.CSSProperties = {
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

const description: React.CSSProperties = {
  fontSize: "15px",
  color: "#555555",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
  textAlign: "center" as const,
};

const benefitsBox: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  borderRadius: "8px",
  padding: "20px",
};

const benefitsTitle: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#3D1A0A",
  margin: "0 0 12px 0",
};

const benefitItem: React.CSSProperties = {
  fontSize: "14px",
  color: "#555555",
  lineHeight: "1.6",
  margin: "0 0 8px 0",
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
  fontSize: "12px",
  color: "#999999",
  textAlign: "center" as const,
  marginTop: "24px",
  lineHeight: "1.5",
};
