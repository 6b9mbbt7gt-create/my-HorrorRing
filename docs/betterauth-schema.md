# betterAuth ユーザースキーマ定義

## 概要
このドキュメントは、betterAuthを使用する際に遵守すべきユーザーデータスキーマを定義します。

---

## コアユーザースキーマ

betterAuthのユーザーテーブルには、以下のコアフィールドが含まれます：

### 必須フィールド

| フィールド名 | 型 | 説明 | 制約 |
|------------|---|------|------|
| `id` | `string` | ユーザーID（UUID） | PRIMARY KEY, NOT NULL |
| `email` | `string` | メールアドレス | UNIQUE, NOT NULL |
| `emailVerified` | `boolean` | メール認証済みフラグ | DEFAULT false |
| `name` | `string` | ユーザー名 | NULL許可 |
| `image` | `string` | プロフィール画像URL | NULL許可 |
| `createdAt` | `datetime` | 作成日時 | NOT NULL |
| `updatedAt` | `datetime` | 更新日時 | NOT NULL |

### 注意事項
- **パスワードはユーザーテーブルには保存されません**。パスワードは `account` テーブルに保存されます。
- OAuth認証（Google等）を使用する場合、パスワードは存在しません。

---

## スキーマ拡張（additionalFields）

HorrorRingプロジェクトでは、betterAuthのコアスキーマを拡張して、追加のフィールドを定義します。

### 拡張フィールド定義

```typescript
// lib/auth.ts
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  user: {
    additionalFields: {
      // ユーザー名（@username形式）
      username: {
        type: 'string',
        required: false,
        unique: true,
      },
      // 自己紹介
      bio: {
        type: 'string',
        required: false,
      },
      // 言語設定
      language: {
        type: 'string',
        required: false,
        defaultValue: 'ja',
      },
      // プラン種別
      plan_type: {
        type: 'string',
        required: false,
        defaultValue: 'free',
      },
      // プラン有効期限
      plan_expires_at: {
        type: 'datetime',
        required: false,
      },
    },
  },
  // その他の設定...
});
```

### 拡張フィールド一覧

| フィールド名 | 型 | 説明 | デフォルト値 | 制約 |
|------------|---|------|------------|------|
| `username` | `string` | ユーザー名（@username形式） | `null` | UNIQUE |
| `bio` | `string` | 自己紹介文 | `null` | - |
| `language` | `string` | 言語設定（ja/en） | `'ja'` | - |
| `plan_type` | `string` | プラン種別（free/premium） | `'free'` | - |
| `plan_expires_at` | `datetime` | プラン有効期限 | `null` | - |

---

## データベーススキーマ（完全版）

### users テーブル

```sql
CREATE TABLE user (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  emailVerified BOOLEAN DEFAULT false,
  name TEXT,
  image TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  language TEXT DEFAULT 'ja',
  plan_type TEXT DEFAULT 'free',
  plan_expires_at DATETIME,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

### インデックス

```sql
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_username ON user(username);
CREATE INDEX idx_user_plan_type ON user(plan_type);
```

---

## 新規ユーザー作成時のデータ構造

### Google OAuth経由での新規ユーザー作成

betterAuthが自動的に作成するユーザーデータ：

```typescript
{
  id: string,              // UUID（自動生成）
  email: string,           // Googleアカウントのメールアドレス
  emailVerified: boolean,  // true（Google認証済み）
  name: string | null,     // Googleアカウントの表示名
  image: string | null,    // Googleアカウントのプロフィール画像URL
  username: null,          // 初期値はnull（後で設定）
  bio: null,               // 初期値はnull（後で設定）
  language: 'ja',         // デフォルト値
  plan_type: 'free',      // デフォルト値
  plan_expires_at: null,   // 初期値はnull
  createdAt: Date,         // 作成日時（自動設定）
  updatedAt: Date,         // 更新日時（自動設定）
}
```

### ユーザー登録後の処理

新規ユーザー作成後、以下の処理を推奨します：

1. **ユーザー名の設定**
   - ユーザーがプロフィール編集時に設定
   - または、初期値として `user-${id.slice(0, 8)}` のような形式を自動生成

2. **プラン情報の初期化**
   - `plan_type: 'free'` が自動設定される
   - 有料プランにアップグレードする場合は、`plan_type` と `plan_expires_at` を更新

3. **言語設定**
   - デフォルトで `'ja'` が設定される
   - ユーザーが言語を変更可能

---

## ユーザー情報の更新

### クライアント側での更新

```typescript
// クライアント側
import { authClient } from '@/lib/auth-client';

