import {
  Text,
  Section,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface DataExportEmailProps {
  customerName: string;
  downloadUrl: string;
}

export default function DataExportEmail({
  customerName = "Degerli Musterimiz",
  downloadUrl = "https://yaseminsatelier.com/hesabim/veri-haklarim",
}: DataExportEmailProps) {
  return (
    <EmailLayout previewText="Verileriniz Hazir - Yasemin's Atelier">
      <Text style={heading}>Verileriniz Hazir</Text>
      <Text style={paragraph}>
        Merhaba {customerName}, KVKK kapsaminda talep ettiginiz kisisel veri
        disa aktarim dosyaniz hazirlanmistir.
      </Text>

      <Section style={infoBox}>
        <Text style={infoTitle}>Indirme Bilgileri</Text>
        <Hr style={divider} />
        <Text style={infoText}>
          Asagidaki butona tiklayarak verilerinizi JSON formatinda
          indirebilirsiniz. Dosyaniz profil bilgileri, siparis gecmisi,
          rezervasyonlar, yorumlar, sadakat islemleri ve onay kayitlarinizi
          icerir.
        </Text>
        <Text style={warningText}>
          Link 1 saat gecerlidir. Suresi dolan linkler icin yeni talep
          olusturmaniz gerekmektedir.
        </Text>
      </Section>

      <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
        <Button href={downloadUrl} style={ctaButton}>
          Verilerimi Indir
        </Button>
      </Section>

      <Section style={kvkkNote}>
        <Text style={kvkkTitle}>KVKK Haklariniz</Text>
        <Text style={kvkkText}>
          6698 sayili Kisisel Verilerin Korunmasi Kanunu kapsaminda; verilerinize
          erisim, duzeltme, silme ve tasima haklariniz bulunmaktadir. Tum
          haklarinizi hesabinizdaki &quot;Veri Haklarim&quot; sayfasindan
          kullanabilirsiniz.
        </Text>
      </Section>

      <Text style={footerNote}>
        Bu e-posta veri disa aktarim talebiniz uzerine otomatik olarak
        gonderilmistir. Herhangi bir sorunuz icin{" "}
        kvkk@yaseminsatelier.com adresine ulasabilirsiniz.
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

const infoBox: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  borderRadius: "8px",
  padding: "20px",
};

const infoTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#3D1A0A",
  margin: "0 0 8px 0",
};

const divider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "12px 0",
};

const infoText: React.CSSProperties = {
  fontSize: "14px",
  color: "#555555",
  lineHeight: "1.6",
  margin: "0 0 12px 0",
};

const warningText: React.CSSProperties = {
  fontSize: "13px",
  color: "#C4622D",
  fontWeight: "600",
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

const kvkkNote: React.CSSProperties = {
  backgroundColor: "#3D1A0A",
  borderRadius: "8px",
  padding: "20px",
  marginTop: "24px",
};

const kvkkTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#B8975C",
  margin: "0 0 8px 0",
};

const kvkkText: React.CSSProperties = {
  fontSize: "13px",
  color: "#dddddd",
  lineHeight: "1.6",
  margin: "0",
};

const footerNote: React.CSSProperties = {
  fontSize: "12px",
  color: "#999999",
  textAlign: "center" as const,
  marginTop: "24px",
  lineHeight: "1.5",
};
