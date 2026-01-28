import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth-server';
import { getPosts } from '@/dal/posts';
import { getFollowerCount, getFollowingCount } from '@/dal/follows';
import { PostList } from '@/components/posts/PostList';
import { Button } from '@/components/common/Button';
import { TrendingUp, Users, MessageSquare, Heart } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  // 最新の投稿を取得
  const recentPosts = await getPosts({ limit: 10 });
  
  // 統計情報（簡易版）
  const stats = {
    posts: recentPosts.length,
    followers: await getFollowerCount(session.user.id),
    following: await getFollowingCount(session.user.id),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">ダッシュボード</h1>
        <Link href="/posts/new">
          <Button>新規投稿</Button>
        </Link>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm text-gray-400">投稿数</h3>
          </div>
          <p className="text-2xl font-bold text-white">{stats.posts}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm text-gray-400">フォロワー</h3>
          </div>
          <p className="text-2xl font-bold text-white">{stats.followers}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm text-gray-400">フォロー中</h3>
          </div>
          <p className="text-2xl font-bold text-white">{stats.following}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm text-gray-400">人気投稿</h3>
          </div>
          <p className="text-2xl font-bold text-white">-</p>
        </div>
      </div>

      {/* 最新投稿 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">最新投稿</h2>
          <Link href="/posts">
            <Button variant="secondary" size="sm">
              すべて見る
            </Button>
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <PostList
            posts={recentPosts.map((p) => ({
              id: p.id,
              userId: p.userId,
              title: p.title,
              content: p.content,
              postType: p.postType as 'review' | 'experience' | 'photo' | 'video',
              genre: p.genre as 'game' | 'haunted_spot' | 'urban_legend',
              genreId: p.genreId || undefined,
              visibility: p.visibility as 'public' | 'private' | 'friends' | 'limited',
              likeCount: p.likeCount || 0,
              heartCount: p.heartCount || 0,
              commentCount: p.commentCount || 0,
              createdAt: p.createdAt,
              updatedAt: p.updatedAt,
            }))}
          />
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">まだ投稿がありません</p>
            <Link href="/posts/new">
              <Button>最初の投稿を作成</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
