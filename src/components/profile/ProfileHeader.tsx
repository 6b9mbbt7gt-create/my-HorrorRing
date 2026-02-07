'use client';

import { useState } from 'react';
import { Crown, User } from 'lucide-react';
import { Button } from '../common/Button';
import { ProfileEditModal } from './ProfileEditModal';
import { OriginalGhostBadge } from '@/components/badges/OriginalGhostBadge';

type UserData = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  username: string | null;
  bio: string | null;
  language: string;
  planType: 'free' | 'premium';
  planExpiresAt: Date | null;
  /** 最古参バッジ「オリジナルゴースト」を所持しているか（有料会員 先着100名） */
  hasFoundingBadge?: boolean;
  /** 管理者ロール */
  role?: string | null;
};

type ProfileHeaderProps = {
  user: UserData;
  followerCount: number;
  followingCount: number;
  postCount: number;
  isOwnProfile: boolean;
  followButton?: React.ReactNode;
};

export function ProfileHeader({
  user,
  followerCount,
  followingCount,
  postCount,
  isOwnProfile,
  followButton,
}: ProfileHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || user.username || 'User'}
                className="w-24 h-24 rounded-full object-cover border-2 border-purple-600"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-2 border-purple-600">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
            {user.hasFoundingBadge && (
              <div className="absolute -top-1 -right-1" title="最古参バッジ オリジナルゴースト">
                <OriginalGhostBadge size="md" />
              </div>
            )}
            {user.planType === 'premium' && !user.hasFoundingBadge && (
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-red-600 rounded-full p-1">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">
                {user.name || user.username || user.email}
              </h1>
              {user.hasFoundingBadge && (
                <span className="flex items-center gap-1.5 px-2 py-1 bg-red-950/80 border border-red-800 text-amber-100 text-xs font-medium rounded" title="最古参バッジ オリジナルゴースト">
                  <OriginalGhostBadge size="sm" />
                  最古参
                </span>
              )}
              {user.planType === 'premium' && (
                <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-red-600 text-white text-xs font-bold rounded">
                  プレミアム
                </span>
              )}
              {user.role === 'admin' && (
                <span className="px-2 py-1 bg-red-900/80 border border-red-700 text-red-200 text-xs font-bold rounded">
                  管理者
                </span>
              )}
            </div>

            {user.username && (
              <p className="text-gray-400 mb-2">@{user.username}</p>
            )}

            {user.bio && (
              <p className="text-gray-300 mb-4">{user.bio}</p>
            )}

            <div className="flex items-center gap-6 mb-4">
              <div>
                <span className="text-white font-bold">{postCount}</span>
                <span className="text-gray-400 ml-1">投稿</span>
              </div>
              <div>
                <span className="text-white font-bold">{followerCount}</span>
                <span className="text-gray-400 ml-1">フォロワー</span>
              </div>
              <div>
                <span className="text-white font-bold">{followingCount}</span>
                <span className="text-gray-400 ml-1">フォロー中</span>
              </div>
            </div>

            <div className="flex gap-2">
              {isOwnProfile ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  プロフィールを編集
                </Button>
              ) : followButton ? (
                followButton
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <ProfileEditModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSave={async () => {
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
