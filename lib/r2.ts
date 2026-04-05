import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

/* ------------------------------------------------------------------ */
/*  S3-uyumlu Cloudflare R2 Client                                     */
/* ------------------------------------------------------------------ */
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET || "yasemins-atelier";
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || "";

/* ------------------------------------------------------------------ */
/*  Upload                                                             */
/* ------------------------------------------------------------------ */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string
): Promise<string> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  // Public URL dondur
  if (PUBLIC_URL) {
    return `${PUBLIC_URL}/${key}`;
  }

  // Fallback: endpoint-based URL
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT!;
  return `${endpoint}/${BUCKET}/${key}`;
}

/* ------------------------------------------------------------------ */
/*  Delete                                                             */
/* ------------------------------------------------------------------ */
export async function deleteFromR2(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}
