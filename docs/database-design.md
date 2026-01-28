# HorrorRing データベース設計書

## 概要
- **DB**: Turso (SQLite)
- **ORM**: Drizzle ORM
- **命名規則**: snake_case

---

## ER図（概要）

```
users ──┬── posts ──┬── comments
        │           ├── likes
        │           ├── hearts
        │           └── bookmarks
        │
        ├── follows (self-referential)
        ├── subscriptions
        ├── messages (sender/receiver)
        └── notifications

posts ──┬── post_images
        └── post_videos

haunted_spots
games
urban_legends
```

---

## テーブル定義

### users（ユーザー）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| email | TEXT | UNIQUE, NOT NULL | メールアドレス |
| name | TEXT | NOT NULL | 表示名 |
| username | TEXT | UNIQUE | ユーザー名（@username） |
| avatar_url | TEXT | | プロフィール画像URL |
| bio | TEXT | | 自己紹介 |
| language | TEXT | DEFAULT 'ja' | 言語設定（ja/en） |
| plan_type | TEXT | DEFAULT 'free' | プラン種別（free/premium） |
| plan_expires_at | DATETIME | | プラン有効期限 |
| created_at | DATETIME | NOT NULL | 作成日時 |
| updated_at | DATETIME | NOT NULL | 更新日時 |

**インデックス**: email, username

---

### posts（投稿）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| user_id | TEXT | NOT NULL, FK(users.id) | 投稿者ID |
| title | TEXT | NOT NULL | タイトル |
| content | TEXT | NOT NULL | 本文（マークダウン） |
| post_type | TEXT | NOT NULL | 投稿タイプ（review/experience/photo/video） |
| genre | TEXT | NOT NULL | ジャンル（game/haunted_spot/urban_legend） |
| genre_id | TEXT | | ジャンル固有ID（ゲームID、スポットIDなど） |
| visibility | TEXT | DEFAULT 'public' | 公開範囲（public/private/friends/limited） |
| like_count | INTEGER | DEFAULT 0 | いいね数 |
| heart_count | INTEGER | DEFAULT 0 | ハート数 |
| comment_count | INTEGER | DEFAULT 0 | コメント数 |
| created_at | DATETIME | NOT NULL | 作成日時 |
| updated_at | DATETIME | NOT NULL | 更新日時 |

**インデックス**: user_id, genre, genre_id, created_at, like_count, heart_count

---

### post_images（投稿画像）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| post_id | TEXT | NOT NULL, FK(posts.id) | 投稿ID |
| r2_key | TEXT | NOT NULL | R2のキー |
| url | TEXT | NOT NULL | 公開URL |
| order | INTEGER | NOT NULL | 表示順序 |
| created_at | DATETIME | NOT NULL | 作成日時 |

**インデックス**: post_id

---

### post_videos（投稿動画）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| post_id | TEXT | NOT NULL, FK(posts.id) | 投稿ID |
| r2_key | TEXT | NOT NULL | R2のキー |
| url | TEXT | NOT NULL | 公開URL |
| duration | INTEGER | | 動画時間（秒） |
| thumbnail_url | TEXT | | サムネイルURL |
| created_at | DATETIME | NOT NULL | 作成日時 |

**インデックス**: post_id

---

### comments（コメント）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| post_id | TEXT | NOT NULL, FK(posts.id) | 投稿ID |
| user_id | TEXT | NOT NULL, FK(users.id) | コメント者ID |
| parent_id | TEXT | FK(comments.id) | 親コメントID（スレッド用） |
| content | TEXT | NOT NULL | コメント内容 |
| created_at | DATETIME | NOT NULL | 作成日時 |
| updated_at | DATETIME | NOT NULL | 更新日時 |

**インデックス**: post_id, user_id, parent_id

---

### likes（いいね）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| post_id | TEXT | NOT NULL, FK(posts.id) | 投稿ID |
| user_id | TEXT | NOT NULL, FK(users.id) | ユーザーID |
| created_at | DATETIME | NOT NULL | 作成日時 |

**ユニーク制約**: (post_id, user_id)

---

### hearts（ハート）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| post_id | TEXT | NOT NULL, FK(posts.id) | 投稿ID |
| user_id | TEXT | NOT NULL, FK(users.id) | ユーザーID |
| created_at | DATETIME | NOT NULL | 作成日時 |

**ユニーク制約**: (post_id, user_id)

---

### follows（フォロー）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| follower_id | TEXT | NOT NULL, FK(users.id) | フォロワーID |
| following_id | TEXT | NOT NULL, FK(users.id) | フォロー中ID |
| created_at | DATETIME | NOT NULL | 作成日時 |

