import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const imageRoot = path.join(process.cwd(), 'public', 'assets', 'img');
const thumbnailRoot = path.join(imageRoot, 'thumbnails');
const rasterImagePattern = /\.(?:jpe?g|png|webp)$/i;
const heroImages = new Set(['posts/Homepage1.png']);

async function collectImages(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const images = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (fullPath === thumbnailRoot) continue;
      images.push(...await collectImages(fullPath));
      continue;
    }

    if (rasterImagePattern.test(entry.name)) images.push(fullPath);
  }

  return images;
}

function outputPathFor(inputPath) {
  const relativePath = path.relative(imageRoot, inputPath);
  const parsedPath = path.parse(relativePath);
  return path.join(thumbnailRoot, parsedPath.dir, `${parsedPath.name}.webp`);
}

async function shouldRegenerate(inputPath, outputPath) {
  try {
    const [inputStats, outputStats] = await Promise.all([
      fs.stat(inputPath),
      fs.stat(outputPath),
    ]);
    return outputStats.mtimeMs < inputStats.mtimeMs;
  } catch {
    return true;
  }
}

const images = await collectImages(imageRoot);
let generatedCount = 0;
let skippedCount = 0;
let originalBytes = 0;
let thumbnailBytes = 0;

for (const inputPath of images) {
  const relativePath = path.relative(imageRoot, inputPath).replaceAll('\\', '/');
  const outputPath = outputPathFor(inputPath);
  const inputStats = await fs.stat(inputPath);
  originalBytes += inputStats.size;

  if (await shouldRegenerate(inputPath, outputPath)) {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await sharp(inputPath)
      .rotate()
      .resize({
        width: heroImages.has(relativePath) ? 1920 : 1200,
        withoutEnlargement: true,
      })
      .webp({ quality: 78, effort: 4, smartSubsample: true })
      .toFile(outputPath);
    generatedCount += 1;
  } else {
    skippedCount += 1;
  }

  thumbnailBytes += (await fs.stat(outputPath)).size;
}

const formatMegabytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

console.log(`缩略图完成：新生成 ${generatedCount} 张，跳过 ${skippedCount} 张。`);
console.log(`原图合计 ${formatMegabytes(originalBytes)}，缩略图合计 ${formatMegabytes(thumbnailBytes)}。`);
