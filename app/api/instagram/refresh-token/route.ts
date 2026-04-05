import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Cron secret kontrolu
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 401 });
    }

    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Instagram access token bulunamadi" },
        { status: 500 }
      );
    }

    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Instagram token yenileme hatasi:", errorData);
      return NextResponse.json(
        { error: "Token yenilenemedi" },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log(
      "Instagram token yenilendi. Yeni sure:",
      data.expires_in,
      "saniye"
    );

    return NextResponse.json({
      success: true,
      expires_in: data.expires_in,
    });
  } catch (error) {
    console.error("Instagram token yenileme hatasi:", error);
    return NextResponse.json(
      { error: "Token yenileme basarisiz" },
      { status: 500 }
    );
  }
}
