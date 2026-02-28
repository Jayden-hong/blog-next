const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const DOMAIN = 'https://blog.zucchini.win';
const postsDir = path.join(process.cwd(), 'content/posts');

function getPosts() {
  if (!fs.existsSync(postsDir)) return [];
  
  return fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.(mdx|md)$/, '');
      const fullPath = path.join(postsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug,
        date: data.date || new Date().toISOString(),
        priority: slug.startsWith('daily-brief') ? '0.9' : '0.7'
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function generateSitemap() {
  const posts = getPosts();
  const today = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${DOMAIN}/blog/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${DOMAIN}/discover/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

  posts.forEach(post => {
    const date = post.date.split('T')[0];
    xml += `
  <url>
    <loc>${DOMAIN}/blog/${post.slug}/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${post.priority}</priority>
  </url>`;
  });

  xml += '\n</urlset>';
  
  fs.writeFileSync(path.join(process.cwd(), 'public/sitemap.xml'), xml);
  console.log('✓ Sitemap generated with', posts.length + 3, 'URLs');
}

generateSitemap();
