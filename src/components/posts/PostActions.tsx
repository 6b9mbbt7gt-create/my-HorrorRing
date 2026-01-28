'use client';

import { LikeButton } from './LikeButton';
import { HeartButton } from './HeartButton';

type PostActionsProps = {
  postId: string;
  initialLiked: boolean;
  initialHearted: boolean;
  likeCount: number;
  heartCount: number;
};

export function PostActions({
  postId,
  initialLiked,
  initialHearted,
  likeCount,
  heartCount,
}: PostActionsProps) {
  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('いいねに失敗しました');
      }
    } catch (error) {
      console.error('Like error:', error);
      throw error;
    }
  };

  const handleHeart = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/hearts`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('ハートに失敗しました');
      }
    } catch (error) {
      console.error('Heart error:', error);
      throw error;
    }
  };

  return (
    <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
      <LikeButton
        postId={postId}
        initialLiked={initialLiked}
        initialCount={likeCount}
        onLike={handleLike}
      />
      <HeartButton
        postId={postId}
        initialHearted={initialHearted}
        initialCount={heartCount}
        onHeart={handleHeart}
      />
    </div>
  );
}
