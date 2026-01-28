# Polar セットアップガイド

## Polar初期セットアップ

### 1. Polarダッシュボードでの設定

#### 1.1 アカウント情報の設定

1. [Polar Dashboard](https://polar.sh/dashboard/horrorring) にアクセス
2. 「あなたのビジネスについて」に以下を入力：

```
HorrorRing is a community-driven social platform focused on horror games, haunted spots, and urban legends. 
Users can post reviews, experiences, photos, and other horror-related content, and interact through comments, likes, hearts, and follows. 
We offer a free plan and a premium subscription plan that provides higher usage limits and additional community features.
```

#### 1.2 Website URLの設定

**重要**: まだVercelにデプロイしていない場合、以下のいずれかの方法で対応してください：

**方法A: 一旦スキップ（推奨）**
- Website URLが必須でない場合は、一旦スキップして後で設定
- Vercelデプロイ完了後、正しいURLを設定

**方法B: 一時的なURLを入力**
- 一旦 `https://example.com` などを入力して先に進む
- デプロイ完了後、正しいURLに更新

**方法C: ngrokで一時公開**
```bash
# ローカルサーバーを起動
npm run dev

# 別ターミナルでngrokを起動
ngrok http 3000
```
- 表示された `https://xxxx.ngrok.io` を入力（一時的なURL）

**デプロイ完了後**:
- VercelのURL（例: `https://my-horrorring-xxxxx.vercel.app`）を入力

### 2. Premiumプランの作成

1. Polarダッシュボードで「Products」→「Create Product」
2. 以下の設定で作成：
   - **Name**: Premium Plan
   - **Description**: プレミアムプラン - 無制限投稿、広告なし、高度な機能
   - **Price**: ¥980/月（または希望の価格）
   - **Billing Period**: Monthly
3. 作成後、**Product ID** と **Price ID** をコピー

### 3. 環境変数の設定

`.env.local` に以下を追加：

```env
POLAR_API_KEY=your-polar-api-key
POLAR_ORG_SLUG=horrorring
POLAR_PREMIUM_PRODUCT_ID=prod_...  # 上記で取得したProduct ID
POLAR_PREMIUM_PRICE_ID=price_...   # 上記で取得したPrice ID
POLAR_WEBHOOK_SECRET=your-webhook-secret
POLAR_API_BASE_URL=https://api.polar.sh/v1
```

### 4. APIキーの取得

1. Polarダッシュボード → 「Settings」→ 「API Keys」
2. 「Create API Key」をクリック
3. 生成されたAPIキーをコピーして `.env.local` の `POLAR_API_KEY` に設定

### 5. Webhookの設定

#### 5.1 ローカル開発環境（ngrok使用）

```bash
# ngrokでローカルサーバーを公開
ngrok http 3000
```

1. 表示されたURL（例: `https://xxxx.ngrok.io`）をコピー
2. Polarダッシュボード → 「Settings」→ 「Webhooks」
3. 「Add Webhook Endpoint」をクリック
4. URL: `https://xxxx.ngrok.io/api/webhooks/polar`
5. イベント: すべて選択（または必要最小限）
6. Webhook Secretをコピーして `.env.local` の `POLAR_WEBHOOK_SECRET` に設定

#### 5.2 本番環境

1. Vercelにデプロイ完了後、URLを確認（例: `https://my-horrorring-xxxxx.vercel.app`）
2. Polarダッシュボード → 「Settings」→ 「Webhooks」
3. 「Add Webhook Endpoint」をクリック
4. URL: `https://my-horrorring-xxxxx.vercel.app/api/webhooks/polar`
5. イベント: すべて選択
6. Webhook SecretをコピーしてVercelの環境変数に設定

### 6. 動作確認

1. 開発サーバーを起動
```bash
npm run dev
```

2. ブラウザで `http://localhost:3000/subscriptions` にアクセス
3. 「プランを選択」ボタンをクリック
4. Polarのチェックアウト画面が表示されることを確認

## トラブルシューティング

### Website URLでエラーが出る

- まだデプロイしていない場合、一旦スキップまたは一時的なURLを入力
- デプロイ完了後、正しいURLに更新

### Checkoutセッションが作成できない

- `POLAR_API_KEY` が正しく設定されているか確認
- `POLAR_PREMIUM_PRODUCT_ID` と `POLAR_PREMIUM_PRICE_ID` が正しく設定されているか確認
- PolarダッシュボードでProduct/Priceが有効になっているか確認

### Webhookが届かない

- Webhook URLが正しく設定されているか確認
- `POLAR_WEBHOOK_SECRET` が正しく設定されているか確認
- PolarダッシュボードのWebhook配信履歴を確認

## 参考リンク

- [Polar Documentation](https://docs.polar.sh)
- [Polar API Reference](https://docs.polar.sh/api-reference)
