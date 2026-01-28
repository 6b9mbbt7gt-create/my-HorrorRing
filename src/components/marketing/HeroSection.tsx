import Link from 'next/link';
import { Users, Camera, MapPin, Star } from 'lucide-react';
import { Button } from '../common/Button';

export function HeroSection() {
  const stats = [
    { icon: Users, value: '10K+', label: 'ユーザー' },
    { icon: Camera, value: '50K+', label: '投稿' },
    { icon: MapPin, value: '1K+', label: 'スポット' },
    { icon: Star, value: '100K+', label: 'レビュー' },
  ];

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-slate-950 to-purple-950 px-4 pt-20"
    >
      <div className="max-w-6xl w-full text-center space-y-12">
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-7xl font-bold text-white leading-tight">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              恐怖を共有する
            </span>
            <br />
            <span className="text-white">新しい世界</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            ホラーゲーム、心霊スポット、都市伝説。
            <br />
            すべての恐怖体験が集まるSNSプラットフォーム
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              無料で始める
            </Button>
          </Link>
          <a href="#features">
            <Button variant="secondary" size="lg">
              詳しく見る
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 backdrop-blur-sm"
              >
                <Icon className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
