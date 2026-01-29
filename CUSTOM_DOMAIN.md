# 🌐 配置自定义域名：blogs.zucchini.win

## 📋 当前状态

- **旧博客**: blogs.zucchini.win（Hexo 博客）
- **新博客**: blog-next.kang1023809948.workers.dev（Next.js 博客）
- **目标**: 将 blogs.zucchini.win 指向新的 Next.js 博客

---

## 🚀 配置步骤

### 方式 1: Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问: https://dash.cloudflare.com/

2. **进入 Workers & Pages**
   - 找到你的 `blog-next` 项目
   - 点击进入项目详情

3. **添加自定义域名**
   - 点击 "Custom domains" 标签页
   - 点击 "Set up a custom domain"
   - 输入: `blogs.zucchini.win`
   - 点击 "Continue"

4. **等待 DNS 配置**
   - Cloudflare 会自动更新 DNS 记录
   - 通常 1-2 分钟完成
   - ✅ 自动启用 HTTPS

5. **验证**
   - 访问 https://blogs.zucchini.win
   - 应该看到新的 Next.js 博客

---

### 方式 2: 手动配置 DNS（如果自动失败）

1. **进入 Cloudflare DNS 设置**
   - Dashboard → Websites → zucchini.win → DNS

2. **更新 CNAME 记录**
   - 找到 `blogs` 记录
   - 修改为:
     ```
     类型: CNAME
     名称: blogs
     内容: blog-next.kang1023809948.workers.dev
     代理状态: 已代理（橙色云朵）
     TTL: 自动
     ```

3. **保存并等待**
   - DNS 传播时间: 1-5 分钟
   - 清除浏览器缓存后访问

---

## 🔄 迁移旧博客内容（可选）

如果你想保留旧 Hexo 博客的内容：

### 选项 1: 双博客共存
- 旧博客: `old-blog.zucchini.win`
- 新博客: `blogs.zucchini.win`

### 选项 2: 内容迁移
1. 导出旧博客的 Markdown 文件
2. 转换为 MDX 格式
3. 放到 `content/posts/` 目录
4. 重新部署

---

## ✅ 验证清单

- [ ] blogs.zucchini.win 指向新博客
- [ ] HTTPS 正常工作
- [ ] 所有页面加载正常
- [ ] 博客列表显示 3 篇文章
- [ ] 动态路由 `/blog/[slug]` 正常工作

---

## 🐛 常见问题

### 1. 域名还是指向旧博客

**原因**: DNS 缓存

**解决**:
```bash
# 清除 DNS 缓存（Mac）
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# 清除 DNS 缓存（Windows）
ipconfig /flushdns

# 验证 DNS
dig blogs.zucchini.win +short
```

### 2. HTTPS 证书错误

**原因**: 证书还在生成中

**解决**: 等待 5-10 分钟，Cloudflare 会自动签发证书

### 3. 404 错误

**原因**: 可能是路由配置问题

**解决**: 检查 `next.config.ts` 中的 `trailingSlash: true`

---

## 📊 对比

| 项目 | 旧博客（Hexo） | 新博客（Next.js） |
|------|----------------|-------------------|
| 框架 | Hexo | Next.js 16 |
| 样式 | 主题模板 | Tailwind CSS 4 |
| 内容 | Markdown | MDX (增强版) |
| 部署 | ? | Cloudflare Pages |
| 构建 | 静态生成 | 静态生成 (SSG) |
| 速度 | 快 | 更快 ⚡ |

---

## 🎯 下一步

1. ✅ 配置 blogs.zucchini.win
2. ⬜ 迁移旧博客内容（可选）
3. ⬜ 添加 Analytics（可选）
4. ⬜ 配置 RSS feed（可选）
5. ⬜ 添加评论系统（可选）

---

*最后更新: 2026-01-29*
*由 Zucchini AI 生成*
