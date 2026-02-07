'use client';

import { useState, useEffect, useRef } from 'react';
import { authClient } from '@/lib/auth-client';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [slowRedirect, setSlowRedirect] = useState(false);
  const [origin, setOrigin] = useState<string>('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setSlowRedirect(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // 5秒経っても画面が切り替わらなければ「遅れています」を表示し、再試行できるようにする
    timeoutRef.current = setTimeout(() => {
      setSlowRedirect(true);
      setIsLoading(false);
      timeoutRef.current = null;
    }, 5000);

    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch (error) {
      console.error('Login error:', error);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsLoading(false);
      setSlowRedirect(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">ログイン</h1>
          <p className="text-gray-400">
            HorrorRingにログインして、ホラーコンテンツの世界を楽しもう
          </p>
        </div>

        {slowRedirect && (
          <p className="text-center text-sm text-amber-400 bg-amber-950/30 border border-amber-800/50 rounded-lg py-2 px-3">
            リダイレクトが遅れています。もう一度ボタンを押すか、ポップアップがブロックされていないか確認してください。
          </p>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-white hover:bg-gray-100 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-gray-900 rounded-lg transition-colors flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="border-white border-t-transparent flex-shrink-0" />
              <span>ログイン中...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Googleでログイン</span>
            </>
          )}
        </button>

        {isLoading && (
          <p className="text-center text-sm text-gray-500">
            Googleのページに移動しています...
          </p>
        )}

        <div className="text-center">
          <a
            href="/age-verification"
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            初めての方はこちら（年齢確認）
          </a>
        </div>

        {origin && (
          <details className="mt-4 text-left">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
              エラー 400: redirect_uri_mismatch のとき
            </summary>
            <div className="mt-2 p-3 bg-gray-800/80 rounded-lg text-xs text-gray-400 space-y-3">
              <p className="font-medium text-amber-200/90">サーバーがGoogleに送っているURIを必ず確認してください:</p>
              <p>ブラウザで <a href={`${origin}/api/auth/callback-url`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline break-all">{origin}/api/auth/callback-url</a> を開き、表示された <code className="text-purple-300">redirectUri</code> の値を<strong>そのまま</strong>コピーして、Google Cloud Console の「認証済みのリダイレクト URI」に追加してください。</p>
              <p className="font-medium text-gray-300 mt-2">あわせて設定:</p>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li>「認証済みの JavaScript 生成元」に <code className="text-purple-300">{origin}</code> を追加</li>
                <li>.env.local の <code className="text-purple-300">BETTER_AUTH_URL</code> を <code className="text-purple-300">{origin}</code> にし、保存してから開発サーバーを再起動</li>
              </ul>
              <p className="text-gray-500 mt-2">※ 保存後1〜2分してから再度ログインを試してください。</p>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
