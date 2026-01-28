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
      description: 'ホラーゲームのレビュー、心霊スポットの写真、都市伝説の体験談を共有しよう',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: MessageSquare,
      title: 'コミュニティ',
      description: 'コメント、いいね、ハートで仲間とつながる。恐怖を分かち合おう',
      color: 'from-red-600 to-red-700',
    },
    {
      icon: Search,
      title: '探索機能',
      description: 'ジャンル別、地域別に恐怖体験を検索。あなただけの恐怖を見つけよう',
      color: 'from-red-700 to-red-800',
    },
    {
      icon: MapPin,
      title: '心霊スポット',
      description: 'Google Maps連携で正確な位置情報。実際に訪れた人の生の声を確認',
      color: 'from-orange-600 to-red-600',
    },
    {
      icon: Video,
      title: '動画投稿',
      description: '有料プランで動画アップロード可能。リアルな恐怖体験を映像で共有',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Crown,
      title: 'プレミアム',
      description: '無制限投稿、広告なし、限定コンテンツへのアクセス',
      color: 'from-amber-500 to-red-600',
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-black px-4"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            主要機能
          </h2>
          <p className="text-gray-400 text-lg">
            HorrorRingで恐怖体験を最大限に楽しむための機能
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-600 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
