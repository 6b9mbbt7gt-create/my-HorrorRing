import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * ユーザーをIDで取得
 */
export async function getUserById(userId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user || null;
}

/**
 * ユーザー名でユーザーを取得
 */
export async function getUserByUsername(username: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return user || null;
}

/**
 * ユーザープロフィールを更新
 */
export async function updateUserProfile(
  userId: string,
  data: {
    username?: string;
    bio?: string;
    language?: string;
  }
) {
  const now = new Date().toISOString();

  const [user] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: now,
    })
    .where(eq(users.id, userId))
    .returning();

  return user || null;
}
