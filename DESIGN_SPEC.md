# 博客页面设计规范 v1.0

## 🎨 设计理念

**核心定位**: 现代主义 × 极简杂志风格
**关键词**: Editorial / 呼吸感 / 克制优雅 / 内容至上
**记忆点**: 非对称布局 + 动态排版 + 极致留白

---

## 📐 整体布局架构

```
┌─────────────────────────────────────────────┐
│  Header (固定顶部，半透明毛玻璃)             │
├─────────────────────────────────────────────┤
│                                             │
│  Hero Section (首屏)                         │
│  - 大标题 + 副标题                            │
│  - 动态打字效果                               │
│  - 微妙的背景动画                             │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Featured Post (精选文章卡片 - 大图)         │
│  - 左右交替布局                               │
│  - 悬停放大效果                               │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Recent Posts (最新文章网格)                 │
│  - 3列网格 (响应式)                          │
│  - 卡片阴影 + 圆角                           │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Tags Cloud (标签云 - 侧边栏)                │
│  - 悬浮在右侧                                │
│  - 不同大小表示热度                           │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Footer (页脚)                               │
│  - 社交链接 + RSS + 备案                     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🧩 功能分区详细规范

### 1. **Header (导航栏)**

**位置**: 固定顶部，滚动时收起
**高度**: 80px (桌面) / 64px (移动)
**背景**: 毛玻璃效果 (backdrop-blur-lg) + 半透明白色

**元素布局**:
```
Logo (左)  |  导航链接 (中)  |  主题切换 + 搜索 (右)
```

**导航链接**:
- 首页 (/)
- 博客 (/blog)
- 关于 (/about)
- 标签 (/tags)
- RSS (/rss.xml)

**交互**:
- 滚动 > 50px 时添加阴影
- 当前页面链接下划线动画
- 悬停时颜色渐变

---

### 2. **Hero Section (首屏)**

**高度**: 90vh
**背景**: 渐变网格 + 动态噪点
**内容居中对齐**

**元素**:
```tsx
<h1>
  👋 你好，我是 Jayden
  <span className="gradient-text">AI 产品经理</span>
</h1>
<p className="subtitle">
  分享关于 AI、Web3、产品设计的思考
</p>
<div className="cta-buttons">
  <Button>阅读博客 →</Button>
  <Button variant="outline">关于我</Button>
</div>
```

**动画**:
- 标题逐字淡入 (stagger: 50ms)
- 副标题从下方滑入
- 背景网格缓慢移动

---

### 3. **Featured Post (精选文章)**

**布局**: 左右交替，图文分离
**宽度**: Max-width: 1200px，居中

**卡片结构** (大卡片):
```
┌──────────────┬──────────────┐
│              │  标题        │
│   封面图     │  日期 + 作者 │
│   (60%)      │  摘要        │
│              │  标签        │
│              │  阅读更多 →  │
└──────────────┴──────────────┘
```

**交互**:
- 悬停时图片放大 1.05x
- 标题颜色渐变
- 阅读时间自动计算

---

### 4. **Recent Posts Grid (最新文章网格)**

**布局**: CSS Grid 3 列
**间距**: gap: 32px
**响应式**: 
- Desktop: 3 列
- Tablet: 2 列
- Mobile: 1 列

**卡片结构** (小卡片):
```
┌─────────────┐
│  封面图     │
├─────────────┤
│  标题       │
│  日期       │
│  摘要       │
│  标签       │
└─────────────┘
```

**样式**:
- 圆角: 12px
- 阴影: hover 时提升
- 边框: 1px solid rgba(0,0,0,0.1)

---

### 5. **Tags Section (标签云)**

**位置**: 侧边栏 sticky (或独立页面)
**布局**: Flex wrap

**标签样式**:
```tsx
<Tag size={热度}>
  #{标签名}
