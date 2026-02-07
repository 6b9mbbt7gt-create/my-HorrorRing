'use client';

import { OriginalGhostBadge } from '@/components/badges/OriginalGhostBadge';
import { Sparkles } from 'lucide-react';

/**
 * TOPページ用：今登録で最古参バッジがもらえる旨を伝えるバナー（案内のみ・CTAはヘッダーの「今すぐ参加」に一本化）
 * 固定ヘッダーの直下に表示するため mt-16 でオフセット
 */
export function FoundingBadgeBanner() {
  return (
    <div className="mt-16 bg-gradient-to-r from-red-950/90 via-amber-950/80 to-red-950/90 border-b border-red-900/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3 overflow-x-auto min-w-0">
          <OriginalGhostBadge size="sm" className="flex-shrink-0" />
          <span className="flex items-center gap-2 text-amber-100 font-medium whitespace-nowrap flex-shrink-0">
            <Sparkles className="w-4 h-4 text-amber-400" aria-hidden />
            今登録で最古参バッジ「オリジナルゴースト」をプレゼント
          </span>
          <span className="text-gray-400 text-sm whitespace-nowrap flex-shrink-0 hidden sm:inline">
            有料会員 先着100名限定・右上の「今すぐ参加」から
          </span>
        </div>
      </div>
    </div>
  );
}
