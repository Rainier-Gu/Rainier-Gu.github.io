# RainierGu 个人网站新手设置手册

> 最后核对日期：2026-08-03。本文以当前 Next.js 版本、4000 本地端口、Vercel 部署和现有页面结构为准。

这份手册面向“刚开始自己动手维护网站”的你。它的目标不是教你一次性记住所有代码，而是让你知道：

- 页面上每个主要元素在哪里改；
- 每个功能需要什么配置；
- 文章、PDF、图片、音乐、相册、项目、友链、说说等内容如何上传；
- 修改后如何本地预览、检查、提交、推送和部署。

你可以把这个网站想成三层：

| 层级 | 主要文件 | 你通常做什么 |
| --- | --- | --- |
| 内容层 | `posts/`、`moments/`、`data/`、`public/assets/` | 写文章、传 PDF、传图片、加项目、加相册、加友链；`chatters/` 是当前隐藏的旧内容源 |
| 配置层 | `siteConfig.ts`、`.env.local`、Vercel 环境变量 | 改站点名称、头像、背景、音乐、AI、评论、天气等 |
| 页面层 | `app/`、`components/`、`app/globals.css` | 改页面布局、组件样式、导航、特效、字体 |

如果你只是更新内容，通常只需要动“内容层”和少量“配置层”；只有想改页面长相时，才需要动 `app/` 和 `components/`。

## 1. 每次修改前先做这几步

打开终端，进入项目根目录：

```powershell
cd "F:\Personal Page"
```

查看当前有没有未提交的改动：

```powershell
git status -sb
```

如果看到很多你不认识的改动，先别急着继续，避免把别的东西覆盖掉。确认无误后再修改。

本地预览网站：

```powershell
npm run dev
```

然后打开：

```text
http://localhost:4000
```

修改完成后，至少运行一次构建检查：

```powershell
npm run build
```

如果只是文档变更，构建不是必须，但写文章、改配置、改组件后建议跑一下。

## 2. 修改后如何发布到线上

最常用流程：

```powershell
git status -sb
git add 你修改的文件
git commit -m "写一句简短说明"
git push origin main
```

如果 GitHub 和 Vercel 已经绑定，推送后 Vercel 通常会自动部署。你也可以手动部署：

```powershell
vercel --prod
```

当前线上主域名是：

```text
https://rainiergu.vercel.app
```

## 3. 重要文件地图

| 你想改什么 | 文件或目录 |
| --- | --- |
| 全站标题、首页大图文案、头像、背景、音乐、AI、评论 | `siteConfig.ts` |
| 首页布局 | `app/page.tsx` |
| 全站外壳、字体、背景、全局特效 | `app/layout.tsx`、`app/globals.css` |
| 导航栏 | `components/Navbar.tsx` |
| 首页个人卡片 | `components/ProfileCard.tsx` |
| 首页照片墙轮播 | `components/PhotoWallCarousel.tsx`、`data/albums.ts` |
| 首页时钟与站点状态 | `components/SiteDashboard.tsx`、`siteConfig.buildDate` |
| 首页天气和地点查询 | `components/WeatherWidget.tsx`、`app/api/weather/route.ts` |
| 首页搜索框 | `components/SearchBar.tsx` |
| 首页文章流 | `components/HomePostStream.tsx` |
| 首页音乐卡片 | `components/CloudPlayer.tsx` |
| 全局音乐播放器 | `components/MusicProvider.tsx`、`components/FloatingPlayer.tsx`、`app/music/MusicClient.tsx` |
| AI 小猫助手 | `components/CyberCat.tsx`、`app/api/chat/route.ts` |
| GitHub 评论 | `components/Comments.tsx`、`components/MomentComments.tsx`、`components/LabComments.tsx`、`components/gitalkConfig.ts` |
| 文章 | `posts/` |
| 隐藏的杂谈源码 | `chatters/`、`app/chatter/`、`components/LatestChatterCarousel.tsx` |
| 说说/动态 | `moments/` |
| 关于我正文 | `app/about/about.md` |
| 项目页数据 | `data/projects.ts` |
| 友链页数据 | `data/friends.ts` |
| 照片墙数据 | `data/albums.ts` |
| 图片、PDF 等静态资源 | `public/assets/` |
| DeepSeek AI 详细说明 | `docs/DEEPSEEK_AI.md` |
| GitHub 评论详细说明 | `docs/GITHUB_COMMENTS.md` |
| Vercel 访问统计 | `app/layout.tsx` 中的 `/_vercel/insights/script.js` |

## 4. `siteConfig.ts` 全站配置详解

这是你最常改的文件。它像网站的“总控制台”。

### 4.1 网站基本信息

```ts
title: "RainierGu's Blog",
faviconUrl: "/assets/img/avatar/avatar.jpg",
authorName: "RainierGu",
bio: "课程学习，科研心得，以及个人的碎碎念。",

heroTitle: "Hey! I'm RainierGu.",
heroSubtitle: "Per aspera ad astra.（循此苦旅 以达繁星）",
```

| 字段 | 影响哪里 | 怎么改 |
| --- | --- | --- |
| `title` | 浏览器标题、页面 metadata | 改成你的网站名 |
| `faviconUrl` | 浏览器标签页小图标 | 推荐用正方形图片 |
| `authorName` | 首页卡片、关于页、文章侧栏、说说头像名称 | 改成你的名字或昵称 |
| `bio` | 首页个人简介、文章侧栏、SEO 描述 | 写 1 到 2 句话 |
| `heroTitle` | 首页大图主标题 | 可独立于网站标题修改 |
| `heroSubtitle` | 首页大图副标题 | 支持中英文普通文本 |

### 4.2 导航栏标题

```ts
navTitle: "RainierGu",
navSuffix: "'s",
navAfter: "Blog",
```

页面顶部会显示类似：

```text
RainierGu 's Blog
```

如果想改成中文，比如：

```ts
navTitle: "Rainier",
navSuffix: "的",
navAfter: "学习档案馆",
```

### 4.3 头像

```ts
avatarUrl: "/assets/img/avatar/avatar.jpg",
```

头像文件建议放在：

```text
public/assets/img/avatar/
```

例如你上传：

```text
public/assets/img/avatar/new-avatar.jpg
```

那么配置写：

```ts
avatarUrl: "/assets/img/avatar/new-avatar.jpg",
faviconUrl: "/assets/img/avatar/new-avatar.jpg",
```

注意：`public` 目录里的文件，在网页里引用时不要写 `public`，从 `/assets/...` 开始写。

### 4.4 背景图与主题色

```ts
useGradient: true,
themeColors: ["#48c6f0", "#fff0d6", "#ff8a3d"],
bgImages: [
  "/assets/img/posts/Homepage1.png",
],
```

