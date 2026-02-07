import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth-server';
import { getPosts, getPostsByUserIds } from '@/dal/posts';
import { getFollowingIds } from '@/dal/follows';
import { getUsersByIds } from '@/dal/users';
import { getRecentMessagesForUser } from '@/dal/messages';
import { PostList } from '@/components/posts/PostList';
import { TimelineNotifications } from '@/components/timeline/TimelineNotifications';

function toAuthorDisplayName(name: string | null, username: string | null): string {
  if (name && name.trim()) return name.trim();
  if (username && username.trim()) return `@${username.trim()}`;
  return '名無し';
}

export default async function TimelinePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const limit = 15;
  const [recommendedPosts, followingIds, recentMessages] = await Promise.all([
    getPosts({ limit }),
    getFollowingIds(session.user.id),
    getRecentMessagesForUser(session.user.id, 20),
  ]);

  const followingPosts =
    followingIds.length > 0
      ? await getPostsByUserIds(followingIds, { limit })
      : [];

  const allAuthorIds = new Set<string>();
  recommendedPosts.forEach((p) => allAuthorIds.add(p.userId));
  followingPosts.forEach((p) => allAuthorIds.add(p.userId));
  recentMessages.forEach((m) => {
    allAuthorIds.add(m.senderId);
    allAuthorIds.add(m.receiverId);
  });
  const authorUsers = await getUsersByIds([...allAuthorIds]);
  const authorNames: Record<string, string> = {};
  authorUsers.forEach((u) => {
    authorNames[u.id] = toAuthorDisplayName(u.name, u.username);
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">タイムライン</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 左: おすすめ */}
        <section className="bg-gray-900 border border-gray-800 rounded-lg p-4 min-h-[400px] flex flex-col">
          <h2 className="text-sm font-bold text-purple-300 mb-3 border-b border-gray-700 pb-2">
            おすすめ
          </h2>
          <p className="text-gray-500 text-xs mb-3">投稿されてきた内容</p>
          <div className="flex-1 overflow-y-auto min-h-0">
            <PostList
              posts={recommendedPosts.map((p) => ({
                id: p.id,
                userId: p.userId,
                title: p.title,
                content: p.content,
                postType: p.postType as 'review' | 'experience' | 'photo' | 'video',
                genre: p.genre as 'game' | 'haunted_spot' | 'urban_legend',
                genreId: p.genreId ?? undefined,
                visibility: (p.visibility as 'public' | 'private' | 'friends' | 'limited') ?? 'public',
                likeCount: p.likeCount ?? 0,
                heartCount: p.heartCount ?? 0,
                commentCount: p.commentCount ?? 0,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
              }))}
              authorNames={authorNames}
              showUser={true}
            />
          </div>
        </section>

        {/* 中央: フォロー中の投稿 */}
        <section className="bg-gray-900 border border-gray-800 rounded-lg p-4 min-h-[400px] flex flex-col">
          <h2 className="text-sm font-bold text-amber-300 mb-3 border-b border-gray-700 pb-2">
            フォロー中
          </h2>
          <p className="text-gray-500 text-xs mb-3">フォローしている人の投稿</p>
          <div className="flex-1 overflow-y-auto min-h-0">
            <PostList
              posts={followingPosts.map((p) => ({
                id: p.id,
                userId: p.userId,
                title: p.title,
                content: p.content,
                postType: p.postType as 'review' | 'experience' | 'photo' | 'video',
                genre: p.genre as 'game' | 'haunted_spot' | 'urban_legend',
                genreId: p.genreId ?? undefined,
                visibility: (p.visibility as 'public' | 'private' | 'friends' | 'limited') ?? 'public',
                likeCount: p.likeCount ?? 0,
                heartCount: p.heartCount ?? 0,
                commentCount: p.commentCount ?? 0,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
              }))}
              authorNames={authorNames}
              showUser={true}
            />
          </div>
        </section>

        {/* 右: 通知 */}
        <section className="bg-gray-900 border border-gray-800 rounded-lg p-4 min-h-[400px] flex flex-col">
          <h2 className="text-sm font-bold text-red-300 mb-3 border-b border-gray-700 pb-2">
            通知
          </h2>
          <p className="text-gray-500 text-xs mb-3">いいね・ぞくぞくなど</p>
          <div className="flex-1 overflow-y-auto min-h-0">
            <TimelineNotifications />
          </div>
        </section>

        {/* 一番右: DM */}
        <section className="bg-gray-900 border border-gray-800 rounded-lg p-4 min-h-[400px] flex flex-col">
          <h2 className="text-sm font-bold text-cyan-300 mb-3 border-b border-gray-700 pb-2">
            DM
          </h2>
          <p className="text-gray-500 text-xs mb-3">ダイレクトメッセージ</p>
          <div className="flex-1 overflow-y-auto min-h-0">
            {recentMessages.length === 0 ? (
              <p className="text-gray-500 text-sm">DMはまだありません</p>
            ) : (
              <ul className="space-y-2">
                {recentMessages.map((m) => {
                  const isFromMe = m.senderId === session.user.id;
                  const otherId = isFromMe ? m.receiverId : m.senderId;
                  const otherName = authorNames[otherId] ?? 'ユーザー';
                  return (
                    <li key={m.id} className="text-sm">
                      <Link
                        href={`/users/${otherId}`}
                        className="text-gray-300 hover:text-cyan-300 block rounded p-2 bg-gray-800/50"
                      >
                        <span className="text-gray-500">
                          {isFromMe ? '→' : '←'} {otherName}
                        </span>
                        <p className="text-gray-300 truncate mt-0.5">{m.content}</p>
                        <span className="text-gray-500 text-xs">
                          {new Date(m.createdAt).toLocaleString('ja-JP', {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
