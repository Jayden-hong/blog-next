#!/usr/bin/env node
/**
 * Export latest feed data to public/feed/latest.json
 * This runs during build to make /discover page fully static
 */

const fs = require('fs');
const path = require('path');

const feedDir = path.join(__dirname, '../content/feed');
const publicDir = path.join(__dirname, '../public/feed');
const outputFile = path.join(publicDir, 'latest.json');

try {
  // Ensure public/feed directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Get all feed JSON files
  if (!fs.existsSync(feedDir)) {
    console.warn('⚠️  No feed directory found, creating empty latest.json');
    fs.writeFileSync(outputFile, JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      totalSources: 0,
      totalArticles: 0,
      highlights: [],
      articles: []
    }, null, 2));
    process.exit(0);
  }

  const files = fs.readdirSync(feedDir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse(); // Latest first

  if (files.length === 0) {
    console.warn('⚠️  No feed files found, creating empty latest.json');
    fs.writeFileSync(outputFile, JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      totalSources: 0,
      totalArticles: 0,
      highlights: [],
      articles: []
    }, null, 2));
    process.exit(0);
  }

  // Copy latest feed file
  const latestFile = path.join(feedDir, files[0]);
  const feedData = JSON.parse(fs.readFileSync(latestFile, 'utf8'));

  // Also export all tags for filtering
  const allTags = new Set();
  files.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(feedDir, file), 'utf8'));
    data.articles?.forEach(article => {
      article.tags?.forEach(tag => allTags.add(tag));
    });
  });

  const output = {
    ...feedData,
    allTags: Array.from(allTags).sort()
  };

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log(`✅ Exported feed: ${feedData.date} (${feedData.totalArticles} articles) → public/feed/latest.json`);

} catch (error) {
  console.error('❌ Failed to export feed:', error);
  process.exit(1);
}
