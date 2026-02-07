import { NextResponse } from 'next/server';

/**
 * Google OAuth でサーバーが実際に使うリダイレクトURIを返す（設定確認用）
 * GET /api/auth/callback-url
 */
export async function GET() {
  const baseURL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || '';
  const redirectUri = baseURL ? `${baseURL.replace(/\/$/, '')}/api/auth/callback/google` : '';
  return NextResponse.json({
    redirectUri,
    baseURL,
    message: redirectUri
      ? 'Google Cloud Console の「認証済みのリダイレクト URI」に上記 redirectUri を1文字も違わず追加してください。'
      : 'BETTER_AUTH_URL または NEXT_PUBLIC_APP_URL を .env.local に設定してください。',
  });
}
