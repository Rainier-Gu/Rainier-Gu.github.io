# Vercel 访客与浏览量统计

本项目已开启 Vercel Web Analytics，用来统计网站的 visitors 和 page views。

## 已完成的配置

1. Vercel 项目 `personal_page` 已通过 Vercel CLI 开启 Web Analytics。
2. `_config.vercel.yml` 中添加了 Vercel 专用开关：

   ```yaml
   vercel:
     web_analytics: true
   ```

3. `_includes/metadata-hook.html` 会在 Vercel 构建时输出统计脚本：

   ```html
   <script defer src="/_vercel/insights/script.js"></script>
   ```

## 为什么只在 Vercel 开启？

这个博客也可以部署到 GitHub Pages。Vercel Web Analytics 的脚本只适用于 Vercel 部署环境，所以项目把它放在 `_config.vercel.yml` 控制下：

- Vercel 构建：加载统计脚本；
- GitHub Pages 构建：不加载统计脚本。

## 去哪里看数据？

进入 Vercel Dashboard：

1. 打开项目 `personal_page`；
2. 进入 **Analytics**；
3. 查看 visitors、page views、top pages、referrers 等数据。

新部署完成后，Vercel 才会开始记录数据。刚开启时没有历史数据是正常的。

## 如何关闭？

如果以后想关闭网站端统计脚本，把 `_config.vercel.yml` 里的开关改成：

```yaml
vercel:
  web_analytics: false
```

如果想彻底关闭 Vercel 侧统计，需要进入 Vercel Dashboard 的项目 Analytics 设置中关闭。
