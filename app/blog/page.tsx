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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">
            Writing
          </h1>
          <p className="text-neutral-500">
            个人思考与技术分享
          </p>
        </header>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-neutral-500">No posts yet</p>
          ) : (
            posts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                    <time className="text-sm text-neutral-400 shrink-0">
                      {format(new Date(post.date), 'MMM d, yyyy')}
                    </time>
                  </div>
                  
                  <p className="text-neutral-500 text-sm mb-3">
                    {post.excerpt}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-neutral-500"
                        >
                          #{tag}
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
