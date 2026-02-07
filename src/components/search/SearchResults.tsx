'use client';

import { useEffect, useState } from 'react';
import { PostList } from '../posts/PostList';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Alert } from '../common/Alert';
import { User } from 'lucide-react';
import Link from 'next/link';

type SearchResultsProps = {
  query: string;
  type: string;
  genre?: string;
};

type SearchResult = {
  posts: Array<{
    id: string;
    userId: string;
    title: string;
    content: string;
    postType: 'review' | 'experience' | 'photo' | 'video';
    genre: 'game' | 'haunted_spot' | 'urban_legend';
    genreId?: string;
    visibility: 'public' | 'private' | 'friends' | 'limited';
    likeCount: number;
    heartCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
  }>;
  authorNames?: Record<string, string>;
  users: Array<{
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    username: string | null;
    bio: string | null;
  }>;
};

export function SearchResults({ query, type, genre }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ q: query });
        if (type !== 'all') {
          params.set('type', type);
        }
        if (genre) {
          params.set('genre', genre);
        }

        const response = await fetch(`/api/search?${params.toString()}`);
        if (!response.ok) {
          throw new Error('検索に失敗しました');
        }

        const data = await response.json();
        setResults(data.results);
      } catch (err: any) {
        setError(err.message || '検索に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, type, genre]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error">
        {error}
      </Alert>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* 投稿結果 */}
      {(type === 'all' || type === 'posts') && results.posts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            投稿 ({results.posts.length})
          </h2>
          <PostList posts={results.posts} authorNames={results.authorNames} />
        </div>
      )}

      {/* ユーザー結果 */}
      {(type === 'all' || type === 'users') && results.users.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            ユーザー ({results.users.length})
          </h2>
          <div className="space-y-4">
            {results.users.map((user) => (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-purple-600 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || user.username || 'User'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">
                      {user.name || user.username || user.email}
                    </h3>
                    {user.username && (
                      <p className="text-gray-400 text-sm">@{user.username}</p>
                    )}
                    {user.bio && (
                      <p className="text-gray-400 text-sm mt-1">{user.bio}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 結果なし */}
      {results.posts.length === 0 && results.users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            「{query}」に一致する結果が見つかりませんでした
          </p>
        </div>
      )}
    </div>
  );
}
