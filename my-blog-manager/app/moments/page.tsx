import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Navbar from '../../components/Navbar';
import PageTransition from '../../components/PageTransition';
import MomentList from './MomentList';
import { siteConfig } from '../../siteConfig';

const MOMENTS_DIR = path.join(process.cwd(), 'moments');
const LEGACY_MOMENTS_DIR = path.join(process.cwd(), 'posts', 'moments');

export const metadata = {
  title: `说说 | ${siteConfig.title}`,
  description: '生活动态与瞬间记录',
};

function readMomentsFromDirectory(directoryPath: string) {
  if (!fs.existsSync(directoryPath)) return [];

  return fs
    .readdirSync(directoryPath)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(directoryPath, fileName);
      const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));

      return {
        id: fileName.replace(/\.md$/, ''),
        date: data.date || '1970-01-01',
        location: data.location || '',
        images: data.images || [],
        content: content.trim(),
      };
    });
}

export default function MomentsPage() {
  let allMoments: any[] = [];

  try {
    allMoments = [
      ...readMomentsFromDirectory(LEGACY_MOMENTS_DIR),
      ...readMomentsFromDirectory(MOMENTS_DIR),
    ];

    allMoments = Array.from(new Map(allMoments.map((item) => [item.id, item])).values()).sort((a, b) => {
      const timeA = new Date(String(a.date).replace(' ', 'T')).getTime();
      const timeB = new Date(String(b.date).replace(' ', 'T')).getTime();
      return (Number.isFinite(timeB) ? timeB : 0) - (Number.isFinite(timeA) ? timeA : 0);
    });
  } catch (e) {
    console.error('读取说说数据失败:', e);
  }

  return (
    <div className="min-h-screen relative pb-10 flex flex-col">
      <Navbar />
      <PageTransition className="flex-1 flex flex-col">
        <MomentList
          moments={allMoments}
          authorName={siteConfig.authorName}
          avatarUrl={siteConfig.avatarUrl}
        />
      </PageTransition>
    </div>
  );
}
