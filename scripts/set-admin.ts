/**
 * 指定メールのユーザーを管理者にし、任意で表示名を設定する
 * 使い方: npx tsx scripts/set-admin.ts <email> [表示名]
 * 例: npx tsx scripts/set-admin.ts fukumoto6343@gmail.com "表示名"
 */
import { config } from 'dotenv';

config({ path: '.env.local' });

import { db } from '../src/lib/db';
import { users } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const email = process.argv[2];
  const displayName = process.argv[3]; // 省略可

  if (!email) {
    console.error('使い方: npx tsx scripts/set-admin.ts <email> [表示名]');
    process.exit(1);
  }

  const now = new Date().toISOString();
  const updates: Record<string, unknown> = {
    role: 'admin',
    updatedAt: now,
  };
  if (displayName !== undefined && displayName !== '') {
    updates.name = displayName;
  }

  const result = await db
    .update(users)
    .set(updates as any)
    .where(eq(users.email, email))
    .returning({ id: users.id, email: users.email, name: users.name, role: users.role });

  if (result.length === 0) {
    console.error(`❌ メール "${email}" のユーザーが見つかりません。先にそのメールでログインしてください。`);
    process.exit(1);
  }

  const u = result[0];
  console.log('✅ 管理者に設定しました:');
  console.log(`   email: ${u.email}`);
  console.log(`   name: ${u.name ?? '(未設定)'}`);
  console.log(`   role: ${u.role}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
