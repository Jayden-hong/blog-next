import { getAllTags, getLatestFeedDay } from '@/lib/feed';
import { DiscoverClient } from '@/components/DiscoverClient';
import { format } from 'date-fns';

export const revalidate = 0; // 禁用缓存

export const metadata = {
  title: 'Discover - Jayden',
  description: '每日AI推荐阅读清单',
};

export default function DiscoverPage() {
  const feedDay = getLatestFeedDay();
  const articles = feedDay?.articles || [];
  const allTags = getAllTags();
  
  // Get stats
  const avgScore = articles.length > 0 
    ? (articles.reduce((sum, a) => sum + (a.score || 5), 0) / articles.length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-8">
          <div className="flex items-baseline justify-between">
            <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
              Discover
            </h1>
            <span className="text-xs text-neutral-400 mono">
              {feedDay?.date || format(new Date(), 'yyyy-MM-dd')}
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-2">
            {articles.length} articles · avg {avgScore}/10 · curated by Kimi K2.5
          </p>
        </header>

        <DiscoverClient articles={articles} allTags={allTags} />
      </div>
    </div>
  );
}
