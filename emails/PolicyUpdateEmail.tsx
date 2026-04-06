import {
  Text,
  Section,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface PolicyUpdateEmailProps {
  customerName: string;
  policyName: string;
  summary: string;
  policyUrl: string;
}

export default function PolicyUpdateEmail({
  customerName = "Degerli Musterimiz",
  policyName = "Gizlilik Politikasi",
  summary = "Kisisel verilerin islenmesine iliskin sartlar guncellenmistir.",
  policyUrl = "https://yaseminsatelier.com/politikalar",
}: PolicyUpdateEmailProps) {
  return (
    <EmailLayout previewText={`Politikamiz Guncellendi - ${policyName}`}>
      <Text style={heading}>Politikamiz Guncellendi</Text>
      <Text style={paragraph}>
        Merhaba {customerName}, seffaflik ilkemiz geregi{" "}
        <strong>{policyName}</strong> belgemizde yapilan guncellemeleri
        bilginize sunmak istiyoruz.
      </Text>

      <Section style={changeBox}>
        <Text style={changeTitle}>Neler Degisti?</Text>
        <Hr style={divider} />
        <Text style={changeText}>{summary}</Text>
      </Section>

      <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
        <Button href={policyUrl} style={ctaButton}>
          Guncel Politikayi Oku
        </Button>
      </Section>

      <Section style={infoSection}>
        <Text style={infoText}>
          Bu guncelleme{" "}
          {new Date().toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          tarihi itibariyle yururluge girmistir. Hizmetlerimizi kullanmaya devam
          etmeniz, guncellenmis politikayi kabul ettiginiz anlamina gelir.
        </Text>
        <Text style={infoText}>
          Guncellemeler hakkinda sorulariniz varsa veya KVKK kapsamindaki
          haklariniz hakkinda bilgi almak istiyorsaniz, hesabinizdeki
          &quot;Veri Haklarim&quot; sayfasini ziyaret edebilir veya
          kvkk@yaseminsatelier.com adresine yazabilirsiniz.
        </Text>
      </Section>

      <Text style={footerNote}>
        Bu e-posta yasal bilgilendirme amacli gonderilmistir ve
        pazarlama iletisi degildir.
      </Text>
    </EmailLayout>
  );
}

const heading: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "700",
  color: "#3D1A0A",
  textAlign: "center" as const,
  margin: "0 0 16px 0",
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  color: "#555555",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const changeBox: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  borderRadius: "8px",
  padding: "20px",
};

const changeTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#3D1A0A",
  margin: "0 0 8px 0",
};

const divider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "12px 0",
};

const changeText: React.CSSProperties = {
  fontSize: "14px",
  color: "#555555",
  lineHeight: "1.6",
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

const infoSection: React.CSSProperties = {
  marginTop: "24px",
};

const infoText: React.CSSProperties = {
  fontSize: "13px",
  color: "#777777",
  lineHeight: "1.6",
  margin: "0 0 12px 0",
};

const footerNote: React.CSSProperties = {
  fontSize: "12px",
  color: "#999999",
  textAlign: "center" as const,
  marginTop: "24px",
  lineHeight: "1.5",
  fontStyle: "italic" as const,
};
