'use client';

/**
 * LP用の血の雫デコレーション（背景に表示する装飾）
 */
export function BloodDrips() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* 上部・左右の雫風グラデーション */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-950/30 to-transparent" />
      <div className="absolute top-0 right-0 w-48 h-64 bg-gradient-to-bl from-red-900/20 to-transparent rounded-bl-full" />
      <div className="absolute top-0 left-0 w-48 h-64 bg-gradient-to-br from-red-900/20 to-transparent rounded-br-full" />
      {/* 下部の雫風 */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-red-950/20 to-transparent" />
    </div>
  );
}
