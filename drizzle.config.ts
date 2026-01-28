import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

// .env.localファイルを読み込む
config({ path: '.env.local' });

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  } as any, // Turso用のauthTokenを許可
} satisfies Config;
