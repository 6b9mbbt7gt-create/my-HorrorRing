import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { markAllNotificationsAsRead } from '@/dal/notifications';

/**
 * POST /api/notifications/read-all
 * すべての通知を既読にする
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

    await markAllNotificationsAsRead(session.user.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Mark all notifications as read error:', error);
    return NextResponse.json(
      { error: '通知の更新に失敗しました' },
      { status: 500 }
    );
  }
}
