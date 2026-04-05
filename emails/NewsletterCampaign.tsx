import {
  Text,
  Section,
  Button,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface NewsletterCampaignProps {
  headline: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  unsubscribeUrl: string;
}

export default function NewsletterCampaign({
  headline = "Bu Haftanin Ozel Lezzetleri",
  body = "Yeni sezon menumuzu sizler icin hazirladik. Taze malzemeler ve ozenle hazirlanan tariflerimizle bu hafta sofralarinizi renklendirin.",
  ctaText,
  ctaUrl,
  unsubscribeUrl = "https://yaseminsatelier.com/unsubscribe",
}: NewsletterCampaignProps) {
  return (
    <EmailLayout previewText={headline}>
      {/* Headline */}
      <Text style={headlineStyle}>{headline}</Text>

      <Hr style={divider} />

      {/* Body */}
      <Text style={bodyStyle}>{body}</Text>

      {/* CTA Button (optional) */}
      {ctaText && ctaUrl && (
        <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
          <Button href={ctaUrl} style={ctaButton}>
            {ctaText}
          </Button>
        </Section>
      )}

      <Hr style={bottomDivider} />

      {/* Unsubscribe */}
      <Text style={unsubscribeText}>
        Bu e-posta Yasemin&apos;s Atelier bulten aboneliginiz kapsaminda
        gonderilmistir.{" "}
        <Link href={unsubscribeUrl} style={unsubscribeLink}>
          Aboneligimi iptal et
        </Link>
      </Text>
    </EmailLayout>
  );
}

const headlineStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#3D1A0A",
  textAlign: "center" as const,
  margin: "0 0 16px 0",
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  lineHeight: "1.3",
};

const divider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "0 0 24px 0",
};

const bodyStyle: React.CSSProperties = {
  fontSize: "15px",
  color: "#555555",
  lineHeight: "1.7",
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

const bottomDivider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "32px 0 16px 0",
};

const unsubscribeText: React.CSSProperties = {
  fontSize: "12px",
  color: "#999999",
  textAlign: "center" as const,
  lineHeight: "1.5",
  margin: "0",
};

const unsubscribeLink: React.CSSProperties = {
  color: "#999999",
  textDecoration: "underline",
};
