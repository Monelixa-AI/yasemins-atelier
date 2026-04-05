import {
  Text,
  Section,
  Button,
  Hr,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./components/EmailLayout";

interface OrderItem {
  name: string;
  variantName?: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationProps {
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  deliveryDate: string;
  deliverySlot: string;
  address: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(
    amount
  );

export default function OrderConfirmation({
  orderNumber = "YA-20260401-0042",
  customerName = "Ayse",
  items = [
    { name: "Fistikli Baklava", variantName: "500g", quantity: 2, price: 450 },
    { name: "Kunefe", quantity: 1, price: 320 },
  ],
  deliveryDate = "3 Nisan 2026",
  deliverySlot = "14:00 - 16:00",
  address = "Nisantasi, Istanbul",
  subtotal = 1220,
  deliveryFee = 50,
  discount = 0,
  total = 1270,
  paymentMethod = "Kredi Karti",
}: OrderConfirmationProps) {
  return (
    <EmailLayout previewText={`Siparis #${orderNumber} onaylandi`}>
      {/* Heading */}
      <Text style={heading}>Siparisiniz Alindi!</Text>
      <Text style={greeting}>
        Merhaba {customerName}, siparisiniz basariyla alindi. Siparis
        detaylariniz asagida yer almaktadir.
      </Text>

      {/* Order Box */}
      <Section style={orderBox}>
        <Text style={orderBoxLabel}>Siparis Numarasi</Text>
        <Text style={orderBoxValue}>{orderNumber}</Text>
        <Text style={orderBoxDate}>
          {new Date().toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </Section>

      {/* Items Table */}
      <Section style={{ marginTop: "24px" }}>
        <Text style={sectionTitle}>Siparis Detaylari</Text>
        <Hr style={divider} />
        {items.map((item, index) => (
          <Row key={index} style={itemRow}>
            <Column style={itemNameCol}>
              <Text style={itemName}>
                {item.name}
                {item.variantName && (
                  <span style={itemVariant}> ({item.variantName})</span>
                )}
              </Text>
              <Text style={itemQty}>Adet: {item.quantity}</Text>
            </Column>
            <Column style={itemPriceCol}>
              <Text style={itemPrice}>{formatPrice(item.price)}</Text>
            </Column>
          </Row>
        ))}
        <Hr style={divider} />

        {/* Price Summary */}
        <Row style={summaryRow}>
          <Column style={summaryLabel}>
            <Text style={summaryText}>Ara Toplam</Text>
          </Column>
          <Column style={summaryValue}>
            <Text style={summaryText}>{formatPrice(subtotal)}</Text>
          </Column>
        </Row>
        <Row style={summaryRow}>
          <Column style={summaryLabel}>
            <Text style={summaryText}>Teslimat Ucreti</Text>
          </Column>
          <Column style={summaryValue}>
            <Text style={summaryText}>
              {deliveryFee === 0 ? "Ucretsiz" : formatPrice(deliveryFee)}
            </Text>
          </Column>
        </Row>
        {discount > 0 && (
          <Row style={summaryRow}>
            <Column style={summaryLabel}>
              <Text style={{ ...summaryText, color: "#C4622D" }}>Indirim</Text>
            </Column>
            <Column style={summaryValue}>
              <Text style={{ ...summaryText, color: "#C4622D" }}>
                -{formatPrice(discount)}
              </Text>
            </Column>
          </Row>
        )}
        <Hr style={divider} />
        <Row style={summaryRow}>
          <Column style={summaryLabel}>
            <Text style={totalText}>Toplam</Text>
          </Column>
          <Column style={summaryValue}>
            <Text style={totalText}>{formatPrice(total)}</Text>
          </Column>
        </Row>
      </Section>

      {/* Delivery Info */}
      <Section style={deliveryBox}>
        <Text style={sectionTitle}>Teslimat Bilgileri</Text>
        <Text style={deliveryDetail}>
          <strong>Tarih:</strong> {deliveryDate}
        </Text>
        <Text style={deliveryDetail}>
          <strong>Saat:</strong> {deliverySlot}
        </Text>
        <Text style={deliveryDetail}>
          <strong>Adres:</strong> {address}
        </Text>
        <Text style={deliveryDetail}>
          <strong>Odeme:</strong> {paymentMethod}
        </Text>
      </Section>

      {/* CTA */}
      <Section style={{ textAlign: "center" as const, marginTop: "32px" }}>
        <Button
          href={`https://yaseminsatelier.com/orders/${orderNumber}`}
          style={ctaButton}
        >
          Siparisinizi Takip Edin
        </Button>
      </Section>
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

const greeting: React.CSSProperties = {
  fontSize: "15px",
  color: "#555555",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const orderBox: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  border: "1px solid #E8D5A3",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center" as const,
};

const orderBoxLabel: React.CSSProperties = {
  fontSize: "12px",
  color: "#999999",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 4px 0",
};

const orderBoxValue: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#3D1A0A",
  margin: "0 0 4px 0",
};

const orderBoxDate: React.CSSProperties = {
  fontSize: "13px",
  color: "#999999",
  margin: "0",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#3D1A0A",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 12px 0",
};

const divider: React.CSSProperties = {
  borderColor: "#E8D5A3",
  margin: "12px 0",
};

const itemRow: React.CSSProperties = {
  padding: "8px 0",
};

const itemNameCol: React.CSSProperties = {
  width: "70%",
  verticalAlign: "top" as const,
};

const itemName: React.CSSProperties = {
  fontSize: "15px",
  color: "#333333",
  margin: "0",
  fontWeight: "500",
};

const itemVariant: React.CSSProperties = {
  color: "#999999",
  fontWeight: "400",
};

const itemQty: React.CSSProperties = {
  fontSize: "13px",
  color: "#999999",
  margin: "2px 0 0 0",
};

const itemPriceCol: React.CSSProperties = {
  width: "30%",
  verticalAlign: "top" as const,
  textAlign: "right" as const,
};

const itemPrice: React.CSSProperties = {
  fontSize: "15px",
  color: "#333333",
  margin: "0",
  fontWeight: "500",
};

const summaryRow: React.CSSProperties = {
  padding: "4px 0",
};

const summaryLabel: React.CSSProperties = {
  width: "70%",
};

const summaryValue: React.CSSProperties = {
  width: "30%",
  textAlign: "right" as const,
};

const summaryText: React.CSSProperties = {
  fontSize: "14px",
  color: "#666666",
  margin: "0",
};

const totalText: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#3D1A0A",
  margin: "0",
};

const deliveryBox: React.CSSProperties = {
  backgroundColor: "#FDF6EE",
  borderRadius: "8px",
  padding: "20px",
  marginTop: "24px",
};

const deliveryDetail: React.CSSProperties = {
  fontSize: "14px",
  color: "#555555",
  margin: "0 0 8px 0",
  lineHeight: "1.5",
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
