"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error] Route-level hata:", error);
  }, [error]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: "#FDF6EE" }}
    >
      <div className="mx-auto max-w-md">
        {/* Icon */}
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(196, 112, 86, 0.1)" }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C47056"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1
          className="mb-3 text-2xl font-semibold"
          style={{ color: "#1a1a1a", fontFamily: "'Playfair Display', serif" }}
        >
          Bir sorun olustu
        </h1>

        <p className="mb-8 text-base" style={{ color: "#666" }}>
          Sayfayi yuklerken beklenmeyen bir hata olustu. Lutfen tekrar deneyin
          veya ana sayfaya donun.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "#C47056" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#b3624a")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#C47056")
            }
          >
            Tekrar Dene
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm font-medium transition-colors"
            style={{
              borderColor: "#C47056",
              color: "#C47056",
            }}
          >
            Ana Sayfa
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs" style={{ color: "#999" }}>
            Hata kodu: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
