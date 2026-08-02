# RainierGu 的学习档案馆

这是 RainierGu 的个人主页，已经从 Jekyll/Chirpy 迁移到基于 **Next.js + XHBlogs** 的新模板。

线上主站建议使用 Vercel 部署，因为新模板包含 Next.js API 路由，例如音乐、天气、AI 助手和 GitHub 评论代理。GitHub Pages 不再作为主要部署方式。

## 主要功能

- 首页个人信息卡片
- 文章与课程笔记
- PDF 资料归档
- 项目展示
- 照片墙
- 杂谈与说说
- 音乐卡片
- AI 猫猫助手入口
- Gitalk 评论预留入口
- Vercel Web Analytics 访问统计
- 本地 `my-blog-manager` 管理后台

## 本地开发

安装依赖：

```powershell
npm install
```

启动前台：

```powershell
npm run dev
```

访问：

```text
http://localhost:3000
```

生产构建：

```powershell
npm run build
```

## 常用目录

| 内容 | 位置 |
| --- | --- |
| 全站配置 | `siteConfig.ts` |
| 首页文章 | `posts/` |
| 杂谈 | `chatters/` |
| 说说/短动态 | `moments/` |
| 关于页正文 | `app/about/about.md` |
| 项目数据 | `data/projects.ts` |
| 友链数据 | `data/friends.ts` |
| 相册数据 | `data/albums.ts` |
| 图片、PDF 等静态资源 | `public/assets/` |
| 本地管理后台 | `my-blog-manager/` |

## 需要密钥的功能

不要把密钥写进仓库。需要时请在 Vercel 的 Environment Variables 中配置：

- `GEMINI_API_KEY`：AI 猫猫助手。
- `QWEATHER_KEY`：天气组件。
- `NEXT_PUBLIC_GITALK_CLIENT_ID` / `NEXT_PUBLIC_GITALK_CLIENT_SECRET`：GitHub Issues 评论系统。配置步骤见 `docs/GITHUB_COMMENTS.md`。

评论系统需要在 GitHub 创建 OAuth App，并把 Gitalk 的 `clientID`、`clientSecret`、`repo`、`owner`、`admin` 填入 `siteConfig.ts`。

## 模板来源

本项目基于 [heiehiehi/XinghuisamaBlogs](https://github.com/heiehiehi/XinghuisamaBlogs) 改造。

模板许可证见 [LICENSE](LICENSE)。请注意原模板采用 CC BY-NC 4.0 许可证，禁止商业用途。
