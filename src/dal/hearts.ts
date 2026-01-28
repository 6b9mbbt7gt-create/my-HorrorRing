import { db } from '@/lib/db';
import { hearts, posts } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { generateId } from '@/lib/utils/uuid';

/**
 * ハートを追加/削除（トグル）
 */
export async function toggleHeart(postId: string, userId: string) {
  // 既存のハートを確認
  const [existing] = await db
    .select()
    .from(hearts)
    .where(and(eq(hearts.postId, postId), eq(hearts.userId, userId)))
    .limit(1);

  if (existing) {
    // ハートを削除
    await db
      .delete(hearts)
      .where(and(eq(hearts.postId, postId), eq(hearts.userId, userId)));

    // 投稿のハート数を更新
    const [heartCountResult] = await db
      .select({ count: count() })
      .from(hearts)
      .where(eq(hearts.postId, postId));
    
    await db
      .update(posts)
      .set({
        heartCount: heartCountResult?.count || 0,
      })
      .where(eq(posts.id, postId));

    return { hearted: false };
  } else {
    // ハートを追加
    const id = generateId();
    const now = new Date().toISOString();

    await db.insert(hearts).values({
      id,
      postId,
      userId,
      createdAt: now,
    });

    // 投稿のハート数を更新
    const [heartCountResult] = await db
      .select({ count: count() })
      .from(hearts)
      .where(eq(hearts.postId, postId));
    
    await db
      .update(posts)
      .set({
        heartCount: heartCountResult?.count || 0,
      })
      .where(eq(posts.id, postId));

    return { hearted: true };
  }
}

/**
 * ユーザーがハートしているか確認
 */
export async function isHearted(
  postId: string,
  userId: string
): Promise<boolean> {
  const [heart] = await db
    .select()
    .from(hearts)
    .where(and(eq(hearts.postId, postId), eq(hearts.userId, userId)))
    .limit(1);

  return !!heart;
}
