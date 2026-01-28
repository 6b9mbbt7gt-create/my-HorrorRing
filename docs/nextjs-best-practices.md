# Next.js App Router ベストプラクティス

## 概要
このドキュメントは、HorrorRingプロジェクトでNext.js App Routerを使用する際に遵守すべきベストプラクティスを定義します。

**対象**: `app/` または `src/app/` 配下の Next.js + TypeScript コード  
**目的**: Server Components 前提で、シンプルかつ保守しやすい構成に揃える

---

## 1. ルーティングと構成

### ディレクトリ構造
- 新規画面は `app/xxx/page.tsx`、レイアウトは `app/xxx/layout.tsx` に配置する
- マーケ系とアプリ本体を分ける場合は `(marketing)`, `(app)` などのグルーピングを使う
- ローディング/エラー/404 は `loading.tsx`, `error.tsx`, `not-found.tsx` を基本とする

### 命名規則
- **ページコンポーネント**: `page.tsx`
- **レイアウトコンポーネント**: `layout.tsx`
- **ローディング状態**: `loading.tsx`
- **エラーハンドリング**: `error.tsx`
- **404 ページ**: `not-found.tsx`

### 例
```
app/
├── (marketing)/
│   ├── about/
│   │   └── page.tsx
│   └── layout.tsx
├── (app)/
│   ├── posts/
│   │   ├── page.tsx
│   │   ├── [id]/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   └── layout.tsx
│   └── layout.tsx
└── api/
    └── posts/
        └── route.ts
```

---

## 2. Server / Client コンポーネント

### 基本方針
- **既定は Server Component**。`"use client"` は本当に必要なときだけ付ける
- ブラウザ API・イベントハンドラ・状態管理・カスタムHook利用が必要な場合のみ Client にする
- 重いデータ取得やSEOが重要なページはできるだけ Server Component で完結させる

### Server Component の例
```typescript
// app/posts/page.tsx
import { getPosts } from '@/dal/posts';

export default async function PostsPage() {
  const posts = await getPosts();
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Client Component の例
```typescript
// components/LikeButton.tsx
'use client';

import { useState } from 'react';

export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  
  const handleLike = async () => {
    // いいね処理
    setLiked(!liked);
  };
  
  return (
    <button onClick={handleLike}>
      {liked ? '❤️' : '🤍'}
    </button>
  );
}
```

### `"use client"` が必要な場合
- ブラウザ API を使用する場合（`window`, `localStorage`, `navigator` など）
- イベントリスナーが必要な場合（`onClick`, `onChange` など）
- React hooks を使用する場合（`useState`, `useEffect`, `useContext` など）
- クライアントサイドの状態管理が必要な場合

---

## 3. データ取得とAPI

### 基本方針
- **読み取り系のデータ取得は基本 Server Component 内の `fetch` で行い、専用GET APIを乱立させない**
- 変更系は `app/api/**/route.ts` の POST/PATCH/PUT/DELETE か Server Actions にまとめる
- Route Handler / Server Action では zod 等で入力バリデーションと認可チェックを行う

### Server Component でのデータ取得
```typescript
// app/posts/page.tsx
import { getPosts } from '@/dal/posts';

export default async function PostsPage() {
  const posts = await getPosts();
  return <PostsList posts={posts} />;
}
```

### Route Handler でのデータ変更
```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createPost } from '@/dal/posts';
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const body = await request.json();
  const data = createPostSchema.parse(body);
  
  const post = await createPost(session.user.id, data);
  return NextResponse.json(post, { status: 201 });
}
```

### Server Actions の使用（代替案）
```typescript
// app/actions/posts.ts
'use server';

import { auth } from '@/lib/auth';
import { createPost } from '@/dal/posts';
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
});

export async function createPostAction(data: unknown) {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }

  const validatedData = createPostSchema.parse(data);
  return await createPost(session.user.id, validatedData);
}
```

---

## 4. キャッシュと再検証

### 基本方針
- `fetch` には意図したキャッシュ戦略を明示する
- キャッシュ方針はコメントや関数名で目的を分かりやすくする

### キャッシュ戦略の例
```typescript
// 変更が少ないデータ（ISR: 1時間ごとに再検証）
const posts = await fetch('https://api.example.com/posts', {
  next: { revalidate: 3600 }, // 1時間
});

// 常に最新が必要なデータ（キャッシュなし）
const userProfile = await fetch('https://api.example.com/user', {
  cache: 'no-store',
});

// 静的なデータ（ビルド時に生成）
const staticData = await fetch('https://api.example.com/static', {
  cache: 'force-cache',
});
```

### ページレベルの再検証
```typescript
// app/posts/page.tsx
export const revalidate = 3600; // 1時間ごとに再検証

