'use client';

import { useState } from 'react';
import { Crown, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Alert } from '../common/Alert';

type Plan = {
  name: string;
  priceId: string | null;
  monthlyPrice?: number;
  features: {
    postLimit: number;
    likeLimit: number;
    heartLimit: number;
    dmLimit: number;
  };
};

type SubscriptionCardProps = {
  plan: Plan;
  isCurrentPlan: boolean;
  isPremium: boolean;
  expiresAt?: Date | null;
};

export function SubscriptionCard({
  plan,
  isCurrentPlan,
  isPremium,
  expiresAt,
}: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (isCurrentPlan) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: isPremium ? 'premium' : 'free' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'サブスクリプションの作成に失敗しました');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'サブスクリプションの作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-gray-900 border rounded-lg p-6 ${
        isCurrentPlan ? 'border-purple-600' : 'border-gray-800'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        {isPremium && <Crown className="w-6 h-6 text-amber-500" />}
        <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
        {isCurrentPlan && (
          <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
            現在のプラン
          </span>
        )}
      </div>

      {isPremium && plan.monthlyPrice && (
        <div className="mb-4">
          <span className="text-3xl font-bold text-white">¥{plan.monthlyPrice}</span>
          <span className="text-gray-400 ml-2">/月</span>
        </div>
      )}

      {expiresAt && (
        <p className="text-sm text-gray-400 mb-4">
          有効期限: {expiresAt.toLocaleDateString('ja-JP')}
        </p>
      )}

      <ul className="space-y-2 mb-6">
        <li className="flex items-center gap-2 text-gray-300">
          <Check className="w-5 h-5 text-green-500" />
          投稿: {plan.features.postLimit}件/日
        </li>
        <li className="flex items-center gap-2 text-gray-300">
          <Check className="w-5 h-5 text-green-500" />
          いいね: {plan.features.likeLimit}件/日
        </li>
        <li className="flex items-center gap-2 text-gray-300">
          <Check className="w-5 h-5 text-green-500" />
          ハート: {plan.features.heartLimit}件/日
        </li>
        <li className="flex items-center gap-2 text-gray-300">
          <Check className="w-5 h-5 text-green-500" />
          DM: {plan.features.dmLimit}件/日
        </li>
      </ul>

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      {!isCurrentPlan && (
        <Button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              処理中...
            </span>
          ) : (
            'プランを選択'
          )}
        </Button>
      )}
    </div>
  );
}
