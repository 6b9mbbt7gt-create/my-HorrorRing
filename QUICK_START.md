# クイックスタートガイド

## 1. 依存関係のインストール

```bash
npm install
```

## 2. 環境変数の設定

`.env.local.example` を参考に `.env.local` を作成し、必要な環境変数を設定してください。

**最低限必要な環境変数**:
```
TURSO_DATABASE_URL=libsql://your-database-url
TURSO_AUTH_TOKEN=your-auth-token
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## 4. Vercelデプロイ（本番環境）

詳細は [DEPLOY.md](./DEPLOY.md) を参照してください。

### 簡単な手順

1. **GitHubリポジトリを作成**
   - GitHubで空のリポジトリを作成

2. **コードをプッシュ**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: HorrorRing MVP"
   git remote add origin https://github.com/your-username/my-HorrorRing.git
   git branch -M main
   git push -u origin main
   ```

3. **Vercelでデプロイ**
   - [Vercel Dashboard](https://vercel.com/dashboard) でプロジェクトをインポート
   - 環境変数を設定
   - デプロイ実行

## トラブルシューティング

### npm install でエラーが出る場合

```bash
npm install --legacy-peer-deps
```

### 型エラーが出る場合

```bash
npm run type-check
```

エラーメッセージを確認して修正してください。
