import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';
import { getUserById } from '@/dal/users';
import { PLANS } from '@/lib/polar/config';
import { SubscriptionCard } from '@/components/subscriptions/SubscriptionCard';

export default async function SubscriptionsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const user = await getUserById(session.user.id);
  if (!user) {
    redirect('/login');
  }

  const currentPlan = (user.planType as 'free' | 'premium') || 'free';
  const planExpiresAt = user.planExpiresAt ? new Date(user.planExpiresAt) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">サブスクリプション</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SubscriptionCard
          plan={PLANS.free}
          isCurrentPlan={currentPlan === 'free'}
          isPremium={false}
        />
        <SubscriptionCard
          plan={PLANS.premium}
          isCurrentPlan={currentPlan === 'premium'}
          isPremium={true}
          expiresAt={planExpiresAt}
        />
      </div>
    </div>
  );
}
