export interface Friend {
  id: string;
  name: string;
  url: string;
  description: string;
  avatar: string;
  themeColor: string;
}

export const friendsData: Friend[] = [
  {
    id: "xhblogs-template",
    name: "XHBlogs 模板",
    description: "当前主页使用的 Next.js 毛玻璃风格博客模板。",
    avatar: "/assets/img/posts/research-writing-cover.svg",
    url: "https://github.com/heiehiehi/XinghuisamaBlogs",
    themeColor: "rgba(99, 102, 241, 0.45)",
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "当前 Next.js 主页的主要部署平台，并提供 Web Analytics 统计。",
    avatar: "/vercel.svg",
    url: "https://vercel.com/",
    themeColor: "rgba(15, 23, 42, 0.45)",
  },
];
