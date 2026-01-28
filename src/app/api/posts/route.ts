import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { getPosts, createPost, addPostImage } from '@/dal/posts';
import { checkPlanLimit, incrementPlanLimit } from '@/lib/plan-limits';
import { postCreateSchema } from '@/lib/utils/validation';

/**
 * GET /api/posts
 * 投稿一覧を取得
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const genre = searchParams.get('genre') as any;
    const userId = searchParams.get('userId') || undefined;

    const posts = await getPosts({ limit, offset, genre, userId });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error: any) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: '投稿の取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * 新規投稿を作成
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

    // プラン制限チェック
    const canPost = await checkPlanLimit(session.user.id, 'post');
    if (!canPost) {
      return NextResponse.json(
        { error: '投稿数の上限に達しています' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = postCreateSchema.parse(body);

    const post = await createPost(session.user.id, {
      title: validated.title,
      content: validated.content,
      postType: validated.postType,
      genre: validated.genre,
      genreId: validated.genreId,
      visibility: validated.visibility,
    });

    // 画像URLが提供されている場合、投稿画像を追加
    if (body.imageUrls && Array.isArray(body.imageUrls)) {
      for (let i = 0; i < body.imageUrls.length; i++) {
        const imageUrl = body.imageUrls[i];
        // URLからR2キーを抽出（例: https://example.com/images/123-filename.jpg -> images/123-filename.jpg）
        const urlParts = imageUrl.split('/');
        const r2Key = urlParts.slice(-2).join('/');
        
        await addPostImage(post.id, {
          r2Key,
          url: imageUrl,
          order: i,
        });
      }
    }

    // プラン制限の使用量を増やす
    await incrementPlanLimit(session.user.id, 'post');

    return NextResponse.json({ post }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create post error:', error);
    return NextResponse.json(
      { error: '投稿の作成に失敗しました' },
      { status: 500 }
    );
  }
}
