import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { format } from 'date-fns';

export default function Home() {
  const posts = getAllPosts().slice(0, 3); // 最新 3 篇

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:60px_60px] dark:bg-grid-slate-50/[0.02]" />
        <div className="relative max-w-6xl mx-auto px-4 py-32">
          <div className="text-center space-y-6">
            <div className="inline-block">
              <div className="text-6xl mb-4 animate-bounce">🥒</div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                你好，我是 Jayden
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              AI 产品经理 · 工具探索者 · 一人公司实践者
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              分享关于 <span className="font-semibold text-blue-600 dark:text-blue-400">AI 产品</span>、
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">工具评测</span>、
              <span className="font-semibold text-purple-600 dark:text-purple-400">效率优化</span> 的思考
            </p>
            <div className="flex gap-4 justify-center pt-6">
              <Link
                href="/blog"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              >
                阅读博客 →
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 rounded-full font-medium transition-all hover:scale-105"
              >
                关于我
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            📚 最新文章
          </h2>
          <Link
            href="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            查看全部 →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              {/* 整张卡片可点击的覆盖链接 */}
              <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" aria-label={post.title} />

              {/* Cover Image Placeholder */}
              <div className={`bg-gradient-to-br ${
                index === 0
                  ? 'from-blue-500 to-indigo-600 h-64'
                  : 'from-purple-400 to-pink-500 h-48'
              }`} />

              <div className="p-6">
                  <h3 className={`${
                    index === 0 ? 'text-2xl' : 'text-xl'
                  } font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                    {post.title}
                  </h3>

                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
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

                <p className={`text-gray-600 dark:text-gray-300 ${
                  index === 0 ? 'text-base' : 'text-sm'
                } mb-4 line-clamp-3`}>
                  {post.excerpt}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {posts.length}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">篇文章</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                AI
              </div>
              <div className="text-gray-600 dark:text-gray-400">产品经理</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                10+
              </div>
              <div className="text-gray-600 dark:text-gray-400">AI 工具</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                ∞
              </div>
              <div className="text-gray-600 dark:text-gray-400">持续学习</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          想要第一时间收到更新？
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          订阅我的 RSS 或在 GitHub 上关注我
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/rss.xml"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition-all hover:scale-105 shadow-lg"
          >
            📡 订阅 RSS
          </a>
          <a
            href="https://github.com/Jayden-hong"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-full font-medium transition-all hover:scale-105 shadow-lg"
          >
            ⭐ GitHub
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-4">
            Made with ❤️ by Jayden | Powered by Next.js + TypeScript
          </p>
          <p className="text-sm">
            © 2026 Jayden's Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
