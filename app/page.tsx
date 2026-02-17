import Link from 'next/link';
import { getLatestFeedDay } from '@/lib/feed';
import { getAllPosts } from '@/lib/posts';
import { format } from 'date-fns';

export default function Home() {
  const feedDay = getLatestFeedDay();
  const posts = getAllPosts().slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-neutral-900 dark:text-neutral-100">
          Hey, I&apos;m Jayden
        </h1>
        <p className="text-lg text-neutral-500 max-w-2xl">
          AI 产品经理 · 工具探索者 · 一人公司实践者
        </p>
      </section>

      {/* Two Column Layout */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Left Column - Today's Highlights */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">
              Last 24h Highlights
            </h2>
            
            {feedDay ? (
              <div className="space-y-3">
                {feedDay.highlights.map((highlight, index) => (
                  <a
                    key={index}
                    href={highlight.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {highlight.title}
                      </h3>
                      <span className="text-xs text-neutral-400 shrink-0">
                        {highlight.source}
                      </span>
                    </div>
                  </a>
                ))}
                
                <Link
                  href="/discover"
                  className="inline-block mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View all → 
                </Link>
              </div>
            ) : (
              <p className="text-neutral-500">No highlights available</p>
            )}
          </div>

          {/* Right Column - Latest Writing */}
          <div>
            <h2 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">
              Latest Writing
            </h2>
            
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <article key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                        {post.title}
                      </h3>
                      <time className="text-sm text-neutral-400">
                        {format(new Date(post.date), 'MMM d, yyyy')}
                      </time>
                    </Link>
                  </article>
                ))
              ) : (
                <p className="text-neutral-500">No posts yet</p>
              )}
              
              {posts.length > 0 && (
                <Link
                  href="/blog"
                  className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View all →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
