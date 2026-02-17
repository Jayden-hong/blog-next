import fs from 'fs';
import path from 'path';

const feedDirectory = path.join(process.cwd(), 'content/feed');

export interface FeedArticle {
  title: string;
  url: string;
  source: string;
  category: string;
  isHot?: boolean;
}

export interface FeedHighlight {
  title: string;
  source: string;
  url: string;
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

export function getAllCategories(): string[] {
  const days = getAllFeedDays();
  const categories = new Set<string>();
  days.forEach((day) => {
    day.articles.forEach((article) => categories.add(article.category));
  });
  return Array.from(categories).sort();
}
