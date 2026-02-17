import { getAllTags, getLatestFeedDay, FeedArticle } from '@/lib/feed';
import { SearchBox, ArticleList } from '@/components/DiscoverSearch';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata = {
  title: 'Discover - Jayden',
  description: '每日AI推荐阅读清单 - 基于质量评分的文章聚合',
};

interface DiscoverPageProps {
  searchParams: { q?: string; tag?: string };
}

function DiscoverContent({ q, tag }: { q?: string; tag?: string }) {
  const feedDay = getLatestFeedDay();
  
  // Get all articles from the feed
  const allArticles = feedDay?.articles || [];
  
  // Filter articles based on search query or tag
  let articles: FeedArticle[] = allArticles;
  
  if (q) {
    const lowerQuery = q.toLowerCase();
    articles = articles.filter((article) => 
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description?.toLowerCase().includes(lowerQuery) ||
      article.source.toLowerCase().includes(lowerQuery) ||
      article.author?.toLowerCase().includes(lowerQuery) ||
      article.tags?.some((t) => t.toLowerCase().includes(lowerQuery))
    );
  }
  
  if (tag) {
    articles = articles.filter((article) =>
      article.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  return (
    <>
      {/* Stats */}
      <div className="flex items-center gap-6 mb-6 text-sm text-neutral-500">
        <span>{articles.length} 篇文章</span>
        {q && (
          <>
            <span>·</span>
            <span>搜索: &quot;{q}&quot;</span>
          </>
        )}
        {tag && (
          <>
            <span>·</span>
            <span>标签: {tag}</span>
          </>
        )}
      </div>

      {/* Articles List */}
      <section>
        <ArticleList articles={articles} />
      </section>
    </>
  );
}

export default function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const { q, tag } = searchParams || {};
  const feedDay = getLatestFeedDay();
  const allArticles = feedDay?.articles || [];
  
  // Get all unique tags
  const allTags = getAllTags();

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">
            Discover
          </h1>
          <p className="text-neutral-500">
            每日AI推荐阅读清单 - 基于质量评分排序
          </p>
        </header>

        {/* Search Box with Suspense */}
        <Suspense fallback={<div className="h-14 mb-6 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-lg" />}>
          <SearchBox />
        </Suspense>

        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/discover"
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              !tag
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            全部
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/discover?tag=${encodeURIComponent(t)}`}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                tag === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {t}
            </Link>
          ))}
        </div>

        {/* Content with Suspense */}
        <Suspense fallback={<div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-lg" />
          ))}
        </div>}>
          <DiscoverContent q={q} tag={tag} />
        </Suspense>
      </div>
    </div>
  );
}
