# Vercelデプロイ手順

## 前提条件

- GitHubアカウント
- Vercelアカウント（GitHubアカウントで連携可能）

## デプロイ手順

### 1. GitHubリポジトリの作成とプッシュ

**重要**: まずGitHubでリポジトリを作成してください（空のリポジトリでOK）。

```bash
# プロジェクトディレクトリで実行
cd /Users/fukumotoryou/projects/my-HorrorRing

# Gitリポジトリの初期化
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: HorrorRing MVP"

# GitHubでリポジトリを作成後、以下を実行
# （GitHubでリポジトリを作成する際、README、.gitignore、LICENSEは追加しない）
git remote add origin https://github.com/your-username/my-HorrorRing.git
git branch -M main
git push -u origin main
```

**注意**: `.env.local` は `.gitignore` に含まれているため、GitHubにはプッシュされません。環境変数はVercelで設定してください。

### 2. Vercelでプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. "Add New..." → "Project" をクリック
3. GitHubリポジトリ `my-HorrorRing` を選択
4. プロジェクト設定：
   - **Framework Preset**: Next.js（自動検出されるはず）
   - **Root Directory**: `./`（デフォルト）
   - **Build Command**: `npm run build`（デフォルト）
   - **Output Directory**: `.next`（デフォルト）
   - **Install Command**: `npm install`（デフォルト）

### 3. 環境変数の設定

Vercelのプロジェクト設定画面で、以下の環境変数を追加：

#### 必須環境変数
```
TURSO_DATABASE_URL=libsql://your-database-url
TURSO_AUTH_TOKEN=your-auth-token
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=https://your-vercel-url.vercel.app
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

#### Google OAuth（設定済みの場合）
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Polar（設定済みの場合）
```
POLAR_API_KEY=your-polar-api-key
POLAR_ORG_SLUG=horrorring
POLAR_PREMIUM_PRODUCT_ID=prod_...
POLAR_PREMIUM_PRICE_ID=price_...
POLAR_WEBHOOK_SECRET=your-webhook-secret
POLAR_API_BASE_URL=https://api.polar.sh/v1
```

#### Cloudflare R2（設定済みの場合）
```
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=horrorring-media
R2_PUBLIC_URL=https://your-r2-domain.com
```

### 4. デプロイ実行

1. "Deploy" ボタンをクリック
2. ビルドが完了するまで待機（数分）
3. デプロイ完了後、表示されたURL（例: `https://my-horrorring-xxxxx.vercel.app`）を確認

### 5. Polarの設定を更新

1. Polarダッシュボードに戻る
2. "Website URL" にVercelのURLを入力（例: `https://my-horrorring-xxxxx.vercel.app`）
3. Webhook URLを設定: `https://my-horrorring-xxxxx.vercel.app/api/webhooks/polar`

### 6. Google OAuthの設定を更新

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. OAuth 2.0 クライアントIDの設定画面を開く
3. 「認証済みのリダイレクトURI」に以下を追加：
   - `https://my-horrorring-xxxxx.vercel.app/api/auth/callback/google`

## デプロイができないときのチェックリスト

デプロイには **2つの方法** があります。まずどちらを使うか決めましょう。

### 方法A: Vercel の GitHub 連携（推奨・簡単）

GitHub にプッシュするだけで Vercel が自動デプロイします。`.github/workflows/deploy.yml` は **使わなくてOK** です。

| やること | 確認 |
|----------|------|
| 1. GitHub にリポジトリがある | `main` にプッシュ済みか |
| 2. Vercel でプロジェクトをインポート | [Vercel Dashboard](https://vercel.com/dashboard) → Add New → Project → 対象リポジトリを選択 |
| 3. 必須の環境変数を Vercel に設定 | 下記「必須環境変数」を参照 |
| 4. 初回デプロイ | Deploy ボタンまたは `main` にプッシュ |

**必須環境変数（Vercel の Settings → Environment Variables）**

- `NEXT_PUBLIC_APP_URL` … デプロイ後のURL（例: `https://my-horrorring-xxx.vercel.app`）。初回は仮でOK。デプロイ後に正しいURLに更新
- `TURSO_DATABASE_URL` … Turso の接続URL（`libsql://...`）
- `TURSO_AUTH_TOKEN` … Turso の認証トークン
- `BETTER_AUTH_SECRET` … 32文字以上のランダム文字列
- `BETTER_AUTH_URL` … 上と同じくデプロイ後のURL

Google OAuth / Polar / R2 は後から追加しても動作します（該当機能だけ無効になります）。

### 方法B: GitHub Actions でデプロイ（deploy.yml を使う場合）

`.github/workflows/deploy.yml` で Vercel にデプロイするには、**GitHub の Secrets** に以下がすべて必要です。

| Secret 名 | 説明 |
|-----------|------|
| `VERCEL_TOKEN` | Vercel → Settings → Tokens で作成 |
| `VERCEL_ORG_ID` | Vercel プロジェクトの Settings → General に表示 |
| `VERCEL_PROJECT_ID` | 同上 |
| `NEXT_PUBLIC_APP_URL` | 本番URL |
| `TURSO_DATABASE_URL` | Turso 接続URL |
| `TURSO_AUTH_TOKEN` | Turso トークン |
| `BETTER_AUTH_SECRET` | 認証用シークレット |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | （OAuth を使う場合） |
| `R2_*` / `POLAR_*` | （R2・Polar を使う場合） |

**Secrets の設定場所**: GitHub リポジトリ → Settings → Secrets and variables → Actions → New repository secret

---

## トラブルシューティング

### ビルドエラーが発生する場合

- ターミナルで `npm run build` を実行してローカルでエラーを確認
- エラーログを確認して修正

### 環境変数が反映されない場合

- Vercelの環境変数設定画面で、すべての環境（Production, Preview, Development）に設定されているか確認
- デプロイを再実行

### データベース接続エラー

- TursoのURLとトークンが正しく設定されているか確認
- ネットワークアクセスが許可されているか確認

## カスタムドメインの設定（オプション）

1. Vercelのプロジェクト設定 → "Domains"
2. カスタムドメインを追加（例: `horrorring.com`）
3. DNS設定をVercelの指示に従って更新