// ユーザー情報の更新
await authClient.updateUser({
  name: '新しい名前',
  image: 'https://example.com/avatar.jpg',
});

// 拡張フィールドの更新は、直接API経由で行う必要があります
```

### サーバー側での更新

```typescript
// サーバー側（Route Handler または Server Action）
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';

export async function updateUserProfile(data: {
  username?: string;
  bio?: string;
  language?: string;
}) {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }

  await db
    .update(user)
    .set({
      username: data.username,
      bio: data.bio,
      language: data.language,
      updatedAt: new Date(),
    })
    .where(eq(user.id, session.user.id));
}
```

---

## ユーザー情報の取得

### Server Component での取得

```typescript
import { auth } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  // session.user にユーザー情報が含まれます
  const user = session.user;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>@{user.username}</p>
      <p>{user.bio}</p>
    </div>
  );
}
```

### 型定義

```typescript
// lib/types/user.ts
export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  image: string | null;
  username: string | null;
  bio: string | null;
  language: string;
  plan_type: 'free' | 'premium';
  plan_expires_at: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
```

---

## マイグレーション

### betterAuth CLI を使用したマイグレーション

```bash
# マイグレーションの実行
npx @better-auth/cli migrate

# スキーマの生成
npx @better-auth/cli generate
```

### 手動マイグレーション（Drizzle ORM）

```typescript
// migrations/0001_add_user_fields.ts
import { sql } from 'drizzle-orm';

export async function up(db: Database) {
  await db.execute(sql`
    ALTER TABLE user 
    ADD COLUMN username TEXT UNIQUE,
    ADD COLUMN bio TEXT,
    ADD COLUMN language TEXT DEFAULT 'ja',
    ADD COLUMN plan_type TEXT DEFAULT 'free',
    ADD COLUMN plan_expires_at DATETIME
  `);
}

export async function down(db: Database) {
  await db.execute(sql`
    ALTER TABLE user 
    DROP COLUMN username,
    DROP COLUMN bio,
    DROP COLUMN language,
    DROP COLUMN plan_type,
    DROP COLUMN plan_expires_at
  `);
}
```

---

## バリデーション

### ユーザー名のバリデーション

```typescript
import { z } from 'zod';

export const usernameSchema = z
  .string()
  .min(3, 'ユーザー名は3文字以上である必要があります')
  .max(20, 'ユーザー名は20文字以下である必要があります')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'ユーザー名は英数字とアンダースコアのみ使用できます'
  );

export const updateUserProfileSchema = z.object({
  username: usernameSchema.optional(),
  bio: z.string().max(500, '自己紹介は500文字以下である必要があります').optional(),
  language: z.enum(['ja', 'en']).optional(),
});
```

---

## 注意事項

### 1. ユーザー名の一意性
- `username` は UNIQUE 制約があるため、重複チェックが必要です
- ユーザー名更新時は、既存のユーザー名と重複していないか確認してください

### 2. プラン情報の管理
- `plan_type` と `plan_expires_at` は Stripe Webhook で更新されます
- 手動で更新する場合は、整合性を保つように注意してください

### 3. メールアドレスの変更
- betterAuthの `changeEmail` 機能を使用する場合は、設定が必要です
- 詳細は [betterAuth ドキュメント](https://better-auth.com/docs/concepts/users-accounts#change-email) を参照

### 4. パスワードの管理
- パスワードは `user` テーブルではなく `account` テーブルに保存されます
- OAuth認証のみのユーザーにはパスワードが存在しません

---

## 参考資料

- [betterAuth 公式ドキュメント - User & Accounts](https://better-auth.com/docs/concepts/users-accounts)
- [betterAuth 公式ドキュメント - Database](https://better-auth.com/docs/concepts/database)
- [データベース設計書](./database-design.md)
