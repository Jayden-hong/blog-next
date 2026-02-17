import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { format } from 'date-fns';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} - Jayden`,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <article className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-3 text-xs text-neutral-400 mono mb-4">
            <time dateTime={post.date}>
              {format(new Date(post.date), 'yyyy-MM-dd')}
            </time>
            {post.author && (
              <>
                <span>·</span>
                <span>{post.author}</span>
              </>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag) => (
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

        {/* MDX Content */}
        <div className="prose">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeHighlight],
              },
            }}
          />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-neutral-100">
          <Link
            href="/blog"
            className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            ← Back to Writing
          </Link>
        </footer>
      </article>
    </div>
  );
}
