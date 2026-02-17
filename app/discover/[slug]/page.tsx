import { getDiscoverArticleBySlug, getAllDiscoverArticles } from '@/lib/feed';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllDiscoverArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getDiscoverArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found - Discover',
    };
  }

  return {
    title: `${article.title} - Discover`,
    description: article.aiSummary.slice(0, 160),
  };
}

export default async function DiscoverArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getDiscoverArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 mb-8 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Discover
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full">
              {article.category}
            </span>
            <span className="text-sm text-neutral-400">{article.date}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-neutral-900 dark:text-neutral-100">
            {article.title}
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">来源:</span>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {article.source}
            </a>
          </div>
        </header>

        {/* AI Summary */}
        {article.aiSummary && (
          <section className="mb-10">
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                AI 摘要
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {article.aiSummary}
              </p>
            </div>
          </section>
        )}

        {/* Original Content */}
        {article.originalContent && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
              原文内容
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {article.originalContent}
              </p>
            </div>

            {article.originalUrl && (
              <a
                href={article.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-blue-600 dark:text-blue-400 hover:underline"
              >
                阅读完整原文
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <Link
            href="/discover"
            className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            ← 查看更多发现
          </Link>
        </footer>
      </div>
    </div>
  );
}
