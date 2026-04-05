import { google } from "googleapis";

interface SearchPerformanceRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export async function getSearchPerformance(
  startDate: string,
  endDate: string
): Promise<SearchPerformanceRow[]> {
  try {
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      return [];
    }

    const credentials = JSON.parse(serviceAccountKey);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });

    const searchconsole = google.searchconsole({ version: "v1", auth });

    const siteUrl = process.env.GOOGLE_SITE_URL || "https://yaseminsatelier.com";

    const response = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 25,
      },
    });

    if (!response.data.rows) {
      return [];
    }

    return response.data.rows.map((row) => ({
      keys: row.keys ?? [],
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }));
  } catch (error) {
    console.error("Search Console API hatasi:", error);
    return [];
  }
}
