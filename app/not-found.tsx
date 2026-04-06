import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: "#FDF6EE" }}
    >
      <div className="mx-auto max-w-md">
        {/* 404 badge */}
        <div
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(196, 112, 86, 0.1)" }}
        >
          <span
            className="text-3xl font-bold"
            style={{ color: "#C47056", fontFamily: "'Playfair Display', serif" }}
          >
            404
          </span>
        </div>

        <h1
          className="mb-3 text-2xl font-semibold"
          style={{ color: "#1a1a1a", fontFamily: "'Playfair Display', serif" }}
        >
          Sayfa bulunamadi
        </h1>

        <p className="mb-8 text-base" style={{ color: "#666" }}>
          Aradiginiz sayfa mevcut degil veya tasindi. Asagidaki baglantilari
          kullanarak devam edebilirsiniz.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "#C47056" }}
          >
            Ana Sayfa
          </Link>

          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm font-medium transition-colors"
            style={{
              borderColor: "#C47056",
              color: "#C47056",
            }}
          >
            Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
