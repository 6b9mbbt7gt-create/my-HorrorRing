import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';
import { getUserById } from '@/dal/users';
import Link from 'next/link';

export default async function DeveloperPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await getUserById(session.user.id);
  const isAdmin = user && 'role' in user && user.role === 'admin';
  if (!isAdmin) redirect('/dashboard');

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">開発者ページ</h1>
      <p className="text-gray-400 mb-6">
        API・開発向けの情報やリンクをまとめます。
      </p>
      <ul className="space-y-3 text-gray-300">
        <li>
          <Link href="/api/auth/route" className="text-purple-400 hover:underline" target="_blank" rel="noopener">
            /api/auth
          </Link>
          — 認証（betterAuth）
        </li>
        <li>
          <code className="text-amber-300">GET /api/posts</code> — 投稿一覧
        </li>
        <li>
          <code className="text-amber-300">GET /api/search?q=...</code> — 検索
        </li>
        <li>
          <code className="text-amber-300">GET /api/users/me</code> — 自分のユーザー情報（要認証）
        </li>
      </ul>
      <p className="mt-6 text-gray-500 text-sm">
        詳細は <code>docs/api-design.md</code> を参照してください。
      </p>
      <p className="mt-6">
        <Link href="/dashboard" className="text-purple-400 hover:underline">
          ← ダッシュボードへ
        </Link>
      </p>
    </div>
  );
}
