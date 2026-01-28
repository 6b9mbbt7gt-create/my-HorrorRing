import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth-server';
import { LogoutButton } from '@/components/common/LogoutButton';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認証チェック
  try {
    const session = await getSession();
    if (!session) {
      redirect('/login');
    }
  } catch (error) {
    // 認証エラーの場合はログインページへ
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <header className="border-b border-gray-800">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-xl font-bold text-purple-400">
              HorrorRing
            </Link>
            <div className="flex gap-4 items-center">
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-white transition-colors"
              >
                ダッシュボード
              </Link>
              <Link
                href="/posts"
                className="text-gray-300 hover:text-white transition-colors"
              >
                投稿
              </Link>
              <Link
                href="/profile"
                className="text-gray-300 hover:text-white transition-colors"
              >
                プロフィール
              </Link>
              <Link
                href="/search"
                className="text-gray-300 hover:text-white transition-colors"
              >
                検索
              </Link>
              <NotificationBell />
              <LogoutButton />
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
