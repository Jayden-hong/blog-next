import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { format } from 'date-fns';

export const metadata = {
  title: '博客文章 - Jayden\'s Blog',
  description: 'AI、Web3、技术分享',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          📝 博客文章
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12">
          分享关于 AI、Web3 和技术的思考
        </p>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
          ) : (
            posts.map((post) => (
              <article
                key={post.slug}
                className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800"
              >
                <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10 rounded-lg" aria-label={post.title} />
                  <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <time dateTime={post.date}>
                    {format(new Date(post.date), 'yyyy-MM-dd')}
                  </time>
                  {post.author && (
                    <>
                      <span>•</span>
                      <span>{post.author}</span>
                    </>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
