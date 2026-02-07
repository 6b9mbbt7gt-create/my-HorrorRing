import Link from 'next/link';
import { Users, Camera, MapPin, Skull } from 'lucide-react';
import { Button } from '../common/Button';

export function HeroSection() {
  const stats = [
    { icon: Users, value: '10K+', label: 'ユーザー' },
    { icon: Camera, value: '50K+', label: '投稿' },
    { icon: MapPin, value: '1K+', label: 'スポット' },
    { icon: Skull, value: '100K+', label: 'レビュー' },
  ];

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center blood-gradient px-4 pt-20 relative"
    >
      {/* 上部の血の帯 */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-red-900/80 to-transparent warning-glow" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-red-950/60" />

      <div className="max-w-6xl w-full text-center space-y-12 relative">
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-tight tracking-tight">
            <span className="blood-text drop-shadow-[0_0_30px_rgba(139,0,0,0.9)]">
              恐怖を共有する
            </span>
            <br />
            <span className="text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]">
              新しい世界
            </span>
          </h1>
          <p className="text-xl text-red-200/90 max-w-2xl mx-auto font-medium">
            ホラーゲーム・心霊スポット・都市伝説。
            <br />
            <span className="text-red-300/80">
              すべての恐怖体験が集まるSNS
            </span>
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/login">
            <Button
              size="lg"
              className="bg-red-700 hover:bg-red-600 border-2 border-red-500/50 text-white font-bold shadow-[0_0_20px_rgba(139,0,0,0.5)] hover:shadow-[0_0_30px_rgba(139,0,0,0.7)]"
            >
              無料で始める
            </Button>
          </Link>
          <a href="#features">
            <Button
              variant="secondary"
              size="lg"
              className="bg-red-950/80 border-2 border-red-900 text-red-200 hover:bg-red-900/80 hover:text-white"
            >
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
                className="bg-red-950/40 border-2 border-red-900/80 rounded-lg p-6 backdrop-blur-sm hover:border-red-700/80 transition-colors"
              >
                <Icon className="w-8 h-8 text-red-500 mx-auto mb-2 drop-shadow-[0_0_8px_rgba(139,0,0,0.6)]" />
                <div className="text-2xl font-bold text-red-200 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-red-300/80">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 下部の血の帯 */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-red-900/60 to-transparent" />
    </section>
  );
}
