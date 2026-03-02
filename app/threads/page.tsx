import Link from 'next/link';
import { getXThreads, XThread } from '@/lib/xthreads';
import { format } from 'date-fns';

export const metadata = {
  title: 'X Threads - Jayden',
  description: 'Curated long-form threads from X (Twitter)',
};

const ITEMS_PER_PAGE = 20;

interface ThreadsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ThreadsPage({ searchParams }: ThreadsPageProps) {
  const allThreads = getXThreads();
  
  const lang = (searchParams.lang as string) || 'all';
  const page = parseInt((searchParams.page as string) || '1', 10);
  
  // Filter: exclude Japanese, keep en/zh/all
  const langFiltered = allThreads.filter(t => {
    if (lang === 'all') return t.lang === 'en' || t.lang === 'zh';
    return t.lang === lang;
  });
  
  // Pagination
  const totalItems = langFiltered.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const threads = langFiltered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  // Counts (excluding Japanese)
  const counts = {
    all: allThreads.filter(t => t.lang === 'en' || t.lang === 'zh').length,
    en: allThreads.filter(t => t.lang === 'en').length,
    zh: allThreads.filter(t => t.lang === 'zh').length,
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
            X Threads
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Top long-form threads from X, ranked by engagement
          </p>
          <p className="text-xs text-neutral-400 mt-4">
            Source: <a href="https://www.attentionvc.ai" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-600">AttentionVC</a>
            {allThreads.length > 0 && (
              <span className="ml-2">· Updated: {format(new Date(allThreads[0].date), 'yyyy-MM-dd')}</span>
            )}
          </p>
        </header>

        {/* Language Filter - Only 3 options */}
        <div className="flex items-center gap-2 mb-8 pb-6 border-b border-neutral-100">
          {[
            { key: 'all', label: 'All' },
            { key: 'en', label: 'English' },
            { key: 'zh', label: '中文' },
          ].map(({ key, label }) => (
            <Link
              key={key}
              href={`/threads?lang=${key}&page=1`}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                lang === key 
                  ? 'bg-neutral-900 text-white' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {label} ({counts[key as keyof typeof counts]})
            </Link>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-neutral-400">
            {totalItems > 0 ? (
              <>Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems}</>
            ) : (
              'No results'
            )}
          </p>
          {totalPages > 1 && (
            <p className="text-xs text-neutral-400 mono">
              Page {currentPage} / {totalPages}
            </p>
          )}
        </div>

        {/* Threads */}
        <div className="space-y-6">
          {threads.length === 0 ? (
            <p className="text-neutral-400 text-sm">No threads available</p>
          ) : (
            threads.map((thread, index) => (
              <article key={thread.id} className="group border-b border-neutral-100 pb-6 last:border-0">
                <a 
                  href={thread.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  {/* Rank + Title */}
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-xs text-neutral-300 mono w-6">
                      {startIndex + index + 1}
                    </span>
                    <h2 className="font-medium text-neutral-900 group-hover:opacity-60 transition-opacity flex-1">
                      {thread.title}
                    </h2>
                  </div>
                  
                  {/* Author */}
                  <div className="flex items-center gap-2 ml-9">
                    <span className="text-xs text-neutral-400 mono">{thread.author}</span>
                    {thread.authorName && thread.authorName !== thread.author && (
                      <span className="text-xs text-neutral-300">({thread.authorName})</span>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-neutral-500 text-sm mt-2 line-clamp-2 ml-9">
                    {thread.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-3 text-xs text-neutral-400 mono ml-9 flex-wrap">
                    <span className="px-2 py-0.5 bg-neutral-100 rounded text-neutral-600">
                      {thread.category}
                    </span>
                    <Link href={`/threads?lang=${thread.lang}&page=1`} className="hover:text-neutral-900 hover:underline">{(thread.lang || '').toUpperCase()}</Link>
                    {thread.readingTime && thread.readingTime > 0 && (
                      <span>{thread.readingTime} min</span>
                    )}
                    {thread.wordCount && thread.wordCount > 0 && (
                      <span>{thread.wordCount.toLocaleString()} words</span>
                    )}
                    <span>·</span>
                    <span>{thread.engagement}</span>
                  </div>
                </a>
              </article>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-neutral-100">
            {currentPage > 1 ? (
              <Link
                href={`/threads?lang=${lang}&page=${currentPage - 1}`}
                className="px-3 py-1 text-sm text-neutral-500 hover:text-neutral-900"
              >
                ← Prev
              </Link>
            ) : (
              <span className="px-3 py-1 text-sm text-neutral-300">← Prev</span>
            )}
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Link
                    key={pageNum}
                    href={`/threads?lang=${lang}&page=${pageNum}`}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded transition-colors ${
                      pageNum === currentPage
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-500 hover:bg-neutral-100'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
            
            {currentPage < totalPages ? (
              <Link
                href={`/threads?lang=${lang}&page=${currentPage + 1}`}
                className="px-3 py-1 text-sm text-neutral-500 hover:text-neutral-900"
              >
                Next →
              </Link>
            ) : (
              <span className="px-3 py-1 text-sm text-neutral-300">Next →</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
