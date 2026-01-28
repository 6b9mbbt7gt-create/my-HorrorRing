'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

type SearchFormProps = {
  initialQuery?: string;
  initialType?: string;
  initialGenre?: string;
};

export function SearchForm({
  initialQuery = '',
  initialType = 'all',
  initialGenre,
}: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [genre, setGenre] = useState(initialGenre || '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams({ q: query });
    if (type !== 'all') {
      params.set('type', type);
    }
    if (genre) {
      params.set('genre', genre);
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="投稿やユーザーを検索..."
            className="pl-10"
          />
        </div>
        <Button type="submit">検索</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="検索タイプ"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">すべて</option>
          <option value="posts">投稿</option>
          <option value="users">ユーザー</option>
        </Select>

        <Select
          label="ジャンル"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">すべて</option>
          <option value="game">ホラーゲーム</option>
          <option value="haunted_spot">心霊スポット</option>
          <option value="urban_legend">都市伝説</option>
        </Select>
      </div>
    </form>
  );
}
