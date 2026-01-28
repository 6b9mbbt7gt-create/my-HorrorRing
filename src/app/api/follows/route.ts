import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { toggleFollow, isFollowing } from '@/dal/follows';
import { createNotification } from '@/dal/notifications';

/**
 * POST /api/follows
 * フォロー/アンフォロー（トグル）
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
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      );
    }

    if (userId === session.user.id) {
      return NextResponse.json(
        { error: '自分自身をフォローすることはできません' },
        { status: 400 }
      );
    }

    const result = await toggleFollow(session.user.id, userId);

    // 通知を作成（フォローした場合のみ）
    if (result.following) {
      await createNotification(userId, {
        type: 'follow',
        content: `${session.user.name || session.user.email}があなたをフォローしました`,
        relatedUserId: session.user.id,
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Toggle follow error:', error);
    return NextResponse.json(
      { error: 'フォロー処理に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/follows
 * フォロー状態を確認
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ following: false }, { status: 200 });
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      );
    }

    const following = await isFollowing(session.user.id, userId);

    return NextResponse.json({ following }, { status: 200 });
  } catch (error: any) {
    console.error('Get follow status error:', error);
    return NextResponse.json(
      { error: 'フォロー状態の取得に失敗しました' },
      { status: 500 }
    );
  }
}
