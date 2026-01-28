import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';
import { SearchForm } from '@/components/search/SearchForm';
import { SearchResults } from '@/components/search/SearchResults';

type SearchPageProps = {
  searchParams: Promise<{ q?: string; type?: string; genre?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const query = params.q || '';
  const type = params.type || 'all';
  const genre = params.genre;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">検索</h1>

      <SearchForm initialQuery={query} initialType={type} initialGenre={genre} />

      {query && <SearchResults query={query} type={type} genre={genre} />}
    </div>
  );
}
