import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { getComments, createComment } from '@/dal/comments';
import { createNotification } from '@/dal/notifications';
import { getPostById } from '@/dal/posts';
import { z } from 'zod';

type CommentParams = {
  params: Promise<{ id: string }>;
};

const commentCreateSchema = z.object({
  content: z.string().min(1).max(5000),
  parentId: z.string().optional(),
});

/**
 * GET /api/posts/[id]/comments
 * コメント一覧を取得
 */
export async function GET(
  request: NextRequest,
  { params }: CommentParams
) {
  try {
    const { id } = await params;
    const comments = await getComments(id);

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error: any) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: 'コメントの取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts/[id]/comments
 * コメントを作成
 */
export async function POST(
  request: NextRequest,
  { params }: CommentParams
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
    const body = await request.json();
    const validated = commentCreateSchema.parse(body);

    const comment = await createComment(id, session.user.id, {
      content: validated.content,
      parentId: validated.parentId,
    });

    // 通知を作成（投稿主に通知）
    const post = await getPostById(id);
    if (post && post.userId !== session.user.id) {
      await createNotification(post.userId, {
        type: 'comment',
        content: `${session.user.name || session.user.email}があなたの投稿にコメントしました`,
        relatedUserId: session.user.id,
        relatedPostId: id,
      });
    }

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: 'コメントの作成に失敗しました' },
      { status: 500 }
    );
  }
}
