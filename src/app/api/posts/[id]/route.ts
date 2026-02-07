import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { getUserById } from '@/dal/users';
import { getPostById, updatePost, deletePost, deletePostAsAdmin } from '@/dal/posts';

type PostDetailParams = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/posts/[id]
 * 投稿詳細を取得
 */
export async function GET(
  request: NextRequest,
  { params }: PostDetailParams
) {
  try {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
      return NextResponse.json(
        { error: '投稿が見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error: any) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { error: '投稿の取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/posts/[id]
 * 投稿を更新
 */
export async function PATCH(
  request: NextRequest,
  { params }: PostDetailParams
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

    const post = await updatePost(id, session.user.id, {
      title: body.title,
      content: body.content,
      visibility: body.visibility,
    });

    if (!post) {
      return NextResponse.json(
        { error: '投稿が見つからないか、編集権限がありません' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error: any) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: '投稿の更新に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/[id]
 * 投稿を削除
 */
export async function DELETE(
  request: NextRequest,
  { params }: PostDetailParams
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
    const user = await getUserById(session.user.id);
    const isAdmin = user && 'role' in user && user.role === 'admin';

    if (isAdmin) {
      const deleted = await deletePostAsAdmin(id);
      if (!deleted) {
        return NextResponse.json(
          { error: '投稿が見つかりません' },
          { status: 404 }
        );
      }
    } else {
      await deletePost(id, session.user.id);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: '投稿の削除に失敗しました' },
      { status: 500 }
    );
  }
}
