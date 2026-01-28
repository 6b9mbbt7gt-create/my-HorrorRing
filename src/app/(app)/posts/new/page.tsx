'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ImageUpload } from '@/components/posts/ImageUpload';

export default function NewPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    postType: 'review' as 'review' | 'experience' | 'photo' | 'video',
    genre: 'game' as 'game' | 'haunted_spot' | 'urban_legend',
    visibility: 'public' as 'public' | 'private' | 'friends' | 'limited',
    imageUrls: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrls: formData.imageUrls,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '投稿の作成に失敗しました');
      }

      const { post } = await response.json();
      router.push(`/posts/${post.id}`);
    } catch (err: any) {
      setError(err.message || '投稿の作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">新規投稿</h1>
        <Link href="/posts">
          <Button variant="secondary" size="sm">
            キャンセル
          </Button>
        </Link>
      </div>

      {error && (
        <Alert type="error">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="タイトル"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="投稿のタイトルを入力"
          required
          maxLength={200}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="投稿タイプ"
            value={formData.postType}
            onChange={(e) =>
              setFormData({
                ...formData,
                postType: e.target.value as typeof formData.postType,
              })
            }
          >
            <option value="review">レビュー</option>
            <option value="experience">体験談</option>
            <option value="photo">写真</option>
            <option value="video">動画</option>
          </Select>

          <Select
            label="ジャンル"
            value={formData.genre}
            onChange={(e) =>
              setFormData({
                ...formData,
                genre: e.target.value as typeof formData.genre,
              })
            }
          >
            <option value="game">ホラーゲーム</option>
            <option value="haunted_spot">心霊スポット</option>
            <option value="urban_legend">都市伝説</option>
          </Select>
        </div>

        <Select
          label="公開範囲"
          value={formData.visibility}
          onChange={(e) =>
            setFormData({
              ...formData,
              visibility: e.target.value as typeof formData.visibility,
            })
          }
        >
          <option value="public">公開</option>
          <option value="private">非公開</option>
          <option value="friends">友達のみ</option>
          <option value="limited">限定公開</option>
        </Select>

        <Textarea
          label="本文"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          rows={10}
          placeholder="投稿内容を入力"
          required
          maxLength={10000}
        />

        {(formData.postType === 'photo' || formData.postType === 'review' || formData.postType === 'experience') && (
          <div>
            <label className="block text-gray-300 mb-2">画像</label>
            <ImageUpload
              onUploadComplete={(url) => {
                setFormData({
                  ...formData,
                  imageUrls: [...formData.imageUrls, url],
                });
              }}
              maxImages={5}
            />
          </div>
        )}

        <div className="flex gap-4">
          <Link href="/posts" className="flex-1">
            <Button variant="secondary" type="button" className="w-full">
              キャンセル
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                投稿中...
              </span>
            ) : (
              '投稿する'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
