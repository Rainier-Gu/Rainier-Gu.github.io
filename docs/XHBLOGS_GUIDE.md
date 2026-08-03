# 新版个人主页维护指南

这个站点已经从 Jekyll/Chirpy 切换为 Next.js + XHBlogs 模板。

如果你是第一次自己维护这个项目，建议优先阅读更完整的新手手册：

```text
docs/NEWBIE_SITE_MANUAL.md
```

## 常用命令

安装依赖：

```powershell
npm install
```

本地预览：

```powershell
npm run dev
```

浏览器打开：

```text
http://localhost:3000
```

生产构建检查：

```powershell
npm run build
```

## 常改文件

| 想修改什么 | 文件或目录 |
| --- | --- |
| 网站标题、头像、背景、音乐、社交入口 | `siteConfig.ts` |
| 首页文章 | `posts/` |
| 杂谈文章 | `chatters/` |
| 说说/短动态 | `moments/` |
| 关于页正文 | `app/about/about.md` |
| 项目页 | `data/projects.ts` |
| 友链页 | `data/friends.ts` |
| 照片墙 | `data/albums.ts` |
| PDF、图片等静态资源 | `public/assets/` |

## 写文章

在 `posts/` 新建 Markdown 文件，例如：

```text
posts/my-new-note.md
```

文章开头写：

```markdown
---
title: "文章标题"
date: "2026-08-02 20:00:00"
description: "一句话摘要"
cover: "/assets/img/posts/welcome.webp"
tags: ["笔记", "物理"]
---

正文从这里开始。
```

文件名会变成文章链接，例如：

```text
/posts/my-new-note
```

## 上传 PDF

PDF 放到：

```text
public/assets/files/
```

文章里这样链接：

```markdown
[打开 PDF](/assets/files/example/example.pdf)
```

## 需要密钥的功能

下面这些功能已经预留入口，但不要把密钥写进代码仓库：

- AI 猫猫助手：需要在 Vercel 环境变量里配置 `DEEPSEEK_API_KEY`，详细说明见 `docs/DEEPSEEK_AI.md`。
- 天气接口：需要在 Vercel 环境变量里配置 `QWEATHER_KEY`。
- 评论系统：已经预留 Gitalk / GitHub Issues 接入。详细配置见 `docs/GITHUB_COMMENTS.md`。

如果暂时不配置，网站仍可正常访问。
