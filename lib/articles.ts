import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export interface Article {
  slug: string;
  title: string;
  date: string;
  content: string;
  contentHtml?: string;
  excerpt?: string;
  tags?: string[];
  source?: string;
  url?: string;
  score?: number;
  translated?: boolean;
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const allArticles = fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(mdx|md)$/, '');
      const fullPath = path.join(articlesDirectory, fileName);
      
      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Convert markdown to HTML
        const contentHtml = marked.parse(content);

        return {
          slug,
          title: data.title || slug,
          date: data.date || new Date().toISOString(),
          content,
          contentHtml: typeof contentHtml === 'string' ? contentHtml : '',
          excerpt: data.excerpt || content.slice(0, 200).replace(/#.*\n/g, ''),
          tags: data.tags || [],
          source: data.source,
          url: data.url,
          score: data.score,
          translated: data.translated,
        } as Article;
      } catch (error) {
        console.error(`Error parsing article ${fileName}:`, error);
        return null;
      }
    })
    .filter((article): article is Article => article !== null);

  // Sort by date
  return allArticles.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticles();
  return articles.find((article) => article.slug === slug) || null;
}