export default async function PostsPage() {
  // ...
}
```

---

## 5. 環境変数とセキュリティ

### 基本方針
- 機密情報は `.env.local` に置き、クライアントに出すものだけ `NEXT_PUBLIC_` プレフィックスを付ける
- 外部サービスのキーやシークレットは必ずサーバー側（Route Handler / Server Action / DAL）でのみ利用する

### 環境変数の例
```env
# サーバー側のみ（クライアントに公開されない）
TURSO_DATABASE_URL=libsql://...
STRIPE_SECRET_KEY=sk_...

# クライアント側でも使用（NEXT_PUBLIC_ プレフィックス）
NEXT_PUBLIC_APP_URL=https://horrorring.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

### セキュリティチェックリスト
- [ ] 機密情報に `NEXT_PUBLIC_` が付いていないか確認
- [ ] `.env.local` が `.gitignore` に含まれているか確認
- [ ] 本番環境の環境変数が正しく設定されているか確認

---

## 6. コンポーネント設計

### 基本方針
- UIコンポーネントはできるだけ「props in → JSX out」の純粋コンポーネントにし、副作用はHookに寄せる
- 機能単位で `components/`, `features/`, `hooks/`, `dal/` などに分けて、責務を跨がないようにする
- 再利用したいロジックは `useXxx` カスタムHookや `lib/` の純粋関数として切り出す

### コンポーネント分割の例
```typescript
// components/posts/PostCard.tsx（純粋コンポーネント）
export function PostCard({ post }: { post: Post }) {
  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </article>
  );
}

// hooks/usePost.ts（カスタムHook）
export function usePost(postId: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchPost(postId).then(setPost).finally(() => setLoading(false));
  }, [postId]);
  
  return { post, loading };
}
```

---

## 7. 型安全性

### 基本方針
- `strict: true` を基本とし、`any` は極力禁止する（必要な場合はコメントで意図を残す）
- APIの入出力は型 or zodスキーマを定義し、呼び出し側まで型を通す

### TypeScript設定
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 型定義の例
```typescript
// lib/types/post.ts
export type Post = {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

// zodスキーマと型の統合
import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
});

export type PostInput = z.infer<typeof postSchema>;
```

---

## 8. パフォーマンスとUX

### 画像最適化
```typescript
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="説明"
  width={800}
  height={600}
  priority={true} // 重要な画像の場合のみ
  placeholder="blur" // ブラー効果（オプション）
/>
```

### 動的インポート
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>読み込み中...</p>,
  ssr: false, // サーバーサイドレンダリングを無効化（必要な場合）
});
```

### ローディング状態
```typescript
// app/posts/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}
```

---

## 9. エラー処理

### 基本方針
- 例外を握りつぶさず、ログとユーザー向けメッセージを分けて扱う
- `error.tsx` では「再読み込み」「トップへ戻る」などの導線を必ず用意する

### エラーバウンダリ
```typescript
// app/posts/[id]/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <p>{error.message}</p>
      <button onClick={reset}>再試行</button>
      <a href="/">トップへ戻る</a>
    </div>
  );
}
```

### Route Handler でのエラーハンドリング
```typescript
export async function POST(request: Request) {
  try {
    // 処理
  } catch (error) {
    console.error('Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

---

## 10. メタデータとSEO

### メタデータの設定
```typescript
// app/posts/[id]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await getPost(params.id);
  
  return {
    title: post.title,
    description: post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
      images: [post.imageUrl],
    },
  };
}
```

---

## 11. 認証チェック

### Server Component での認証
```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>保護されたコンテンツ</div>;
}
```

### Route Handler での認証
```typescript
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // 処理
}
```

---

## 12. プラン制限チェック

```typescript
import { checkPlanLimit } from '@/lib/plan-limits';

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // プラン制限チェック
  const canPost = await checkPlanLimit(session.user.id, 'post');
  if (!canPost) {
    return NextResponse.json(
      { error: 'Daily post limit reached' },
      { status: 403 }
    );
  }

  // 処理
}
```

---

## チェックリスト

開発時は以下のチェックリストを確認してください：

- [ ] Server Component を優先しているか
- [ ] `"use client"` は本当に必要な場合のみ使用しているか
- [ ] データ取得は Server Component で行っているか（GET APIを乱立させていないか）
- [ ] キャッシュ戦略を明示しているか
- [ ] 環境変数に `NEXT_PUBLIC_` が適切に付いているか
- [ ] 型安全性が確保されているか（`any` を使用していないか）
- [ ] エラーハンドリングが適切に実装されているか
- [ ] 認証チェックが適切に行われているか

---

## 参考資料

- [Next.js App Router 公式ドキュメント](https://nextjs.org/docs/app)
- [Next.js ベストプラクティス（Cursorルール）](../.cursor/rules/nextjs-best-practices.mdc)
- [開発ガイドライン](./development-guidelines.md)
