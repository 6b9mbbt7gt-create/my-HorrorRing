'use client';

import { useState } from 'react';
import { Button } from '../common/Button';

type HeartButtonProps = {
  postId: string;
  initialHearted: boolean;
  initialCount: number;
  onHeart?: () => Promise<void>;
  disabled?: boolean;
};

export function HeartButton({
  postId,
  initialHearted,
  initialCount,
  onHeart,
  disabled = false,
}: HeartButtonProps) {
  const [hearted, setHearted] = useState(initialHearted);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    try {
      // TODO: API実装後に有効化
      // await fetch(`/api/posts/${postId}/hearts`, {
      //   method: 'POST',
      // });
      
      if (onHeart) {
        await onHeart();
      }

      setHearted(!hearted);
      setCount(hearted ? count - 1 : count + 1);
    } catch (error) {
      console.error('Heart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleClick}
      disabled={isLoading || disabled}
      className="flex items-center gap-2"
    >
      {hearted ? '💜' : '🤍'} {count}
    </Button>
  );
}
