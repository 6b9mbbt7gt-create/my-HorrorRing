import { createAuthClient } from 'better-auth/react';

/**
 * ブラウザでは現在のオリジンを使う（ポート3002などで起動しても正しく動く）
 * SSR時のみ env を使用
 */
function getBaseURL(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});
