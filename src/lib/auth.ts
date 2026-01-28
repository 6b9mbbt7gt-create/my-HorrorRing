import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: false, // Google OAuth only
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: false,
        unique: true,
      },
      bio: {
        type: 'string',
        required: false,
      },
      language: {
        type: 'string',
        required: false,
        defaultValue: 'ja',
      },
      planType: {
        type: 'string',
        required: false,
        defaultValue: 'free',
      },
      planExpiresAt: {
        type: 'string',
        required: false,
      },
    },
  },
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
  basePath: '/api/auth',
  secret: process.env.BETTER_AUTH_SECRET!,
});

export type Session = typeof auth.$Infer.Session;
