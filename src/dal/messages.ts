import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { eq, or, desc, and } from 'drizzle-orm';

/**
 * 自分が送受信したDM一覧を取得（直近の会話相手ごとに最新1件）
 */
export async function getRecentMessagesForUser(userId: string, limit = 20) {
  return await db
    .select()
    .from(messages)
    .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}

/**
 * 特定ユーザーとのDMスレッドを取得
 */
export async function getConversation(
  userId: string,
  otherUserId: string,
  limit = 50
) {
  return await db
    .select()
    .from(messages)
    .where(
      or(
        and(
          eq(messages.senderId, userId),
          eq(messages.receiverId, otherUserId)
        ),
        and(
          eq(messages.senderId, otherUserId),
          eq(messages.receiverId, userId)
        )
      )
    )
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}
