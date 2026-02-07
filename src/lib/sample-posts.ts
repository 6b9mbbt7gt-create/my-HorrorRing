/**
 * LP用サンプル投稿（ユーザーの声・実投稿が0件のときに表示）
 */
export type SampleFeaturedPost = {
  id: string;
  title: string;
  content: string;
  genre: string;
  postType: string;
  likeCount: number;
  heartCount: number;
  commentCount: number;
  createdAt: string;
  userId: string;
  userName: string;
  imageUrl?: string | null;
};

export const SAMPLE_FEATURED_POSTS: SampleFeaturedPost[] = [
  {
    id: 'sample-1',
    title: 'サイレントヒル2を10年ぶりにプレイした感想',
    content:
      '霧の街の雰囲気は相変わらず圧巻。ジェームズの心理描写が重く、エンディングまで引き込まれた。今でもホラーゲームの金字塔だと思う。',
    genre: 'game',
    postType: 'review',
    likeCount: 42,
    heartCount: 28,
    commentCount: 12,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'sample-user-1',
    userName: 'おさむ',
  },
  {
    id: 'sample-2',
    title: '廃病院で聞いた足音の正体',
    content:
      '地元で有名な心霊スポットの廃病院を夜に探索。3階の廊下で明らかに人の足音が…。後から調べたら戦時中の病院だった。',
    genre: 'haunted_spot',
    postType: 'experience',
    likeCount: 35,
    heartCount: 19,
    commentCount: 8,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'sample-user-2',
    userName: 'きよし',
  },
  {
    id: 'sample-3',
    title: '口裂け女の都市伝説、地域別のバリエーション',
    content:
      '関東では「はさみ」、関西では「包丁」など、地域によって持ち物が違う説をまとめた。海外にも類似の伝説があるらしい。',
    genre: 'urban_legend',
    postType: 'review',
    likeCount: 58,
    heartCount: 31,
    commentCount: 15,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'sample-user-3',
    userName: 'むささびさん',
  },
  {
    id: 'sample-4',
    title: '零 〜濡鴉の巫女〜 の写真機能が怖すぎる',
    content:
      'カメラで撮影すると見えるものが…。和風ホラーの傑作。濡れ衣という設定が独特で、水辺が苦手になった。',
    genre: 'game',
    postType: 'review',
    likeCount: 29,
    heartCount: 22,
    commentCount: 6,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'sample-user-4',
    userName: '豆くん',
  },
  {
    id: 'sample-5',
    title: '廃墟の学校で撮った心霊写真',
    content:
      '窓ガラスに写り込んだ影。現像してから気づいた。同じ場所で複数人が似たような写真を撮っているという噂も。',
    genre: 'haunted_spot',
    postType: 'photo',
    likeCount: 44,
    heartCount: 37,
    commentCount: 21,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'sample-user-5',
    userName: '練馬大根',
  },
];
