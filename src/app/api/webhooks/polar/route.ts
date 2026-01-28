import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/polar/client';
import { updateUserProfile } from '@/dal/users';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

/**
 * POST /api/webhooks/polar
 * Polar Webhookを処理
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('polar-signature') || headersList.get('x-polar-signature');

  if (!signature) {
    console.warn('Polar webhook signature missing');
    return NextResponse.json(
      { error: '署名がありません' },
      { status: 400 }
    );
  }

  try {
    // Webhook署名の検証
    const isValid = await verifyWebhookSignature(body, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: '無効な署名です' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    // Polar Webhookイベントタイプに応じて処理
    switch (event.type) {
      case 'checkout.completed':
      case 'subscription.created': {
        const metadata = event.data?.metadata || {};
        const userId = metadata.userId;
        const planType = metadata.planType;

        if (userId && planType === 'premium') {
          // プランの有効期限を設定（30日後）
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 30);
          
          // ユーザーのプラン情報を更新
          await db
            .update(users)
            .set({
              planType: 'premium',
              planExpiresAt: expiresAt.toISOString(),
            })
            .where(eq(users.id, userId));
        }
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.expired': {
        const metadata = event.data?.metadata || {};
        const userId = metadata.userId;

        if (userId) {
          // プランを無料に戻す
          await db
            .update(users)
            .set({
              planType: 'free',
              planExpiresAt: null,
            })
            .where(eq(users.id, userId));
        }
        break;
      }

      case 'subscription.updated': {
        // サブスクリプション更新時の処理
        const metadata = event.data?.metadata || {};
        const userId = metadata.userId;
        const subscription = event.data;

        if (userId && subscription) {
          // 有効期限を更新（必要に応じて）
          const expiresAt = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null;

          await db
            .update(users)
            .set({
              planExpiresAt: expiresAt,
            })
            .where(eq(users.id, userId));
        }
        break;
      }

      default:
        console.log(`Unhandled Polar event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Polar webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook処理に失敗しました', details: error.message },
      { status: 400 }
    );
  }
}
