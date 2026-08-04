export interface Photo {
  url: string;
  caption?: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  cover: string;
  date: string;
  photos: Photo[];
}

export const albums: Album[] = [
  {
    id: "晨昏蒙影",
    title: "晨昏蒙影",
    description: "捕捉日出与日落的光影之美",
    cover: "/assets/img/posts/晨昏蒙影/天安门.jpg",
    date: "2026.07",
    photos: [
      { url: "/assets/img/posts/晨昏蒙影/老电视塔.jpg", caption: "2025.08 摄于玉渊潭公园" },
      { url: "/assets/img/posts/晨昏蒙影/天安门.jpg", caption: "2025.08 摄于天安门" },
      { url: "/assets/img/posts/晨昏蒙影/地平线.png", caption: "2026.07 摄于南苑湿地森林公园" },
      { url: "/assets/img/posts/晨昏蒙影/国贸CBD.jpg", caption: "2026.07 摄于南苑湿地森林公园" },
      { url: "/assets/img/posts/晨昏蒙影/飞机.jpg", caption: "2026.07 摄于南苑湿地森林公园" },
      { url: "/assets/img/posts/晨昏蒙影/博雅塔.png", caption: "2026.07 摄于北京大学未名湖" },
    ],
  },
];
