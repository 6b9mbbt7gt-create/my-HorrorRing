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
        { text: 'コメント・いいね・ハート', included: true },
        { text: 'DM（1日5通）', included: true },
        { text: '動画アップロード', included: false },
        { text: '広告なし', included: false },
        { text: '高度な検索', included: false },
      ],
      buttonText: '無料で始める',
      popular: false,
      gradient: 'from-gray-800 to-gray-900',
      borderColor: 'border-gray-700',
    },
    {
      name: '有料プラン',
      price: '¥1,000',
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
      gradient: 'from-red-600 to-red-800',
      borderColor: 'border-red-500',
    },
  ];

  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-b from-black to-slate-950 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            料金プラン
          </h2>
          <p className="text-gray-400 text-lg">
            あなたに合ったプランを選んで、恐怖の世界に飛び込もう
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`relative bg-gray-900 border-2 ${plan.borderColor} rounded-xl p-8 ${
                  plan.popular ? 'scale-105 shadow-2xl shadow-red-500/20' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-1 rounded-full text-sm font-bold">
                    人気プラン
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.gradient} mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </div>

                <Link href="/login" className="block mb-6">
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {plan.buttonText}
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-gray-300' : 'text-gray-600'
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
