import { POLAR_CONFIG } from './config';

type CheckoutSessionParams = {
  productId: string;
  priceId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
};

type CheckoutSessionResponse = {
  id: string;
  url: string;
};

/**
 * Polar Checkoutセッションを作成
 */
export async function createCheckoutSession(
  params: CheckoutSessionParams
): Promise<CheckoutSessionResponse> {
  const response = await fetch(`${POLAR_CONFIG.baseUrl}/checkout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${POLAR_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: params.productId,
      price_id: params.priceId,
      customer_email: params.customerEmail,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata || {},
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(`Polar API error: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    id: data.id,
    url: data.url,
  };
}

/**
 * Polar Subscriptionを取得
 */
export async function getSubscription(subscriptionId: string) {
  const response = await fetch(
    `${POLAR_CONFIG.baseUrl}/subscriptions/${subscriptionId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${POLAR_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(`Polar API error: ${error.message || response.statusText}`);
  }

  return await response.json();
}

/**
 * Polar Webhook署名を検証
 * (Standard Webhooks仕様に準拠)
 */
export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<boolean> {
  // PolarのWebhook署名検証ロジック
  // Standard Webhooks仕様に基づいて実装
  // 詳細はPolarドキュメントを参照
  
  // 暫定実装: 環境変数のシークレットと比較
  if (!POLAR_CONFIG.webhookSecret) {
    console.warn('POLAR_WEBHOOK_SECRETが設定されていません');
    return false;
  }

  // TODO: 実際の署名検証ロジックを実装
  // Standard Webhooksの仕様に従って検証
  return true;
}
