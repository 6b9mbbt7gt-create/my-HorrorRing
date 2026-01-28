import { db } from '@/lib/db';
import { likes, posts } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { generateId } from '@/lib/utils/uuid';

/**
 * いいねを追加/削除（トグル）
 */
export async function toggleLike(postId: string, userId: string) {
  // 既存のいいねを確認
  const [existing] = await db
    .select()
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
    .limit(1);

  if (existing) {
    // いいねを削除
    await db
      .delete(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));

    // 投稿のいいね数を更新
    const [likeCountResult] = await db
      .select({ count: count() })
      .from(likes)
      .where(eq(likes.postId, postId));
    
    await db
      .update(posts)
      .set({
        likeCount: likeCountResult?.count || 0,
      })
      .where(eq(posts.id, postId));

    return { liked: false };
  } else {
    // いいねを追加
    const id = generateId();
    const now = new Date().toISOString();

    await db.insert(likes).values({
      id,
      postId,
      userId,
      createdAt: now,
    });

    // 投稿のいいね数を更新
    const [likeCountResult] = await db
      .select({ count: count() })
      .from(likes)
      .where(eq(likes.postId, postId));
    
    await db
      .update(posts)
      .set({
        likeCount: likeCountResult?.count || 0,
      })
      .where(eq(posts.id, postId));

    return { liked: true };
  }
}

/**
 * ユーザーがいいねしているか確認
 */
export async function isLiked(postId: string, userId: string): Promise<boolean> {
  const [like] = await db
    .select()
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
    .limit(1);

  return !!like;
}