| 字段 | 作用 |
| --- | --- |
| `useGradient` | `true` 时全站背景使用渐变；`false` 时启用背景图轮播 |
| `themeColors` | 背景渐变、光晕、主题色氛围 |
| `bgImages` | 首页大图始终优先使用第一张；关闭渐变后也作为全站背景轮播图 |

上传背景图：

1. 把图片放到 `public/assets/img/backgrounds/`，没有这个目录就新建。
2. 推荐文件名用英文小写，例如 `blue-night.webp`。
3. 在 `bgImages` 里添加：

```ts
bgImages: [
  "/assets/img/backgrounds/blue-night.webp",
  "/assets/img/backgrounds/lab-desk.webp",
],
```

### 4.5 文章默认封面与照片墙入口图

```ts
defaultPostCover: "/assets/img/posts/research-writing-cover.svg",
photoWallImage: "/assets/img/posts/general-physics-lab.webp",
```

| 字段 | 作用 |
| --- | --- |
| `defaultPostCover` | 文章或杂谈没有写 `cover` 时使用的默认封面 |
| `photoWallImage` | 没有相册数据时首页照片墙入口的备用图 |

### 4.6 音乐配置：本地音乐优先，网易云备用

音乐播放器现在支持两种来源：

| 来源 | 配置字段 | 适合场景 |
| --- | --- | --- |
| 本地音频文件 | `localMusicTracks` | 最稳定，推荐优先使用，适合上传自己有权使用的音频和 LRC 歌词 |
| 网易云歌曲 ID | `cloudMusicIds` | 作为补充歌源，但可能因为版权、地区或外链限制无法播放 |

本地音乐配置示例：

```ts
localMusicTracks: [
  {
    id: "blue-night",
    title: "Blue Night",
    artist: "RainierGu",
    album: "Demo",
    cover: "/assets/music/covers/blue-night.webp",
    src: "/assets/music/tracks/blue-night.mp3",
    lrcUrl: "/assets/music/lyrics/blue-night.lrc",
  },
],
```

注意：路径从 `/assets/music/` 开始，不要写 `public`。

对应文件放在：

```text
public/assets/music/tracks/blue-night.mp3
public/assets/music/lyrics/blue-night.lrc
public/assets/music/covers/blue-night.webp
```

LRC 歌词示例：

```lrc
[00:00.00]歌曲名
[00:12.30]第一句歌词
[00:16.80]第二句歌词
```

网易云备用配置仍然保留：

```ts
cloudMusicIds: ["1809646618", "1974443814"],
```

网站会优先加载 `localMusicTracks`，然后再尝试通过 `app/api/music/route.ts` 获取网易云歌曲信息。本地音乐不会受网易云外链限制影响。

### 4.7 社交链接

```ts
social: {
  github: "https://github.com/Rainier-Gu",
  gitee: "",
  google: "",
  email: "",
  qq: "",
  wechat: "",
},
```

| 字段 | 页面表现 |
| --- | --- |
| `github` | 点击后跳转 GitHub |
| `gitee` | 点击后跳转 Gitee |
| `google` | 点击后跳转 Google Scholar 或其它个人页 |
| `email` | 点击复制邮箱 |
| `qq` | 点击复制 QQ |
| `wechat` | 点击复制微信号 |

首页个人卡片和文章详情页右侧个人信息栏共用这组配置；空字符串表示两处都不显示对应图标。

### 4.8 杂谈页标题

```ts
chatterTitle: "研究与生活札记",
chatterDescription: "课程，科研，和一些短想法的碎片记录。",
```

影响保留的 `/chatter` 页面顶部标题和说明。该页面当前已从导航和其它公开页面入口隐藏，普通维护可以暂时忽略。

### 4.9 首页弹幕

```ts
danmakuList: [],
```

数组为空时不显示弹幕。添加字符串后，文字会在桌面端背景里飘过；手机端为了性能默认隐藏。

### 4.10 GitHub 评论

```ts
gitalkConfig: {
  clientID: "",
  repo: "Rainier-Gu.github.io",
  owner: "Rainier-Gu",
  admin: ["Rainier-Gu"],
},
```

现在项目优先读取 Vercel 环境变量：

```env
NEXT_PUBLIC_GITALK_CLIENT_ID=你的 Client ID
GITALK_CLIENT_SECRET=你的 Client Secret
NEXT_PUBLIC_GITALK_OWNER=Rainier-Gu
NEXT_PUBLIC_GITALK_REPO=Rainier-Gu.github.io
NEXT_PUBLIC_GITALK_ADMIN=Rainier-Gu
```

`Client ID` 可以公开，`Client Secret` 只能放在服务端环境变量中，不能写进 `siteConfig.ts`。详细步骤见：

```text
docs/GITHUB_COMMENTS.md
```

### 4.11 首页时钟、站点状态与预留技术徽章

```ts
buildDate: "2026-08-01T00:00:00+08:00",
footerBadges: [
  { name: "Next.js", color: "text-sky-500", svg: "..." },
],
```

| 字段 | 作用 |
| --- | --- |
| `buildDate` | 首页左栏“正常运行时间”的起算时间；也参与“最近更新时间”计算 |
| `footerBadges` | 当前保留的技术徽章配置，现有首页状态面板暂未渲染它 |

时钟和状态面板的具体布局在 `components/SiteDashboard.tsx`。日期会以较醒目的色块显示，下面的运行时长和最近更新时间使用更小的字号，避免左栏拥挤。如果你不熟 SVG，先不要修改 `footerBadges.svg`。

### 4.12 备案信息

```ts
icpConfig: null,
```

如果以后有备案号，可以改成：

```ts
icpConfig: {
  name: "京ICP备xxxxxxxx号",
  link: "https://beian.miit.gov.cn/",
},
```

没有备案就保持 `null`。

### 4.13 AI 小猫助手

```ts
geminiConfig: {
  modelId: "deepseek-v4-flash",
  systemPrompt: "你是 RainierGu 个人主页里的学习助手...",
  maxOutputTokens: 180,
  temperature: 0.75,
},
```

虽然字段名还叫 `geminiConfig`，但实际已经接入 DeepSeek。这是历史命名，暂时保留，避免大范围改动配置结构。

| 字段 | 作用 |
| --- | --- |
| `modelId` | 默认 DeepSeek 模型，比如 `deepseek-v4-flash` |
| `systemPrompt` | 小猫助手的性格和回答规则 |
| `maxOutputTokens` | 最多回复多长 |
| `temperature` | 发散程度，越高越活泼，越低越稳 |

线上必须在 Vercel 配置：

```env
DEEPSEEK_API_KEY=你的 DeepSeek Key
```

详细说明见：

