export function generateOrderTemplate(): string {
  const headers = [
    "alici_adi",
    "alici_telefon",
    "teslimat_adresi",
    "ilce",
    "urun_kodu_1",
    "miktar_1",
    "urun_kodu_2",
    "miktar_2",
    "notlar",
  ];

  const exampleRow = [
    "Ayse Yilmaz",
    "05321234567",
    "Bagdat Cad. No:123 D:4",
    "Kadikoy",
    "KURABIYE-001",
    "2",
    "PASTA-005",
    "1",
    "Hediye paketi yapilsin",
  ];

  return [headers.join(","), exampleRow.join(",")].join("\n");
}
