# RainierGu 个人网站新手设置手册

这份手册面向“刚开始自己动手维护网站”的你。它的目标不是教你一次性记住所有代码，而是让你知道：

- 页面上每个主要元素在哪里改；
- 每个功能需要什么配置；
- 文章、PDF、图片、音乐、相册、项目、友链、说说等内容如何上传；
- 修改后如何本地预览、检查、提交、推送和部署。

你可以把这个网站想成三层：

| 层级 | 主要文件 | 你通常做什么 |
| --- | --- | --- |
| 内容层 | `posts/`、`chatters/`、`moments/`、`data/`、`public/assets/` | 写文章、传 PDF、传图片、加项目、加相册、加友链 |
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
http://localhost:3000
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
| 全站标题、头像、背景、音乐、AI、评论、页脚 | `siteConfig.ts` |
| 首页布局 | `app/page.tsx` |
| 全站外壳、字体、背景、全局特效 | `app/layout.tsx`、`app/globals.css` |
| 导航栏 | `components/Navbar.tsx` |
| 首页个人卡片 | `components/ProfileCard.tsx` |
| 首页搜索框 | `components/SearchBar.tsx` |
| 首页文章流 | `components/HomePostStream.tsx` |
| 首页杂谈轮播 | `components/LatestChatterCarousel.tsx` |
| 首页音乐卡片 | `components/CloudPlayer.tsx` |
| 全局音乐播放器 | `components/MusicProvider.tsx`、`components/FloatingPlayer.tsx`、`app/music/MusicClient.tsx` |
| AI 小猫助手 | `components/CyberCat.tsx`、`app/api/chat/route.ts` |
| GitHub 评论 | `components/Comments.tsx`、`components/MomentComments.tsx`、`components/LabComments.tsx`、`components/gitalkConfig.ts` |
| 文章 | `posts/` |
| 杂谈 | `chatters/` |
| 说说/动态 | `moments/` |
| 关于我正文 | `app/about/about.md` |
| 项目页数据 | `data/projects.ts` |
| 友链页数据 | `data/friends.ts` |
| 照片墙数据 | `data/albums.ts` |
| 图片、PDF 等静态资源 | `public/assets/` |
| DeepSeek AI 详细说明 | `docs/DEEPSEEK_AI.md` |
| GitHub 评论详细说明 | `docs/GITHUB_COMMENTS.md` |

## 4. `siteConfig.ts` 全站配置详解

这是你最常改的文件。它像网站的“总控制台”。

### 4.1 网站基本信息

```ts
title: "RainierGu 的学习档案馆",
faviconUrl: "/assets/img/avatar/avatar.jpg",
authorName: "RainierGu",
bio: "记录物理课程、经济学笔记、科研学习、技术实践与项目进展。",
```

| 字段 | 影响哪里 | 怎么改 |
| --- | --- | --- |
| `title` | 浏览器标题、页面 metadata | 改成你的网站名 |
| `faviconUrl` | 浏览器标签页小图标 | 推荐用正方形图片 |
| `authorName` | 首页卡片、关于页、文章侧栏、说说头像名称 | 改成你的名字或昵称 |
| `bio` | 首页个人简介、文章侧栏、SEO 描述 | 写 1 到 2 句话 |

### 4.2 导航栏标题

```ts
navTitle: "RainierGu",
navSuffix: "·",
navAfter: "Learning Archive",
```

页面顶部会显示类似：

```text
RainierGu · Learning Archive
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
useGradient: false,
themeColors: ["#0f172a", "#312e81", "#0f766e", "#0369a1"],
bgImages: [
  "/assets/img/posts/welcome.webp",
  "/assets/img/posts/research-writing-cover.svg",
],
```

| 字段 | 作用 |
| --- | --- |
| `useGradient` | `false` 时使用背景图轮播；`true` 时主要使用渐变背景 |
| `themeColors` | 背景渐变、光晕、主题色氛围 |
| `bgImages` | 全站背景轮播图片 |

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

### 4.6 网易云音乐

```ts
cloudMusicIds: [],
```

填网易云歌曲 ID，例如：

```ts
cloudMusicIds: ["1809646618", "1974443814"],
```

获取歌曲 ID 的方法：

1. 打开网易云音乐网页版。
2. 进入某首歌页面。
3. 地址通常类似：

```text
https://music.163.com/#/song?id=1809646618
```

4. `id=` 后面的数字就是歌曲 ID。