```text
docs/DEEPSEEK_AI.md
```

### 4.14 友链申请格式

```ts
friendLinkApplyFormat: "名称：RainierGu's Blog\n简介：...",
```

显示在 `/friends` 页面，方便别人复制你的友链信息。

### 4.15 知识地图等级系统

```ts
enableLevelSystem: true,
```

这是知识地图实验组件使用的等级/成就开关。当前配置为开启：

```ts
enableLevelSystem: true,
```

## 5. 页面逐个说明：看见什么，改哪里

### 5.1 全站外壳

| 页面元素 | 文件 | 怎么改 |
| --- | --- | --- |
| 全站字体 | `app/layout.tsx`、`app/globals.css` | 当前 `body` 使用 `font-serif`；在全局 CSS 中调整字体栈并保留回退字体 |
| 背景图片轮播 | `components/BackgroundSlider.tsx`、`siteConfig.bgImages` | 在 `siteConfig.ts` 改背景图数组 |
| 背景粒子/光效 | `components/BackgroundEffects.tsx` | 想关掉可在 `app/layout.tsx` 注释组件 |
| 顶部启动动画 | `components/SplashScreen.tsx` | 改头像、文案、动画逻辑 |
| 顶部导航栏 | `components/Navbar.tsx` | 改 `navLinks` 数组 |
| 左下主题按钮 | `components/FloatingThemeToggle.tsx` | 改悬浮位置、图标和明暗模式切换样式 |
| 可拖动 AI 小猫 | `components/CyberCat.tsx` | 桌面端可在视口内拖动；这里也控制回复框宽度、字号和位置 |
| 桌面悬浮音乐条 | `components/FloatingPlayer.tsx` | 改样式或隐藏 |
| 点击粒子 | `components/ClickEffect.tsx` | 改点击动效 |
| 手机返回按钮 | `components/MobileBackButton.tsx` | 改移动端返回按钮 |

如果想临时隐藏某个全局组件，打开 `app/layout.tsx`，找到类似：

```tsx
<FloatingThemeToggle />
<CyberCat />
<FloatingPlayer />
```

把对应组件注释掉即可。

### 5.2 导航栏

文件：

```text
components/Navbar.tsx
```

核心配置在：

```ts
const navLinks = [
  { name: '首页', href: '/' },
  { name: '开源项目', href: '/projects' },
  { name: '说说', href: '/moments' },
  { name: '照片墙', href: '/photowall' },
  { name: '音乐', href: '/music' },
  { name: '知识地图', href: '/tree' },
  { name: '友链', href: '/friends' },
  { name: '关于', href: '/about' },
];
```

想隐藏某个导航项，就删除或注释那一行。

当前“杂谈”和“归档”页都没有出现在导航栏及首页入口中。`app/chatter/`、`chatters/` 和 `app/timeline/` 的源码仍保留，仅用于以后需要时恢复；普通维护不需要修改。

想新增页面，例如 `/notes`：

1. 在 `app/notes/page.tsx` 新建页面。
2. 在 `navLinks` 里加：

```ts
{ name: '笔记', href: '/notes' },
```

### 5.3 首页 `/`

文件：

```text
app/page.tsx
```

首页由这些模块组成：

| 首页元素 | 组件/数据来源 | 修改方法 |
| --- | --- | --- |
| 顶部大图 | `app/page.tsx`、`siteConfig.heroTitle`、`siteConfig.heroSubtitle`、`siteConfig.bgImages[0]` | 主副标题和图片可分别修改；标题上方不显示额外标签 |
| 右上搜索框 | `components/SearchBar.tsx`，数据来自 `posts/` | 自动搜索文章标题、描述和标签 |
| 个人信息卡片 | `components/ProfileCard.tsx`，数据来自 `siteConfig.ts`、`posts/`、`moments/` 和 `data/albums.ts` | 改头像、昵称、简介、社交链接；文章、说说和照片数量会自动统计 |
| 左栏照片墙轮播 | `components/PhotoWallCarousel.tsx`、`data/albums.ts` | 修改相册和图片数据 |
| 左栏时钟与站点状态 | `components/SiteDashboard.tsx` | 醒目显示年月日和星期，并显示运行时长、最近更新时间 |
| 中栏所有文章 | `components/HomePostStream.tsx`，数据来自 `posts/` | 每页显示 5 篇，超出后在底部自动生成分页按钮；仅第一页第一篇使用大卡片 |
| 右栏音乐卡片 | `components/CloudPlayer.tsx`，歌曲来自 `localMusicTracks` 和 `cloudMusicIds` | 推荐配置本地音频、LRC 和封面 |
| 右栏天气 | `components/WeatherWidget.tsx`、`app/api/weather/route.ts` | 自动定位，也可手动输入城市 |
| 明暗主题 | `components/FloatingThemeToggle.tsx` | 任意页面左下角悬浮按钮 |

宽屏首页最大版心约 1440px，左右内边距约 40px，左右栏固定为约 288px，中栏自动占据剩余空间。第一页第一篇使用大封面，其余文章（包括后续页第一篇）统一使用约 156px 高的紧凑卡片；小屏幕会自动变为单栏。全部文章按 `date` 从新到旧排序。

### 5.4 文章列表与文章详情 `/posts/[slug]`

内容目录：

```text
posts/
```

详情页文件：

```text
app/posts/[slug]/page.tsx
```

特点：

- 支持 Markdown；
- 支持表格、任务列表等 GitHub Flavored Markdown；
- 支持 LaTeX 数学公式；
- 支持代码高亮；
- 支持目录；
- 支持 GitHub 评论。

### 5.5 归档页 `/timeline`

文件：

```text
app/timeline/page.tsx
components/TimelineClient.tsx
```

数据来源：

```text
posts/
```

它会读取每篇文章的：

- `title`
- `date`
- `description`
- `tags`
- `cover`

标签统计也来自文章 front matter 里的 `tags`。

注意：此页当前处于隐藏状态，导航栏和首页都没有入口。保留本节只是为了以后恢复时能找到相关源码。

### 5.6 杂谈页 `/chatter`

该页当前处于隐藏状态：导航、首页、关于动态和知识地图均不再显示杂谈入口，但源码与 Markdown 文件没有删除，未来可以恢复。

内容目录：

```text
chatters/
```

列表页：

```text
app/chatter/page.tsx
app/chatter/ChatterBoard.tsx
```

详情页：

```text
app/chatter/[slug]/page.tsx
```

适合写：

- 站点维护记录；
- 学习碎片；
- 阅读随笔；
- 代码折腾；
- 不一定那么正式的文章。

### 5.7 说说页 `/moments`

内容目录：

```text
moments/
```

页面文件：

```text
app/moments/page.tsx
app/moments/MomentList.tsx
```

