#!/usr/bin/env node
/**
 * Export feed data to public/feed/
 * - latest.json: 最新一天
 * - all-articles.json: 所有历史文章聚合
 */

const fs = require('fs');
const path = require('path');

const feedDir = path.join(__dirname, '../content/feed');
const publicDir = path.join(__dirname, '../public/feed');

function getAllTags(files) {
  const allTags = new Set();
  files.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(feedDir, file), 'utf8'));
    data.articles?.forEach(article => {
      article.tags?.forEach(tag => allTags.add(tag));
    });
  });
  return Array.from(allTags).sort();
}

try {
  // Ensure public/feed directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Get all feed JSON files
  if (!fs.existsSync(feedDir)) {
    console.warn('⚠️  No feed directory found, creating empty feeds');
    const emptyFeed = {
      date: new Date().toISOString().split('T')[0],
      totalSources: 0,
      totalArticles: 0,
      highlights: [],
      articles: [],
      allTags: []
    };
    fs.writeFileSync(path.join(publicDir, 'latest.json'), JSON.stringify(emptyFeed, null, 2));
    fs.writeFileSync(path.join(publicDir, 'all-articles.json'), JSON.stringify(emptyFeed, null, 2));
    process.exit(0);
  }

  const files = fs.readdirSync(feedDir)
    .filter(f => f.endsWith('.json') && f !== 'all-articles.json' && f !== 'latest.json')
    .sort()
    .reverse(); // Latest first

  if (files.length === 0) {
    console.warn('⚠️  No feed files found, creating empty feeds');
    const emptyFeed = {
      date: new Date().toISOString().split('T')[0],
      totalSources: 0,
      totalArticles: 0,
      highlights: [],
      articles: [],
      allTags: []
    };
    fs.writeFileSync(path.join(publicDir, 'latest.json'), JSON.stringify(emptyFeed, null, 2));
    fs.writeFileSync(path.join(publicDir, 'all-articles.json'), JSON.stringify(emptyFeed, null, 2));
    process.exit(0);
  }

  // Get all tags across all feeds
  const allTags = getAllTags(files);

  // Export latest.json (most recent day)
  const latestFile = path.join(feedDir, files[0]);
  const latestData = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
  const latestOutput = {
    ...latestData,
    allTags
  };
  fs.writeFileSync(path.join(publicDir, 'latest.json'), JSON.stringify(latestOutput, null, 2));
  console.log(`✅ Exported latest: ${latestData.date} (${latestData.totalArticles} articles)`);

  // Export all-articles.json (aggregate all history)
  const allArticles = [];
  let totalSources = new Set();
  
  files.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(feedDir, file), 'utf8'));
    if (data.articles) {
      allArticles.push(...data.articles);
    }
    if (data.totalSources) {
      // Approximate source count
      totalSources.add(file.split('.')[0]);
    }
  });

  // Remove duplicates based on URL
  const uniqueArticles = [];
  const seenUrls = new Set();
  allArticles.forEach(article => {
    if (!seenUrls.has(article.url)) {
      seenUrls.add(article.url);
      uniqueArticles.push(article);
    }
  });

  const allArticlesOutput = {
    date: latestData.date,
    totalSources: allTags.length, // Approximation
    totalArticles: uniqueArticles.length,
    articles: uniqueArticles,
    allTags
  };
  
  fs.writeFileSync(path.join(publicDir, 'all-articles.json'), JSON.stringify(allArticlesOutput, null, 2));
  console.log(`✅ Exported all-articles: ${uniqueArticles.length} unique articles from ${files.length} days`);

} catch (error) {
  console.error('❌ Failed to export feed:', error);
  process.exit(1);
}
