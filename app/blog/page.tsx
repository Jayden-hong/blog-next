import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { format } from 'date-fns';

export const metadata = {
  title: 'Writing - Jayden',
  description: '个人博客文章',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
            Writing
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            个人思考与技术分享
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
