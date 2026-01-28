import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { createCheckoutSession } from '@/lib/polar/client';
import { PLANS, POLAR_CONFIG } from '@/lib/polar/config';

/**
 * POST /api/subscriptions/checkout
 * Polar Checkoutセッションを作成
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planType } = body;

    if (planType !== 'premium') {
      return NextResponse.json(
        { error: '無効なプランです' },
        { status: 400 }
      );
    }

    const plan = PLANS.premium;
    if (!plan.productId || !plan.priceId) {
      return NextResponse.json(
        { error: 'プランの設定が完了していません。POLAR_PREMIUM_PRODUCT_IDとPOLAR_PREMIUM_PRICE_IDを設定してください。' },
        { status: 500 }
      );
    }

    if (!POLAR_CONFIG.apiKey) {
      return NextResponse.json(
        { error: 'Polar APIキーが設定されていません' },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const checkoutSession = await createCheckoutSession({
      productId: plan.productId,
      priceId: plan.priceId,
      customerEmail: session.user.email,
      successUrl: `${baseUrl}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/subscriptions/cancel`,
      metadata: {
        userId: session.user.id,
        planType: 'premium',
      },
    });

    return NextResponse.json(
      { url: checkoutSession.url },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    return NextResponse.json(
      { error: 'チェックアウトセッションの作成に失敗しました', details: error.message },
      { status: 500 }
    );
  }
}
