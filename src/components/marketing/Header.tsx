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
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-red-900/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-red-500">
            <Skull className="w-6 h-6" />
            HorrorRing
          </Link>
          <div className="flex items-center gap-6">
            {pathname === '/' && (
              <>
                {['hero', 'features', 'pricing'].map((id) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors"
                  >
                    {id === 'hero' ? 'ホーム' : id === 'features' ? '機能' : 'プラン'}
                  </button>
                ))}
              </>
            )}
            <Link
              href="/login"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              今すぐ参加
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