适合写很短的动态。当前页面采用简洁的“便利贴墙”布局：留言板内部没有额外标题或方格底纹，每条说说会自动获得稳定的淡色纸张、轻微旋转角度、顶部图钉和横线纸纹；桌面端按多列错落排列，手机端自动变为单列。图片仍可点击放大，便利贴右下角的留言按钮会打开独立评论面板。

### 5.8 项目页 `/projects`

数据文件：

```text
data/projects.ts
```

页面文件：

```text
app/projects/page.tsx
app/projects/ProjectsBoard.tsx
```

页面支持按项目名称、描述、标签搜索。

### 5.9 照片墙 `/photowall`

数据文件：

```text
data/albums.ts
```

页面文件：

```text
app/photowall/page.tsx
app/photowall/PhotoWallClient.tsx
```

页面支持：

- 相册列表；
- 相册内瀑布流；
- 点击图片全屏预览；
- 搜索相册标题、描述、照片说明。

### 5.10 音乐馆 `/music`

配置入口：

```text
siteConfig.ts -> localMusicTracks
siteConfig.ts -> cloudMusicIds
```

页面文件：

```text
app/music/page.tsx
app/music/MusicClient.tsx
components/MusicProvider.tsx
app/api/music/route.ts
```

当前音乐功能优先使用本地音频文件和 LRC 歌词文件，网易云歌曲 ID 作为可选补充。

### 5.11 友链页 `/friends`

数据文件：

```text
data/friends.ts
```

页面文件：

```text
app/friends/page.tsx
app/friends/FriendsBoard.tsx
```

友链页底部也接入了评论系统。

### 5.12 关于页 `/about`

正文文件：

```text
app/about/about.md
```

页面文件：

```text
app/about/page.tsx
components/AboutClient.tsx
```

适合写你的个人介绍、研究方向、学习计划、站点说明。

### 5.13 知识地图 `/tree`

当前实际页面文件：

```text
app/tree/page.tsx
```

数据来源：

- `posts/`
- `moments/`
- Markdown 正文中引用的 PDF 数量
- Markdown front matter 中的 `tags`

页面顶部显示文章、说说、PDF 和常用标签，下面用时间线展示最近更新。时间位于每条内容卡片外侧，并与时间线节点对齐；内容类型、标题和摘要仍在卡片内。`CreativeWorkshopClient.tsx`、`AlchemyLab.tsx`、`DijiangModel.tsx` 是保留的实验组件，当前 `/tree` 主页面没有加载它们；普通维护不需要修改。

## 6. 如何写一篇正式文章

在 `posts/` 里新建 Markdown 文件，例如：

```text
posts/my-first-note.md
```

文件名会变成链接：

```text
/posts/my-first-note
```

推荐文件名规则：

- 使用英文小写；
- 单词之间用 `-`；
- 不要用空格；
- 不建议用中文文件名。

文章示例格式：

```markdown
---
title: "文章标题"
date: "2026-08-03 20:00:00"
description: "一句话摘要，会出现在首页、搜索和知识地图里。"
cover: "/assets/img/posts/research-writing-cover.svg"
tags: ["物理", "笔记", "PDF"]
pinned: false
---

这里开始写正文。

## 第一节

正文内容。

## 第二节

正文内容。
```

字段说明：

| 字段 | 必需 | 作用 |
| --- | --- | --- |
| `title` | 建议写 | 文章标题 |
| `date` | 建议写 | 排序依据 |
| `description` | 建议写 | 首页、搜索、知识地图摘要 |
| `cover` | 可选 | 文章封面，不写则用默认封面 |
| `tags` | 可选 | 标签，会影响搜索、知识地图和隐藏的归档页 |
| `pinned` | 可选 | `true` 表示首页置顶，`false` 或不写表示正常按日期排序 |

如果需要置顶某篇文章，把该文章的 front matter 改为：

```yaml
pinned: true
```

置顶文章会优先出现在首页第一页，并在文章卡片右上角显示大头针图标，不再显示“置顶”文字。多篇文章同时设置为 `true` 时，它们之间继续按 `date` 从新到旧排列。取消置顶时删除这一行，或改为 `pinned: false`。布尔值不要加引号。

## 7. Markdown 常用写法

### 7.1 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
```

文章目录会读取 1 到 3 级标题。

### 7.2 加粗、斜体、删除线

```markdown
**加粗**
*斜体*
~~删除线~~
```

### 7.3 列表

```markdown
- 第一项
- 第二项

1. 第一步
2. 第二步
```

注意：数字列表的点号后面要有空格，写成 `1. 第一步`，不要写成 `1.第一步`。

### 7.4 表格

```markdown
| 名称 | 说明 |
| --- | --- |
| A | 第一项 |
| B | 第二项 |
```

### 7.5 代码块

````markdown
```python
def hello():
    print("hello")
