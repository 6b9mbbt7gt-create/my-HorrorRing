import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const handler = toNextJsHandler(auth);

/**
 * POST /api/auth/logout
 * ログアウト処理（betterAuthのハンドラーに転送）
 */
export const POST = handler.POST;
