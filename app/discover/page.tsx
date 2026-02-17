import { getAllDiscoverArticles, searchDiscoverArticles, getDiscoverArticlesByDate } from '@/lib/feed';
import { SearchBox, ArticleList } from '@/components/DiscoverSearch';
import { Suspense } from 'react';

export const metadata = {
  title: 'Discover - Jayden',
  description: 'Karpathy & friends 推荐的阅读清单，每日更新',
};

function DiscoverContent() {
  const articles = getAllDiscoverArticles();
  const groupedByDate = getDiscoverArticlesByDate();

  return (
    <>
      <SearchBox />
      
      {/* Articles List */}
      <section>
        <ArticleList articles={articles} />
      </section>

      {/* Date Archive (hidden when searching via JS, shown by default) */}
      <noscript>
        {groupedByDate.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
              按日期归档
            </h2>
            {groupedByDate.map((group) => (
              <div key={group.date} className="mb-8">
                <h3 className="text-sm font-medium text-neutral-500 mb-3">
                  {group.date}
                </h3>
                <div className="grid gap-3">
                  {group.articles.map((article) => (
                    <a
                      key={article.slug}
                      href={`/discover/${article.slug}`}
                      className="block border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                    >
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-neutral-400">
                          {article.source}
                        </span>
                        <span className="px-2 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded">
                          {article.category}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </noscript>
    </>
  );
}

export default function DiscoverPage() {
  const articles = getAllDiscoverArticles();
  const categories = [...new Set(articles.map(a => a.category))].sort();
  const allCategories = ['All', ...categories];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">
            Discover
          </h1>
          <p className="text-neutral-500">
            Karpathy & friends 推荐的阅读清单，每日更新
          </p>
        </header>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-6 text-sm text-neutral-500">
          <span>{articles.length} articles</span>
          <span>•</span>
          <span>{categories.length} categories</span>
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {allCategories.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              {cat}
            </span>
          ))}
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <DiscoverContent />
        </Suspense>
      </div>
    </div>
  );
}
