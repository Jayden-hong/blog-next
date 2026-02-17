'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchBoxProps {
  initialQuery?: string;
}

export function SearchBox({ initialQuery = '' }: SearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  // Sync with URL params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setQuery(q);
    } else {
      setQuery('');
    }
  }, [searchParams]);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      const params = new URLSearchParams(searchParams.toString());
      
      // Remove tag when searching
      params.delete('tag');
      
      if (value.trim()) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
      router.push(`/discover?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-neutral-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="搜索文章标题、描述、来源..."
        className="block w-full pl-10 pr-3 py-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      {query && (
        <button
          onClick={() => handleSearch('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export interface FeedArticle {
  title: string;
  url: string;
  source: string;
  author: string;
  date: string;
  description: string;
  tags: string[];
  recommendReason: string;
  score: number;
}

// ArticleList component - receives articles as props from server
export function ArticleList({ articles }: { articles: FeedArticle[] }) {
  if (!articles || articles.length === 0) {
    return (
      <p className="text-neutral-500 text-center py-12">
        没有找到匹配的文章
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {articles.map((article, index) => (
        <a
          key={`${article.url}-${index}`}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Score Badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                  {article.score.toFixed(1)}
                </span>
                {article.tags && article.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {article.title}
              </h3>
              
              {/* Author, Source, Date */}
              <div className="flex items-center gap-2 mt-1.5 text-sm text-neutral-500">
                {article.author && (
                  <>
                    <span>{article.author}</span>
                    <span>·</span>
                  </>
                )}
                <span>{article.source}</span>
                <span>·</span>
                <span>{article.date}</span>
              </div>
              
              {/* Description */}
              {article.description && (
                <p className="mt-2 text-sm text-neutral-500 line-clamp-2">
                  {article.description}
                </p>
              )}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
