# 📦 Cloudflare Pages 部署指南

## ✅ 修复内容

1. **Next.js 配置** (`next.config.ts`)
   - ✅ 添加 `output: 'export'` - 静态导出模式
   - ✅ 添加 `images: { unoptimized: true }` - 禁用图片优化
   - ✅ 添加 `trailingSlash: true` - URL 末尾斜杠

2. **依赖包**
   - ✅ 安装 `next-mdx-remote` - MDX 内容渲染

3. **构建测试**
   - ✅ 本地构建成功
   - ✅ 生成 8 个静态页面
   - ✅ 输出目录: `out/`

---

## 🚀 Cloudflare Pages 部署步骤

### 方式 1: 通过 GitHub（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "配置 Cloudflare Pages 静态导出"
   git push origin main
   ```

2. **登录 Cloudflare Pages**
   - 访问: https://dash.cloudflare.com/
   - 进入 "Workers & Pages" → "Create application" → "Pages"

3. **连接 GitHub 仓库**
   - 选择你的 `blog-next` 仓库
   - 授权访问

4. **配置构建设置**
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: out
   Root directory: /
   ```

5. **环境变量**（如果需要）
   ```
   NODE_VERSION=18
   ```

6. **点击 "Save and Deploy"**

### 方式 2: 通过 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **部署**
   ```bash
   npm run build
   wrangler pages deploy out --project-name=blog-next
   ```

### 方式 3: 直接上传（快速测试）

1. **构建项目**
   ```bash
   npm run build
   ```

2. **登录 Cloudflare Dashboard**
   - 进入 "Workers & Pages" → "Upload assets"

3. **拖拽 `out/` 目录**
   - 上传整个 `out/` 文件夹

---

## 🔧 构建设置详解

### Cloudflare Pages 配置

| 设置 | 值 |
|------|-----|
| Framework preset | **None** (不要选 Next.js) |
| Build command | `npm install && npm run build` |
| Build output directory | `out` |
| Root directory | `/` |
| Node.js version | `18` (已在 .node-version 指定) |

**⚠️ 重要**: 不要选择 "Next.js" preset，选择 "None" 或 "Static Site"！

### 环境变量（可选）

```env
NODE_VERSION=18
NPM_VERSION=latest
```

---

## 🐛 常见问题

### 1. 构建失败：Module not found

**原因**: 缺少依赖包

**解决**:
```bash
npm install
npm run build
```

### 2. 页面 404

**原因**: 输出目录设置错误

**解决**: 确保 Build output directory 设置为 `out`

### 3. CSS 样式丢失

**原因**: Tailwind CSS 没有正确编译

**解决**:
```bash
# 检查 tailwind.config.js
npm run build
```

### 4. 动态路由不工作

**原因**: 没有 `generateStaticParams`

**解决**: 已经在 `app/blog/[slug]/page.tsx` 中添加了 ✅

---

## 📊 构建结果

```
Route (app)
┌ ○ /                          - 首页
├ ○ /_not-found                - 404 页面
├ ○ /blog                      - 博客列表
└ ● /blog/[slug]               - 博客详情
  ├ /blog/why-i-blog
  ├ /blog/hello-world
  └ /blog/clawdbot-review

○  (Static)  预渲染为静态内容
●  (SSG)     预渲染为静态 HTML
```

---

## 🎯 下一步

1. ✅ 推送代码到 GitHub
2. ✅ 连接 Cloudflare Pages
3. ✅ 配置自定义域名（可选）
4. ✅ 设置 HTTPS（自动）

---

## 📝 自定义域名（可选）

1. 在 Cloudflare Pages 项目设置中
2. 点击 "Custom domains"
3. 添加你的域名（如 `blog.zucchini.win`）
4. 按照提示配置 DNS

---

**部署成功后访问**: `https://blog-next.pages.dev`

或你的自定义域名: `https://blog.zucchini.win`

---

*最后更新: 2026-01-29*
*由 Zucchini AI 生成*
