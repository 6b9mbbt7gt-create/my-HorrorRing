import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users table (betterAuthのコアスキーマ + 拡張フィールド)
export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).default(false),
  name: text('name'),
  image: text('image'),
  // 拡張フィールド
  username: text('username').unique(),
  bio: text('bio'),
  language: text('language').default('ja'),
  planType: text('plan_type').default('free'),
  planExpiresAt: text('plan_expires_at'),
  /** 最古参バッジ付与日（有料会員 先着100名、null は未付与） */
  foundingBadgeGrantedAt: text('founding_badge_granted_at'),
  /** ロール: user | admin */
  role: text('role').default('user'),
  createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// betterAuth required tables
export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Posts table
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  postType: text('post_type').notNull(), // review, experience, photo, video
  genre: text('genre').notNull(), // game, haunted_spot, urban_legend
  genreId: text('genre_id'),
  visibility: text('visibility').default('public'), // public, private, friends, limited
  likeCount: integer('like_count').default(0),
  heartCount: integer('heart_count').default(0),
  commentCount: integer('comment_count').default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Post Images table
export const postImages = sqliteTable('post_images', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id),
  r2Key: text('r2_key').notNull(),
  url: text('url').notNull(),
  order: integer('order').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Post Videos table
export const postVideos = sqliteTable('post_videos', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id),
  r2Key: text('r2_key').notNull(),
  url: text('url').notNull(),
  duration: integer('duration'), // seconds
  thumbnailUrl: text('thumbnail_url'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Comments table
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id),
  userId: text('user_id').notNull().references(() => users.id),
  parentId: text('parent_id'), // For threaded comments (self-reference handled separately)
  content: text('content').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Likes table
export const likes = sqliteTable('likes', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id),
  userId: text('user_id').notNull().references(() => users.id),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Hearts table
export const hearts = sqliteTable('hearts', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id),
  userId: text('user_id').notNull().references(() => users.id),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Follows table
export const follows = sqliteTable('follows', {
  id: text('id').primaryKey(),
  followerId: text('follower_id').notNull().references(() => users.id),
  followingId: text('following_id').notNull().references(() => users.id),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Messages (DM) table
export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  senderId: text('sender_id').notNull().references(() => users.id),
  receiverId: text('receiver_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Bookmarks table
export const bookmarks = sqliteTable('bookmarks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  postId: text('post_id').notNull().references(() => posts.id),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Subscriptions table
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  planType: text('plan_type').notNull(), // free, premium
  status: text('status').notNull(), // active, canceled, past_due
  currentPeriodStart: text('current_period_start').notNull(),
  currentPeriodEnd: text('current_period_end').notNull(),
  canceledAt: text('canceled_at'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Notifications table
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type').notNull(), // follow, comment, like, heart, dm, post
  relatedUserId: text('related_user_id').references(() => users.id),
  relatedPostId: text('related_post_id').references(() => posts.id),
  content: text('content'),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Haunted Spots table
export const hauntedSpots = sqliteTable('haunted_spots', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  region: text('region'),
  category: text('category'), // 廃墟, 病院, 学校など
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Games table
export const games = sqliteTable('games', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  platform: text('platform'), // PC, Console, Mobile
  releaseDate: text('release_date'),
  steamId: text('steam_id'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Urban Legends table
export const urbanLegends = sqliteTable('urban_legends', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  region: text('region'),
  category: text('category'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// User Daily Limits table
export const userDailyLimits = sqliteTable('user_daily_limits', {
  userId: text('user_id').primaryKey().references(() => users.id),
  date: text('date').primaryKey(),
  postCount: integer('post_count').default(0),
  likeCount: integer('like_count').default(0),
  heartCount: integer('heart_count').default(0),
  dmCount: integer('dm_count').default(0),
});
