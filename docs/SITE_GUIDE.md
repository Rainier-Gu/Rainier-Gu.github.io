# 个人主页维护指南

这个站点使用 **Next.js + React + Tailwind CSS** 构建，生产环境主要部署在 Vercel。

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
http://localhost:4000
```

生产构建检查：

```powershell
npm run build
```

## 常改文件

| 想修改什么 | 文件或目录 |
| --- | --- |
| 网站标题、头像、背景、音乐、社交入口 | `siteConfig.ts` |
| 首页布局 | `app/page.tsx` |
| 全站外壳、字体、背景、全局特效 | `app/layout.tsx`、`app/globals.css` |
| 正式文章 | `posts/` |
| 隐藏的杂谈内容（保留备用） | `chatters/` |
| 说说/短动态 | `moments/` |
| 关于页正文 | `app/about/about.md` |
| 项目页数据 | `data/projects.ts` |
| 友链页数据 | `data/friends.ts` |
| 照片墙数据 | `data/albums.ts` |
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

## 上传本地音乐和 LRC 歌词

音乐素材放到：

```text
public/assets/music/tracks/   音频文件
public/assets/music/lyrics/   LRC 歌词
public/assets/music/covers/   歌曲封面
```

然后在 `siteConfig.ts` 的 `localMusicTracks` 中添加：

```ts
{
  id: "blue-night",
  title: "Blue Night",
  artist: "RainierGu",
  cover: "/assets/music/covers/blue-night.webp",
  src: "/assets/music/tracks/blue-night.mp3",
  lrcUrl: "/assets/music/lyrics/blue-night.lrc",
}
```

网易云歌曲 ID 仍可写在 `cloudMusicIds` 中作为备用，但本地音频更稳定。

## 需要密钥的功能

下面这些功能已经预留入口，但不要把密钥写进代码仓库：

- AI 小猫助手：在 Vercel 环境变量里配置 `DEEPSEEK_API_KEY`，详细说明见 `docs/DEEPSEEK_AI.md`。
- 天气接口：在 Vercel 环境变量里配置 `QWEATHER_KEY`。
- 天气详细地址：可选配置 `AMAP_WEB_SERVICE_KEY`，必须使用高德“Web 服务”类型的 Key。
- 评论系统：使用服务端 OAuth + GitHub Issues，详细配置见 `docs/GITHUB_COMMENTS.md`。

如果暂时不配置这些密钥，网站主体内容仍可正常访问。
