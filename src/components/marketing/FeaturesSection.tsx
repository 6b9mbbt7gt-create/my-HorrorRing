import {
  Camera,
  MessageSquare,
  Search,
  MapPin,
  Video,
  Crown,
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Camera,
      title: '恐怖を投稿',
      description: 'ホラーゲームのレビュー、心霊スポットの写真、都市伝説の体験談を共有できます。',
      color: 'from-red-800 to-red-950',
    },
    {
      icon: MessageSquare,
      title: 'コミュニティ',
      description: 'コメント・いいね・ゾクゾクで、同じ趣味の仲間とつながれます。',
      color: 'from-red-900 to-red-950',
    },
    {
      icon: Search,
      title: '探索機能',
      description: 'ジャンル別・地域別に検索。気になるホラー体験を見つけよう。',
      color: 'from-red-950 to-black',
    },
    {
      icon: MapPin,
      title: '心霊スポット',
      description: '実際に訪れた人の声をチェック。Google Maps連携で場所も確認できます。',
      color: 'from-red-800 to-red-900',
    },
    {
      icon: Video,
      title: '動画投稿',
      description: '有料プランで動画アップロード可能。映像で伝える恐怖体験。',
      color: 'from-red-700 to-red-900',
    },
    {
      icon: Crown,
      title: 'プレミアム',
      description: '無制限投稿、広告なし、限定コンテンツ。ホラーを思い切り楽しむためのプラン。',
      color: 'from-amber-900 to-red-950',
    },
  ];

  return (
    <section id="features" className="py-20 bg-black px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.08)_0%,transparent_70%)]" />
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-16 space-y-4">
          <p className="text-red-800 text-sm font-bold tracking-widest">
            FEATURES
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white blood-text">
            主な機能
          </h2>
          <p className="text-red-300/80 text-lg max-w-xl mx-auto">
            ホラー好きのための、便利な機能がそろっています
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-red-950/30 border-2 border-red-900/80 rounded-xl p-6 hover:border-red-700 hover:shadow-[0_0_30px_rgba(139,0,0,0.2)] transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-red-800/50`}
                >
                  <Icon className="w-6 h-6 text-red-200" />
                </div>
                <h3 className="text-xl font-bold text-red-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-red-300/70 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
