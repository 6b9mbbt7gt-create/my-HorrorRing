/**
 * アプリケーション定数
 */

// プラン制限
export const PLAN_LIMITS = {
  free: {
    post: 5,
    like: 50,
    heart: 3,
    dm: 5,
    imageUpload: {
      maxPerPost: 5,
      maxSizeMB: 5,
    },
    videoUpload: false,
  },
  premium: {
    post: Infinity,
    like: Infinity,
    heart: Infinity,
    dm: Infinity,
    imageUpload: {
      maxPerPost: Infinity,
      maxSizeMB: 20,
    },
    videoUpload: {
      maxPerPost: Infinity,
      maxDurationSeconds: 300, // 5分
      maxSizeMB: 500,
    },
  },
} as const;

// 対応ファイル形式
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
];

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime', // MOV
];

// ファイル拡張子
export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.avif',
];

export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];

// 最大ファイルサイズ（バイト）
export const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
