import type { Metadata } from "next";
import CheckoutPage from "@/components/site/checkout/CheckoutPage";

export const metadata: Metadata = {
  title: "Sipariş Tamamla",
  robots: { index: false },
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
