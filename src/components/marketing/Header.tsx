'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skull } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-md border-b-2 border-red-950 shadow-[0_0_30px_rgba(139,0,0,0.3)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-red-600 hover:text-red-500 transition-colors drop-shadow-[0_0_8px_rgba(139,0,0,0.6)]"
          >
            <Skull className="w-6 h-6" />
            HorrorRing
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {pathname === '/' && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 -mx-2 px-2 sm:mx-0 sm:px-0 min-w-0">
                {[
                  { id: 'hero', label: 'ホーム' },
                  { id: 'features', label: '機能' },
                  { id: 'pricing', label: 'プラン' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-red-950/80 hover:bg-red-900/80 text-red-200 hover:text-white border border-red-900/80 hover:border-red-600 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            <Link
              href="/login"
              className="flex-shrink-0 px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold text-sm whitespace-nowrap border border-red-500/50 shadow-[0_0_15px_rgba(185,28,28,0.5)] hover:shadow-[0_0_25px_rgba(185,28,28,0.7)] transition-all"
            >
              今すぐ参加
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