**ユニーク制約**: (follower_id, following_id)  
**チェック制約**: follower_id != following_id

---

### messages（DM）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| sender_id | TEXT | NOT NULL, FK(users.id) | 送信者ID |
| receiver_id | TEXT | NOT NULL, FK(users.id) | 受信者ID |
| content | TEXT | NOT NULL | メッセージ内容 |
| is_read | BOOLEAN | DEFAULT false | 既読フラグ |
| created_at | DATETIME | NOT NULL | 作成日時 |

**インデックス**: sender_id, receiver_id, created_at

---

### bookmarks（ブックマーク）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| user_id | TEXT | NOT NULL, FK(users.id) | ユーザーID |
| post_id | TEXT | NOT NULL, FK(posts.id) | 投稿ID |
| created_at | DATETIME | NOT NULL | 作成日時 |

**ユニーク制約**: (user_id, post_id)

---

### subscriptions（サブスクリプション）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| user_id | TEXT | NOT NULL, FK(users.id) | ユーザーID |
| stripe_subscription_id | TEXT | UNIQUE | StripeサブスクリプションID |
| plan_type | TEXT | NOT NULL | プラン種別（free/premium） |
| status | TEXT | NOT NULL | ステータス（active/canceled/past_due） |
| current_period_start | DATETIME | NOT NULL | 現在の期間開始日 |
| current_period_end | DATETIME | NOT NULL | 現在の期間終了日 |
| canceled_at | DATETIME | | 解約日時 |
| created_at | DATETIME | NOT NULL | 作成日時 |
| updated_at | DATETIME | NOT NULL | 更新日時 |

**インデックス**: user_id, stripe_subscription_id

---

### notifications（通知）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| user_id | TEXT | NOT NULL, FK(users.id) | ユーザーID |
| type | TEXT | NOT NULL | 通知タイプ（follow/comment/like/heart/dm/post） |
| related_user_id | TEXT | FK(users.id) | 関連ユーザーID |
| related_post_id | TEXT | FK(posts.id) | 関連投稿ID |
| content | TEXT | | 通知内容 |
| is_read | BOOLEAN | DEFAULT false | 既読フラグ |
| created_at | DATETIME | NOT NULL | 作成日時 |

**インデックス**: user_id, is_read, created_at

---

### haunted_spots（心霊スポット）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| name | TEXT | NOT NULL | スポット名 |
| description | TEXT | | 説明 |
| latitude | REAL | | 緯度 |
| longitude | REAL | | 経度 |
| region | TEXT | | 地域 |
| category | TEXT | | カテゴリ（廃墟/病院/学校など） |
| created_at | DATETIME | NOT NULL | 作成日時 |
| updated_at | DATETIME | NOT NULL | 更新日時 |

**インデックス**: region, category

---

### games（ゲーム）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| name | TEXT | NOT NULL | ゲーム名 |
| description | TEXT | | 説明 |
| platform | TEXT | | プラットフォーム（PC/Console/Mobile） |
| release_date | DATE | | 発売日 |
| steam_id | TEXT | | Steam ID（API連携用） |
| created_at | DATETIME | NOT NULL | 作成日時 |
| updated_at | DATETIME | NOT NULL | 更新日時 |

**インデックス**: platform, release_date

---

### urban_legends（都市伝説）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| title | TEXT | NOT NULL | タイトル |
| content | TEXT | NOT NULL | 内容 |
| region | TEXT | | 地域 |
| category | TEXT | | カテゴリ |
| created_at | DATETIME | NOT NULL | 作成日時 |
| updated_at | DATETIME | NOT NULL | 更新日時 |

**インデックス**: region, category

---

## プラン制限管理

プラン制限は以下のテーブルで管理するか、アプリケーションロジックで実装：

### user_daily_limits（ユーザー日次制限）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| user_id | TEXT | PRIMARY KEY, FK(users.id) | ユーザーID |
| date | DATE | PRIMARY KEY | 日付 |
| post_count | INTEGER | DEFAULT 0 | 本日の投稿数 |
| like_count | INTEGER | DEFAULT 0 | 本日のいいね数 |
| heart_count | INTEGER | DEFAULT 0 | 本日のハート数 |
| dm_count | INTEGER | DEFAULT 0 | 本日のDM数 |

---

## マイグレーション

Drizzle ORMを使用してマイグレーションを管理。

```bash
# マイグレーション生成
npm run db:generate

# マイグレーション実行
npm run db:migrate
```
