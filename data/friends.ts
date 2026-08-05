export interface Friend {
  id: string;
  name: string;
  url: string;
  description: string;
  avatar: string;
  themeColor: string;
  badge?: string;
}

export const friendsData: Friend[] = [
  {
    id: "vercel",
    name: "Vercel",
    description: "当前 Next.js 主页的主要部署平台，并提供 Web Analytics 统计。",
    avatar: "/vercel.svg",
    url: "https://vercel.com/",
    themeColor: "rgba(15, 23, 42, 0.45)",
    badge: "部署服务",
  },
  {
    id: "xinghuisama-blogs",
    name: "XinghuisamaBlogs",
    description: "本站基于这套 Next.js 毛玻璃博客模板改造，并在此基础上持续完善。",
    avatar: "/assets/img/friends/xinghuisama-blogs.svg",
    url: "https://github.com/heiehiehi/XinghuisamaBlogs",
    themeColor: "rgba(99, 102, 241, 0.45)",
    badge: "基础模板",
  },
  {
    id: "fuquan99666",
    name: "zzz~",
    description: "not one, not two, not seven ~~",
    avatar: "https://fuquan99666.github.io/avatar.png",
    url: "https://fuquan99666.github.io",
    themeColor: "",
    badge: "",
  },
];
