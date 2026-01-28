import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { getPosts } from '@/dal/posts';
import { getUserById, getUserByUsername } from '@/dal/users';
import { eq, or, like, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { posts, users } from '@/lib/db/schema';

/**
 * GET /api/search
 * 検索機能（投稿、ユーザー）
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
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, posts, users
    const genre = searchParams.get('genre') as any;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query.trim()) {
      return NextResponse.json(
        { error: '検索クエリが必要です' },
        { status: 400 }
      );
    }

    const results: any = {
      posts: [],
      users: [],
    };

    // 投稿検索
    if (type === 'all' || type === 'posts') {
      const searchPosts = await db
        .select()
        .from(posts)
        .where(
          and(
            or(
              like(posts.title, `%${query}%`),
              like(posts.content, `%${query}%`)
            ),
            genre ? eq(posts.genre, genre) : undefined,
            eq(posts.visibility, 'public')
          )
        )
        .limit(limit)
        .offset(offset);

      results.posts = searchPosts;
    }

    // ユーザー検索
    if (type === 'all' || type === 'users') {
      const searchUsers = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          image: users.image,
          username: users.username,
          bio: users.bio,
        })
        .from(users)
        .where(
          or(
            like(users.name, `%${query}%`),
            like(users.username, `%${query}%`),
            like(users.email, `%${query}%`)
          )
        )
        .limit(limit)
        .offset(offset);

      results.users = searchUsers;
    }

    return NextResponse.json({ results }, { status: 200 });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: '検索に失敗しました' },
      { status: 500 }
    );
  }
}
