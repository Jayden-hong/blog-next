import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Force rebuild: 2026-02-17T12:40:00Z
const feedDirectory = path.join(process.cwd(), 'content/feed');
const discoverDirectory = path.join(process.cwd(), 'content/discover');

export interface FeedArticle {
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

export interface FeedHighlight extends FeedArticle {
  // Highlights are articles with high scores
}

export interface FeedDay {
  date: string;
  totalSources: number;
  totalArticles: number;
  highlights: FeedHighlight[];
  articles: FeedArticle[];
}

export function getAllFeedDays(): FeedDay[] {
  if (!fs.existsSync(feedDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(feedDirectory);
  const feedDays = fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(feedDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents) as FeedDay;
    });

  // Sort by date descending
  return feedDays.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getLatestFeedDay(): FeedDay | null {
  const days = getAllFeedDays();
  return days.length > 0 ? days[0] : null;
}

export function getFeedDayByDate(date: string): FeedDay | null {
  const days = getAllFeedDays();
  return days.find((day) => day.date === date) || null;
}

export function getAllTags(): string[] {
  const days = getAllFeedDays();
  const tags = new Set<string>();
  days.forEach((day) => {
    day.articles.forEach((article) => {
      article.tags?.forEach((tag) => tags.add(tag));
    });
  });
  return Array.from(tags).sort();
}

// Get all articles from all feed days, sorted by score
export function getAllArticles(): FeedArticle[] {
  const days = getAllFeedDays();
  const allArticles: FeedArticle[] = [];
  
  days.forEach((day) => {
    allArticles.push(...day.articles);
  });
  
  // Sort by score descending
  return allArticles.sort((a, b) => (b.score || 0) - (a.score || 0));
}

// Get articles filtered by tag
export function getArticlesByTag(tag: string): FeedArticle[] {
  const allArticles = getAllArticles();
  return allArticles.filter((article) => 
    article.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

// Search articles by query
export function searchArticles(query: string): FeedArticle[] {
  if (!query.trim()) {
    return getAllArticles();
  }
  
  const lowerQuery = query.toLowerCase();
  const allArticles = getAllArticles();
  
  return allArticles.filter((article) => {
    const titleMatch = article.title.toLowerCase().includes(lowerQuery);
    const descMatch = article.description?.toLowerCase().includes(lowerQuery);
    const tagMatch = article.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery));
    const sourceMatch = article.source.toLowerCase().includes(lowerQuery);
    const authorMatch = article.author?.toLowerCase().includes(lowerQuery);
    
    return titleMatch || descMatch || tagMatch || sourceMatch || authorMatch;
  });
}

// Legacy: getAllCategories (now uses tags)
export function getAllCategories(): string[] {
  return getAllTags();
}

// Local Discover Articles (MDX-based) - Legacy
export interface DiscoverArticle {
  slug: string;
  title: string;
  source: string;
  sourceUrl: string;
  category: string;
  date: string;
  aiSummary: string;
  originalContent: string;
  originalUrl: string;
}

export function getAllDiscoverArticles(): DiscoverArticle[] {
  if (!fs.existsSync(discoverDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(discoverDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(discoverDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Extract AI summary and original content from the MDX content
      let aiSummary = '';
      let originalContent = '';
      let originalUrl = data.original_url || '';

      // Simple parsing - look for "## AI 摘要" and "## 原文内容" sections
      const aiSummaryMatch = content.match(/## AI 摘要\n([\s\S]*?)(?:---|$)/);
      const originalContentMatch = content.match(/## 原文内容\n([\s\S]*?)(?:---|$)/);

      if (aiSummaryMatch) {
        aiSummary = aiSummaryMatch[1].trim();
      }
      if (originalContentMatch) {
        originalContent = originalContentMatch[1].trim();
      }

      return {
        slug: data.slug || fileName.replace('.mdx', ''),
        title: data.title || '',
        source: data.source || '',
        sourceUrl: data.original_url || '',
        category: data.category || '',
        date: data.date || '',
        aiSummary,
        originalContent,
        originalUrl,
      } as DiscoverArticle;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getDiscoverArticleBySlug(slug: string): DiscoverArticle | null {
  const articles = getAllDiscoverArticles();
  return articles.find((article) => article.slug === slug) || null;
}

export function searchDiscoverArticles(query: string): DiscoverArticle[] {
  if (!query.trim()) {
    return getAllDiscoverArticles();
  }

  const lowerQuery = query.toLowerCase();
  const articles = getAllDiscoverArticles();

  return articles.filter((article) => {
    const titleMatch = article.title.toLowerCase().includes(lowerQuery);
    const summaryMatch = article.aiSummary.toLowerCase().includes(lowerQuery);
    const categoryMatch = article.category.toLowerCase().includes(lowerQuery);
    const sourceMatch = article.source.toLowerCase().includes(lowerQuery);

    return titleMatch || summaryMatch || categoryMatch || sourceMatch;
  });
}

export function getDiscoverArticlesByDate(): { date: string; articles: DiscoverArticle[] }[] {
  const articles = getAllDiscoverArticles();
  const grouped: Record<string, DiscoverArticle[]> = {};

  articles.forEach((article) => {
    const date = article.date;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(article);
  });

  return Object.entries(grouped)
    .map(([date, arts]) => ({ date, articles: arts }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
