import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  brand: { fontSize: 18, fontWeight: "bold", color: "#3D1A0A" },
  brandSub: { fontSize: 8, color: "#6B3520", marginTop: 2 },
  invoiceTitle: { fontSize: 14, fontWeight: "bold", color: "#B8975C", textAlign: "right" },
  invoiceMeta: { fontSize: 9, color: "#555", textAlign: "right", marginTop: 3 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#E8D5A3", marginVertical: 15 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  col: { width: "48%" },
  label: { fontSize: 8, color: "#999", marginBottom: 3, textTransform: "uppercase" },
  value: { fontSize: 10, color: "#333", marginBottom: 2 },
  tableHeader: {
    flexDirection: "row", backgroundColor: "#F9F3E8", padding: 8, borderRadius: 3,
    marginBottom: 4,
  },
  tableRow: { flexDirection: "row", padding: 8, borderBottomWidth: 0.5, borderBottomColor: "#eee" },
  colProduct: { width: "45%" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "20%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },
  headerText: { fontSize: 8, fontWeight: "bold", color: "#6B3520" },
  cellText: { fontSize: 9, color: "#333" },
  summaryRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 4 },
  summaryLabel: { width: 120, textAlign: "right", fontSize: 9, color: "#666", paddingRight: 10 },
  summaryValue: { width: 80, textAlign: "right", fontSize: 9, color: "#333" },
  totalRow: {
    flexDirection: "row", justifyContent: "flex-end", marginTop: 8,
    paddingTop: 8, borderTopWidth: 1, borderTopColor: "#B8975C",
  },
  totalLabel: { width: 120, textAlign: "right", fontSize: 11, fontWeight: "bold", color: "#3D1A0A", paddingRight: 10 },
  totalValue: { width: 80, textAlign: "right", fontSize: 11, fontWeight: "bold", color: "#3D1A0A" },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", fontSize: 7, color: "#999" },
})

interface InvoiceItem {
  name: string
  variantName?: string | null
  quantity: number
  price: number
  total: number
}

interface InvoiceData {
  invoiceNo: string
  issuedAt: string
  billingName: string
  billingEmail: string
  billingAddress?: string | null
  companyName?: string | null
  taxNumber?: string | null
  items: InvoiceItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  taxRate: number
  taxAmount: number
  total: number
}

export function InvoicePDF({ data }: { data: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Yasemin&apos;s Atelier</Text>
            <Text style={styles.brandSub}>Gastronomi Atölyesi</Text>
            <Text style={styles.brandSub}>İstanbul, Türkiye</Text>
            <Text style={styles.brandSub}>hello@yaseminsatelier.com</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>FATURA</Text>
            <Text style={styles.invoiceMeta}>No: {data.invoiceNo}</Text>
            <Text style={styles.invoiceMeta}>Tarih: {data.issuedAt}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Billing Info */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Fatura Adresi</Text>
            <Text style={styles.value}>{data.billingName}</Text>
            <Text style={styles.value}>{data.billingEmail}</Text>
            {data.billingAddress && <Text style={styles.value}>{data.billingAddress}</Text>}
          </View>
          {data.companyName && (
            <View style={styles.col}>
              <Text style={styles.label}>Şirket Bilgileri</Text>
              <Text style={styles.value}>{data.companyName}</Text>
              {data.taxNumber && <Text style={styles.value}>Vergi No: {data.taxNumber}</Text>}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Items Table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.colProduct]}>Ürün</Text>
          <Text style={[styles.headerText, styles.colQty]}>Adet</Text>
          <Text style={[styles.headerText, styles.colPrice]}>Birim Fiyat</Text>
          <Text style={[styles.headerText, styles.colTotal]}>Toplam</Text>
        </View>

        {data.items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.cellText, styles.colProduct]}>
              {item.name}{item.variantName ? ` (${item.variantName})` : ""}
            </Text>
            <Text style={[styles.cellText, styles.colQty]}>{item.quantity}</Text>
            <Text style={[styles.cellText, styles.colPrice]}>{item.price.toFixed(2)}₺</Text>
            <Text style={[styles.cellText, styles.colTotal]}>{item.total.toFixed(2)}₺</Text>
          </View>
        ))}

        {/* Summary */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ara Toplam</Text>
            <Text style={styles.summaryValue}>{data.subtotal.toFixed(2)}₺</Text>
          </View>
          {data.deliveryFee > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Kargo</Text>
              <Text style={styles.summaryValue}>{data.deliveryFee.toFixed(2)}₺</Text>
            </View>
          )}
          {data.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>İndirim</Text>
              <Text style={styles.summaryValue}>-{data.discount.toFixed(2)}₺</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>KDV (%{(data.taxRate * 100).toFixed(0)})</Text>
            <Text style={styles.summaryValue}>{data.taxAmount.toFixed(2)}₺</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOPLAM</Text>
            <Text style={styles.totalValue}>{data.total.toFixed(2)}₺</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Bu fatura elektronik ortamda oluşturulmuştur. Yasemin&apos;s Atelier — yaseminsatelier.com
        </Text>
      </Page>
    </Document>
  )
}
