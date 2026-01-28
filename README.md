# HorrorRing

ホラーゲーム、心霊スポット、都市伝説などの情報を集約したSNSプラットフォーム。

## 技術スタック

- **フレームワーク**: Next.js 14+ (App Router)
- **言語**: TypeScript
- **データベース**: Turso (SQLite)
- **ORM**: Drizzle ORM
- **認証**: betterAuth (Google OAuth)
- **決済**: Polar
- **ストレージ**: Cloudflare R2
- **スタイリング**: Tailwind CSS

## セットアップ

詳細は [docs/SETUP.md](./docs/SETUP.md) を参照してください。

### クイックスタート

1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定
`.env.local.example` を参考に `.env.local` を作成し、必要な環境変数を設定してください。

3. 開発サーバーの起動
```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## デプロイ

詳細は [DEPLOY.md](./DEPLOY.md) を参照してください。

### Vercelへのデプロイ

1. GitHubリポジトリにプッシュ
2. [Vercel Dashboard](https://vercel.com/dashboard) でプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

## ドキュメント

- [要件定義](./docs/requirements.md)
- [API設計](./docs/api-design.md)
- [セットアップガイド](./docs/SETUP.md)
- [デプロイ手順](./DEPLOY.md)
- [開発タスク管理](./docs/TODO.md)

## ライセンス

Private
