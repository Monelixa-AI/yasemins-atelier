import {
  Text,
  Section,
  Hr,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface LoyaltyLevelUpProps {
  customerName: string;
  tierName: string;
  benefits: string[];
}

export default function LoyaltyLevelUp({
  customerName = "Ayse",
  tierName = "Altin Uye",
  benefits = [
    "Tum siparislerde %10 indirim",
    "Ucretsiz teslimat",
    "Ozel etkinliklere oncelikli erisim",
    "Dogum gunune ozel hediye kutusu",
  ],
}: LoyaltyLevelUpProps) {
  return (
    <EmailLayout previewText={`Tebrikler! ${tierName} seviyesine ulastiniz!`}>
      {/* Party Icon */}
      <Text style={partyIcon}>{"\uD83C\uDF89"}</Text>

      {/* Heading */}
      <Text style={heading}>Tebrikler!</Text>
      <Text style={greeting}>
        Merhaba {customerName}, sadakat programimizda yeni bir seviyeye
        ulastiniz!
      </Text>

      {/* Tier Badge */}
      <Section style={tierBadge}>
        <Text style={tierLabel}>Yeni Seviyeniz</Text>
        <Text style={tierNameText}>{tierName}</Text>
        <Text style={tierStar}>
          {"\u2B50"} {"\u2B50"} {"\u2B50"}
        </Text>
      </Section>

      {/* Benefits */}
      <Section style={benefitsSection}>
        <Text style={benefitsTitle}>Yeni Avantajlariniz</Text>
        <Hr style={divider} />
        {benefits.map((benefit, index) => (
          <Text key={index} style={benefitItem}>
            {"\u2714\uFE0F"} {benefit}
          </Text>
        ))}
      </Section>

      <Text style={footerNote}>
        Bizi tercih ettiginiz icin tesekkur ederiz. Sadakatiniz bizim icin cok
        degerli!
      </Text>
    </EmailLayout>
  );
}

const partyIcon: React.CSSProperties = {
  fontSize: "48px",
  textAlign: "center" as const,
  margin: "0 0 8px 0",
};

const heading: React.CSSProperties = {
  fontSize: "30px",
  fontWeight: "700",
  color: "#B8975C",
  textAlign: "center" as const,
  margin: "0 0 16px 0",
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
};

const greeting: React.CSSProperties = {
  fontSize: "15px",
  color: "#555555",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
  textAlign: "center" as const,
};

const tierBadge: React.CSSProperties = {
  backgroundColor: "#3D1A0A",
  borderRadius: "12px",
  padding: "32px 24px",
  textAlign: "center" as const,
};

const tierLabel: React.CSSProperties = {
  fontSize: "11px",
  color: "#B8975C",
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
  margin: "0 0 8px 0",
};

const tierNameText: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#E8D5A3",
  margin: "0 0 8px 0",
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
};

const tierStar: React.CSSProperties = {
  fontSize: "24px",
  margin: "0",
};

const benefitsSection: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  borderRadius: "8px",
  padding: "20px",
  marginTop: "24px",
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

const footerNote: React.CSSProperties = {
  fontSize: "14px",
  color: "#B8975C",
  textAlign: "center" as const,
  marginTop: "24px",
  lineHeight: "1.5",
  fontStyle: "italic",
};
