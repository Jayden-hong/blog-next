import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { format } from 'date-fns';

export const metadata = {
  title: 'Writing - Jayden',
  description: 'Personal essays and technical writings. AI-friendly markdown versions available.',
  alternates: {
    types: {
      'application/rss+xml': 'https://blog.zucchini.win/rss.xml',
      'application/json': 'https://blog.zucchini.win/feed.json',
    },
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
              Writing
            </h1>
            <a 
              href="/rss.xml" 
              className="text-xs text-neutral-400 hover:text-neutral-600 mono"
              title="Subscribe via RSS"
            >
              RSS
            </a>
          </div>
          <p className="text-sm text-neutral-500 mt-2">
            Personal essays and technical writings
          </p>
          <p className="text-xs text-neutral-400 mt-4">
            Agent-friendly：任意文章链接前添加 <code className="bg-neutral-100 px-1 rounded">/md/</code> 即可获得纯净 Markdown 文本（预估减少 70%token消耗，减少大模型上下文噪声）
            <br />
            示例：<code className="bg-neutral-100 px-1 rounded">/blog/daily-thoughts-2026-02-28/</code> → <code className="bg-neutral-100 px-1 rounded">/md/daily-thoughts-2026-02-28.md</code>
          </p>
        </header>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-neutral-400 text-sm">暂无文章</p>
          ) : (
            posts.map((post) => (
              <article key={post.slug} className="group border-b border-neutral-100 pb-6 last:border-0">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <h2 className="font-medium text-neutral-900 group-hover:opacity-60 transition-opacity">
                      {post.title}
                    </h2>
                    <time className="text-xs text-neutral-400 mono shrink-0">
                      {format(new Date(post.date), 'yyyy-MM-dd')}
                    </time>
                  </div>
                  
                  <p className="text-neutral-500 text-sm mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-neutral-400 mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
