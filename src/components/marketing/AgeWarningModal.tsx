'use client';

import { X } from 'lucide-react';
import { Button } from '../common/Button';

type AgeWarningModalProps = {
  onConfirm: (isAdult: boolean) => void;
};

export function AgeWarningModal({ onConfirm }: AgeWarningModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border-2 border-red-600 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-red-500/20">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-red-600/20 p-4 rounded-full">
              <X className="w-12 h-12 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">年齢確認</h2>
          <p className="text-gray-300">
            このサイトには18歳以上の方のみアクセスできます。
            <br />
            ホラーコンテンツが含まれています。
          </p>
          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => onConfirm(true)}
              variant="primary"
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              18歳以上です
            </Button>
            <Button
              onClick={() => onConfirm(false)}
              variant="secondary"
              className="flex-1"
            >
              いいえ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
