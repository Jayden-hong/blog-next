import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { translateArticleEditorial } from '@/lib/ai-translator';

interface ArticleData {
  title: string;
  url: string;
  source: string;
  author: string;
  date: string;
  description: string;
  tags: string[];
  recommendReason: string;
  score: number;
}

async function getArticle(slug: string): Promise<ArticleData | null> {
  try {
    // 从 feed 数据中获取文章
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.zucchini.win'}/feed/all-articles.json`, {
      cache: 'no-store'
    });
    const data = await response.json();
    
    // 根据 slug 查找文章（slug 是 URL 编码后的标题）
    const article = data.articles.find((a: ArticleData) => 
      encodeURIComponent(a.title.toLowerCase().replace(/\s+/g, '-')) === slug
    );
    
    return article || null;
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return null;
  }
}



export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  
  if (!article) {
    notFound();
  }

  const translatedContent = await translateArticleEditorial(article);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* 返回按钮 */}
        <Link 
          href="/discover" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回发现页
        </Link>

        {/* 文章头部 */}
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          {/* 元信息 */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 not-prose">
            <span>{article.source}</span>
            <span>•</span>
            <span>{article.author}</span>
            <span>•</span>
            <time>{new Date(article.date).toLocaleDateString('zh-CN')}</time>
            <span>•</span>
            <span className="text-amber-600 font-medium">评分: {article.score}/10</span>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-8 not-prose">
            {article.tags.map(tag => (
              <span 
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 原文链接（顶部） */}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors no-underline mb-8"
          >
            阅读原文
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* 转译内容 */}
          <div 
            className="mt-8 text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: translatedContent.replace(/\n/g, '<br />') }}
          />

          {/* 原文链接（底部） */}
          <div className="mt-12 pt-8 border-t border-gray-200 not-prose">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              查看完整原文
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}

// 静态生成（可选，如果文章数量不多可以预生成）
export const dynamic = 'force-dynamic'; // 先用动态渲染，避免构建时出错
