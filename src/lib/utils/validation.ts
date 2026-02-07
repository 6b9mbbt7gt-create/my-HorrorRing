import { z } from 'zod';
import type { PostType, Genre, Visibility } from '@/lib/types';

/**
 * ユーザー名のバリデーション
 */
export const usernameSchema = z
  .string()
  .min(3, 'ユーザー名は3文字以上である必要があります')
  .max(20, 'ユーザー名は20文字以下である必要があります')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'ユーザー名は英数字とアンダースコアのみ使用できます'
  );

/**
 * 投稿作成のバリデーション
 */
export const createPostSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以下である必要があります'),
  content: z.string().min(1, '本文は必須です').max(10000, '本文は10000文字以下である必要があります'),
  postType: z.enum(['review', 'experience', 'photo', 'video']),
  genre: z.enum(['game', 'haunted_spot', 'urban_legend']),
  genreId: z.string().optional(),
  visibility: z.enum(['public', 'private', 'friends', 'limited']).default('public'),
});

// エイリアス（API用）
export const postCreateSchema = createPostSchema;

/**
 * プロフィール更新のバリデーション
 */
export const updateProfileSchema = z.object({
  name: z.string().max(100, '表示名は100文字以下').optional().nullable(),
  username: usernameSchema.optional(),
  bio: z.string().max(500, '自己紹介は500文字以下である必要があります').optional(),
  language: z.enum(['ja', 'en']).optional(),
});
