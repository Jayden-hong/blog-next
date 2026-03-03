'use client';

import { useState, useEffect } from 'react';

interface XThread {
  id: string;
  title: string;
  url: string;
  author: string;
  authorName?: string;
  description: string;
  date: string;
  engagement: string;
  category: string;
  wordCount?: number;
  readingTime?: number;
  lang?: string;
  rank?: number;
  metrics?: {
    views: number;
    likes: number;
    retweets: number;
    bookmarks: number;
  };
}

const ITEMS_PER_PAGE = 20;

export default function ThreadsPage() {
  const [allThreads, setAllThreads] = useState<XThread[]>([]);
  const [lang, setLang] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load threads from public/x-threads.json
  useEffect(() => {
    fetch('/x-threads.json')
      .then(res => res.json())
      .then(data => {
        setAllThreads(data.threads || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load threads:', err);
        setLoading(false);
      });
  }, []);

  // Client-side filter
  const filtered = allThreads.filter(t => {
    if (lang === 'all') return t.lang === 'en' || t.lang === 'zh';
    return t.lang === lang;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const threadsToShow = filtered.slice(startIdx, endIdx);

  if (loading) {
    return (
      <div className="min-h-screen max-w-3xl mx-auto px-4 py-16">
        <p className="text-neutral-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight mb-3 text-neutral-900">
          X Threads
        </h1>
        <p className="text-neutral-500">
          Curated long-form threads from X, powered by AttentionVC.
        </p>
      </div>

      {/* Language Filter */}
      <div className="flex items-center gap-4 mb-8 border-b border-neutral-100">
        <button
          onClick={() => { setLang('all'); setPage(1); }}
          className={`pb-2 text-sm transition-colors ${
            lang === 'all'
              ? 'text-neutral-900 border-b-2 border-neutral-900'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          All ({allThreads.filter(t => t.lang === 'en' || t.lang === 'zh').length})
        </button>
        <button
          onClick={() => { setLang('en'); setPage(1); }}
          className={`pb-2 text-sm transition-colors ${
            lang === 'en'
              ? 'text-neutral-900 border-b-2 border-neutral-900'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          English ({allThreads.filter(t => t.lang === 'en').length})
        </button>
        <button
          onClick={() => { setLang('zh'); setPage(1); }}
          className={`pb-2 text-sm transition-colors ${
            lang === 'zh'
              ? 'text-neutral-900 border-b-2 border-neutral-900'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          中文 ({allThreads.filter(t => t.lang === 'zh').length})
        </button>
      </div>

      {/* Threads List */}
      <div className="space-y-6">
        {threadsToShow.length === 0 ? (
          <p className="text-neutral-400 text-sm">No threads found</p>
        ) : (
          threadsToShow.map((thread) => (
            <article key={thread.id} className="border-b border-neutral-100 pb-6 last:border-0">
              <a
                href={thread.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="flex items-start gap-3 mb-2">
                  {thread.category && (
                    <span className="text-xs text-neutral-400 mono px-2 py-0.5 bg-neutral-50 rounded">
                      {thread.category}
                    </span>
                  )}
                  {thread.lang && (
                    <span className="text-xs text-neutral-300 mono">
                      {thread.lang === 'en' ? 'EN' : thread.lang === 'zh' ? '中文' : thread.lang.toUpperCase()}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-medium text-neutral-900 group-hover:opacity-60 transition-opacity mb-2">
                  {thread.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-neutral-400 mono mb-3">
                  <span>{thread.authorName || thread.author}</span>
                  {thread.readingTime && (
                    <>
                      <span className="text-neutral-300">·</span>
                      <span>{thread.readingTime} min read</span>
                    </>
                  )}
                  {thread.wordCount && (
                    <>
                      <span className="text-neutral-300">·</span>
                      <span>{thread.wordCount.toLocaleString()} words</span>
                    </>
                  )}
                </div>

                <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                  {thread.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span>{thread.engagement}</span>
                  <span className="text-neutral-300">·</span>
                  <span>{new Date(thread.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </a>
            </article>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-neutral-100">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-neutral-400 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 text-sm transition-colors ${
                  num === currentPage
                    ? 'text-neutral-900 font-medium'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm text-neutral-400 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
