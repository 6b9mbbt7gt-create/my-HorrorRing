import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare R2はS3互換APIを使用
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || '',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || '';

/**
 * 画像をR2にアップロード
 */
export async function uploadImage(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const key = `images/${Date.now()}-${filename}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  // R2の公開URLを返す（カスタムドメインまたはR2の公開URL）
  const publicUrl = process.env.R2_PUBLIC_URL || '';
  return `${publicUrl}/${key}`;
}

/**
 * 動画をR2にアップロード
 */
export async function uploadVideo(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const key = `videos/${Date.now()}-${filename}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  const publicUrl = process.env.R2_PUBLIC_URL || '';
  return `${publicUrl}/${key}`;
}

/**
 * ファイルをR2から削除
 */
export async function deleteFile(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}
