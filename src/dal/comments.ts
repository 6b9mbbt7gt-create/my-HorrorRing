import { db } from '@/lib/db';
import { comments, posts } from '@/lib/db/schema';
import { eq, desc, and, count } from 'drizzle-orm';
import { generateId } from '@/lib/utils/uuid';

/**
 * コメント一覧を取得
 */
export async function getComments(postId: string) {
  return await db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt));
}

/**
 * コメントを作成
 */
export async function createComment(
  postId: string,
  userId: string,
  data: {
    content: string;
    parentId?: string;
  }
) {
  const id = generateId();
  const now = new Date().toISOString();

  await db.insert(comments).values({
    id,
    postId,
    userId,
    parentId: data.parentId,
    content: data.content,
    createdAt: now,
    updatedAt: now,
  });

  const [comment] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, id))
    .limit(1);

  // 投稿のコメント数を更新
  const [commentCountResult] = await db
    .select({ count: count() })
    .from(comments)
    .where(eq(comments.postId, postId));
  
  await db
    .update(posts)
    .set({
      commentCount: commentCountResult?.count || 0,
    })
    .where(eq(posts.id, postId));

  return comment;
}

/**
 * コメントを更新
 */
export async function updateComment(
  commentId: string,
  userId: string,
  content: string
) {
  const now = new Date().toISOString();

  const [comment] = await db
    .update(comments)
    .set({
      content,
      updatedAt: now,
    })
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
    .returning();

  return comment || null;
}

/**
 * コメントを削除
 */
export async function deleteComment(commentId: string, userId: string) {
  await db
    .delete(comments)
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));
}
