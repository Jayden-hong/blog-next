'use client';

import { useState, useMemo, useEffect } from 'react';

interface FeedArticle {
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

interface FeedData {
  date: string;
  totalSources: number;
  totalArticles: number;
  articles: FeedArticle[];
  allTags: string[];
}

export function DiscoverClient() {
  const [feedData, setFeedData] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/feed/latest.json')
      .then(res => res.json())
      .then(data => {
        setFeedData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load feed:', err);
        setLoading(false);
      });
  }, []);

  const filteredArticles = useMemo(() => {
    if (!feedData) return [];
    let result = feedData.articles;
    
    if (activeTag) {
      result = result.filter(a => a.tags?.some(t => t.toLowerCase() === activeTag.toLowerCase()));
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    
    return result;
  }, [feedData, activeTag, searchQuery]);

  if (loading) {
    return (
      <>
        <header className="mb-8">
          <div className="flex items-baseline justify-between">
            <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
              Discover
            </h1>
            <span className="text-xs text-neutral-400 mono">
              Loading...
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-2">
            Curated by Kimi K2.5
          </p>
        </header>
        <div className="text-center py-12">
          <p className="text-sm text-neutral-400">Loading feed...</p>
        </div>
      </>
    );
  }

  if (!feedData) {
    return (
      <>
        <header className="mb-8">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
            Discover
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Failed to load feed
          </p>
        </header>
      </>
    );
  }

  const avgScore = feedData.articles.length > 0 
    ? (feedData.articles.reduce((sum, a) => sum + (a.score || 5), 0) / feedData.articles.length).toFixed(1)
    : '0';

  return (
    <>
      {/* Header with actual data */}
      <header className="mb-8">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
            Discover
          </h1>
          <span className="text-xs text-neutral-400 mono">
            {feedData.date}
          </span>
        </div>
        <p className="text-sm text-neutral-500 mt-2">
          {feedData.totalArticles} articles · avg {avgScore}/10 · curated by Kimi K2.5
        </p>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索文章..."
          className="w-full px-3 py-2 border border-neutral-200 rounded bg-white text-sm focus:outline-none focus:border-neutral-400 transition-colors"
        />
      </div>

      {/* Tag Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-3 py-1 text-xs transition-colors mono ${
            !activeTag ? 'text-neutral-900 underline' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          ALL
        </button>
        {feedData.allTags.slice(0, 8).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTag(t)}
            className={`px-3 py-1 text-xs transition-colors mono ${
              activeTag === t ? 'text-neutral-900 underline' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="grid gap-4">
        {filteredArticles.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-b border-neutral-100 pb-4 last:border-0 hover:opacity-60 transition-opacity group"
          >
            {/* Meta */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 mono mb-2">
              <span>{article.score.toFixed(1)}</span>
              <span className="text-neutral-200">|</span>
              <span>{article.source}</span>
              {article.author && (
                <>
                  <span className="text-neutral-200">|</span>
                  <span>{article.author}</span>
                </>
              )}
              {article.tags?.[0] && (
                <>
                  <span className="text-neutral-200">|</span>
                  <span>{article.tags[0]}</span>
                </>
              )}
            </div>
            
            {/* Title */}
            <h3 className="font-medium text-neutral-900 mb-1">
              {article.title}
            </h3>
            
            {/* Description - 一行 */}
            <p className="text-sm text-neutral-500 line-clamp-1">
              {article.description}
            </p>
            
            {/* Recommend Reason - 仅 Highlights 显示 (通过数据控制) */}
            {article.recommendReason && (
              <p className="text-xs text-neutral-400 mt-2 mono">
                → {article.recommendReason}
              </p>
            )}
          </a>
        ))}
      </div>
      
      {filteredArticles.length === 0 && (
        <p className="text-sm text-neutral-400 text-center py-12">
          没有找到匹配的文章
        </p>
      )}
    </>
  );
}
