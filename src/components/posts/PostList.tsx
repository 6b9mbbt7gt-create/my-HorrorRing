import { PostCard } from './PostCard';

type PostListProps = {
  posts: Array<{
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
  }>;
  showUser?: boolean;
};

export function PostList({ posts, showUser = true }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">投稿がまだありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} showUser={showUser} />
      ))}
    </div>
  );
}
