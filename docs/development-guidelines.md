# HorrorRing 開発ガイドライン

## コーディング規約

### TypeScript
- `strict: true` を有効化
- `any` の使用を避ける（必要な場合はコメントで理由を明記）
- 型定義は `lib/types/` に配置

### 命名規則
- **ファイル名**: kebab-case（例: `user-profile.tsx`）
- **コンポーネント名**: PascalCase（例: `UserProfile`）
- **関数・変数**: camelCase（例: `getUserProfile`）
- **定数**: UPPER_SNAKE_CASE（例: `MAX_POST_LENGTH`）
- **型・インターフェース**: PascalCase（例: `UserProfile`）

### ディレクトリ構造
```
app/
├── (marketing)/          # マーケティングページ
├── (app)/                # アプリ本体
│   ├── posts/
│   ├── profile/
│   └── settings/
├── api/                  # Route Handlers
└── layout.tsx

components/
├── common/              # 共通コンポーネント
├── features/           # 機能別コンポーネント
└── layouts/            # レイアウトコンポーネント

lib/
├── auth/               # betterAuth設定
├── db/                 # データベース設定
├── types/              # 型定義
└── utils/              # ユーティリティ関数

dal/                    # Data Access Layer
```

---

## コンポーネント設計

### Server Components を優先
- デフォルトで Server Component を使用
- ブラウザAPI、イベントハンドラ、状態管理が必要な場合のみ Client Component

### Client Component の例
```typescript
'use client';

import { useState } from 'react';

export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  // ...
}
```

### Server Component の例
```typescript
import { auth } from '@/lib/auth';
import { getPosts } from '@/dal/posts';

export default async function PostsPage() {
  const session = await auth();
  const posts = await getPosts();
  // ...
}
```

---

## データ取得

### Server Components でのデータ取得
```typescript
// app/posts/page.tsx
import { getPosts } from '@/dal/posts';

export default async function PostsPage() {
  const posts = await getPosts();
  return <PostsList posts={posts} />;
}
```

### Route Handlers でのデータ変更
```typescript
// app/api/posts/route.ts
import { auth } from '@/lib/auth';
import { createPost } from '@/dal/posts';
import { z } from 'zod';

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const data = createPostSchema.parse(body);
  
  const post = await createPost(session.user.id, data);
  return NextResponse.json(post, { status: 201 });
}
```

---

## エラーハンドリング

### Server Components
```typescript
// app/posts/[id]/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <button onClick={reset}>再試行</button>
    </div>
  );
}
```

### Route Handlers
```typescript
export async function POST(request: Request) {
  try {
    // ...
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

---

## バリデーション

### zod を使用
```typescript
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  post_type: z.enum(['review', 'experience', 'photo', 'video']),
  genre: z.enum(['game', 'haunted_spot', 'urban_legend']),
});

export async function POST(request: Request) {
  const body = await request.json();
  const data = createPostSchema.parse(body); // バリデーション
  // ...
}
```

---

## 認証チェック

### Server Components
```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }
  // ...
}
```

### Route Handlers
```typescript
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ...
}
```

---

## プラン制限チェック

```typescript
import { checkPlanLimit } from '@/lib/plan-limits';

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // プラン制限チェック
  const canPost = await checkPlanLimit(session.user.id, 'post');
  if (!canPost) {
    return NextResponse.json(
      { error: 'Daily post limit reached' },
      { status: 403 }
    );
  }

  // ...
}
```

---

## 画像・動画アップロード

### R2へのアップロード
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2(file: File): Promise<string> {
  const key = `${Date.now()}-${file.name}`;
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  });
  
  await r2Client.send(command);
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
```

---

## テスト

### 単体テスト
```typescript
// __tests__/utils/format.test.ts
import { formatDate } from '@/lib/utils/format';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2026-01-26');
    expect(formatDate(date)).toBe('2026年1月26日');
  });
});
```

---

## Git運用

### ブランチ戦略
- `main`: 本番環境
- `develop`: 開発環境
- `feature/xxx`: 機能追加
- `fix/xxx`: バグ修正

### コミットメッセージ
```
feat: 投稿機能を追加
fix: いいね機能のバグを修正
refactor: コンポーネントをリファクタリング
docs: READMEを更新
```

---

## パフォーマンス

### 画像最適化
```typescript
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="説明"
  width={800}
  height={600}
  priority={false} // 重要でない画像はfalse
/>
```

### 動的インポート
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>読み込み中...</p>,
});
```

---

## セキュリティ

### 環境変数
- 機密情報は `.env.local` に保存（`.gitignore` に含める）
- クライアントに公開するもののみ `NEXT_PUBLIC_` プレフィックス

### 入力値のサニタイズ
- XSS対策: Reactの自動エスケープを活用
- SQLインジェクション対策: ORMを使用（パラメータ化クエリ）

---

## 参考資料

### プロジェクト内ドキュメント
- [Next.js App Router ベストプラクティス](./nextjs-best-practices.md) - **必読**: 開発時のベストプラクティス
- [betterAuth ユーザースキーマ定義](./betterauth-schema.md) - **必読**: betterAuthのスキーマ定義
- [Next.js App Router ベストプラクティス（Cursorルール）](../.cursor/rules/nextjs-best-practices.mdc)
- [要件定義書](./requirements.md)
- [データベース設計書](./database-design.md)
- [API設計書](./api-design.md)

### 外部ドキュメント
- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [Drizzle ORM ドキュメント](https://orm.drizzle.team/)
- [betterAuth 公式ドキュメント](https://www.better-auth.com/docs)
