import Link from 'next/link';
import { formatRelativeTime, getAuthorDisplayName } from '@/lib/utils/format';

type PostCardProps = {
  post: {
    id: string;
    userId: string;
    title: string;
    content: string;
    postType: 'review' | 'experience' | 'photo' | 'video';
    genre: 'game' | 'haunted_spot' | 'urban_legend';
    genreId?: string;
    visibility: 'public' | 'private' | 'friends' | 'limited';
    likeCount: number;
    heartCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
  };
  /** 投稿者表示名（表示名 or @ユーザー名。メールは含めない） */
  authorDisplayName?: string | null;
  showUser?: boolean;
};

export function PostCard({ post, authorDisplayName, showUser = true }: PostCardProps) {
  return (
    <article className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-purple-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link href={`/posts/${post.id}`}>
            <h3 className="text-xl font-bold text-white hover:text-purple-400 transition-colors mb-2">
              {post.title}
            </h3>
          </Link>
          {showUser && (
            <p className="text-sm text-gray-400">
              {getAuthorDisplayName(post.userId, authorDisplayName)} • {formatRelativeTime(post.createdAt)}
            </p>
          )}
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

      <p className="text-gray-300 mb-4 line-clamp-3">{post.content}</p>

      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>💜 {post.heartCount}</span>
        <span>👍 {post.likeCount}</span>
        <span>💬 {post.commentCount}</span>
      </div>
    </article>
  );
}
