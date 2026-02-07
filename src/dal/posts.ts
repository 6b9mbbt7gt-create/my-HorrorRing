import { db } from '@/lib/db';
import { posts, postImages, postVideos } from '@/lib/db/schema';
import { eq, desc, and, or, isNull, sql, inArray } from 'drizzle-orm';
import { generateId } from '@/lib/utils/uuid';
import type { PostType, Genre, Visibility } from '@/lib/types';

/**
 * 投稿一覧を取得
 */
export async function getPosts(options?: {
  limit?: number;
  offset?: number;
  genre?: Genre;
  userId?: string;
  /** 自分のプロフィール用: true のとき visibility で絞らない（非公開も含む） */
  includeAllVisibility?: boolean;
}) {
  const { limit = 20, offset = 0, genre, userId, includeAllVisibility } = options || {};

  const conditions = [];
  if (genre) {
    conditions.push(eq(posts.genre, genre));
  }
  if (userId) {
    conditions.push(eq(posts.userId, userId));
    // 自分の投稿一覧以外は公開のみ（visibility が null の投稿も表示）
    if (!includeAllVisibility) {
      conditions.push(or(eq(posts.visibility, 'public'), isNull(posts.visibility)));
    }
  } else {
    // 一覧は公開投稿のみ（visibility が null の投稿も表示）
    conditions.push(or(eq(posts.visibility, 'public'), isNull(posts.visibility)));
  }

  const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);

  return await db
    .select()
    .from(posts)
    .where(whereClause)
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);
}

/**
 * 指定ユーザー群の公開投稿を取得（タイムラインの「フォロー中」用）
 */
export async function getPostsByUserIds(
  userIds: string[],
  options?: { limit?: number; offset?: number }
) {
  if (userIds.length === 0) return [];
  const { limit = 20, offset = 0 } = options || {};
  return await db
    .select()
    .from(posts)
    .where(
      and(
        inArray(posts.userId, userIds),
        or(eq(posts.visibility, 'public'), isNull(posts.visibility))
      )
    )
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);
}

/**
 * 投稿をIDで取得
 */
export async function getPostById(postId: string) {
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  return post || null;
}

/**
 * 投稿を作成
 */
export async function createPost(
  userId: string,
  data: {
    title: string;
    content: string;
    postType: PostType;
    genre: Genre;
    genreId?: string;
    visibility?: Visibility;
  }
) {
  const id = generateId();
  const now = new Date().toISOString();

  await db.insert(posts).values({
    id,
    userId,
    title: data.title,
    content: data.content,
    postType: data.postType,
    genre: data.genre,
    genreId: data.genreId,
    visibility: data.visibility || 'public',
    likeCount: 0,
    heartCount: 0,
    commentCount: 0,
    createdAt: now,
    updatedAt: now,
  });

  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);

  return post || null;
}

/**
 * 投稿を更新
 */
export async function updatePost(
  postId: string,
  userId: string,
  data: {
    title?: string;
    content?: string;
    visibility?: Visibility;
  }
) {
  const now = new Date().toISOString();

  const [post] = await db
    .update(posts)
    .set({
      ...data,
      updatedAt: now,
    })
    .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
    .returning();

  return post || null;
}

/**
 * 投稿を削除（投稿者本人のみ）
 */
export async function deletePost(postId: string, userId: string) {
  await db
    .delete(posts)
    .where(and(eq(posts.id, postId), eq(posts.userId, userId)));
}

/**
 * 投稿を管理者権限で削除（誰の投稿でも削除可能）
 */
export async function deletePostAsAdmin(postId: string): Promise<boolean> {
  const post = await getPostById(postId);
  if (!post) return false;
  await db.delete(posts).where(eq(posts.id, postId));
  return true;
}

/**
 * LP用人気投稿取得（いいね＋ハート＋コメントの合計でソート、user は JOIN しない）
 */
export async function getFeaturedPostsForLP(limit: number = 5) {
  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      genre: posts.genre,
      postType: posts.postType,
      likeCount: posts.likeCount,
      heartCount: posts.heartCount,
      commentCount: posts.commentCount,
      createdAt: posts.createdAt,
      userId: posts.userId,
    })
    .from(posts)
    .where(eq(posts.visibility, 'public'))
    .orderBy(
      desc(sql`(like_count + heart_count + comment_count)`)
    )
    .limit(limit);

  return rows.map((r) => ({ ...r, userName: null as string | null }));
}

/**
 * 複数投稿IDの先頭画像URLを取得（post_images の order 昇順の1件目）
 */
export async function getFirstImageUrlsByPostIds(
  postIds: string[]
): Promise<Record<string, string>> {
  if (postIds.length === 0) return {};

  const images = await db
    .select({
      postId: postImages.postId,
      url: postImages.url,
    })
    .from(postImages)
    .where(inArray(postImages.postId, postIds))
    .orderBy(postImages.order);

  // 各 postId の先頭1件だけを取る
  const firstByPostId: Record<string, string> = {};
  for (const row of images) {
    if (!(row.postId in firstByPostId)) {
      firstByPostId[row.postId] = row.url;
    }
  }
  return firstByPostId;
}

/**
 * 投稿の画像を追加
 */
export async function addPostImage(
  postId: string,
  data: {
    r2Key: string;
    url: string;
    order: number;
  }
) {
  const id = generateId();
  const now = new Date().toISOString();

  const { r2Key, url, order } = data;

  await db.insert(postImages).values({
    id,
    postId,
    r2Key,
    url,
    order,
    createdAt: now,
  });

  const [image] = await db
    .select()
    .from(postImages)
    .where(eq(postImages.id, id))
    .limit(1);

  return image || null;
}

/**
 * 投稿の動画を追加
 */
export async function addPostVideo(
  postId: string,
  data: {
    r2Key: string;
    url: string;
    duration?: number;
    thumbnailUrl?: string;
  }
) {
  const id = generateId();
  const now = new Date().toISOString();

  await db.insert(postVideos).values({
    id,
    postId,
    r2Key: data.r2Key,
    url: data.url,
    duration: data.duration,
    thumbnailUrl: data.thumbnailUrl,
    createdAt: now,
  });

  const [video] = await db
    .select()
    .from(postVideos)
    .where(eq(postVideos.id, id))
    .limit(1);

  return video || null;
}
