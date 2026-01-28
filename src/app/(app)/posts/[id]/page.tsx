import { redirect } from 'next/navigation';
import { getPostById } from '@/dal/posts';
import { getComments } from '@/dal/comments';
import { isLiked } from '@/dal/likes';
import { isHearted } from '@/dal/hearts';
import { getSession } from '@/lib/auth-server';
import { CommentList } from '@/components/posts/CommentList';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { PostActions } from '@/components/posts/PostActions';
import { formatRelativeTime } from '@/lib/utils/format';

type PostDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const post = await getPostById(id);
  if (!post) {
    redirect('/posts');
  }

  const comments = await getComments(id);
  const liked = await isLiked(id, session.user.id);
  const hearted = await isHearted(id, session.user.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/posts">
          <Button variant="secondary" size="sm">
            ← 戻る
          </Button>
        </Link>
      </div>

      <article className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{post.title}</h1>
            <p className="text-sm text-gray-400">
              @{post.userId.slice(0, 8)} • {formatRelativeTime(post.createdAt)}
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-purple-900 text-purple-300 rounded">
              {post.genre === 'game'
                ? 'ゲーム'
                : post.genre === 'haunted_spot'
                ? '心霊スポット'
                : '都市伝説'}
            </span>
            <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded">
              {post.postType === 'review'
                ? 'レビュー'
                : post.postType === 'experience'
                ? '体験談'
                : post.postType === 'photo'
                ? '写真'
                : '動画'}
            </span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none mb-6">
          <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
        </div>

        <PostActions
          postId={id}
          initialLiked={liked}
          initialHearted={hearted}
          likeCount={post.likeCount || 0}
          heartCount={post.heartCount || 0}
        />
      </article>

      <CommentList
        postId={id}
        comments={comments.map((c) => ({
          id: c.id,
          userId: c.userId,
          content: c.content,
          parentId: c.parentId,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        }))}
        currentUserId={session.user.id}
        onCommentSubmit={async () => {
          // ページをリロードしてコメントを再取得
          window.location.reload();
        }}
      />
    </div>
  );
}
