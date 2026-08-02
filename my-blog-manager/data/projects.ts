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
    name: "个人主页与学习档案馆",
    githubUrl: "https://github.com/Rainier-Gu/Rainier-Gu.github.io",
    description: "基于 XHBlogs 模板改造的个人主页，用来集中展示课程笔记、PDF 资料、项目、相册与碎片记录。",
    icon: "🌧️",
    tags: ["Next.js", "Blog", "Vercel"],
  },
  {
    id: "computational-physics-notes",
    name: "计算物理学笔记",
    githubUrl: "https://rainiergu.vercel.app/posts/computational-physics-notes",
    description: "整理计算物理课程中的数值方法、方程求解、蒙特卡洛、机器学习等内容，并提供 PDF 版本。",
    icon: "🧮",
    tags: ["Physics", "Numerical Methods", "PDF"],
  },
  {
    id: "physics-lab-reports",
    name: "普通物理实验报告资料库",
    githubUrl: "https://rainiergu.vercel.app/posts/general-physics-lab-reports",
    description: "归档普通物理实验报告 PDF，覆盖力学、声学、电磁学、光学、低温与近代物理实验。",
    icon: "🔬",
    tags: ["Physics Lab", "Reports", "Archive"],
  },
];
