import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { markNotificationAsRead } from '@/dal/notifications';

type NotificationParams = {
  params: Promise<{ id: string }>;
};

/**
 * PATCH /api/notifications/[id]
 * 通知を既読にする
 */
export async function PATCH(
  request: NextRequest,
  { params }: NotificationParams
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await markNotificationAsRead(id, session.user.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Mark notification as read error:', error);
    return NextResponse.json(
      { error: '通知の更新に失敗しました' },
      { status: 500 }
    );
  }
}
