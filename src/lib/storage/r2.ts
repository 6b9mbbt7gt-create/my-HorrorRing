import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare R2 のエンドポイント（R2_ENDPOINT 未設定時は R2_ACCOUNT_ID から生成）
function getR2Endpoint(): string {
  if (process.env.R2_ENDPOINT?.trim()) {
    return process.env.R2_ENDPOINT.trim();
  }
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  if (accountId) {
    return `https://${accountId}.r2.cloudflarestorage.com`;
  }
  return '';
}

const r2Endpoint = getR2Endpoint();

// Cloudflare R2はS3互換APIを使用（endpoint が空だと AWS の s3.auto.amazonaws.com に繋がり ENOTFOUND になる）
const r2Client = new S3Client({
  region: 'auto',
  ...(r2Endpoint && {
    endpoint: r2Endpoint,
    forcePathStyle: true,
  }),
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || '';

function ensureR2Config(): void {
  if (!r2Endpoint) {
    throw new Error(
      'R2が設定されていません。.env.local に R2_ENDPOINT または R2_ACCOUNT_ID を設定してください。'
    );
  }
  if (!BUCKET_NAME) {
    throw new Error(
      'R2_BUCKET_NAME が設定されていません。.env.local を確認してください。'
    );
  }
}

/**
 * 画像をR2にアップロード
 */
export async function uploadImage(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  ensureR2Config();
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
  ensureR2Config();
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
  ensureR2Config();
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}
