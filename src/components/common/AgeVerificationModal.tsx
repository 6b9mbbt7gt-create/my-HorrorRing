'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AgeVerificationModal() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    // セッションストレージで年齢確認済みかチェック
    if (typeof window !== 'undefined') {
      const verified = sessionStorage.getItem('ageVerified');
      if (!verified) {
        setShow(true);
      }
    }
  }, []);

  const handleContinue = () => {
    if (agreed) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ageVerified', 'true');
      }
      setShow(false);
    }
  };

  const handleCancel = () => {
    router.push('/age-verification');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">年齢確認</h2>
          <p className="text-gray-400">
            このサービスは18歳以上の方を対象としています
          </p>
        </div>

        <div className="bg-red-950 border border-red-800 rounded-lg p-4">
          <p className="text-red-200 text-sm">
            <strong className="text-red-400">警告：</strong>
            このサービスにはホラーコンテンツ、心霊スポット、都市伝説などの
            不適切な内容が含まれる可能性があります。
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
          />
          <span className="text-gray-300 text-sm">
            私は18歳以上であり、上記の警告内容を理解し、同意します。
          </span>
        </label>

        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            戻る
          </button>
          <button
            onClick={handleContinue}
            disabled={!agreed}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            続ける
          </button>
        </div>
      </div>
    </div>
  );
}
