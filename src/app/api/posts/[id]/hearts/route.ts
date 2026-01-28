import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { toggleHeart, isHearted } from '@/dal/hearts';
import { checkPlanLimit, incrementPlanLimit } from '@/lib/plan-limits';
import { createNotification } from '@/dal/notifications';
import { getPostById } from '@/dal/posts';

type HeartParams = {
  params: Promise<{ id: string }>;
};

/**
 * POST /api/posts/[id]/hearts
 * ハートを追加/削除（トグル）
 */
export async function POST(
  request: NextRequest,
  { params }: HeartParams
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

    // プラン制限チェック
    const canHeart = await checkPlanLimit(session.user.id, 'heart');
    if (!canHeart) {
      return NextResponse.json(
        { error: 'ハート数の上限に達しています' },
        { status: 403 }
      );
    }

    const result = await toggleHeart(id, session.user.id);

    // プラン制限の使用量を増やす
    await incrementPlanLimit(session.user.id, 'heart');

    // 通知を作成（ハートした場合のみ、投稿主に通知）
    if (result.hearted) {
      const post = await getPostById(id);
      if (post && post.userId !== session.user.id) {
        await createNotification(post.userId, {
          type: 'heart',
          content: `${session.user.name || session.user.email}があなたの投稿にハートしました`,
          relatedUserId: session.user.id,
          relatedPostId: id,
        });
      }
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Toggle heart error:', error);
    return NextResponse.json(
      { error: 'ハートの処理に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/posts/[id]/hearts
 * ハート状態を確認
 */
export async function GET(
  request: NextRequest,
  { params }: HeartParams
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ hearted: false }, { status: 200 });
    }

    const { id } = await params;
    const hearted = await isHearted(id, session.user.id);

    return NextResponse.json({ hearted }, { status: 200 });
  } catch (error: any) {
    console.error('Get heart status error:', error);
    return NextResponse.json(
      { error: 'ハート状態の取得に失敗しました' },
      { status: 500 }
    );
  }
}
