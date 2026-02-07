'use client';

/**
 * 最古参バッジ「オリジナルゴースト」
 * ホラーゲーム・心霊スポット・都市伝説の3要素を融合した特別アイコン
 */
type OriginalGhostBadgeProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
};

const sizeMap = {
  sm: 28,
  md: 40,
  lg: 56,
};

export function OriginalGhostBadge({
  size = 'md',
  className = '',
  title = '最古参バッジ オリジナルゴースト',
}: OriginalGhostBadgeProps) {
  const s = sizeMap[size];

  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
      title={title}
      role="img"
      aria-label={title}
    >
      <svg
        width={s}
        height={s}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"
      >
        {/* 外枠: 呪いの輪（都市伝説）＋ 炎のアクセント（心霊） */}
        <defs>
          <linearGradient id="badge-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="50%" stopColor="#450a0a" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
          <linearGradient id="badge-inner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* 背景円 */}
        <circle cx="32" cy="32" r="30" fill="url(#badge-inner)" stroke="url(#badge-border)" strokeWidth="2.5" />
        {/* ゴースト本体（ホラーゲームのシルエット＋和風のたれ目） */}
        <path
          d="M32 18c-6 0-11 5-11 11v8c0 2 1 4 3 5l-2 10h4l2-8h2l2 8h4l-2-10c2-1 3-3 3-5v-8c0-6-5-11-11-11z"
          fill="#e5e7eb"
          opacity="0.95"
          filter="url(#glow)"
        />
        {/* 目（一つ目風・都市伝説） */}
        <ellipse cx="32" cy="28" rx="4" ry="5" fill="#0f172a" />
        <circle cx="33" cy="27" r="1" fill="#fef2f2" opacity="0.9" />
        {/* 口（ほぼ見せない不気味さ） */}
        <path d="M29 34q3 2 6 0" stroke="#374151" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.8" />
        {/* リボン／神社の紙垂れ（心霊スポット） */}
        <path d="M26 18l6-4 6 4v3l-6 2-6-2v-3z" fill="#b91c1c" opacity="0.9" />
        {/* 額の紋（レッドアクセント） */}
        <circle cx="32" cy="22" r="2.5" fill="none" stroke="#dc2626" strokeWidth="0.8" opacity="0.9" />
      </svg>
    </span>
  );
}
