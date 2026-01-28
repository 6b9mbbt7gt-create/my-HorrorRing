'use client';

import { useState } from 'react';
import { PostList } from '../posts/PostList';

type Post = {
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
};

type ProfileTabsProps = {
  posts: Post[];
};

export function ProfileTabs({ posts }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'bookmarks'>('posts');

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg">
      <div className="border-b border-gray-800">
        <div className="flex">
          {[
            { id: 'posts', label: '投稿', count: posts.length },
            { id: 'likes', label: 'いいね', count: 0 },
            { id: 'bookmarks', label: 'ブックマーク', count: 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'posts' && (
          <PostList posts={posts} showUser={false} />
        )}
        {activeTab === 'likes' && (
          <div className="text-center py-12">
            <p className="text-gray-400">いいねした投稿はまだありません</p>
          </div>
        )}
        {activeTab === 'bookmarks' && (
          <div className="text-center py-12">
            <p className="text-gray-400">ブックマークした投稿はまだありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
