# セットアップガイド

## 必要な環境変数

`.env.local`ファイルに以下の環境変数を設定してください：

### データベース（Turso）
```
TURSO_DATABASE_URL=libsql://your-database-url
TURSO_AUTH_TOKEN=your-auth-token
```

### 認証（betterAuth）
```
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Google OAuth（オプション）
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Cloudflare R2（オプション）
```
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-custom-domain.com
```

### Polar（オプション）
```
POLAR_API_KEY=your-polar-api-key
POLAR_ORG_SLUG=horrorring
POLAR_PREMIUM_PRODUCT_ID=prod_...
POLAR_PREMIUM_PRICE_ID=price_...
POLAR_WEBHOOK_SECRET=your-webhook-secret
POLAR_API_BASE_URL=https://api.polar.sh/v1
```

## インストール手順

1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定
`.env.local.example`を参考に`.env.local`を作成し、必要な環境変数を設定してください。

3. データベースマイグレーション
```bash
npm run db:generate
npm run db:push
```

または、開発サーバー起動時に自動実行されます：
```bash
npm run dev
```

## 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## 本番環境へのデプロイ

### Vercel推奨

1. GitHubリポジトリにプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

### 注意事項

- Cloudflare R2のカスタムドメイン設定が必要です
- Polar Webhookのエンドポイントを設定してください（`/api/webhooks/polar`）
- Google OAuthのリダイレクトURIを設定してください
- PolarダッシュボードでPremiumプランのProduct/Price IDを取得し、環境変数に設定してください
