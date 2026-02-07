/**
 * 日付をフォーマットする
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * 相対時間をフォーマットする（例: "3時間前"）
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}日前`;
  }
  if (hours > 0) {
    return `${hours}時間前`;
  }
  if (minutes > 0) {
    return `${minutes}分前`;
  }
  return 'たった今';
}

/** 表示名が渡されないときのフォールバック用（userId から決定的に選択） */
const FALLBACK_NAMES = ['おさむ', 'きよし', 'むささびさん', '豆くん', '練馬大根'] as const;

/**
 * 投稿者・コメント著者の表示名を返す。
 * authorDisplayName を渡すとそれを使う（表示名 or @ユーザー名。メールは渡さない想定）。
 * 渡さない場合は従来のフォールバック名を返す。
 */
export function getAuthorDisplayName(
  userId: string,
  authorDisplayName?: string | null
): string {
  if (authorDisplayName && authorDisplayName.trim()) {
    return authorDisplayName.trim();
  }
  let n = 0;
  for (let i = 0; i < userId.length; i++) {
    n += userId.charCodeAt(i);
  }
  return FALLBACK_NAMES[n % FALLBACK_NAMES.length];
}

/**
 * 数値をフォーマットする（例: 1000 → "1K"）
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
