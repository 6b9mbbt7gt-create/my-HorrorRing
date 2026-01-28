import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { toggleLike, isLiked } from '@/dal/likes';
import { checkPlanLimit, incrementPlanLimit } from '@/lib/plan-limits';
import { createNotification } from '@/dal/notifications';
import { getPostById } from '@/dal/posts';

type LikeParams = {
  params: Promise<{ id: string }>;
};

/**
 * POST /api/posts/[id]/likes
 * いいねを追加/削除（トグル）
 */
export async function POST(
  request: NextRequest,
  { params }: LikeParams
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

    // プラン制限チェック（いいねは無制限の想定だが、念のため）
    const canLike = await checkPlanLimit(session.user.id, 'like');
    if (!canLike) {
      return NextResponse.json(
        { error: 'いいね数の上限に達しています' },
        { status: 403 }
      );
    }

    const result = await toggleLike(id, session.user.id);

    // プラン制限の使用量を増やす
    await incrementPlanLimit(session.user.id, 'like');

    // 通知を作成（いいねした場合のみ、投稿主に通知）
    if (result.liked) {
      const post = await getPostById(id);
      if (post && post.userId !== session.user.id) {
        await createNotification(post.userId, {
          type: 'like',
          content: `${session.user.name || session.user.email}があなたの投稿にいいねしました`,
          relatedUserId: session.user.id,
          relatedPostId: id,
        });
      }
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Toggle like error:', error);
    return NextResponse.json(
      { error: 'いいねの処理に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/posts/[id]/likes
 * いいね状態を確認
 */
export async function GET(
  request: NextRequest,
  { params }: LikeParams
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ liked: false }, { status: 200 });
    }

    const { id } = await params;
    const liked = await isLiked(id, session.user.id);

    return NextResponse.json({ liked }, { status: 200 });
  } catch (error: any) {
    console.error('Get like status error:', error);
    return NextResponse.json(
      { error: 'いいね状態の取得に失敗しました' },
      { status: 500 }
    );
  }
}
