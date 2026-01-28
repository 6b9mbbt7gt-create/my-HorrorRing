# HorrorRing API設計書

## 概要
- **アーキテクチャ**: Next.js App Router (Server Components + Route Handlers)
- **認証**: betterAuth
- **データ取得**: Server Components内の`fetch`を基本とする
- **データ変更**: Route Handlers (POST/PATCH/PUT/DELETE) または Server Actions

---

## 認証

### 認証状態の確認
- Server Components: `await auth()` を使用
- Route Handlers: `await auth()` を使用

---

## Route Handlers（API Routes）

### POST /api/posts
**説明**: 新規投稿を作成

**リクエスト**:
```typescript
{
  title: string;
  content: string;
  post_type: 'review' | 'experience' | 'photo' | 'video';
  genre: 'game' | 'haunted_spot' | 'urban_legend';
  genre_id?: string;
  visibility: 'public' | 'private' | 'friends' | 'limited';
  images?: string[]; // R2のキー配列
  videos?: string[]; // R2のキー配列
}
```

**レスポンス**:
```typescript
{
  id: string;
  title: string;
  // ... その他の投稿フィールド
}
```

**認証**: 必須  
**プラン制限**: 無料プランは1日5投稿まで

---

### PATCH /api/posts/[id]
**説明**: 投稿を更新

**リクエスト**: POSTと同じ（部分更新可）

**レスポンス**: 更新された投稿

**認証**: 必須（自分の投稿のみ）

---

### DELETE /api/posts/[id]
**説明**: 投稿を削除

**レスポンス**: `{ success: true }`

**認証**: 必須（自分の投稿のみ）

---

### POST /api/posts/[id]/comments
**説明**: コメントを投稿

**リクエスト**:
```typescript
{
  content: string;
  parent_id?: string; // 返信の場合
}
```

**レスポンス**: 作成されたコメント

**認証**: 必須

---

### POST /api/posts/[id]/likes
**説明**: いいねを追加/削除（トグル）

**レスポンス**: `{ liked: boolean }`

**認証**: 必須  
**プラン制限**: 無料プランは1日制限あり

---

### POST /api/posts/[id]/hearts
**説明**: ハートを追加/削除（トグル）

**レスポンス**: `{ hearted: boolean }`

**認証**: 必須  
**プラン制限**: 無料プランは1日3個まで

---

### POST /api/users/[id]/follow
**説明**: ユーザーをフォロー/アンフォロー（トグル）

**レスポンス**: `{ following: boolean }`

**認証**: 必須

---

### POST /api/messages
**説明**: DMを送信

**リクエスト**:
```typescript
{
  receiver_id: string;
  content: string;
}
```

**レスポンス**: 作成されたメッセージ

**認証**: 必須  
**プラン制限**: 無料プランは1日5通まで

---

### POST /api/bookmarks
**説明**: ブックマークを追加/削除（トグル）

**リクエスト**:
```typescript
{
  post_id: string;
}
```

**レスポンス**: `{ bookmarked: boolean }`

**認証**: 必須（有料プランのみ）

---

### POST /api/upload/image
**説明**: 画像をR2にアップロード

**リクエスト**: FormData (multipart/form-data)
- `file`: File

**レスポンス**:
```typescript
{
  r2_key: string;
  url: string;
}
```

**認証**: 必須  
**プラン制限**: 無料プランは1投稿5枚まで、1枚5MBまで

---

### POST /api/upload/video
**説明**: 動画をR2にアップロード

**リクエスト**: FormData
- `file`: File

**レスポンス**:
```typescript
{
  r2_key: string;
  url: string;
  thumbnail_url?: string;
}
```

**認証**: 必須（有料プランのみ）

---

### POST /api/subscriptions/checkout
**説明**: サブスクリプションを登録（Polar Checkoutセッションを作成）

**リクエスト**:
```typescript
{
  planType: 'premium';
}
```

**レスポンス**:
```typescript
{
  url: string; // PolarのチェックアウトURL
}
```

**認証**: 必須

**注意**: PolarダッシュボードでPremiumプランのProduct IDとPrice IDを取得し、環境変数に設定する必要があります。

---

### POST /api/webhooks/polar
**説明**: Polar Webhookを処理（サブスクリプション状態の更新）

**リクエスト**: PolarからのWebhookイベント（Standard Webhooks仕様）

**処理イベント**:
- `checkout.completed`: チェックアウト完了時、ユーザーのプランをPremiumに更新
- `subscription.created`: サブスクリプション作成時、プランをPremiumに更新
- `subscription.cancelled`: サブスクリプション解約時、プランをFreeに戻す
- `subscription.expired`: サブスクリプション期限切れ時、プランをFreeに戻す
- `subscription.updated`: サブスクリプション更新時、有効期限を更新

**レスポンス**: `{ received: true }`

**認証**: Webhook署名検証（POLAR_WEBHOOK_SECRETを使用）

---

### DELETE /api/subscriptions
**説明**: サブスクリプションを解約（Polarのカスタマーポータルを利用）

**実装方針**: Polarのカスタマーポータル（`https://polar.sh/horrorring/portal`）にリダイレクトするか、アプリ内でユーザー状態のみ更新

**レスポンス**: `{ success: true }`

**認証**: 必須

---

### POST /api/notifications/[id]/read
**説明**: 通知を既読にする

**レスポンス**: `{ success: true }`

**認証**: 必須

---

## Server Actions（代替案）

Route Handlersの代わりにServer Actionsを使用することも可能。

### createPost
```typescript
'use server'

export async function createPost(data: PostData) {
  // 認証チェック
  // プラン制限チェック
  // 投稿作成
}
```

---

## エラーハンドリング

### エラーレスポンス形式
```typescript
{
  error: string;
  code?: string;
  details?: unknown;
}
```

### ステータスコード
- `200`: 成功
- `201`: 作成成功
- `400`: バリデーションエラー
- `401`: 認証エラー
- `403`: 権限エラー（プラン制限など）
- `404`: リソースが見つからない
- `500`: サーバーエラー

---

## バリデーション

すべてのRoute Handlerで入力値のバリデーションを実施。

**推奨ライブラリ**: zod

```typescript
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  // ...
});
```

---

## レートリミット

重要なエンドポイントにレートリミットを実装。

**推奨ライブラリ**: `@upstash/ratelimit` または Tursoベースの実装

---

## キャッシュ戦略

- 投稿一覧: ISR（1時間ごとに再検証）
- ユーザープロフィール: ISR（30分ごとに再検証）
- 検索結果: キャッシュなし（常に最新）
