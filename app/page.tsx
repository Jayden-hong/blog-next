import Link from 'next/link';
import { getLatestFeedDay } from '@/lib/feed';
import { getAllPosts } from '@/lib/posts';
import { format } from 'date-fns';

export default function Home() {
  const feedDay = getLatestFeedDay();
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-3xl mx-auto px-4 pt-16 pb-12">
        <h1 className="text-2xl font-medium tracking-tight mb-3 text-neutral-900">
          Hey, I&apos;m Jayden
        </h1>
        <p className="text-neutral-500 leading-relaxed">
          AI 产品经理 · 工具探索者 · 一人公司实践者
        </p>
      </section>

      {/* Two Column Layout */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Left Column - Today's Highlights (Top 6) */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-medium text-neutral-900">
                今日推荐
              </h2>
              <span className="text-xs text-neutral-400 mono">
                {feedDay?.date || format(new Date(), 'yyyy-MM-dd')}
              </span>
            </div>
            
            {feedDay && feedDay.highlights.length > 0 ? (
              <div className="grid gap-3">
                {feedDay.highlights.slice(0, 5).map((highlight, index) => (
                  <a
                    key={index}
                    href={highlight.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border-b border-neutral-100 pb-3 last:border-0 hover:opacity-60 transition-opacity group"
                  >
                    {/* Title */}
                    <h3 className="font-medium text-neutral-900 mb-1">
                      {highlight.title}
                    </h3>
                    
                    {/* Meta line */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mono">
                      <span>{highlight.source}</span>
                      {highlight.author && (
                        <>
                          <span>·</span>
                          <span>{highlight.author}</span>
                        </>
                      )}
                      <span className="text-neutral-300">|</span>
                      <span>{highlight.score}/10</span>
                      {highlight.tags?.[0] && (
                        <>
                          <span className="text-neutral-300">|</span>
                          <span>{highlight.tags[0]}</span>
                        </>
                      )}
                    </div>
                    
                    {/* Description - 一行 */}
                    {highlight.description && (
                      <p className="mt-2 text-sm text-neutral-500 line-clamp-1">
                        {highlight.description}
                      </p>
                    )}
                    
                    {/* Recommend Reason - Highlights 都显示 */}
                    {highlight.recommendReason && (
                      <p className="mt-1 text-xs text-neutral-400 mono">
                        → {highlight.recommendReason}
                      </p>
                    )}
                  </a>
                ))}
                
                <Link
                  href="/discover"
                  className="inline-block mt-4 text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  查看全部 →
                </Link>
              </div>
            ) : (
              <p className="text-neutral-400 text-sm">今日暂无推荐</p>
            )}
          </div>

          {/* Right Column - Latest Writing */}
          <div>
            <h2 className="text-base font-medium mb-6 text-neutral-900">
              Latest Writing
            </h2>
            
            <div className="space-y-5">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <article key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h3 className="font-medium text-neutral-900 group-hover:opacity-60 transition-opacity mb-1">
                        {post.title}
                      </h3>
                      <time className="text-xs text-neutral-400 mono">
                        {format(new Date(post.date), 'yyyy-MM-dd')}
                      </time>
                    </Link>
                  </article>
                ))
              ) : (
                <p className="text-neutral-400 text-sm">暂无文章</p>
              )}
              
              {posts.length > 0 && (
                <Link
                  href="/blog"
                  className="inline-block text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
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
