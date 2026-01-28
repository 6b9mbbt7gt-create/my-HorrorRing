'use client';

import { useState } from 'react';
import { Button } from '../common/Button';
import { Textarea } from '../common/Textarea';

type CommentFormProps = {
  postId: string;
  parentId?: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
};

export function CommentForm({
  postId,
  parentId,
  onSubmit,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit(content);
      setContent('');
    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        label={parentId ? '返信を入力' : 'コメントを入力'}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="コメントを入力してください"
        rows={3}
        required
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading || !content.trim()}>
          {isLoading ? '送信中...' : '送信'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            キャンセル
          </Button>
        )}
      </div>
    </form>
  );
}
