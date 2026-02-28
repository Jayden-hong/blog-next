const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = path.join(process.cwd(), 'content/posts');
const mdOutputDir = path.join(process.cwd(), 'public/md');

function generateMarkdownExports() {
  if (!fs.existsSync(postsDir)) {
    console.log('No posts directory found');
    return;
  }

  // Ensure output directory exists
  if (!fs.existsSync(mdOutputDir)) {
    fs.mkdirSync(mdOutputDir, { recursive: true });
  }

  const files = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

  files.forEach(fileName => {
    const slug = fileName.replace(/\.(mdx|md)$/, '');
    const fullPath = path.join(postsDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Build markdown with frontmatter as YAML
    const mdContent = `---
title: "${data.title || slug}"
date: "${data.date || ''}"
author: "${data.author || 'Jayden'}"
tags: [${(data.tags || []).map(t => `"${t}"`).join(', ')}]
---

${content}`;

    const outputPath = path.join(mdOutputDir, `${slug}.md`);
    fs.writeFileSync(outputPath, mdContent);
    console.log(`✓ Generated /md/${slug}.md`);
  });

  // Create index file listing all available markdown exports
  const indexContent = files
    .map(f => {
      const slug = f.replace(/\.(mdx|md)$/, '');
      return `- [${slug}](/md/${slug}.md)`;
    })
    .join('\n');
  
  fs.writeFileSync(
    path.join(mdOutputDir, 'README.md'),
    `# Markdown Exports\n\nAvailable articles in Markdown format:\n\n${indexContent}\n`
  );

  console.log(`✓ Generated ${files.length} markdown exports in /md/`);
}

generateMarkdownExports();