网站会通过 `app/api/music/route.ts` 获取歌曲信息、封面、歌词和播放地址。注意：网易云外链有时会因为版权或地区问题无法播放，这是正常现象。

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

空字符串表示不显示。

### 4.8 杂谈页标题

```ts
chatterTitle: "研究与生活札记",
chatterDescription: "课程、科研、代码、阅读和一些短想法的碎片记录。",
```

影响 `/chatter` 页面顶部标题和说明。

### 4.9 首页弹幕

```ts
danmakuList: [
  "今天也要认真推导",
  "PDF 资料库加载中",
],
```

这些文字会在桌面端背景里飘过。手机端为了性能默认隐藏。

### 4.10 GitHub 评论

```ts
gitalkConfig: {
  clientID: "",
  clientSecret: "",
  repo: "Rainier-Gu.github.io",
  owner: "Rainier-Gu",
  admin: ["Rainier-Gu"],
},
```

现在项目优先读取 Vercel 环境变量：

```env
NEXT_PUBLIC_GITALK_CLIENT_ID=你的 Client ID
NEXT_PUBLIC_GITALK_CLIENT_SECRET=你的 Client Secret
NEXT_PUBLIC_GITALK_OWNER=Rainier-Gu
NEXT_PUBLIC_GITALK_REPO=Rainier-Gu.github.io
NEXT_PUBLIC_GITALK_ADMIN=Rainier-Gu
```

通常不建议把 `clientID` 和 `clientSecret` 直接写进 `siteConfig.ts`。详细步骤见：

```text
docs/GITHUB_COMMENTS.md
```

### 4.11 页脚运行时间与技术徽章

```ts
buildDate: "2026-07-08T00:00:00+08:00",
footerBadges: [
  { name: "Next.js", color: "text-sky-500", svg: "..." },
],
```

| 字段 | 作用 |
| --- | --- |
| `buildDate` | 首页底部运行天数从这个日期开始计算 |
| `footerBadges` | 首页底部显示的技术徽章 |

如果你不熟 SVG，先只改 `name` 和 `color`，不要轻易改 `svg`。

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
friendLinkApplyFormat: "名称：RainierGu 的学习档案馆\n简介：...",
```

显示在 `/friends` 页面，方便别人复制你的友链信息。

### 4.15 知识地图等级系统

```ts
enableLevelSystem: false,
```

影响 `/tree` 页面里的等级/成就系统。如果你想开启更游戏化的等级统计，可以改成：

```ts
enableLevelSystem: true,
```

如果只是普通博客，保持 `false` 更清爽。

## 5. 页面逐个说明：看见什么，改哪里

### 5.1 全站外壳

| 页面元素 | 文件 | 怎么改 |
| --- | --- | --- |
| 全站字体 | `app/layout.tsx`、`app/globals.css` | 改 `next/font/google` 引入和 `body` class |
| 背景图片轮播 | `components/BackgroundSlider.tsx`、`siteConfig.bgImages` | 在 `siteConfig.ts` 改背景图数组 |
| 背景粒子/光效 | `components/BackgroundEffects.tsx` | 想关掉可在 `app/layout.tsx` 注释组件 |
| 顶部启动动画 | `components/SplashScreen.tsx` | 改头像、文案、动画逻辑 |
| 顶部导航栏 | `components/Navbar.tsx` | 改 `navLinks` 数组 |
| 左下主题按钮 | `components/FloatingThemeToggle.tsx` | 改悬浮位置、图标和明暗模式切换样式 |
| 右下 AI 小猫 | `components/CyberCat.tsx` | 改猫猫文案、按钮、位置、大小 |
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
  { name: '项目', href: '/projects' },
  { name: '归档', href: '/timeline' },
  { name: '照片墙', href: '/photowall' },
  { name: '音乐', href: '/music' },
  { name: '知识地图', href: '/tree' },
  { name: '说说', href: '/moments' },
  { name: '杂谈', href: '/chatter' },
  { name: '友链', href: '/friends' },
  { name: '关于', href: '/about' },
];
```

