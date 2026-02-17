import { getAllTags, getLatestFeedDay } from '@/lib/feed';
import { DiscoverClient } from '@/components/DiscoverClient';

export const metadata = {
  title: 'Discover - Jayden',
  description: '每日AI推荐阅读清单',
};

export default function DiscoverPage() {
  const feedDay = getLatestFeedDay();
  const articles = feedDay?.articles || [];
  const allTags = getAllTags();

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">
            Discover
          </h1>
          <p className="text-neutral-500">
            每日AI推荐阅读清单
          </p>
        </header>

        <DiscoverClient articles={articles} allTags={allTags} />
      </div>
    </div>
  );
}
