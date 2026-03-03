#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../content/feed/x-threads.json');
const dest = path.join(__dirname, '../public/x-threads.json');

if (!fs.existsSync(path.dirname(dest))) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
}

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('✅ Copied x-threads.json to public/');
} else {
  console.warn('⚠️  x-threads.json not found, creating empty file');
  fs.writeFileSync(dest, JSON.stringify({ threads: [] }, null, 2));
}
