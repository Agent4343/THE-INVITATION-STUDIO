import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let _s3: S3Client | null = null;

function getS3() {
  if (!_s3) {
    _s3 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return _s3;
}

function getBucket() {
  return process.env.R2_BUCKET_NAME!;
}

/**
 * Upload a PDF buffer to R2 and return the object key.
 */
export async function uploadPdf(
  key: string,
  buffer: Buffer,
): Promise<string> {
  await getS3().send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: buffer,
      ContentType: "application/pdf",
    }),
  );

  return key;
}

/**
 * Generate a signed download URL that expires in 7 days.
 */
export async function getSignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: key,
  });

  const url = await getSignedUrl(getS3(), command, {
    expiresIn: 7 * 24 * 60 * 60,
  });

  return url;
}
