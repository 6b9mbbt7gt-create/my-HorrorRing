import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { getUserById, updateUserProfile } from '@/dal/users';
import { updateProfileSchema } from '@/lib/utils/validation';

/**
 * GET /api/users/me
 * 現在のユーザー情報を取得
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const user = await getUserById(session.user.id);
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
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'ユーザー情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/me
 * 現在のユーザープロフィールを更新
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = updateProfileSchema.parse(body);

    const user = await updateUserProfile(session.user.id, validated);

    if (!user) {
      return NextResponse.json(
        { error: 'プロフィールの更新に失敗しました' },
        { status: 500 }
      );
    }

    // パスワードなどの機密情報を除外
    const { password, ...safeUser } = user as any;

    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'プロフィールの更新に失敗しました' },
      { status: 500 }
    );
  }
}
