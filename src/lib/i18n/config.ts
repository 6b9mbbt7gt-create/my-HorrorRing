// 多言語対応設定

export const locales = ['ja', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ja';

export const translations = {
  ja: {
    common: {
      login: 'ログイン',
      logout: 'ログアウト',
      profile: 'プロフィール',
      search: '検索',
      dashboard: 'ダッシュボード',
      posts: '投稿',
      submit: '送信',
      cancel: 'キャンセル',
      save: '保存',
      delete: '削除',
      edit: '編集',
      loading: '読み込み中...',
    },
    posts: {
      title: 'タイトル',
      content: '本文',
      create: '新規投稿',
      edit: '投稿を編集',
      delete: '投稿を削除',
      like: 'いいね',
      heart: 'ハート',
      comment: 'コメント',
      comments: 'コメント',
      noPosts: '投稿がありません',
    },
    profile: {
      edit: 'プロフィールを編集',
      followers: 'フォロワー',
      following: 'フォロー中',
      posts: '投稿',
      follow: 'フォロー',
      unfollow: 'フォロー解除',
    },
  },
  en: {
    common: {
      login: 'Login',
      logout: 'Logout',
      profile: 'Profile',
      search: 'Search',
      dashboard: 'Dashboard',
      posts: 'Posts',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      loading: 'Loading...',
    },
    posts: {
      title: 'Title',
      content: 'Content',
      create: 'Create Post',
      edit: 'Edit Post',
      delete: 'Delete Post',
      like: 'Like',
      heart: 'Heart',
      comment: 'Comment',
      comments: 'Comments',
      noPosts: 'No posts',
    },
    profile: {
      edit: 'Edit Profile',
      followers: 'Followers',
      following: 'Following',
      posts: 'Posts',
      follow: 'Follow',
      unfollow: 'Unfollow',
    },
  },
} as const;

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      // フォールバック: デフォルトロケールから取得
      value = translations[defaultLocale];
      for (const k2 of keys) {
        value = value?.[k2];
      }
      break;
    }
  }

  return typeof value === 'string' ? value : key;
}
