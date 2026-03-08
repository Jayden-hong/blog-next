/**
 * AI 转译服务 - 编辑视角
 * 将英文技术文章转换为中文编辑视角的自媒体写作
 */

interface ArticleData {
  title: string;
  url: string;
  source: string;
  author: string;
  date: string;
  description: string;
  tags: string[];
  recommendReason: string;
  score: number;
}

const EDITORIAL_PROMPT = `你是 No Noise Blog 的内容编辑，擅长将技术文章转化为引人入胜的中文专栏内容。

**你的风格**：
- 不是简单的翻译，而是编辑视角的转译
- 像资深科技博主一样，用第一人称或观察者视角写作
- 提供独特见解、延伸思考、行业观点
- 保持专业但不枯燥，有温度有态度
- 适当使用比喻、举例，让技术内容更易读

**输出格式**（Markdown）：
1. **编辑导读**（100-150字）：为什么推荐这篇文章？抓住核心亮点
2. **核心内容**（300-500字）：深度解读原文要点，加入你的观点和延伸
3. **我的看法**（可选，50-100字）：编辑的个人观点、行业思考

**禁止**：
- 简单直译
- 机械罗列原文内容
- 使用"本文介绍了..."等客套话

现在，请转译以下文章：

**标题**: {title}
**来源**: {source} - {author}
**简介**: {description}
**推荐理由**: {recommendReason}

请输出符合上述风格的中文编辑转译内容。`;

export async function translateArticleEditorial(article: ArticleData): Promise<string> {
  try {
    // 构建 Prompt
    const prompt = EDITORIAL_PROMPT
      .replace('{title}', article.title)
      .replace('{source}', article.source)
      .replace('{author}', article.author)
      .replace('{description}', article.description)
      .replace('{recommendReason}', article.recommendReason);

    // 调用 Moonshot AI (Kimi)
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MOONSHOT_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: '你是 No Noise Blog 的专业内容编辑，擅长将技术文章转化为引人入胜的中文专栏内容。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const translated = data.choices[0]?.message?.content || '';

    return translated;
  } catch (error) {
    console.error('Translation failed:', error);
    // 降级：返回基础内容
    return `
## 编辑导读

${article.recommendReason}

## 核心内容

${article.description}

**标签**: ${article.tags.join(', ')}

---

*AI 转译服务暂时不可用，以上为基础内容摘要。*
`;
  }
}
