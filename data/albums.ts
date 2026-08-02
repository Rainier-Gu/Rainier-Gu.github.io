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
    id: "course-notes-covers",
    title: "课程笔记封面",
    description: "物理、经济学与科研写作相关内容的视觉入口。",
    cover: "/assets/img/posts/research-writing-cover.svg",
    date: "2026.07",
    photos: [
      { url: "/assets/img/posts/welcome.webp", caption: "博客首页欢迎图" },
      { url: "/assets/img/posts/computational-physics.webp", caption: "计算物理学笔记" },
      { url: "/assets/img/posts/general-physics-lab.webp", caption: "普通物理实验报告" },
      { url: "/assets/img/posts/mathematical-economics.webp", caption: "数理经济学笔记" },
      { url: "/assets/img/posts/intermediate-microeconomics.webp", caption: "中级微观经济学笔记" },
      { url: "/assets/img/posts/intermediate-macroeconomics.webp", caption: "中级宏观经济学笔记" },
      { url: "/assets/img/posts/research-writing-cover.svg", caption: "研究与写作封面" },
    ],
  },
];
