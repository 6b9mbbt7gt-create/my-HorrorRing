import { db } from './db';
import { userDailyLimits, users } from './db/schema';
import { eq, and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export type LimitType = 'post' | 'like' | 'heart' | 'dm';

/**
 * プラン制限をチェックする
 */
export async function checkPlanLimit(
  userId: string,
  limitType: LimitType
): Promise<boolean> {
  // ユーザーのプラン情報を取得
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    return false;
  }

  const planType = user.planType || 'free';
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // 今日の制限を取得
  const dailyLimit = await db.query.userDailyLimits.findFirst({
    where: and(
      eq(userDailyLimits.userId, userId),
      eq(userDailyLimits.date, today)
    ),
  });

  // プラン制限の定義
  const limits = {
    free: {
      post: 5,
      like: 50, // 仮の値
      heart: 3,
      dm: 5,
    },
    premium: {
      post: Infinity,
      like: Infinity,
      heart: Infinity,
      dm: Infinity,
    },
  };

  const planLimits = limits[planType as 'free' | 'premium'] || limits.free;
  const limit = planLimits[limitType];

  if (limit === Infinity) {
    return true; // 無制限
  }

  // 今日の使用量を取得
  let currentCount = 0;
  if (dailyLimit) {
    if (limitType === 'post') {
      currentCount = dailyLimit.postCount || 0;
    } else if (limitType === 'like') {
      currentCount = dailyLimit.likeCount || 0;
    } else if (limitType === 'heart') {
      currentCount = dailyLimit.heartCount || 0;
    } else if (limitType === 'dm') {
      currentCount = dailyLimit.dmCount || 0;
    }
  }

  return currentCount < limit;
}

/**
 * プラン制限の使用量を増やす
 */
export async function incrementPlanLimit(
  userId: string,
  limitType: LimitType
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  // 今日の制限レコードを取得または作成
  const dailyLimit = await db.query.userDailyLimits.findFirst({
    where: and(
      eq(userDailyLimits.userId, userId),
      eq(userDailyLimits.date, today)
    ),
  });

  if (dailyLimit) {
    // 既存レコードを更新
    const updateData: any = {};
    if (limitType === 'post') {
      updateData.postCount = (dailyLimit.postCount || 0) + 1;
    } else if (limitType === 'like') {
      updateData.likeCount = (dailyLimit.likeCount || 0) + 1;
    } else if (limitType === 'heart') {
      updateData.heartCount = (dailyLimit.heartCount || 0) + 1;
    } else if (limitType === 'dm') {
      updateData.dmCount = (dailyLimit.dmCount || 0) + 1;
    }

    await db
      .update(userDailyLimits)
      .set(updateData)
      .where(
        and(
          eq(userDailyLimits.userId, userId),
          eq(userDailyLimits.date, today)
        )
      );
  } else {
    // 新規レコードを作成
    await db.insert(userDailyLimits).values({
      userId,
      date: today,
      postCount: limitType === 'post' ? 1 : 0,
      likeCount: limitType === 'like' ? 1 : 0,
      heartCount: limitType === 'heart' ? 1 : 0,
      dmCount: limitType === 'dm' ? 1 : 0,
    });
  }
}
