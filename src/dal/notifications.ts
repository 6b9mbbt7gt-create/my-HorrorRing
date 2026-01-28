import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { generateId } from '@/lib/utils/uuid';
import type { NotificationType } from '@/lib/types';

/**
 * 通知一覧を取得
 */
export async function getNotifications(userId: string, limit = 20) {
  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

/**
 * 未読通知数を取得
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const allNotifications = await db
    .select()
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

  return allNotifications.length;
}

/**
 * 通知を作成
 */
export async function createNotification(
  userId: string,
  data: {
    type: NotificationType;
    content: string;
    relatedUserId?: string;
    relatedPostId?: string;
  }
) {
  const id = generateId();
  const now = new Date().toISOString();

  await db.insert(notifications).values({
    id,
    userId,
    type: data.type,
    content: data.content,
    relatedUserId: data.relatedUserId,
    relatedPostId: data.relatedPostId,
    isRead: false,
    createdAt: now,
  });

  const [notification] = await db
    .select()
    .from(notifications)
    .where(eq(notifications.id, id))
    .limit(1);

  return notification || null;
}

/**
 * 通知を既読にする
 */
export async function markNotificationAsRead(notificationId: string, userId: string) {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
}

/**
 * すべての通知を既読にする
 */
export async function markAllNotificationsAsRead(userId: string) {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
}
