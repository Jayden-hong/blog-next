import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticles } from '@/lib/articles';
import { format } from 'date-fns';
import Link from 'next/link';

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }
  
  return {
    title: article.title,
    description: article.excerpt || article.title,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    notFound();
  }
  
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link 
          href="/blog" 
          className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8 inline-block"
        >
          ← Back to Writing
        </Link>
        
        {/* Article header */}
        <header className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900 mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <time className="mono">
              {format(new Date(article.date), 'yyyy-MM-dd')}
            </time>
            {article.source && (
              <>
                <span>·</span>
                <span>{article.source}</span>
              </>
            )}
            {article.score && (
              <>
                <span>·</span>
                <span className="text-amber-600">★ {article.score}/10</span>
              </>
            )}
          </div>
          
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-neutral-400 mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        
        {/* Article content */}
        <article className="prose prose-neutral max-w-none">
          <div 
            className="text-neutral-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: article.contentHtml || article.content }}
          />
        </article>
        
        {/* Original link */}
        {article.url && (
          <div className="mt-12 pt-8 border-t border-neutral-100">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              阅读原文 →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
