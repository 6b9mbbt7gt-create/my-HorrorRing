# HorrorRing 環境構築ガイド

## 前提条件

- Node.js 18+ がインストールされていること
- npm または yarn がインストールされていること
- Git がインストールされていること

---

## 1. リポジトリのクローン

```bash
git clone <repository-url>
cd my-HorrorRing
```

---

## 2. 依存関係のインストール

```bash
npm install
# または
yarn install
```

---

## 3. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定：

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (Turso)
TURSO_DATABASE_URL=libsql://your-database-url
TURSO_AUTH_TOKEN=your-auth-token

# betterAuth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=horrorring-media
R2_PUBLIC_URL=https://your-r2-domain.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google Maps API (心霊スポット用)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

---

## 4. Turso データベースのセットアップ

### 4.1 Tursoアカウント作成
1. [Turso](https://turso.tech/) にアクセス
2. アカウントを作成
3. データベースを作成

### 4.2 データベース接続情報の取得
```bash
# Turso CLIをインストール（未インストールの場合）
curl -sSfL https://get.tur.so/install.sh | bash

# ログイン
turso auth login

# データベース作成
turso db create horrorring

# データベースURLとトークンを取得
turso db show horrorring
```

取得した情報を `.env.local` に設定。

---

## 5. Cloudflare R2 のセットアップ

### 5.1 R2バケット作成
1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. R2 を開く
3. 「Create bucket」をクリック
4. バケット名: `horrorring-media`
5. 作成

### 5.2 API トークンの作成
1. R2 の「Manage R2 API Tokens」を開く
2. 「Create API token」をクリック
3. 権限: 「Object Read & Write」
4. トークンを作成し、`.env.local` に設定

### 5.3 カスタムドメイン設定（オプション）
1. R2 バケットの「Settings」を開く
2. 「Public Access」を有効化
3. カスタムドメインを設定（推奨）

---

## 6. betterAuth のセットアップ

### 6.1 betterAuth のインストール
```bash
npm install better-auth
```

### 6.2 設定ファイルの作成
`lib/auth.ts` を作成（設定は別途実装）

### 6.3 Google OAuth の設定
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクトを作成
3. OAuth同意画面を設定
4. 認証情報を作成（OAuth 2.0 クライアント ID）
5. リダイレクトURIを設定: `http://localhost:3000/api/auth/callback/google`
6. クライアントIDとシークレットを `.env.local` に設定

---

## 7. Stripe のセットアップ

### 7.1 Stripeアカウント作成
1. [Stripe](https://stripe.com/) にアクセス
2. アカウントを作成
3. ダッシュボードからAPIキーを取得

### 7.2 サブスクリプション商品の作成
1. Stripeダッシュボードで「Products」を開く
2. 「Add product」をクリック
3. 商品名: 「HorrorRing Premium」
4. 価格: ¥1,000/月
5. 作成

### 7.3 Webhookの設定
1. Stripeダッシュボードで「Webhooks」を開く
2. 「Add endpoint」をクリック
3. URL: `http://localhost:3000/api/webhooks/stripe`（開発環境）
4. イベント: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
5. シークレットを `.env.local` に設定

---

## 8. Google Maps API のセットアップ

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 「APIとサービス」→「ライブラリ」を開く
3. 「Maps JavaScript API」を有効化
4. 「認証情報」でAPIキーを作成
5. APIキーを `.env.local` に設定

---

## 9. データベースマイグレーション

```bash
# マイグレーション生成
npm run db:generate

# マイグレーション実行
npm run db:migrate
```

---

## 10. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス。

---

## 11. トラブルシューティング

### データベース接続エラー
- TursoのURLとトークンが正しいか確認
- ネットワーク接続を確認

### R2アップロードエラー
- R2の認証情報が正しいか確認
- バケット名が正しいか確認
- CORS設定を確認

### OAuth認証エラー
- Google OAuthのリダイレクトURIが正しいか確認
- クライアントIDとシークレットが正しいか確認

### Stripeエラー
- APIキーが正しいか確認（テストキー/本番キー）
- Webhookのエンドポイントが正しいか確認

---

## 12. 次のステップ

- [開発ガイドライン](./development-guidelines.md) を確認
- [TODO](./TODO.md) を確認して開発を開始
