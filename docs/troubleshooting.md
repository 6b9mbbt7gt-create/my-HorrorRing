# HorrorRing トラブルシューティング

## よくある問題と解決方法

---

## データベース関連

### Turso接続エラー

**症状**: `Failed to connect to database`

**原因**:
- 環境変数が正しく設定されていない
- ネットワーク接続の問題
- Tursoの認証トークンが無効

**解決方法**:
1. `.env.local` の `TURSO_DATABASE_URL` と `TURSO_AUTH_TOKEN` を確認
2. Turso CLIで接続テスト:
   ```bash
   turso db show horrorring
   ```
3. トークンを再生成:
   ```bash
   turso db tokens create horrorring
   ```

---

### マイグレーションエラー

**症状**: `Migration failed`

**原因**:
- スキーマの不整合
- 既存データとの競合

**解決方法**:
1. マイグレーションファイルを確認
2. ローカルでテスト:
   ```bash
   npm run db:migrate
   ```
3. 必要に応じてロールバック:
   ```bash
   npm run db:rollback
   ```

---

## 認証関連

### Google OAuth認証エラー

**症状**: `OAuth callback failed`

**原因**:
- リダイレクトURIが正しく設定されていない
- クライアントID/シークレットが間違っている

**解決方法**:
1. Google Cloud ConsoleでリダイレクトURIを確認:
   - 開発環境: `http://localhost:3000/api/auth/callback/google`
   - 本番環境: `https://your-domain.com/api/auth/callback/google`
2. クライアントIDとシークレットを確認
3. betterAuthの設定を確認

---

### セッションが保持されない

**症状**: ログイン後すぐにログアウトされる

**原因**:
- Cookie設定の問題
- ドメイン設定の問題

**解決方法**:
1. `BETTER_AUTH_URL` が正しく設定されているか確認
2. Cookie設定を確認:
   ```typescript
   // lib/auth.ts
   cookies: {
     sameSite: 'lax',
     secure: process.env.NODE_ENV === 'production',
   }
   ```

---

## ストレージ関連

### R2アップロードエラー

**症状**: `Failed to upload to R2`

**原因**:
- 認証情報が間違っている
- バケット名が間違っている
- CORS設定の問題

**解決方法**:
1. R2の認証情報を確認:
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME`
2. バケットが存在するか確認
3. CORS設定を確認:
   ```json
   [
     {
       "AllowedOrigins": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedHeaders": ["*"]
     }
   ]
   ```

---

### 画像が表示されない

**症状**: アップロードした画像が表示されない

**原因**:
- R2の公開設定が無効
- URLが間違っている

**解決方法**:
1. R2バケットの「Public Access」が有効か確認
2. `R2_PUBLIC_URL` が正しく設定されているか確認
3. 画像URLを直接ブラウザで開いて確認

---

## 決済関連

### Stripe Webhookエラー

**症状**: `Webhook signature verification failed`

**原因**:
- Webhookシークレットが間違っている
- リクエストボディの検証が失敗

**解決方法**:
1. StripeダッシュボードでWebhookシークレットを確認
2. 環境変数 `STRIPE_WEBHOOK_SECRET` を確認
3. Webhookハンドラーでシグネチャ検証を実装:
   ```typescript
   import Stripe from 'stripe';
   
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
   const sig = request.headers.get('stripe-signature')!;
   
   const event = stripe.webhooks.constructEvent(
     await request.text(),
     sig,
     process.env.STRIPE_WEBHOOK_SECRET!
   );
   ```

---

### サブスクリプションが更新されない

**症状**: プラン変更が反映されない

**原因**:
- Webhookが正しく処理されていない
- データベースの更新が失敗

**解決方法**:
1. Webhookのログを確認
2. データベースの `subscriptions` テーブルを確認
3. Stripeダッシュボードでサブスクリプションの状態を確認

---

## パフォーマンス関連

### ページ読み込みが遅い

**症状**: ページの読み込みが3秒以上かかる

**原因**:
- データベースクエリが最適化されていない
- 画像が最適化されていない
- キャッシュが適切に設定されていない

**解決方法**:
1. データベースクエリを最適化:
   - インデックスを追加
   - N+1クエリを解消
2. 画像を最適化:
   - Next.js Imageコンポーネントを使用
   - WebP/AVIF形式に変換
3. キャッシュを設定:
   ```typescript
   export const revalidate = 3600; // 1時間
   ```

---

### メモリリーク

**症状**: 長時間動作させるとメモリ使用量が増加

**原因**:
- イベントリスナーのクリーンアップ不足
- 無限ループ

**解決方法**:
1. useEffectのクリーンアップ関数を実装:
   ```typescript
   useEffect(() => {
     const timer = setInterval(() => {
       // ...
     }, 1000);
     
     return () => clearInterval(timer);
   }, []);
   ```
2. メモリプロファイラーで確認

---

## プラン制限関連

### プラン制限が正しく動作しない

**症状**: 無料プランでも制限がかからない

**原因**:
- プラン制限チェックのロジックが間違っている
- 日次リセットが正しく動作していない

**解決方法**:
1. `checkPlanLimit` 関数を確認
2. `user_daily_limits` テーブルを確認
3. 日次リセットのジョブが正しく動作しているか確認

---

## 多言語対応関連

### 翻訳が表示されない

**症状**: 言語を切り替えても翻訳が適用されない

**原因**:
- i18n設定が間違っている
- リソースファイルが正しく読み込まれていない

**解決方法**:
1. `next-intl` の設定を確認
2. リソースファイルのパスを確認
3. ブラウザのキャッシュをクリア

---

## デプロイ関連

### ビルドエラー

**症状**: Vercelでのビルドが失敗する

**原因**:
- 環境変数が設定されていない
- 依存関係のバージョンが合わない
- TypeScriptエラー

**解決方法**:
1. ビルドログを確認
2. 環境変数を確認
3. ローカルでビルドテスト:
   ```bash
   npm run build
   ```
4. TypeScriptエラーを修正

---

## その他

### 環境変数が読み込まれない

**症状**: `process.env.XXX` が `undefined`

**原因**:
- `.env.local` ファイルが正しく配置されていない
- 環境変数名が間違っている
- クライアント側で `NEXT_PUBLIC_` プレフィックスが必要

**解決方法**:
1. `.env.local` がプロジェクトルートにあるか確認
2. 環境変数名を確認
3. クライアント側で使用する場合は `NEXT_PUBLIC_` を付ける

---

## ログの確認方法

### 開発環境
```bash
# Next.jsのログを確認
npm run dev

# データベースクエリログを確認
# Drizzleのログ設定を有効化
```

### 本番環境
- Vercelダッシュボードの「Logs」を確認
- Sentryなどのエラー追跡サービスを使用

---

## サポート

問題が解決しない場合は、以下を確認:
1. [要件定義書](./requirements.md)
2. [開発ガイドライン](./development-guidelines.md)
3. [API設計書](./api-design.md)

---

## 参考資料

- [Next.js トラブルシューティング](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#error-handling)
- [Turso トラブルシューティング](https://docs.turso.tech/troubleshooting)
- [betterAuth トラブルシューティング](https://www.better-auth.com/docs/troubleshooting)
