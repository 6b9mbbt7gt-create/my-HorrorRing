import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth-server';
import { getPosts } from '@/dal/posts';
import { PostList } from '@/components/posts/PostList';
import { Button } from '@/components/common/Button';

type PostsPageProps = {
  searchParams: Promise<{ genre?: string; page?: string }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const genre = params.genre as any;
  const page = parseInt(params.page || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  const posts = await getPosts({ limit, offset, genre });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">投稿一覧</h1>
        <Link href="/posts/new">
          <Button>新規投稿</Button>
        </Link>
      </div>

      {/* ジャンルフィルタ */}
      <div className="flex gap-2">
        <Link
          href="/posts"
          className={`px-4 py-2 rounded-lg transition-colors ${
            !genre
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          すべて
        </Link>
        <Link
          href="/posts?genre=game"
          className={`px-4 py-2 rounded-lg transition-colors ${
            genre === 'game'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          ゲーム
        </Link>
        <Link
          href="/posts?genre=haunted_spot"
          className={`px-4 py-2 rounded-lg transition-colors ${
            genre === 'haunted_spot'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          心霊スポット
        </Link>
        <Link
          href="/posts?genre=urban_legend"
          className={`px-4 py-2 rounded-lg transition-colors ${
            genre === 'urban_legend'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          都市伝説
        </Link>
      </div>

      <PostList
        posts={posts.map((p) => ({
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
    </div>
  );
}
