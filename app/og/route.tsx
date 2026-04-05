import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Yasemin's Atelier";
  const subtitle =
    searchParams.get("subtitle") || "Istanbul Butik Gastronomi";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          fontFamily: "sans-serif",
        }}
      >
        {/* Left panel — 60% */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "60%",
            height: "100%",
            backgroundColor: "#3D1A0A",
            padding: "60px",
          }}
        >
          {/* Gold brand label */}
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 700,
              color: "#D4A574",
              letterSpacing: "4px",
              textTransform: "uppercase" as const,
              marginBottom: "24px",
            }}
          >
            YASEMIN&apos;S ATELIER
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: 52,
              fontWeight: 700,
              color: "#FAF7F2",
              lineHeight: 1.2,
              marginBottom: "20px",
              maxWidth: "580px",
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#D4A574",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Right panel — 40% */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40%",
            height: "100%",
            backgroundColor: "#C4622D",
          }}
        >
          {/* Decorative star */}
          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            fill="none"
          >
            <path
              d="M90 0L101.5 66.5L168 45L113.5 90L168 135L101.5 113.5L90 180L78.5 113.5L12 135L66.5 90L12 45L78.5 66.5L90 0Z"
              fill="#D4A574"
              opacity="0.9"
            />
          </svg>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
