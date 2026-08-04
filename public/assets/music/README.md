# 本地音乐素材目录

这个目录用于存放网站音乐播放器使用的本地音频、歌词和封面。

推荐结构：

```text
public/assets/music/
  tracks/   音频文件，例如 song-name.mp3
  lyrics/   LRC 歌词文件，例如 song-name.lrc
  covers/   歌曲封面，例如 song-name.webp
```

在 `siteConfig.ts` 中配置时，不要写 `public`，直接从 `/assets/music/` 开始：

```ts
{
  id: "song-name",
  title: "歌曲名",
  artist: "歌手名",
  cover: "/assets/music/covers/song-name.webp",
  src: "/assets/music/tracks/song-name.mp3",
  lrcUrl: "/assets/music/lyrics/song-name.lrc",
}
```

LRC 歌词示例：

```lrc
[00:00.00]歌曲名
[00:12.30]第一句歌词
[00:16.80]第二句歌词
```

建议文件名使用英文小写和短横线，例如 `blue-night.mp3`，避免空格、中文标点和特殊符号。
