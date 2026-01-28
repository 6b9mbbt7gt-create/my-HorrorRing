import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { getNotifications, getUnreadNotificationCount } from '@/dal/notifications';

/**
 * GET /api/notifications
 * 通知一覧を取得
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

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');

    const notifications = await getNotifications(session.user.id, limit);
    const unreadCount = await getUnreadNotificationCount(session.user.id);

    return NextResponse.json(
      { notifications, unreadCount },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: '通知の取得に失敗しました' },
      { status: 500 }
    );
  }
}
