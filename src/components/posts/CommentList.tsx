'use client';

import { useState } from 'react';
import { CommentForm } from './CommentForm';
import { formatRelativeTime } from '@/lib/utils/format';

type Comment = {
  id: string;
  userId: string;
  content: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
};

type CommentListProps = {
  postId: string;
  comments: Comment[];
  currentUserId?: string;
  onCommentSubmit: (content: string, parentId?: string) => Promise<void>;
};

export function CommentList({
  postId,
  comments,
  currentUserId,
  onCommentSubmit,
}: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // 親コメントと子コメントを分ける
  const parentComments = comments.filter((c) => !c.parentId);
  const childComments = comments.filter((c) => c.parentId);

  const getReplies = (parentId: string) => {
    return childComments.filter((c) => c.parentId === parentId);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">コメント ({comments.length})</h3>

      <CommentForm
        postId={postId}
        onSubmit={async (content) => {
          try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content }),
            });
            if (!response.ok) {
              throw new Error('コメントの投稿に失敗しました');
            }
            await onCommentSubmit(content);
          } catch (error) {
            console.error('Comment submit error:', error);
            throw error;
          }
        }}
      />

      <div className="space-y-4">
        {parentComments.map((comment) => (
          <div key={comment.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-sm text-gray-400">
                  @{comment.userId.slice(0, 8)} • {formatRelativeTime(comment.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                返信
              </button>
            </div>
            <p className="text-gray-300 mb-2">{comment.content}</p>

            {replyingTo === comment.id && (
              <div className="mt-4 pl-4 border-l-2 border-purple-600">
                <CommentForm
                  postId={postId}
                  parentId={comment.id}
                  onSubmit={async (content) => {
                    try {
                      const response = await fetch(`/api/posts/${postId}/comments`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content, parentId: comment.id }),
                      });
                      if (!response.ok) {
                        throw new Error('返信の投稿に失敗しました');
                      }
                      await onCommentSubmit(content, comment.id);
                      setReplyingTo(null);
                    } catch (error) {
                      console.error('Reply submit error:', error);
                      throw error;
                    }
                  }}
                  onCancel={() => setReplyingTo(null)}
                />
              </div>
            )}

            {/* 返信を表示 */}
            {getReplies(comment.id).length > 0 && (
              <div className="mt-4 pl-4 border-l-2 border-gray-700 space-y-2">
                {getReplies(comment.id).map((reply) => (
                  <div key={reply.id} className="bg-gray-800 rounded p-3">
                    <p className="text-xs text-gray-400 mb-1">
                      @{reply.userId.slice(0, 8)} • {formatRelativeTime(reply.createdAt)}
                    </p>
                    <p className="text-gray-300 text-sm">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
