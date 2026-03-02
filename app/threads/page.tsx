'use client';

import { useEffect, useState, useMemo } from 'react';
import { XThread } from '@/lib/xthreads';

const ITEMS_PER_PAGE = 20;

export default function ThreadsPage() {
  const [allThreads, setAllThreads] = useState<XThread[]>([]);
  const [loading, setLoading] = useState(true);
  
  // URL: /threads/en/1/ -> lang=en, page=1
  const [lang, setLang] = useState('all');
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    // Load data
    import('@/lib/xthreads').then(({ getXThreads }) => {
      setAllThreads(getXThreads());
      setLoading(false);
    });
    
    // Parse URL path: /threads/en/1/ -> lang=en, page=1
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    // pathParts = ['threads', 'en', '1', ''] or ['threads', '']
    const langFromUrl = pathParts[1] || 'all';
    const pageFromUrl = parseInt(pathParts[2] || '1', 10);
    
    setLang(langFromUrl);
    setPage(pageFromUrl);
  }, []);
  
  const { filtered, totalPages, currentPage, startIndex, counts } = useMemo(() => {
    const langFiltered = allThreads.filter(t => {
      if (lang === 'all') return t.lang === 'en' || t.lang === 'zh';
      return t.lang === lang;
    });
    
    const totalItems = langFiltered.length;
    const tp = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const cp = Math.max(1, Math.min(page, tp || 1));
    const si = (cp - 1) * ITEMS_PER_PAGE;
    
    const c = {
      all: allThreads.filter(t => t.lang === 'en' || t.lang === 'zh').length,
      en: allThreads.filter(t => t.lang === 'en').length,
      zh: allThreads.filter(t => t.lang === 'zh').length,
    };
    
    return {
      filtered: langFiltered.slice(si, si + ITEMS_PER_PAGE),
      totalPages: tp,
      currentPage: cp,
      startIndex: si,
      counts: c
    };
  }, [allThreads, lang, page]);
  
  const navigate = (newLang: string, newPage: number) => {
    const url = `/threads/${newLang}/${newPage}/`;
    window.location.href = url;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900">X Threads</h1>
          <p className="text-sm text-neutral-500 mt-2">Top long-form threads from X, ranked by engagement</p>
          <p className="text-xs text-neutral-400 mt-4">
            Source: <a href="https://www.attentionvc.ai" target="_blank" rel="noopener noreferrer">AttentionVC</a>
          </p>
        </header>

        <div className="flex items-center gap-2 mb-8 pb-6 border-b border-neutral-100">
          {[
            { key: 'all', label: 'All' },
            { key: 'en', label: 'English' },
            { key: 'zh', label: '中文' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => navigate(key, 1)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                lang === key ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {label} ({counts[key as keyof typeof counts]})
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-neutral-400">
            {filtered.length > 0 ? (
              <>Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {counts.all}</>
            ) : 'No results'}
          </p>
          {totalPages > 1 && <p className="text-xs text-neutral-400">Page {currentPage} / {totalPages}</p>}
        </div>

        <div className="space-y-6">
          {filtered.length === 0 ? (
            <p className="text-neutral-400 text-sm">No threads available</p>
          ) : (
            filtered.map((thread, index) => (
              <article key={thread.id} className="group border-b border-neutral-100 pb-6">
                <a href={thread.url} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-xs text-neutral-300 mono w-6">{startIndex + index + 1}</span>
                    <h2 className="font-medium text-neutral-900 group-hover:opacity-60">{thread.title}</h2>
                  </div>
                  <div className="flex items-center gap-">
                    <span ml-9 className="text-xs text-neutral-400 mono">{thread.author}</span>
                  </div>
                  <p className="text-neutral-500 text-sm mt-2 line-clamp-2 ml-9">{thread.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-neutral-400 mono ml-9">
                    <span className="px-2 py-0.5 bg-neutral-100 rounded text-neutral-600">{thread.category}</span>
                    <span>{thread.engagement}</span>
                  </div>
                </a>
              </article>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-neutral-100">
            <button
              onClick={() => navigate(lang, currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-neutral-500 hover:text-neutral-900 disabled:text-neutral-300"
            >
              ← Prev
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => navigate(lang, pageNum)}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
                      pageNum === currentPage ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => navigate(lang, currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-neutral-500 hover:text-neutral-900 disabled:text-neutral-300"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