</Tag>
```

**大小映射**:
- 1-3篇: text-sm (12px)
- 4-6篇: text-base (14px)
- 7+篇: text-lg (16px)

**颜色**:
- 主题色渐变
- 悬停时背景高亮

---

### 6. **Article Page (文章详情页)**

**布局**: 居中单栏，max-width: 720px

**结构**:
```
封面图 (全宽)
↓
标题 (大字号，48px)
↓
元信息 (日期 / 作者 / 阅读时间 / 标签)
↓
分割线
↓
正文 (prose 样式)
↓
底部导航 (上一篇 / 下一篇)
↓
评论区 (可选)
```

**正文排版** (Tailwind Typography):
- 字号: 18px
- 行高: 1.8
- 段落间距: 1.5em
- 代码块: 圆角 + 语法高亮
- 引用: 左边框 + 斜体

**目录 (TOC)**:
- 右侧悬浮
- 滚动时自动高亮当前章节
- 平滑滚动到对应位置

---

### 7. **Footer (页脚)**

**高度**: 200px
**背景**: 深色 (dark mode) / 浅灰 (light mode)

**布局**:
```
┌─────────────────────────────────────┐
│  Logo + Slogan                      │
│                                     │
│  社交链接:                           │
│  GitHub | Twitter | Email | RSS    │
│                                     │
│  © 2026 Jayden | 备案号             │
└─────────────────────────────────────┘
```

---

## 🎨 视觉设计规范

### 字体方案

**标题**: 
- 中文: [霞鹜文楷](https://github.com/lxgw/LxgwWenKai) / 思源黑体
- 英文: [Crimson Pro](https://fonts.google.com/specimen/Crimson+Pro) (衬线，优雅)

**正文**:
- 中文: 苹方 / PingFang SC
- 英文: [Inter](https://fonts.google.com/specimen/Inter) (易读)

**代码**:
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) / Fira Code

### 色彩方案

**主色调** (Primary):
```css
--primary: #0066FF;        /* 科技蓝 */
--primary-hover: #0052CC;
```

**强调色** (Accent):
```css
--accent: #FF6B6B;         /* 活力红 */
--accent-hover: #EE5A52;
```

**中性色**:
```css
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-800: #1F2937;
--gray-900: #111827;
```

**渐变** (用于背景装饰):
```css
background: linear-gradient(
  135deg,
  rgba(0, 102, 255, 0.1) 0%,
  rgba(255, 107, 107, 0.1) 100%
);
```

### 间距系统 (8pt Grid)

```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
```

### 圆角

```css
--radius-sm: 8px;   /* 按钮 */
--radius-md: 12px;  /* 卡片 */
--radius-lg: 16px;  /* 大卡片 */
```

### 阴影

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```

---

## ⚡ 动画规范

### 过渡时长

```css
--transition-fast: 150ms;
--transition-base: 300ms;
--transition-slow: 500ms;
```

### Easing

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### 关键动画

**页面加载**:
1. Header 从上滑入 (100ms)
2. Hero 标题逐字淡入 (stagger 50ms)
3. 文章卡片从下淡入 (stagger 100ms)

**交互反馈**:
- 按钮 hover: scale(1.05)
- 卡片 hover: translateY(-4px) + shadow 增强
- 链接 hover: 下划线从左到右展开

---

## 📱 响应式断点

```css
/* Mobile first */
--breakpoint-sm: 640px;   /* 手机横屏 */
--breakpoint-md: 768px;   /* 平板 */
--breakpoint-lg: 1024px;  /* 桌面 */
--breakpoint-xl: 1280px;  /* 大屏 */
```

**移动端适配**:
- 导航改为汉堡菜单
- 网格变单列
- 字号缩小 15%
- 触摸区域至少 44px

---

## ✨ 特色功能

### 1. 深色模式
- 系统自动 + 手动切换
- 平滑过渡 (300ms)
- 本地存储偏好

### 2. 搜索功能
- 快捷键: Cmd/Ctrl + K
- 模糊搜索标题 + 内容
- 实时预览结果

### 3. 阅读进度条
- 顶部固定
- 根据滚动位置填充
- 渐变色

### 4. 代码高亮
- 主题: GitHub Dark / Light
- 行号 + 复制按钮
- 支持语言标识

### 5. 图片懒加载
- Intersection Observer
- 模糊预览 (LQIP)
- 点击放大 (lightbox)

---

## 🚀 性能优化

- [ ] 图片优化 (Next.js Image)
- [ ] 字体子集化 (仅加载需要的字符)
- [ ] CSS 代码分割
- [ ] 路由预加载
- [ ] Lighthouse 得分 > 90

---

## 📦 技术栈确认

```json
{
  "framework": "Next.js 15 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS + CSS Modules",
  "content": "MDX (gray-matter)",
  "animations": "Framer Motion",
  "fonts": "next/font",
  "icons": "Lucide React",
  "deployment": "Vercel"
}
```

---

**设计师**: Zucchini AI 🥒
**版本**: v1.0
**更新日期**: 2026-01-29
