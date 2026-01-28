import { db } from '@/lib/db';
import { follows, users } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { generateId } from '@/lib/utils/uuid';

/**
 * フォロー/アンフォロー（トグル）
 */
export async function toggleFollow(
  followerId: string,
  followingId: string
) {
  if (followerId === followingId) {
    throw new Error('Cannot follow yourself');
  }

  // 既存のフォローを確認
  const [existing] = await db
    .select()
    .from(follows)
    .where(
      and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      )
    )
    .limit(1);

  if (existing) {
    // アンフォロー
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId)
        )
      );

    return { following: false };
  } else {
    // フォロー
    const id = generateId();
    const now = new Date().toISOString();

    await db.insert(follows).values({
      id,
      followerId,
      followingId,
      createdAt: now,
    });

    return { following: true };
  }
}

/**
 * フォロー中か確認
 */
export async function isFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const [follow] = await db
    .select()
    .from(follows)
    .where(
      and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      )
    )
    .limit(1);

  return !!follow;
}

/**
 * フォロワー数を取得
 */
export async function getFollowerCount(userId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(follows)
    .where(eq(follows.followingId, userId));

  return result?.count || 0;
}

/**
 * フォロー中数を取得
 */
export async function getFollowingCount(userId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(follows)
    .where(eq(follows.followerId, userId));

  return result?.count || 0;
}
