import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';
import { getUserById } from '@/dal/users';
import { getPosts } from '@/dal/posts';
import { getFollowerCount, getFollowingCount, isFollowing } from '@/dal/follows';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { PostList } from '@/components/posts/PostList';
import { FollowButton } from '@/components/profile/FollowButton';

type UserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserPage({ params }: UserPageProps) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const { id } = await params;
  const user = await getUserById(id);
  if (!user) {
    redirect('/profile');
  }

  const posts = await getPosts({ userId: id, limit: 20 });
  const followerCount = await getFollowerCount(id);
  const followingCount = await getFollowingCount(id);
  const following = await isFollowing(session.user.id, id);
  const isOwnProfile = session.user.id === id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProfileHeader
        user={{
          id: user.id,
          email: user.email,
          name: user.name || null,
          image: user.image || null,
          username: user.username || null,
          bio: user.bio || null,
          language: user.language || 'ja',
          planType: (user.planType as 'free' | 'premium') || 'free',
          planExpiresAt: user.planExpiresAt ? new Date(user.planExpiresAt) : null,
        }}
        followerCount={followerCount}
        followingCount={followingCount}
        postCount={posts.length}
        isOwnProfile={isOwnProfile}
        followButton={
          !isOwnProfile ? (
            <FollowButton userId={id} initialFollowing={following} />
          ) : undefined
        }
      />

      <ProfileTabs
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
