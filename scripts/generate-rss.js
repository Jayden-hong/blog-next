const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const DOMAIN = 'https://blog.zucchini.win';
const postsDir = path.join(process.cwd(), 'content/posts');
const outputDir = path.join(process.cwd(), 'public');

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  })[c]);
}

function generateRss() {
  if (!fs.existsSync(postsDir)) {
    console.log('No posts directory found');
    return;
  }

  // Get cutoff time (24 hours ago)
  const cutoffTime = Date.now() - 24 * 60 * 60 * 1000;

  const files = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.(mdx|md)$/, '');
      const fullPath = path.join(postsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const postTime = new Date(data.date || 0).getTime();
      
      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        postTime,
        description: data.description || content.slice(0, 200).replace(/[#*_`]/g, ''),
        tags: data.tags || []
      };
    })
    .filter(post => post.postTime >= cutoffTime) // Only last 24h
    .sort((a, b) => b.postTime - a.postTime);

  const lastBuildDate = new Date().toUTCString();

  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>No Noise Blog</title>
    <link>${DOMAIN}</link>
    <description>Your attention is valuable. Every day: must-reads, plus latest writing.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${DOMAIN}/rss.xml" rel="self" type="application/rss+xml"/>
    <atom:link href="${DOMAIN}/feed.json" rel="alternate" type="application/json"/>
`;

  files.forEach(post => {
    const postDate = new Date(post.date).toUTCString();
    const postUrl = `${DOMAIN}/blog/${post.slug}/`;
    const mdUrl = `${DOMAIN}/md/${post.slug}.md`;
    const categories = post.tags.map(tag => `    <category>${escapeXml(tag)}</category>`).join('\n');
    
    rss += `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${postDate}</pubDate>
${categories}
      <description>${escapeXml(post.description)}</description>
      <content:encoded><![CDATA[
        <p>${post.description}</p>
        <p><a href="${mdUrl}">Agent-friendly Markdown version (70% smaller)</a></p>
        <p><a href="${postUrl}">Read on blog →</a></p>
      ]]></content:encoded>
    </item>`;
  });

  rss += `
  </channel>
</rss>`;

  fs.writeFileSync(path.join(outputDir, 'rss.xml'), rss, 'utf8');
  console.log(`✓ Generated RSS feed with ${files.length} items (last 24h)`);
  
  // Also generate JSON Feed (modern alternative)
  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'No Noise Blog',
    home_page_url: DOMAIN,
    feed_url: `${DOMAIN}/feed.json`,
    description: 'Your attention is valuable. Every day: must-reads, plus latest writing.',
    language: 'en',
    items: files.map(post => ({
      id: `${DOMAIN}/blog/${post.slug}/`,
      url: `${DOMAIN}/blog/${post.slug}/`,
      title: post.title,
      content_text: post.description,
      date_published: post.date,
      tags: post.tags,
      _agent_friendly: `${DOMAIN}/md/${post.slug}.md`
    }))
  };
  
  fs.writeFileSync(path.join(outputDir, 'feed.json'), JSON.stringify(jsonFeed, null, 2), 'utf8');
  console.log(`✓ Generated JSON feed with ${files.length} items (last 24h)`);
}

generateRss();
