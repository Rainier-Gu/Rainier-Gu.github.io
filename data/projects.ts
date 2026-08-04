// 项目展示数据

export type Project = {
  id: string;
  name: string;
  description: string;
  icon: string;
  githubUrl: string;
  tags: string[];
};

export const projectsData: Project[] = [
  {
    id: "personal-homepage",
    name: "个人博客",
    githubUrl: "https://github.com/Rainier-Gu/Rainier-Gu.github.io",
    description: "使用 Next.js、React 和 Tailwind CSS 构建的个人主页，用来集中展示课程笔记、PDF 资料、项目、相册与碎片记录。",
    icon: "🖥️",
    tags: ["Next.js", "Blog", "Vercel"],
  },
  {
    id: "stupid-students",
    name: "今天你卖的是什么腿？",
    githubUrl: "https://stupid-students.pages.dev/",
    description: "姨姨 饿饿 腿腿🥹🥹🥹",
    icon: "🍗",
    tags: ["PKU", "THU", "鹅腿阿姨"],
  },
  {
    id: "daily-hot-hole",
    name: "每日热洞",
    githubUrl: "https://github.com/Rainier-Gu/DailyHotHole",
    description: "树洞洞友您好：基于《北大树洞管理规范》，我们删除了您的树洞，并禁言至 2099-12-31 23:59:59。希望您在未来的使用中，遵守各项行为规范和道德伦理，共同建设北大师生的网上家园。",
    icon: "🔥",
    tags: ["PKU", "hole"],
  },
  {
    id: "yan-yuan-card",
    name: "燕园账本",
    githubUrl: "https://pkucard.cc.cd/",
    description: "把北京大学校园卡流水转化为年度消费仪表盘：月度趋势、消费日历、常去地点、时段画像、余额轨迹、年度故事与可检索明细。",
    icon: "💰",
    tags: ["PKU", "card"],
  },
  {
    id: "timetable",
    name: "云边课表",
    githubUrl: "https://timetable-pwa.vercel.app/#/today",
    description: "这是一个基于 PWA 的课表应用，页面简洁，支持常规的课程导入导出等功能。",
    icon: "📅",
    tags: ["timetable", "class"],
  },
  {
    id: "medical-english-review",
    name: "医学英语复习网站",
    githubUrl: "https://medical-english.dizzyingrain.workers.dev/",
    description: "2026春季学期医学英语（lhy）期末重点复习。不过作者被正态了www 哭哭😭",
    icon: "📚",
    tags: ["medical", "english", "review"],
  },
];
