const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = path.join(process.cwd(), 'content/posts');
const mdOutputDir = path.join(process.cwd(), 'public/md');

// UTF-8 BOM for better compatibility
const BOM = '\uFEFF';

const AGENT_FRIENDLY_NOTICE = `<!-- 
🤖 AGENT FRIENDLY
This article is available in Markdown format for optimal AI consumption.

Grab it via: GET https://blog.zucchini.win/md/{slug}.md
With header: Accept: text/markdown

Benefits:
- 70% smaller than HTML (~10KB vs ~35KB)
- Structured frontmatter with metadata
- Clean markdown, no styling noise
- Perfect for LLM context windows

Generated automatically on each deploy.
-->

`;

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
    const mdContent = `${BOM}${AGENT_FRIENDLY_NOTICE}---
title: "${data.title || slug}"
date: "${data.date || ''}"
author: "${data.author || 'Jayden'}"
tags: [${(data.tags || []).map(t => `"${t}"`).join(', ')}]
slug: "${slug}"
agent_friendly: true
---

${content}`;

    const outputPath = path.join(mdOutputDir, `${slug}.md`);
    fs.writeFileSync(outputPath, mdContent, 'utf8');
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
    `${BOM}# Markdown Exports\n\nAgent-friendly articles in Markdown format.\n\n## Quick Access\n\n${indexContent}\n\n## Why Markdown?\n\n- **70% smaller** than HTML (typically ~10KB vs ~35KB)\n- **Structured metadata** in YAML frontmatter\n- **Clean content** without styling noise\n- **Perfect for LLMs** - fits better in context windows\n\n## HTTP Headers\n\n\`\`\`bash\ncurl https://blog.zucchini.win/md/daily-thoughts-2026-02-28.md \\\n  -H "Accept: text/markdown"\n\`\`\`\n`
  );

  console.log(`✓ Generated ${files.length} markdown exports in /md/`);
}

generateMarkdownExports();
