import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { getUserById } from '@/dal/users';

type UserParams = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/users/[id]
 * ユーザー情報を取得
 */
export async function GET(
  request: NextRequest,
  { params }: UserParams
) {
  try {
    const { id } = await params;
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // パスワードなどの機密情報を除外
    const { password, ...safeUser } = user as any;

    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'ユーザー情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}
