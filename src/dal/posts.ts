import { db } from '@/lib/db';
import { posts, postImages, postVideos } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
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
}) {
  const { limit = 20, offset = 0, genre, userId } = options || {};

  const conditions = [];
  if (genre) {
    conditions.push(eq(posts.genre, genre));
  }
  if (userId) {
    conditions.push(eq(posts.userId, userId));
    conditions.push(eq(posts.visibility, 'public'));
  } else {
    // 公開投稿のみ
    conditions.push(eq(posts.visibility, 'public'));
  }

  return await db
    .select()
    .from(posts)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
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
 * 投稿を削除
 */
export async function deletePost(postId: string, userId: string) {
  await db
    .delete(posts)
    .where(and(eq(posts.id, postId), eq(posts.userId, userId)));
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
