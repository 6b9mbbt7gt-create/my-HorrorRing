// Polar プラン定義
export const PLANS = {
  free: {
    name: '無料プラン',
    productId: null,
    priceId: null,
    features: {
      postLimit: 10,
      likeLimit: 50,
      heartLimit: 20,
      dmLimit: 5,
    },
  },
  premium: {
    name: 'プレミアムプラン',
    productId: process.env.POLAR_PREMIUM_PRODUCT_ID || '',
    priceId: process.env.POLAR_PREMIUM_PRICE_ID || '',
    monthlyPrice: 980,
    features: {
      postLimit: 100,
      likeLimit: 1000,
      heartLimit: 500,
      dmLimit: 100,
    },
  },
} as const;

// Polar API設定
export const POLAR_CONFIG = {
  apiKey: process.env.POLAR_API_KEY || '',
  orgSlug: process.env.POLAR_ORG_SLUG || 'horrorring',
  baseUrl: process.env.POLAR_API_BASE_URL || 'https://api.polar.sh/v1',
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET || '',
} as const;
