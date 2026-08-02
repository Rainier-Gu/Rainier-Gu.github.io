// siteConfig.ts - 全站展示配置中心

export const siteConfig = {
  title: "RainierGu 的学习档案馆",
  faviconUrl: "/assets/img/avatar/avatar.jpg",
  authorName: "RainierGu",
  bio: "记录物理课程、经济学笔记、科研学习、技术实践与项目进展。这里会尽量保存推导、尝试、失败路径和可复用资料。",

  navTitle: "RainierGu",
  navSuffix: "·",
  navAfter: "Learning Archive",

  avatarUrl: "/assets/img/avatar/avatar.jpg",

  useGradient: false,
  themeColors: ["#0f172a", "#312e81", "#0f766e", "#0369a1"],
  bgImages: [
    "/assets/img/posts/welcome.webp",
    "/assets/img/posts/research-writing-cover.svg",
    "/assets/img/posts/computational-physics.webp",
    "/assets/img/posts/general-physics-lab.webp",
  ],

  defaultPostCover: "/assets/img/posts/research-writing-cover.svg",
  photoWallImage: "/assets/img/posts/general-physics-lab.webp",

  // 可在网易云音乐网页地址中复制歌曲 id 后填入，例如 ["1809646618"]。
  cloudMusicIds: [],

  social: {
    github: "https://github.com/Rainier-Gu",
    gitee: "",
    google: "",
    email: "",
    qq: "",
    wechat: "",
  },

  counts: {
    photos: 7,
  },

  chatterTitle: "研究与生活札记",
  chatterDescription: "课程、科研、代码、阅读和一些短想法的碎片记录。",

  danmakuList: [
    "今天也要认真推导",
    "PDF 资料库加载中",
    "实验报告请合理参考",
    "计算物理启动！",
    "经济学模型正在收敛",
    "代码和公式都要写清楚",
    "欢迎来到学习档案馆",
  ],

  gitalkConfig: {
    clientID: "",
    clientSecret: "",
    repo: "Rainier-Gu.github.io",
    owner: "Rainier-Gu",
    admin: ["Rainier-Gu"],
  },

  buildDate: "2026-07-08T00:00:00+08:00",

  footerBadges: [
    {
      name: "Next.js",
      color: "text-sky-500",
      svg: "<path d=\"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z\"/>",
    },
    {
      name: "React",
      color: "text-cyan-400",
      svg: "<path d=\"M12 10.5A1.5 1.5 0 1 0 12 13.5 1.5 1.5 0 0 0 12 10.5Zm0-8.5c2.2 0 4.2 4.5 4.2 10s-2 10-4.2 10S7.8 17.5 7.8 12 9.8 2 12 2Zm0 2c-.8 0-2.2 3.1-2.2 8s1.4 8 2.2 8 2.2-3.1 2.2-8S12.8 4 12 4Z\"/>",
    },
    {
      name: "Tailwind",
      color: "text-teal-400",
      svg: "<path d=\"M12 6c-3 0-4.9 1.5-5.7 4.4 1.1-1.5 2.4-2 3.9-1.7.8.2 1.4.8 2.1 1.5 1.1 1.1 2.4 2.4 5.2 2.4 3 0 4.9-1.5 5.7-4.4-1.1 1.5-2.4 2-3.9 1.7-.8-.2-1.4-.8-2.1-1.5C16.1 7.3 14.8 6 12 6ZM6.5 12.6c-3 0-4.9 1.5-5.7 4.4 1.1-1.5 2.4-2 3.9-1.7.8.2 1.4.8 2.1 1.5 1.1 1.1 2.4 2.4 5.2 2.4 3 0 4.9-1.5 5.7-4.4-1.1 1.5-2.4 2-3.9 1.7-.8-.2-1.4-.8-2.1-1.5-1.1-1.1-2.4-2.4-5.2-2.4Z\"/>",
    },
  ],

  icpConfig: null,

  geminiConfig: {
    modelId: "deepseek-v4-flash",
    systemPrompt:
      "你是 RainierGu 个人主页里的学习助手。回答要简洁、友好、偏学术笔记风格；如果问题涉及本站资料，请提醒用户核对原文和 PDF。",
    maxOutputTokens: 180,
    temperature: 0.75,
  },

  friendLinkApplyFormat:
    "名称：RainierGu 的学习档案馆\n简介：记录物理、经济学、科研学习与技术实践\n链接：https://rainiergu.vercel.app\n头像：https://rainiergu.vercel.app/assets/img/avatar/avatar.jpg",

  enableLevelSystem: false,
};
