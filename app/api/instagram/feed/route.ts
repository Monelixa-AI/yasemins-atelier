import { NextResponse } from "next/server";

export const revalidate = 3600; // 1 saat cache

interface InstagramPost {
  id: string;
  caption?: string;
  media_url: string;
  media_type: string;
  permalink: string;
  timestamp: string;
}

export async function GET() {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;

    if (!accessToken || !userId) {
      return NextResponse.json(
        { error: "Instagram yapilandirmasi eksik" },
        { status: 500 }
      );
    }

    const fields = "id,caption,media_url,media_type,permalink,timestamp";
    const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=25&access_token=${accessToken}`;

    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Instagram API hatasi:", errorData);
      return NextResponse.json(
        { error: "Instagram verisi alinamadi" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Sadece IMAGE ve CAROUSEL_ALBUM tiplerini filtrele (VIDEO haric)
    const posts = (data.data as InstagramPost[])
      .filter(
        (post) =>
          post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM"
      )
      .map((post) => ({
        id: post.id,
        caption: post.caption || "",
        media_url: post.media_url,
        permalink: post.permalink,
        timestamp: post.timestamp,
      }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Instagram feed hatasi:", error);
    return NextResponse.json(
      { error: "Instagram feed alinamadi" },
      { status: 500 }
    );
  }
}
