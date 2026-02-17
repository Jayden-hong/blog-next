import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllFeedDays, getFeedDayByDate } from '@/lib/feed';

export async function generateStaticParams() {
  const days = getAllFeedDays();
  return days.map((day) => ({
    date: day.date,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  return {
    title: `Discover ${date} - Jayden`,
    description: `Feed highlights for ${date}`,
  };
}

export default async function DiscoverDatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const feedDay = getFeedDayByDate(date);

  if (!feedDay) {
    notFound();
  }

  const categories = Array.from(new Set(feedDay.articles.map((a) => a.category))).sort();
  const allCategories = ['All', ...categories];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
            <Link href="/discover" className="hover:text-neutral-900 dark:hover:text-neutral-100">
              Discover
            </Link>
            <span>/</span>
            <span>{feedDay.date}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">
            {feedDay.date}
          </h1>
          <p className="text-neutral-500">
            {feedDay.totalSources} sources · {feedDay.totalArticles} articles
          </p>
        </header>

        {/* Highlights */}
        {feedDay.highlights.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
              Highlights
            </h2>
            <div className="grid gap-3">
              {feedDay.highlights.map((highlight, index) => (
                <a
                  key={index}
                  href={highlight.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                >
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                    {highlight.title}
                  </h3>
                  <span className="text-xs text-neutral-400">
                    {highlight.source}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Category Tabs */}
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
      </div>
    </div>
  );
}
