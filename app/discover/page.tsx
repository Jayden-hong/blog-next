import Link from 'next/link';
import { getLatestFeedDay, getAllCategories } from '@/lib/feed';

export const metadata = {
  title: 'Discover - Jayden',
  description: 'Karpathy & friends 推荐的阅读清单，每日更新',
};

export default function DiscoverPage() {
  const feedDay = getLatestFeedDay();
  const categories = getAllCategories();
  const allCategories = ['All', ...categories];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">
            Discover
          </h1>
          <p className="text-neutral-500">
            Karpathy & friends 推荐的阅读清单，每日更新
          </p>
        </header>

        {feedDay ? (
          <>
            {/* Stats */}
            <div className="flex items-center gap-6 mb-8 text-sm text-neutral-500">
              <span>{feedDay.totalSources} sources</span>
              <span>•</span>
              <span>{feedDay.totalArticles} articles</span>
              <span>•</span>
              <span>{feedDay.date}</span>
            </div>

            {/* Hot Articles */}
            {feedDay.articles.filter(a => a.isHot).length > 0 && (
              <section className="mb-10">
                <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
                  🔥 Hot
                </h2>
                <div className="grid gap-3">
                  {feedDay.articles
                    .filter((a) => a.isHot)
                    .map((article, index) => (
                      <a
                        key={index}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 hover:border-orange-300 dark:hover:border-orange-800 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-neutral-500">
                              <span className="text-orange-700 dark:text-orange-400">
                                {article.source}
                              </span>
                              <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded">
                                {article.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                </div>
              </section>
            )}

            {/* Category Tabs - Simple horizontal scroll for now */}
            <section className="mb-6 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {allCategories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full whitespace-nowrap"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </section>

            {/* All Articles */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
                All Articles
              </h2>
              <div className="grid gap-3">
                {feedDay.articles.map((article, index) => (
                  <a
                    key={index}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-neutral-400">
                          {article.source}
                        </span>
                        <span className="px-2 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </>
        ) : (
          <p className="text-neutral-500">No feed data available</p>
        )}
      </div>
    </div>
  );
}
