'use client';

import { useState, useMemo } from 'react';

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
        {allTags.slice(0, 8).map((t) => (
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