```
````

常用语言名：

- `python`
- `cpp`
- `javascript`
- `typescript`
- `bash`
- `json`

### 7.6 数学公式

行内公式：

```markdown
这是行内公式：$E = mc^2$。
```

独立公式：

```markdown
$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$
```

### 7.7 链接

```markdown
[链接文字](https://example.com)
```

### 7.8 图片

先把图片放到：

```text
public/assets/img/posts/
```

然后在文章里写：

```markdown
![图片说明](/assets/img/posts/example.webp)
```

## 8. 如何上传 PDF 并在网页预览

推荐目录：

```text
public/assets/files/
```

比如你要上传一份计算物理笔记：

```text
public/assets/files/computational-physics/computational-physics.pdf
```

文章里提供下载链接：

```markdown
[下载 PDF](/assets/files/computational-physics/computational-physics.pdf)
```

文章里嵌入网页预览：

```html
<iframe
  src="/assets/files/computational-physics/computational-physics.pdf"
  width="100%"
  height="720"
  style="border: 1px solid rgba(148, 163, 184, 0.35); border-radius: 16px;"
></iframe>
```

如果担心手机端太高，可以写成：

```html
<div style="position: relative; width: 100%; height: min(75vh, 760px);">
  <iframe
    src="/assets/files/computational-physics/computational-physics.pdf"
    style="position: absolute; inset: 0; width: 100%; height: 100%; border: 1px solid rgba(148, 163, 184, 0.35); border-radius: 16px;"
  ></iframe>
</div>
```

注意：

- PDF 文件名建议用英文小写和 `-`；
- 文件太大时加载会慢；
- 某些手机浏览器对 PDF 内嵌预览支持一般，所以最好同时提供“下载 PDF”链接。

## 9. 如何写杂谈

注意：杂谈功能当前处于隐藏状态。下面内容仅供以后恢复该页面时使用；现在新增杂谈不会出现在首页、导航、关于动态或知识地图中。

在 `chatters/` 里新建：

```text
chatters/2026-08-03-my-chatter.md
```

杂谈示例格式：

```markdown
---
title: "杂谈标题"
date: "2026-08-03 21:00:00"
description: "一句话摘要"
cover: "/assets/img/posts/research-writing-cover.svg"
tags: ["站点维护", "学习"]
mood: "慢慢折腾"
---

这里写杂谈正文。
```

字段说明：

| 字段 | 作用 |
| --- | --- |
| `title` | 杂谈标题 |
| `date` | 排序和详情页日期 |
| `description` | 恢复杂谈列表或轮播后使用的摘要 |
| `cover` | 杂谈封面 |
| `tags` | 标签 |
| `mood` | 详情页展示心情 |

## 10. 如何写说说/动态

在 `moments/` 里新建：

```text
moments/moment-20260803.md
```

最简单示例格式：

```markdown
---
date: "2026-08-03 21:30:00"
---

今天更新了网站手册，感觉终于能自己慢慢维护这个小宇宙了。
```

带地点和图片的示例格式：

```markdown
---
date: "2026-08-03 21:30:00"
location: "北京"
images:
  - "/assets/img/moments/library.webp"
  - "/assets/img/moments/desk.webp"
---

今天在图书馆整理了一些课程资料。
```

图片放到：

```text
public/assets/img/moments/
```

## 11. 如何修改关于页

打开：

```text
app/about/about.md
```

按普通 Markdown 修改即可。

关于页 front matter 可以写：

```markdown
---
title: 关于我
date: "2026-08-03"
tags: ["关于", "学习", "科研"]
mood: "整理知识，慢慢生长"
cover: "/assets/img/posts/research-writing-cover.svg"
description: "RainierGu 的个人主页介绍。"
---
```

正文就是关于页主体内容。

## 12. 如何添加项目

打开：

```text
data/projects.ts
```

添加一个对象：

```ts
{
  id: "my-new-project",
  name: "我的新项目",
  githubUrl: "https://github.com/你的用户名/仓库名",
  description: "这里写项目介绍。",
  icon: "🧪",
  tags: ["Next.js", "Physics", "Tool"],
},
```

字段说明：

| 字段 | 作用 |
| --- | --- |
| `id` | 唯一标识，不要重复 |
| `name` | 项目名称 |
| `githubUrl` | 点击项目卡片后跳转的链接，也可以填文章链接 |
| `description` | 项目描述 |
| `icon` | 项目前面的 emoji |
| `tags` | 搜索和展示用标签 |

## 13. 如何添加友链

打开：

```text
data/friends.ts
```

添加：

```ts
{
  id: "friend-name",
  name: "朋友的网站名",
  description: "朋友网站的一句话介绍。",
  avatar: "/assets/img/friends/friend-avatar.webp",
  url: "https://example.com",
  themeColor: "rgba(99, 102, 241, 0.45)",
},
```

头像放到：

```text
public/assets/img/friends/
```

`themeColor` 控制卡片氛围色。如果不知道怎么选，可以先用：

```ts
themeColor: "rgba(99, 102, 241, 0.45)"
```

## 14. 如何添加相册和照片

图片建议放到：

```text
public/assets/img/albums/相册英文名/
```

例如：

```text
public/assets/img/albums/campus/campus-01.webp
public/assets/img/albums/campus/campus-02.webp
```

打开：

```text
data/albums.ts
```

添加：

```ts
{
  id: "campus",
  title: "校园片段",
  description: "一些学习和生活里的照片。",
  cover: "/assets/img/albums/campus/campus-01.webp",
  date: "2026.08",
  photos: [
    { url: "/assets/img/albums/campus/campus-01.webp", caption: "图书馆的下午" },
    { url: "/assets/img/albums/campus/campus-02.webp", caption: "实验室桌面" },
  ],
},
```

字段说明：

| 字段 | 作用 |
| --- | --- |
| `id` | 相册唯一标识 |
| `title` | 相册标题 |
| `description` | 相册简介 |
| `cover` | 相册封面 |
| `date` | 相册时间 |
| `photos` | 相册内照片数组 |

首页照片墙入口会优先使用 `albums` 数组里的第一个相册。

## 15. 如何上传图片

建议按用途分类：

| 用途 | 推荐目录 |
| --- | --- |
| 头像 | `public/assets/img/avatar/` |
| 文章封面 | `public/assets/img/posts/` |
| 文章内图片 | `public/assets/img/posts/文章英文名/` |
| 说说图片 | `public/assets/img/moments/` |
| 相册图片 | `public/assets/img/albums/相册英文名/` |
| 友链头像 | `public/assets/img/friends/` |
| 背景图 | `public/assets/img/backgrounds/` |

命名建议：

- 推荐：`computational-physics-cover.webp`
- 推荐：`lab-report-01.jpg`
- 不推荐：`我的 图片 1.png`

网页引用路径规则：

```text
public/assets/img/posts/a.webp
```

在代码或 Markdown 里写成：

```text
/assets/img/posts/a.webp
```

## 16. 如何配置音乐

打开：

```text
siteConfig.ts
```

### 16.1 推荐方式：上传本地音频和 LRC 歌词

把文件放到下面三个目录：

```text
public/assets/music/tracks/   音频文件，例如 blue-night.mp3
public/assets/music/lyrics/   LRC 歌词，例如 blue-night.lrc
public/assets/music/covers/   歌曲封面，例如 blue-night.webp
```

然后在 `siteConfig.ts` 里找到：

```ts
localMusicTracks: [
  // ...
],
```

添加一首歌：

```ts
localMusicTracks: [
  {
    id: "blue-night",
    title: "Blue Night",
    artist: "RainierGu",
    album: "Demo",
    cover: "/assets/music/covers/blue-night.webp",
    src: "/assets/music/tracks/blue-night.mp3",
    lrcUrl: "/assets/music/lyrics/blue-night.lrc",
  },
],
```

每个字段的意思：

| 字段 | 说明 |
| --- | --- |
| `id` | 歌曲唯一标识，建议英文小写，例如 `blue-night` |
| `title` | 歌曲名 |
| `artist` | 歌手名 |
| `album` | 专辑名，可不填 |
| `cover` | 歌曲封面路径 |
| `src` | 音频文件路径 |
| `lrcUrl` | LRC 歌词文件路径，可不填；不填就只播放音乐不滚动歌词 |

LRC 歌词文件长这样：

```lrc
[00:00.00]歌曲名
[00:12.30]第一句歌词
[00:16.80]第二句歌词
```

小提醒：

- 路径不要写 `public`，要从 `/assets/music/` 开始。
- 文件名建议用英文小写和短横线，例如 `blue-night.mp3`。
- 音频推荐 `mp3` 或 `m4a`。
- 封面推荐 `webp`、`jpg` 或 `png`。
- 请只上传自己有权使用的音频文件。

### 16.2 可选方式：继续使用网易云歌曲 ID

如果你还想补充网易云歌曲，可以继续配置：

```ts
cloudMusicIds: ["1809646618", "1974443814"],
```

但网易云外链可能因为版权、地区或接口限制无法播放，所以更推荐把重要歌曲放到本地音乐目录。

音乐会影响：

- 首页音乐卡片；
- 首页歌词栏；
- 桌面端右下/底部悬浮音乐播放器；
- `/music` 音乐馆页面。

如果没有配置任何本地音乐或网易云歌曲，音乐组件会提示你到 `siteConfig.ts` 配置 `localMusicTracks` 或 `cloudMusicIds`。

## 17. 如何配置 AI 小猫助手

相关文件：

```text
components/CyberCat.tsx
app/api/chat/route.ts
siteConfig.ts
docs/DEEPSEEK_AI.md
```

桌面端可以直接拖动猫咪本体改变位置。聊天、喂食和输入区域不会误触拖拽；回复框会根据猫咪靠近屏幕左侧、中央或右侧自动调整对齐。长回复使用较宽的小字号文本框，内容过长时只在回复框内部滚动。手机端目前为了性能默认隐藏 AI 小猫。

### 17.1 改小猫的性格

打开 `siteConfig.ts`，修改：

```ts
systemPrompt: "你是 RainierGu 个人主页里的学习助手。回答要简洁、友好、偏学术笔记风格；如果问题涉及本站资料，请提醒用户核对原文和 PDF。",
```

例如你想让它更活泼：

```ts
systemPrompt: "你是一个温柔、活泼、喜欢用简短比喻解释问题的博客助手。回答要友好，不要太长。",
```

### 17.2 改模型

代码中的默认模型来自：

```ts
modelId: "deepseek-v4-flash",
```

线上也可以用环境变量覆盖，不必修改代码：

```env
DEEPSEEK_MODEL=你的 DeepSeek 账户当前支持的模型 ID
```

模型名称以 DeepSeek 控制台/API 实际支持的值为准。如果聊天接口提示 `model not found`，优先检查这个变量；修改 Vercel 环境变量后必须重新部署。

### 17.3 必需密钥

本地 `.env.local`：

```env
DEEPSEEK_API_KEY=你的 DeepSeek Key
```

Vercel 线上环境变量也要配置：

```env
DEEPSEEK_API_KEY=你的 DeepSeek Key
```

不要写成 `NEXT_PUBLIC_DEEPSEEK_API_KEY`。

## 18. 如何配置 GitHub 评论

评论系统通过服务端 OAuth 把评论保存在 GitHub Issues 中，并兼容旧 Gitalk Issue 标签。

相关文件：

```text
components/Comments.tsx
components/MomentComments.tsx
components/LabComments.tsx
components/gitalkConfig.ts
docs/GITHUB_COMMENTS.md
```

Vercel 环境变量：

```env
NEXT_PUBLIC_GITALK_CLIENT_ID=你的 Client ID
GITALK_CLIENT_SECRET=你的 Client Secret
NEXT_PUBLIC_GITALK_OWNER=Rainier-Gu
NEXT_PUBLIC_GITALK_REPO=Rainier-Gu.github.io
NEXT_PUBLIC_GITALK_ADMIN=Rainier-Gu
```

评论出现位置：

- 文章详情页；
- 杂谈详情页；
- 说说；
- 友链页；
- 关于页；
- 音乐页；
- 知识地图部分页面。

第一次打开某篇文章评论时，管理员可能需要点一次初始化 Issue。

## 19. 如何配置天气

相关文件：

```text
components/WeatherWidget.tsx
app/api/weather/route.ts
```

当前天气有三种使用方式：

1. 第一次进入首页时请求浏览器定位；
2. 点击天气卡片右上角“定位”重新定位；
3. 在输入框中手动输入“北京”“上海”或“北京市海淀区颐和园路5号北京大学”等地址并查询，成功后会保存在浏览器本地。

逐小时预报当前最多显示接下来的 4 个时段，使用固定四列布局，不会出现横向滑动。

天气接口按下面顺序工作：

1. 配置了 `QWEATHER_KEY` 时优先使用和风天气；
2. 未配置或请求失败时尝试 Open-Meteo；
3. 外部服务都不可用时返回模拟天气，保证首页仍能显示。

可选的 Vercel 环境变量：

```env
QWEATHER_KEY=你的和风天气 Token
AMAP_WEB_SERVICE_KEY=你的高德 Web 服务 Key
```

`QWEATHER_KEY` 负责天气数据，最多稳定识别到城市或区县；`AMAP_WEB_SERVICE_KEY` 负责详细地址。配置高德 Key 后，浏览器定位会依次完成 GPS 坐标转换和逆地理编码，天气卡片可显示区县、街道、门牌、社区或附近建筑名。高德 Key 必须选择“Web 服务”类型，不要选择 JS API 类型。

详细地址只会在访客发起天气请求时用于解析并返回给该访客，项目不会把访客坐标或地址写入文件、数据库或日志。浏览器定位本身仍可能受到设备 GPS、Wi-Fi 和用户授权影响，因此界面会把结果视为近似位置。

因此城市不再写死，不需要为了换城市修改代码。浏览器定位必须在 `localhost` 或 HTTPS 页面使用；如果用户拒绝定位，直接手动输入城市即可。

## 20. 如何修改字体

全站字体主要在：

```text
app/layout.tsx
app/globals.css
```

当前 `app/layout.tsx` 的 `body` 使用：

```tsx
className="... font-serif"
```

`app/globals.css` 当前已经定义了完整的回退字体栈：

```css
:root {
  --font-serif: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "SimSun", serif;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, "Cascadia Code", "JetBrains Mono", Consolas, monospace;
}
```

`body` 通过 `font-family: var(--font-serif)` 使用衬线字体。修改网站字体时，只需调整 `--font-serif` 中的顺序，例如把你喜欢的字体放在最前面。最后的 `serif` 就是最终回退选项，建议始终保留。

标题中的英文优先使用 Centaur。相关配置位于 `app/globals.css`：

```css
--font-title: "Site Centaur", "Centaur", Baskerville, "Palatino Linotype", "Book Antiqua", "Times New Roman", var(--font-serif);
```

语义标题 `h1` 到 `h6` 会自动使用该字体；其它英文栏目名通过 `title-font-regular` 或 `title-font-black` 控制字重。字体文件保存在 `public/assets/fonts/centaur-regular.ttf`，会随网站一起部署，因此访客不需要在自己的设备上安装 Centaur。浏览器无法加载字体文件时，才会自动使用后面的回退字体。

### 20.1 全站字距与行距规范

全站的排版参数统一写在 `app/globals.css`，页面组件不应再随意添加 `tracking-widest`、`tracking-[0.3em]`、`leading-snug` 或 `leading-relaxed`。新增文字时，应按照文字用途选择下面的排版角色：

| 排版角色 | CSS 类名 | 适合内容 | 行高 | 字距 |
| --- | --- | --- | --- | --- |
| 页面主标题 | `type-page-title` | 每个页面顶部的唯一主标题 | `1.1` | `-0.02em` |
| 页面副标题 | `type-page-subtitle` | 主标题下面的一句话说明 | `1.8` | `0.04em` |
| 区块标题 | `type-section-title` | 卡片组、留言区、文章分区 | `1.3` | `-0.012em` |
| 卡片标题 | `type-card-title` | 文章、相册、项目等卡片标题 | `1.35` | `-0.006em` |
| 正文 | `type-body` | 较长的完整文字 | `1.8` | `0.012em` |
| 摘要 | `type-summary` | 卡片简介、个人简介、搜索结果摘要 | `1.7` | `0.012em` |
| 日期和元信息 | `type-meta` | 日期、作者、状态等辅助信息 | `1.6` | `0.04em` |
| 英文小标题 | `type-kicker` | `Weather`、`Photo Wall`、`All Notes` 等 | `1.4` | `0.14em` |
| 标签和短按钮 | `type-label` | 标签、徽章、短按钮文字 | `1.4` | `0.08em` |

文章阅读页右侧的 `NOW PLAYING`、`RECOMMENDED`、`TABLE OF CONTENTS` 和杂谈详情页的 `RECENT RECORDS` 必须统一使用 `sidebar-heading`，不要再分别添加字重、字距或左边框。

例如，新增一个普通卡片时可以这样写：

```tsx
<article>
  <p className="type-meta text-xs">2026-08-04</p>
  <h2 className="type-card-title text-xl font-bold">卡片标题</h2>
  <p className="type-summary text-sm">这里是一两行简短说明。</p>
</article>
```

文章 Markdown 生成的正文统一使用 `article-prose`。文章页已经配置好，一般不需要单独修改段落行高。时钟数字、歌词动画、代码和知识地图内部的主题化界面可以保留专用排版，它们属于有意设计的例外。

### 20.2 为什么中英文混排有时看起来大小不一致

Centaur 只有西文字形，没有中文字形。如果在同一个标题里写 `stamp制作`，并直接使用 Centaur，浏览器会用 Centaur 显示 `stamp`，再用中文回退字体显示“制作”。两套字体的字面高度、基线和粗细不同，看起来就像使用了两种字号。

因此本项目采用以下规则：

- 页面主标题、独立英文栏目标题使用 Centaur；
- Markdown 文章内部的 `h1` 到 `h6` 使用统一的正文宋体，适合中英文混排；
- 四级标题在桌面端为 `1.2rem`，不会再小于 `1.15rem` 的正文；
- 代码、命令和变量使用等宽字体；
- 不要为了修正某一个英文单词而在 Markdown 中单独添加字号样式。

对应规则位于 `app/globals.css` 的 `.prose.article-prose` 部分。

文章内部标题遵循“标题前留白大于标题后留白”的阅读节奏：二级标题前留白 `2.75rem`，三级标题前留白 `2.125rem`，四级标题前留白 `1.75rem`。这样标题会明确归属于后面的内容，不会贴住上一段。若标题是文章正文的第一个元素，则自动取消顶部留白。

如果你想将全站改成无衬线字体，可以把 `body` 改成：

```css
body {
  font-family: var(--font-sans);
}
```

如果以后通过 `next/font` 引入在线或本地字体，需要：

1. 在 `app/layout.tsx` 引入新字体；
2. 定义字体变量；
3. 把变量加入 `<html className=...>`；
4. 在 `body` 或 CSS 中使用。

不要删除字体栈末尾的 `serif` 或 `sans-serif`，否则字体加载失败时可能出现不可控差异。

## 21. 如何修改颜色和毛玻璃风格

主要文件：

```text
app/globals.css
components/*.tsx
app/**/*.tsx
```

项目使用 Tailwind CSS，常见类名含义：

| 类名 | 含义 |
| --- | --- |
| `bg-white/60` | 白色背景，60% 透明 |
| `dark:bg-slate-800/50` | 暗色模式下背景 |
| `backdrop-blur-xl` | 毛玻璃模糊 |
| `rounded-3xl` | 大圆角 |
| `shadow-xl` | 阴影 |
| `text-indigo-500` | 靛蓝色文字 |
| `hover:scale-[1.02]` | 鼠标悬停放大 |

如果你想统一调整风格，建议从这些地方开始：

- 首页卡片：`app/page.tsx` 和相关组件；
- 文章样式：`app/posts/[slug]/page.tsx`；
- 全局背景：`app/layout.tsx`；
- 全局 CSS：`app/globals.css`。

## 22. 如何添加一个新页面

例如你想添加 `/reading` 页面：

1. 新建文件：

```text
app/reading/page.tsx
```

2. 写入最简单页面：

```tsx
import Navbar from '../../components/Navbar';
import PageTransition from '../../components/PageTransition';

export default function ReadingPage() {
  return (
    <div className="min-h-screen relative pb-20">
      <Navbar />
      <PageTransition>
        <main className="w-[90%] max-w-4xl mx-auto mt-28 relative z-10 rounded-3xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl p-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">阅读清单</h1>
          <p className="mt-4 text-slate-700 dark:text-slate-300">这里记录我正在读的书和论文。</p>
        </main>
      </PageTransition>
    </div>
  );
}
```

3. 在 `components/Navbar.tsx` 的 `navLinks` 里添加：

```ts
{ name: '阅读', href: '/reading' },
```

4. 本地预览：

```powershell
npm run dev
```

打开：

```text
http://localhost:4000/reading
```

## 23. 环境变量与密钥清单

不要把密钥写进 Git 仓库。`.env.local` 已被 `.gitignore` 忽略。

| 变量名 | 用途 | 是否要加 `NEXT_PUBLIC_` |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | AI 小猫助手 | 不要 |
| `DEEPSEEK_MODEL` | 可选，覆盖 DeepSeek 模型 | 不要 |
| `QWEATHER_KEY` | 天气接口 | 不要 |
| `NEXT_PUBLIC_GITALK_CLIENT_ID` | GitHub 评论登录的公开 Client ID | 需要 |
| `GITALK_CLIENT_SECRET` | GitHub 评论登录的服务端 Secret | 不要 |
| `NEXT_PUBLIC_GITALK_OWNER` | 评论仓库 owner | 需要 |
| `NEXT_PUBLIC_GITALK_REPO` | 评论仓库 repo | 需要 |
| `NEXT_PUBLIC_GITALK_ADMIN` | 评论管理员 | 需要 |

说明：`QWEATHER_KEY` 是可选项；不配置时会自动尝试 Open-Meteo。Vercel Web Analytics 不需要环境变量，线上部署时 `app/layout.tsx` 会加载 `/_vercel/insights/script.js`，同时还要在 Vercel 项目的 Analytics 页面确认功能已启用。

本地 `.env.local` 示例：

```env
DEEPSEEK_API_KEY=sk-xxx
QWEATHER_KEY=xxx
NEXT_PUBLIC_GITALK_CLIENT_ID=xxx
GITALK_CLIENT_SECRET=xxx
```

Vercel 也要配置同样的线上变量。

## 24. 常见修改任务速查

### 24.1 改网站名称

改：

```text
siteConfig.ts
```

字段：

```ts
title
navTitle
navAfter
```

### 24.2 改头像

1. 上传图片到 `public/assets/img/avatar/`。
2. 修改 `siteConfig.ts`：

```ts
avatarUrl: "/assets/img/avatar/new-avatar.jpg",
faviconUrl: "/assets/img/avatar/new-avatar.jpg",
```

### 24.3 改首页背景

1. 上传图片到 `public/assets/img/backgrounds/`。
2. 修改：

```ts
bgImages: [
  "/assets/img/backgrounds/new-bg.webp",
],
```

### 24.4 添加文章

1. 在 `posts/` 新建 `.md`。
2. 写 front matter。
3. 上传封面/PDF 到 `public/assets/`。
4. `npm run build` 检查。
5. 提交、推送。

需要置顶时，在文章 front matter 中添加 `pinned: true`；取消置顶则删除该字段或改成 `false`。

### 24.5 添加 PDF

1. 放到 `public/assets/files/某个目录/`。
2. 在文章里写下载链接或 `<iframe>`。

### 24.6 添加项目

改：

```text
data/projects.ts
```

### 24.7 添加友链

改：

```text
data/friends.ts
```

### 24.8 添加照片墙图片

1. 图片放 `public/assets/img/albums/`。
2. 改 `data/albums.ts`。

### 24.9 添加音乐

1. 音频放到 `public/assets/music/tracks/`。
2. LRC 歌词放到 `public/assets/music/lyrics/`。
3. 封面放到 `public/assets/music/covers/`。
4. 改：

```text
siteConfig.ts -> localMusicTracks
```

网易云歌曲 ID 仍可作为备用，改：

```text
siteConfig.ts -> cloudMusicIds
```

### 24.10 改 AI 助手回答风格

改：

```text
siteConfig.ts -> geminiConfig.systemPrompt
```

### 24.11 改导航菜单

改：

```text
components/Navbar.tsx -> navLinks
```

### 24.12 改页面整体布局

优先看：

```text
app/page.tsx
app/layout.tsx
components/
```

## 25. 新手最容易踩的坑

### 25.1 图片路径写错

错误：

```text
public/assets/img/avatar/avatar.jpg
```

正确：

```text
/assets/img/avatar/avatar.jpg
```

### 25.2 Markdown front matter 格式错

开头和结尾都要有 `---`：

```markdown
---
title: "标题"
date: "2026-08-03"
---
```

### 25.3 数组末尾漏逗号

在 `.ts` 数据文件里，对象之间要用逗号：

```ts
{
  id: "a",
  name: "A",
},
{
  id: "b",
  name: "B",
},
```

### 25.4 密钥写进代码

不要把 DeepSeek、天气、GitHub OAuth 密钥写进公开仓库。应该写在：

- 本地 `.env.local`
- Vercel Environment Variables

### 25.5 只改了本地，忘记部署

本地看到效果不代表线上已经更新。需要：

```powershell
git add .
git commit -m "说明"
git push origin main
```

或手动：

```powershell
vercel --prod
```

### 25.6 改完没有重启开发服务器

大部分修改会自动热更新，但环境变量、依赖、配置变化有时需要重启：

```powershell
Ctrl + C
npm run dev
```

## 26. 推荐的个人开发节奏

如果你要新增一篇文章：

1. 准备 Markdown 正文。
2. 把图片/PDF 放进 `public/assets/`。
3. 在 `posts/` 新建文章。
4. 本地 `npm run dev` 预览。
5. 检查链接、图片、PDF 预览。
6. 运行 `npm run build`。
7. `git status -sb` 看改了哪些文件。
8. `git add`、`git commit`、`git push`。
9. 等 Vercel 部署完成。
10. 打开线上页面检查。

如果你要改页面样式：

1. 先找到对应页面/组件。
2. 每次只改一小块。
3. 本地刷新确认。
4. 不要一次改太多文件。
5. 改坏了就看 `git diff` 找回。

## 27. 出问题时怎么自救

查看改了哪些文件：

```powershell
git status -sb
```

查看具体改动：

```powershell
git diff
```

构建报错时，先看错误里提到的文件路径和行号。

常见报错判断：

| 报错类型 | 可能原因 |
| --- | --- |
| `SyntaxError` | 少了逗号、引号、括号 |
| `Module not found` | 引入路径写错 |
| `TypeError` | 某个字段为空或类型不对 |
| 图片 404 | 图片路径写错或文件没放到 `public` |
| AI 500 | `DEEPSEEK_API_KEY` 没配置或无效 |
| 评论不显示 | Gitalk 环境变量、OAuth App 或 GitHub Issues 没配好 |

如果你不确定下一步怎么做，就把下面三样信息发给我：

```powershell
git status -sb
npm run build
```

以及你刚才改过的文件名。

## 28. 建议保留的文件命名习惯

文章：

```text
posts/computational-physics-notes.md
```

杂谈：

```text
chatters/2026-08-03-site-update.md
```

说说：

```text
moments/moment-20260803.md
```

图片：

```text
public/assets/img/posts/computational-physics-cover.webp
```

PDF：

```text
public/assets/files/computational-physics/computational-physics.pdf
```

这样命名的好处是：链接稳定、跨系统不容易乱码，后续长期维护也更省心。

## 29. 你真正需要记住的三句话

第一，内容优先改这些地方：

```text
posts/
chatters/
moments/
data/
public/assets/
siteConfig.ts
```

第二，路径规则永远记住：

```text
public/assets/xxx
```

网页里写成：

```text
/assets/xxx
```

第三，发布前先检查：

```powershell
npm run build
git status -sb
```

会这三件事，你就已经能安全地维护这个网站的大部分内容了。
