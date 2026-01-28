import Link from 'next/link';
import { Skull } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-red-500 mb-4">
              <Skull className="w-6 h-6" />
              HorrorRing
            </Link>
            <p className="text-gray-400 text-sm">
              恐怖を共有する新しい世界
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">サービス</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#features" className="hover:text-red-500 transition-colors">
                  機能
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-red-500 transition-colors">
                  料金
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-red-500 transition-colors">
                  コミュニティ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">サポート</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  ヘルプセンター
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  利用規約
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  プライバシーポリシー
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">フォロー</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          &copy; 2024 HorrorRing. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
