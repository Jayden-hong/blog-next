'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

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

interface DiscoverClientProps {
  articles: FeedArticle[];
  allTags: string[];
}

export function DiscoverClient({ articles, allTags }: DiscoverClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    let result = articles;
    
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
  }, [articles, activeTag, searchQuery]);

  return (
    <>
      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索文章..."
          className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 mb-6 text-sm text-neutral-500">
        <span>{filteredArticles.length} 篇文章</span>
        {activeTag && <span>·</span>}
        {activeTag && <span>标签: {activeTag}</span>}
      </div>

      {/* Tag Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            !activeTag ? 'bg-blue-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'
          }`}
        >
          全部
        </button>
        {allTags.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTag(t)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              activeTag === t ? 'bg-blue-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="grid gap-3">
        {filteredArticles.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-neutral-400 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {article.score.toFixed(1)}
              </span>
              {article.tags?.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs bg-neutral-100 px-2 py-0.5 rounded text-neutral-500">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="font-medium text-neutral-900">{article.title}</h3>
            <div className="text-sm text-neutral-500 mt-1">
              {article.author} · {article.source} · {article.date}
            </div>
            <p className="text-sm text-neutral-500 mt-2 line-clamp-2">{article.description}</p>
          </a>
        ))}
      </div>
    </>
  );
}
