/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone' は Docker 等の自己ホスト用。Vercel では不要で、
  // (marketing) ルートグループでスタンドアロンコピーが失敗するため外す。
};

module.exports = nextConfig;
