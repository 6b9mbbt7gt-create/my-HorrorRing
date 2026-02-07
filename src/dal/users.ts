import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';

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
 * 複数IDでユーザーを取得（投稿者名などの一括取得用）
 */
export async function getUsersByIds(userIds: string[]) {
  if (userIds.length === 0) return [];
  const uniq = [...new Set(userIds)];
  return db
    .select({ id: users.id, name: users.name, username: users.username })
    .from(users)
    .where(inArray(users.id, uniq));
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
    name?: string | null;
    username?: string;
    bio?: string;
    language?: string;
  }
) {
  const now = new Date().toISOString();
  const setData: Record<string, unknown> = { updatedAt: now };
  if (data.name !== undefined) setData.name = data.name;
  if (data.username !== undefined) setData.username = data.username;
  if (data.bio !== undefined) setData.bio = data.bio;
  if (data.language !== undefined) setData.language = data.language;

  const [user] = await db
    .update(users)
    .set(setData as any)
    .where(eq(users.id, userId))
    .returning();

  return user || null;
}
