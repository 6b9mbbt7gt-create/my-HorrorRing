import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-6 text-center">
        <h2 className="text-3xl font-bold text-white">404</h2>
        <p className="text-gray-400">ページが見つかりませんでした</p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          トップへ戻る
        </Link>
      </div>
    </div>
  );
}