想隐藏某个导航项，就删除或注释那一行。

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
| 搜索框 | `components/SearchBar.tsx`，数据来自 `posts/` | 自动搜索文章标题、描述、标签 |
| 个人信息卡片 | `components/ProfileCard.tsx`，数据来自 `siteConfig.ts` | 改头像、昵称、简介、社交链接 |
| 音乐卡片 | `components/CloudPlayer.tsx`，歌曲来自 `cloudMusicIds` | 在 `siteConfig.ts` 填网易云歌曲 ID |
| 文章流 | `components/HomePostStream.tsx`，数据来自 `posts/` | 新文章会自动出现在这里 |
| 照片墙入口 | `data/albums.ts` 第一个相册 | 改第一个相册会影响首页大海报 |
| 杂谈轮播 | `components/LatestChatterCarousel.tsx`，数据来自 `chatters/` | 新杂谈会自动出现 |
| 主题切换 | `components/FloatingThemeToggle.tsx` | 左下悬浮按钮控制明暗主题 |
| 底部数据面板 | `components/SiteDashboard.tsx` | 显示运行时间、徽章、备案 |

首页文章顺序按 `date` 从新到旧排序。

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

### 5.6 杂谈页 `/chatter`

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

适合写很短的动态，类似朋友圈/微博。

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
siteConfig.ts -> cloudMusicIds
```

页面文件：

```text
app/music/page.tsx
app/music/MusicClient.tsx
components/MusicProvider.tsx
app/api/music/route.ts
```

当前音乐功能主要依赖网易云歌曲 ID。

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

页面文件：

```text
app/tree/page.tsx
app/tree/CreativeWorkshopClient.tsx
app/tree/AlchemyLab.tsx
app/tree/DijiangModel.tsx
```

数据来源：

- `posts/`
- `chatters/`
- `moments/`
- `data/albums.ts`
- `data/friends.ts`
- GitHub Issues 评论数据

这个页面偏“可视化/游戏化”。如果你只是写博客，不需要频繁改它。

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

文章模板：

```markdown
---
title: "文章标题"
date: "2026-08-03 20:00:00"
description: "一句话摘要，会出现在首页、搜索和归档里。"
cover: "/assets/img/posts/welcome.webp"
tags: ["物理", "笔记", "PDF"]
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
| `description` | 建议写 | 首页、搜索、归档摘要 |
| `cover` | 可选 | 文章封面，不写则用默认封面 |
| `tags` | 可选 | 标签，会影响搜索和归档 |

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

在 `chatters/` 里新建：

```text
chatters/2026-08-03-my-chatter.md
```

模板：

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
| `description` | 首页杂谈轮播摘要 |
| `cover` | 杂谈封面 |
| `tags` | 标签 |
| `mood` | 详情页展示心情 |

## 10. 如何写说说/动态

在 `moments/` 里新建：

```text
moments/moment-20260803.md
```

最简单模板：

```markdown
---
date: "2026-08-03 21:30:00"
---

今天更新了网站手册，感觉终于能自己慢慢维护这个小宇宙了。
```

带地点和图片的模板：

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

找到：

```ts
cloudMusicIds: [],
```

改成：

```ts
cloudMusicIds: ["1809646618", "1974443814"],
```

音乐会影响：

- 首页音乐卡片；
- 首页歌词栏；
- 桌面端右下/底部悬浮音乐播放器；
- `/music` 音乐馆页面。

如果没有配置歌曲，音乐组件会显示“请配置 cloudMusicIds”。

## 17. 如何配置 AI 小猫助手

相关文件：

```text
components/CyberCat.tsx
app/api/chat/route.ts
siteConfig.ts
docs/DEEPSEEK_AI.md
```

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

默认：

```ts
modelId: "deepseek-v4-flash",
```

更强但可能更贵：

```ts
modelId: "deepseek-v4-pro",
```

也可以在 Vercel 环境变量里设置：

```env
DEEPSEEK_MODEL=deepseek-v4-pro
```

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

评论系统使用 Gitalk，把评论存在 GitHub Issues。

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
NEXT_PUBLIC_GITALK_CLIENT_SECRET=你的 Client Secret
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

Vercel 环境变量：

```env
QWEATHER_KEY=你的和风天气 Token
```

当前城市写死为北京：

```ts
const locationId = "101010100"; // 北京
```

如果要换城市：

1. 查和风天气 Location ID。
2. 修改 `app/api/weather/route.ts` 里的 `locationId`。
3. 修改 `components/WeatherWidget.tsx` 里的城市显示文字，比如把 `北京市` 改成你的城市。

如果没有配置天气 key，组件会进入“模拟天气”模式，不影响网站访问。

## 20. 如何修改字体

全站字体主要在：

```text
app/layout.tsx
app/globals.css
```

