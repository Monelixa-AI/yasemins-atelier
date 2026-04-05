import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
  Preview,
} from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

const colors = {
  terracotta: "#C4622D",
  gold: "#B8975C",
  cream: "#FDF6EE",
  brownDeep: "#3D1A0A",
  brownMid: "#6B3520",
  goldLight: "#E8D5A3",
};

export default function EmailLayout({
  previewText,
  children,
}: EmailLayoutProps) {
  return (
    <Html lang="tr">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerText}>Yasemin&apos;s Atelier</Text>
            <Hr style={headerHr} />
          </Section>

          {/* Body */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerLinks}>
              <Link href="https://instagram.com/yaseminsatelier" style={footerLink}>
                Instagram
              </Link>
              {"  ·  "}
              <Link href="https://wa.me/905551234567" style={footerLink}>
                WhatsApp
              </Link>
            </Text>
            <Text style={footerCopyright}>
              &copy; 2026 Yasemin&apos;s Atelier &middot; Istanbul
            </Text>
            <Link href="https://yaseminsatelier.com/unsubscribe" style={unsubscribeLink}>
              abonelikten cik
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#F5F0E8",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: "0",
  padding: "0",
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
};

const header: React.CSSProperties = {
  backgroundColor: colors.brownDeep,
  padding: "24px 0",
  textAlign: "center" as const,
};

const headerText: React.CSSProperties = {
  color: colors.gold,
  fontSize: "28px",
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontWeight: "400",
  margin: "0",
  letterSpacing: "1px",
};

const headerHr: React.CSSProperties = {
  borderColor: colors.gold,
  borderWidth: "0.5px",
  margin: "16px 40px 0 40px",
};

const content: React.CSSProperties = {
  padding: "32px 40px",
};

const footer: React.CSSProperties = {
  backgroundColor: colors.cream,
  padding: "24px",
  textAlign: "center" as const,
};

const footerLinks: React.CSSProperties = {
  fontSize: "14px",
  color: colors.brownMid,
  margin: "0 0 8px 0",
};

const footerLink: React.CSSProperties = {
  color: colors.brownMid,
  textDecoration: "none",
  fontWeight: "500",
};

const footerCopyright: React.CSSProperties = {
  fontSize: "12px",
  color: "#999999",
  margin: "0 0 8px 0",
};

const unsubscribeLink: React.CSSProperties = {
  fontSize: "11px",
  color: "#aaaaaa",
  textDecoration: "underline",
};
