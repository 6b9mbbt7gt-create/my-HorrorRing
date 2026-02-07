import Link from 'next/link';
import { Skull } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t-2 border-red-950 py-12 px-4 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-red-900/50" />
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-red-600 mb-4 hover:text-red-500 transition-colors"
            >
              <Skull className="w-6 h-6" />
              HorrorRing
            </Link>
            <p className="text-red-400/70 text-sm">
              恐怖を共有する、呪われた世界
            </p>
          </div>

          <div>
            <h3 className="text-red-200 font-bold mb-4">サービス</h3>
            <ul className="space-y-2 text-sm text-red-400/80">
              <li>
                <a href="#features" className="hover:text-red-400 transition-colors">
                  機能
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-red-400 transition-colors">
                  料金
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-red-400 transition-colors">
                  コミュニティ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-red-200 font-bold mb-4">サポート</h3>
            <ul className="space-y-2 text-sm text-red-400/80">
              <li>
                <a href="#" className="hover:text-red-400 transition-colors">
                  ヘルプ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400 transition-colors">
                  利用規約
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400 transition-colors">
                  プライバシー
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-red-200 font-bold mb-4">フォロー</h3>
            <ul className="space-y-2 text-sm text-red-400/80">
              <li>
                <a href="#" className="hover:text-red-400 transition-colors">
                  X
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400 transition-colors">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-red-950 pt-8 text-center text-sm text-red-900">
          © {new Date().getFullYear()} HorrorRing.
        </div>
      </div>
    </footer>
  );
}
