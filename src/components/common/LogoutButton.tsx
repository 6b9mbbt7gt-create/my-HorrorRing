'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from './Button';
import { authClient } from '@/lib/auth-client';

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (!confirm('ログアウトしますか？')) {
      return;
    }

    setIsLoading(true);
    try {
      // betterAuthのクライアント側ログアウト
      await authClient.signOut();
      
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      alert('ログアウトに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <LogOut className="w-4 h-4" />
      ログアウト
    </Button>
  );
}
