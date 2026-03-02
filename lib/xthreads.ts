import fs from 'fs';
import path from 'path';

export interface XThread {
  id: string;
  title: string;
  url: string;
  author: string;
  description: string;
  date: string;
  engagement?: string;
  category?: string;
}

const THREADS_FILE = path.join(process.cwd(), 'content/feed/x-threads.json');

export function getXThreads(): XThread[] {
  try {
    if (!fs.existsSync(THREADS_FILE)) {
      return [];
    }
    
    const data = JSON.parse(fs.readFileSync(THREADS_FILE, 'utf8'));
    return data.threads || [];
  } catch (error) {
    console.error('Failed to load X threads:', error);
    return [];
  }
}
