'use client';

import { useState } from 'react';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';

type FollowButtonProps = {
  userId: string;
  initialFollowing: boolean;
};

export function FollowButton({ userId, initialFollowing }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setFollowing(data.following);
      } else {
        throw new Error('フォロー処理に失敗しました');
      }
    } catch (error) {
      console.error('Follow error:', error);
      alert('フォロー処理に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={following ? 'secondary' : 'primary'}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          処理中...
        </span>
      ) : following ? (
        'フォロー中'
      ) : (
        'フォロー'
      )}
    </Button>
  );
}
