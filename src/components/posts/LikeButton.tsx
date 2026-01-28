'use client';

import { useState } from 'react';
import { Button } from '../common/Button';

type LikeButtonProps = {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  onLike?: () => Promise<void>;
};

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  onLike,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // TODO: API実装後に有効化
      // await fetch(`/api/posts/${postId}/likes`, {
      //   method: 'POST',
      // });
      
      if (onLike) {
        await onLike();
      }

      setLiked(!liked);
      setCount(liked ? count - 1 : count + 1);
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {liked ? '❤️' : '🤍'} {count}
    </Button>
  );
}
