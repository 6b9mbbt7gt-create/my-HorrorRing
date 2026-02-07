import Link from 'next/link';
import { Unlock, Crown } from 'lucide-react';
import { Button } from '../common/Button';
import { Check, X } from 'lucide-react';

export function PricingSection() {
  const plans = [
    {
      name: '無料プラン',
      price: '¥0',
      period: '/月',
      description: '無料で始める',
      icon: Unlock,
      features: [
        { text: '1日5投稿まで', included: true },
        { text: '画像アップロード（5枚/投稿、5MB/枚）', included: true },
        { text: '基本検索機能', included: true },
        { text: 'コメント・いいね・ゾクゾク', included: true },
        { text: 'DM（1日5通）', included: true },
        { text: '動画アップロード', included: false },
        { text: '広告なし', included: false },
        { text: '高度な検索', included: false },
      ],
      buttonText: '無料で堕ちる',
      popular: false,
      gradient: 'from-red-950 to-black',
      borderColor: 'border-red-900',
    },
    {
      name: '有料プラン',
      price: '¥980',
      period: '/月',
      description: 'すべての機能を解放',
      icon: Crown,
      features: [
        { text: '無制限投稿', included: true },
        { text: '画像アップロード（無制限、20MB/枚）', included: true },
        { text: '動画アップロード（5分、500MB）', included: true },
        { text: '広告なし', included: true },
        { text: '高度な検索・フィルタリング', included: true },
        { text: 'ブックマーク機能', included: true },
        { text: 'プロフィールカスタマイズ', included: true },
        { text: '特別バッジ・限定コンテンツ', included: true },
      ],
      buttonText: 'プレミアムに登録',
      popular: true,
      gradient: 'from-red-800 to-red-950',
      borderColor: 'border-red-600',
    },
  ];

  return (
    <section
      id="pricing"
      className="py-20 blood-gradient px-4 relative"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-red-900/60" />
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-16 space-y-4">
          <p className="text-red-800 text-sm font-bold tracking-widest">
            PRICING
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white blood-text">
            料金プラン
          </h2>
          <p className="text-red-300/80 text-lg">
            あなたに合ったプランを選んで、ホラー体験を楽しもう
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`relative bg-red-950/30 border-2 ${plan.borderColor} rounded-xl p-8 ${
                  plan.popular
                    ? 'scale-105 shadow-[0_0_50px_rgba(139,0,0,0.25)] ring-2 ring-red-700/50'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-700 to-red-900 text-white px-4 py-1.5 rounded-full text-sm font-bold border border-red-600 shadow-[0_0_15px_rgba(139,0,0,0.5)]">
                    人気プラン
                  </div>
                )}

                <div className="text-center mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.gradient} mb-4 border border-red-800/50`}
                  >
                    <Icon className="w-8 h-8 text-red-200" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-100 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-red-400/80 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-red-400/80">{plan.period}</span>
                  </div>
                </div>

                <Link href="/login" className="block mb-6">
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className={`w-full font-bold ${
                      plan.popular
                        ? 'bg-red-700 hover:bg-red-600 border-2 border-red-500/50 shadow-[0_0_20px_rgba(139,0,0,0.4)]'
                        : 'bg-red-950/80 border-2 border-red-900 text-red-200 hover:bg-red-900'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-red-950 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? 'text-red-200/90'
                            : 'text-red-900'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
