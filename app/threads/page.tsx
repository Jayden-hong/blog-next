import Link from 'next/link';
import { getXThreads } from '@/lib/xthreads';
import { format } from 'date-fns';

export const metadata = {
  title: 'X Threads - Jayden',
  description: 'Curated long-form threads from X (Twitter)',
};

export default function ThreadsPage() {
  const threads = getXThreads();

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
            X Threads
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Curated long-form threads from X (Twitter)
          </p>
          <p className="text-xs text-neutral-400 mt-4">
            Source: <a href="https://www.attentionvc.ai" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-600">AttentionVC</a>
          </p>
        </header>

        <div className="space-y-6">
          {threads.length === 0 ? (
            <p className="text-neutral-400 text-sm">No threads available</p>
          ) : (
            threads.map((thread) => (
              <article key={thread.id} className="group border-b border-neutral-100 pb-6 last:border-0">
                <a 
                  href={thread.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <h2 className="font-medium text-neutral-900 group-hover:opacity-60 transition-opacity">
                      {thread.title}
                    </h2>
                    <span className="text-xs text-neutral-400 mono shrink-0">
                      {thread.author}
                    </span>
                  </div>
                  
                  <p className="text-neutral-500 text-sm mt-2 line-clamp-2">
                    {thread.description}
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-xs text-neutral-400 mono">
                    <span>{format(new Date(thread.date), 'yyyy-MM-dd')}</span>
                    {thread.engagement && (
                      <>
                        <span>·</span>
                        <span>{thread.engagement} engagements</span>
                      </>
                    )}
                    {thread.category && (
                      <>
                        <span>·</span>
                        <span>{thread.category}</span>
                      </>
                    )}
                  </div>
                </a>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
