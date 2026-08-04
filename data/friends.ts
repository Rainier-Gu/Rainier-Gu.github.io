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
    id: "vercel",
    name: "Vercel",
    description: "当前 Next.js 主页的主要部署平台，并提供 Web Analytics 统计。",
    avatar: "/vercel.svg",
    url: "https://vercel.com/",
    themeColor: "rgba(15, 23, 42, 0.45)",
  },
];
