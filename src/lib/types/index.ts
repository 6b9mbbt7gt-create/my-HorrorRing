// 投稿タイプ
export type PostType = 'review' | 'experience' | 'photo' | 'video';

// ジャンル
export type Genre = 'game' | 'haunted_spot' | 'urban_legend';

// 公開範囲
export type Visibility = 'public' | 'private' | 'friends' | 'limited';

// プラン種別
export type PlanType = 'free' | 'premium';

// 通知タイプ
export type NotificationType =
  | 'follow'
  | 'comment'
  | 'like'
  | 'heart'
  | 'dm'
  | 'post';

// 投稿データ
export type Post = {
  id: string;
  userId: string;
  title: string;
  content: string;
  postType: PostType;
  genre: Genre;
  genreId?: string;
  visibility: Visibility;
  likeCount: number;
  heartCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
};

// ユーザーデータ
export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  image: string | null;
  username: string | null;
  bio: string | null;
  language: string;
  planType: PlanType;
  planExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