现在 `app/layout.tsx` 里引入了：

```ts
import { Geist, Geist_Mono, Noto_Serif_SC } from "next/font/google";
```

`body` 使用了：

```tsx
className="... font-serif"
```

如果你只想改正文为无衬线字体，可以在 `app/globals.css` 里调整全局样式；如果要换 Google Font，需要：

1. 在 `app/layout.tsx` 引入新字体；
2. 定义字体变量；
3. 把变量加入 `<html className=...>`；
4. 在 `body` 或 CSS 中使用。

建议新手先保留当前字体，不要一次改太多。

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
http://localhost:3000/reading
```

## 23. 环境变量与密钥清单

不要把密钥写进 Git 仓库。`.env.local` 已被 `.gitignore` 忽略。

| 变量名 | 用途 | 是否要加 `NEXT_PUBLIC_` |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | AI 小猫助手 | 不要 |
| `DEEPSEEK_MODEL` | 可选，覆盖 DeepSeek 模型 | 不要 |
| `QWEATHER_KEY` | 天气接口 | 不要 |
| `NEXT_PUBLIC_GITALK_CLIENT_ID` | Gitalk 评论登录 | 需要 |
| `NEXT_PUBLIC_GITALK_CLIENT_SECRET` | Gitalk 评论登录 | 需要 |
| `NEXT_PUBLIC_GITALK_OWNER` | 评论仓库 owner | 需要 |
| `NEXT_PUBLIC_GITALK_REPO` | 评论仓库 repo | 需要 |
| `NEXT_PUBLIC_GITALK_ADMIN` | 评论管理员 | 需要 |

本地 `.env.local` 示例：

```env
DEEPSEEK_API_KEY=sk-xxx
QWEATHER_KEY=xxx
NEXT_PUBLIC_GITALK_CLIENT_ID=xxx
NEXT_PUBLIC_GITALK_CLIENT_SECRET=xxx
```

Vercel 也要配置同样的线上变量。

## 24. 常见修改任务速查

### 25.1 改网站名称

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

### 25.2 改头像

1. 上传图片到 `public/assets/img/avatar/`。
2. 修改 `siteConfig.ts`：

```ts
avatarUrl: "/assets/img/avatar/new-avatar.jpg",
faviconUrl: "/assets/img/avatar/new-avatar.jpg",
```

### 25.3 改首页背景

1. 上传图片到 `public/assets/img/backgrounds/`。
2. 修改：

```ts
bgImages: [
  "/assets/img/backgrounds/new-bg.webp",
],
```

### 25.4 添加文章

1. 在 `posts/` 新建 `.md`。
2. 写 front matter。
3. 上传封面/PDF 到 `public/assets/`。
4. `npm run build` 检查。
5. 提交、推送。

### 25.5 添加 PDF

1. 放到 `public/assets/files/某个目录/`。
2. 在文章里写下载链接或 `<iframe>`。

### 25.6 添加项目

改：

```text
data/projects.ts
```

### 25.7 添加友链

改：

```text
data/friends.ts
```

### 25.8 添加照片墙图片

1. 图片放 `public/assets/img/albums/`。
2. 改 `data/albums.ts`。

### 25.9 添加音乐

改：

```text
siteConfig.ts -> cloudMusicIds
```

### 25.10 改 AI 助手回答风格

改：

```text
siteConfig.ts -> geminiConfig.systemPrompt
```

### 25.11 改导航菜单

改：

```text
components/Navbar.tsx -> navLinks
```

### 25.12 改页面整体布局

优先看：

```text
app/page.tsx
app/layout.tsx
components/
```

## 25. 新手最容易踩的坑

### 26.1 图片路径写错

错误：

```text
public/assets/img/avatar/avatar.jpg
```

正确：

```text
/assets/img/avatar/avatar.jpg
```

### 26.2 Markdown front matter 格式错

开头和结尾都要有 `---`：

```markdown
---
title: "标题"
date: "2026-08-03"
---
```

### 26.3 数组末尾漏逗号

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

### 26.4 密钥写进代码

不要把 DeepSeek、天气、GitHub OAuth 密钥写进公开仓库。应该写在：

- 本地 `.env.local`
- Vercel Environment Variables

### 26.5 只改了本地，忘记部署

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

### 26.6 改完没有重启开发服务器

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

这样命名的好处是：链接稳定、跨系统不容易乱码、以后迁移也省心。

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
