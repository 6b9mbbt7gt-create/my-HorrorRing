# HorrorRing デプロイ手順書

## デプロイ環境

- **ホスティング**: Vercel（推奨）または Railway / Render
- **データベース**: Turso（本番環境）
- **ストレージ**: Cloudflare R2
- **CDN**: Cloudflare

---

## Vercel へのデプロイ

### 1. Vercelアカウントの準備
1. [Vercel](https://vercel.com/) にアクセス
2. GitHubアカウントでログイン
3. プロジェクトをインポート

### 2. 環境変数の設定
Vercelダッシュボードで以下の環境変数を設定：

```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
TURSO_DATABASE_URL=libsql://your-production-database-url
TURSO_AUTH_TOKEN=your-production-auth-token
BETTER_AUTH_SECRET=your-production-secret
BETTER_AUTH_URL=https://your-domain.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=horrorring-media
R2_PUBLIC_URL=https://your-r2-domain.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 3. ビルド設定
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 4. デプロイ
1. GitHubにプッシュ
2. Vercelが自動的にデプロイを開始
3. デプロイ完了を確認

---

## Turso 本番環境のセットアップ

### 1. 本番データベースの作成
```bash
turso db create horrorring-production
```

### 2. レプリカの作成（オプション）
```bash
turso db replicate horrorring-production --location jp-nrt
```

### 3. 接続情報の取得
```bash
turso db show horrorring-production
```

取得した情報をVercelの環境変数に設定。

---

## Cloudflare R2 本番環境の設定

### 1. 本番バケットの作成
1. CloudflareダッシュボードでR2を開く
2. 「Create bucket」をクリック
3. バケット名: `horrorring-media-production`
4. 作成

### 2. カスタムドメインの設定
1. バケットの「Settings」を開く
2. 「Public Access」を有効化
3. カスタムドメインを設定（例: `media.horrorring.com`）

### 3. CORS設定
```json
[
  {
    "AllowedOrigins": ["https://your-domain.vercel.app"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

---

## Stripe 本番環境の設定

### 1. 本番APIキーの取得
1. Stripeダッシュボードで「Developers」→「API keys」を開く
2. 「Live mode」に切り替え
3. 「Secret key」と「Publishable key」を取得
4. Vercelの環境変数に設定

### 2. Webhookの設定
1. Stripeダッシュボードで「Webhooks」を開く
2. 「Add endpoint」をクリック
3. URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. イベントを選択:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. シークレットを取得し、Vercelの環境変数に設定

---

## Google OAuth 本番環境の設定

### 1. リダイレクトURIの追加
1. Google Cloud ConsoleでOAuth認証情報を開く
2. 「承認済みのリダイレクト URI」に追加:
   - `https://your-domain.vercel.app/api/auth/callback/google`

### 2. 承認済みのJavaScript生成元
- `https://your-domain.vercel.app`

---

## データベースマイグレーション

### 本番環境でのマイグレーション実行
```bash
# 環境変数を設定
export TURSO_DATABASE_URL=libsql://your-production-database-url
export TURSO_AUTH_TOKEN=your-production-auth-token

# マイグレーション実行
npm run db:migrate
```

または、Vercelのビルド時に自動実行する設定を追加。

---

## ドメイン設定

### カスタムドメインの追加
1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Domains」を開く
3. カスタムドメインを追加
4. DNS設定を確認

### DNS設定例
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

---

## モニタリング

### Vercel Analytics
1. Vercelダッシュボードで「Analytics」を開く
2. 有効化

### エラーログ
- Vercelダッシュボードの「Logs」で確認
- Sentryなどのエラー追跡サービスを統合（推奨）

---

## パフォーマンス最適化

### 画像最適化
- Next.js Image最適化を有効化
- Cloudflare R2のCDNを活用

### キャッシュ設定
- VercelのEdge Cachingを活用
- ISR（Incremental Static Regeneration）を適切に設定

---

## バックアップ

### データベースバックアップ
```bash
# Turso CLIでバックアップ
turso db backup horrorring-production backup-$(date +%Y%m%d).sql
```

### R2バックアップ
- Cloudflare R2の自動レプリケーション機能を活用
- 定期的な手動バックアップも検討

---

## ロールバック

### Vercelでのロールバック
1. Vercelダッシュボードで「Deployments」を開く
2. ロールバックしたいデプロイを選択
3. 「Promote to Production」をクリック

---

## セキュリティチェックリスト

- [ ] 環境変数が正しく設定されているか
- [ ] HTTPSが有効になっているか
- [ ] CORS設定が適切か
- [ ] レートリミットが実装されているか
- [ ] エラーハンドリングが適切か
- [ ] ログに機密情報が含まれていないか

---

## トラブルシューティング

### デプロイエラー
- ビルドログを確認
- 環境変数が正しく設定されているか確認
- 依存関係のバージョンを確認

### データベース接続エラー
- Tursoの接続情報を確認
- ネットワーク設定を確認

### R2アップロードエラー
- R2の認証情報を確認
- CORS設定を確認

---

## 参考資料

- [Vercel ドキュメント](https://vercel.com/docs)
- [Turso ドキュメント](https://docs.turso.tech/)
- [Cloudflare R2 ドキュメント](https://developers.cloudflare.com/r2/)
