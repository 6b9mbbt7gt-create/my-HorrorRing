'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-6 text-center">
        <h2 className="text-2xl font-bold text-white">エラーが発生しました</h2>
        <p className="text-gray-400">{error.message}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            再試行
          </button>
          <a
            href="/"
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            トップへ戻る
          </a>
        </div>
      </div>
    </div>
  );
}
