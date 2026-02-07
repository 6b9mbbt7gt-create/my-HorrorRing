import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';
import { getUserById } from '@/dal/users';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await getUserById(session.user.id);
  const isAdmin = user && 'role' in user && user.role === 'admin';
  if (!isAdmin) redirect('/dashboard');

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">管理者ページ</h1>
      <p className="text-gray-400 mb-6">
        管理者用の管理機能はここに追加できます（ユーザー管理、モデレーション、統計など）。
      </p>
      <ul className="list-disc list-inside text-gray-300 space-y-2">
        <li>管理者タブは <code className="text-purple-400">role === &quot;admin&quot;</code> のユーザーにのみ表示されます。</li>
        <li>管理者は他人の投稿も削除できます（投稿詳細の削除は別途UIを追加する必要があります）。</li>
      </ul>
      <p className="mt-6">
        <Link href="/dashboard" className="text-purple-400 hover:underline">
          ← ダッシュボードへ
        </Link>
      </p>
    </div>
  );
}
