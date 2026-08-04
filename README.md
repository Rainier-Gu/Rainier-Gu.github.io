# RainierGu 的学习档案馆

这是 RainierGu 的个人主页项目，使用 **Next.js + React + Tailwind CSS** 构建，并以 **Vercel** 作为主要生产部署平台。

站点用于集中整理课程笔记、科研学习、技术实践、项目展示、PDF 资料、照片墙、说说、音乐卡片、AI 助手、GitHub 评论和访问统计。

## 主要功能

- 首页三栏信息流与个人信息卡片
- 文章、课程笔记和 PDF 资料归档
- 项目展示
- 照片墙
- 说说与日常动态
- 音乐卡片和全局播放器
- AI 小猫助手
- GitHub Issues 评论系统
- 天气组件
- Vercel Web Analytics 访问统计

## 本地开发

安装依赖：

```powershell
npm install
```

启动本地预览：

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

## 常用目录

| 内容 | 位置 |
| --- | --- |
| 全站配置 | `siteConfig.ts` |
| 首页与主要页面 | `app/` |
| 通用组件 | `components/` |
| 正式文章 | `posts/` |
| 隐藏的杂谈内容（保留备用） | `chatters/` |
| 说说/短动态 | `moments/` |
| 关于页正文 | `app/about/about.md` |
| 项目数据 | `data/projects.ts` |
| 友链数据 | `data/friends.ts` |
| 相册数据 | `data/albums.ts` |
| 图片、PDF 等静态资源 | `public/assets/` |

## 音乐素材

本地音乐使用 `public/assets/music/`：

```text
public/assets/music/tracks/   音频文件
public/assets/music/lyrics/   LRC 歌词
public/assets/music/covers/   歌曲封面
```

在 `siteConfig.ts` 的 `localMusicTracks` 中配置本地歌曲。`cloudMusicIds` 仍可作为网易云备用歌源。

## 维护手册

如果你想自己继续开发和更新内容，建议阅读：

```text
docs/NEWBIE_SITE_MANUAL.md
```

它按“页面元素在哪里改、功能如何设置、内容如何上传”的方式整理了完整步骤。

## 需要密钥的功能

不要把密钥写进 Git 仓库。需要时请在 Vercel 的 Environment Variables 中配置：

- `DEEPSEEK_API_KEY`：AI 小猫助手服务端密钥，不要加 `NEXT_PUBLIC_` 前缀。
- `QWEATHER_KEY`：天气组件密钥。
- `AMAP_WEB_SERVICE_KEY`：可选的高德 Web 服务 Key，用于把访客经纬度解析成区县、街道、门牌和附近建筑名。
- `NEXT_PUBLIC_GITALK_CLIENT_ID` / `GITALK_CLIENT_SECRET`：GitHub Issues 评论系统；Secret 只能使用服务端变量。

详细说明：

- DeepSeek AI：[docs/DEEPSEEK_AI.md](docs/DEEPSEEK_AI.md)
- GitHub 评论：[docs/GITHUB_COMMENTS.md](docs/GITHUB_COMMENTS.md)

## 部署

生产环境使用 Vercel。项目包含 Next.js API Routes，适合使用支持服务端函数的部署平台。
