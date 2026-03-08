import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// Force static generation
export const dynamic = 'force-static';

// Generate static params for all articles
export async function generateStaticParams() {
  const articlesDir = path.join(process.cwd(), 'content/articles');
  
  // Check if directory exists
  if (!fs.existsSync(articlesDir)) {
    return [];
  }
  
  const files = fs.readdirSync(articlesDir);
  
  return files
    .filter(file => file.endsWith('.mdx'))
    .map(file => ({
      slug: file.replace('.mdx', ''),
    }));
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  
  // Read MDX file
  const articlesDir = path.join(process.cwd(), 'content/articles');
  const filePath = path.join(articlesDir, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    notFound();
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto max-w-4xl px-6 py-4">
          <Link 
            href="/discover" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Discover
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto max-w-4xl px-6 py-12">
        {/* Title */}
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          {data.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
          <span>{data.source}</span>
          <span>·</span>
          <span>Score: {data.score}/10</span>
          {data.url && (
            <>
              <span>·</span>
              <a 
                href={data.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
              >
                Original Article <ExternalLink className="w-3 h-3" />
              </a>
            </>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none
          prose-headings:font-serif prose-headings:font-bold
          prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
          prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3
          prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2
          prose-p:mb-4 prose-p:leading-relaxed prose-p:text-gray-800
          prose-a:text-blue-600 prose-a:hover:text-blue-700 prose-a:underline
          prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ul:space-y-2
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-ol:space-y-2
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-4
          prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
        ">
          <MDXRemote 
            source={content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeHighlight],
              },
            }}
          />
        </div>
      </article>
    </div>
  );
}
