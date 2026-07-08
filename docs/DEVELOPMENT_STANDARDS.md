# Chirpy 个人博客开发规范

本规范用于当前博客及后续同类 Jekyll/Chirpy 项目。目标是保持内容可维护、构建可复现，并避免污染 Windows 主机环境。

## 1. 环境边界

1. Windows 主机只安装 Git、Docker Desktop、VS Code 与 Dev Containers 扩展。
2. Ruby、Bundler、Jekyll、Node.js 和项目依赖只能在 Docker 容器中运行。
3. 禁止在主机执行 `gem install`、`bundle install`、`jekyll`、`npm install -g` 等命令。
4. gems 使用 Docker named volume；`vendor/`、`node_modules/`、`_site/` 和 `.jekyll-cache/` 不得提交。
5. 不修改用户全局环境变量，不把 token、`.env`、私钥或 GitHub 凭据写入仓库。

## 2. 配置单一来源

- 站点标题、URL、GitHub 用户名、署名和社交主页统一维护在 `_config.yml`。
- 联系入口维护在 `_data/contact.yml`，个人介绍维护在 `_tabs/about.md`。
- 不在文章、布局或多个数据文件中重复硬编码用户名和域名。
- 用户主页仓库 `<username>.github.io` 使用 `baseurl: ""`；项目站点使用 `baseurl: "/<repo>"`。
- 评论和统计默认关闭；只有在 provider、仓库 ID 或统计 ID 完整配置后才启用。

## 3. 文章规范

- 文件名使用 `YYYY-MM-DD-english-slug.md`，slug 使用小写字母与连字符。
- `date` 明确写出 `+0800` 时区；至少提供 `title`、`date`、`categories`、`tags`、`description`。
- 分类保持两级以内，标签使用稳定、可复用的术语，避免同义词并存。
- 使用公式时声明 `math: true`，使用 Mermaid 时声明 `mermaid: true`。
- 行内公式写作 `\(...\)`，行间公式写作 `$$...$$`；禁止单美元符号行内公式。
- 代码块必须标注语言；命令示例注明运行位置（主机或容器）。
- 科研记录应区分事实、推断与待验证问题，并保留软件版本、参数和数据来源。
- 引用外部资料时提供作者、标题、年份与 DOI/稳定 URL，不复制大段受版权保护的正文。

## 4. 图片与静态资源

- 头像放在 `assets/img/avatar/`，文章图片放在 `assets/img/posts/`，favicon 放在 `assets/img/favicons/`。
- 文件名使用小写英文、数字和连字符；避免空格、中文文件名和无意义的 `image1`。
- 优先使用 WebP、压缩后的 PNG/JPEG 或简洁 SVG；提交前删除 EXIF 等隐私元数据。
- Markdown 图片必须有描述性 alt 文本。引用站内资源时使用 `/assets/...` 路径，由 Chirpy 处理站点前缀。
- 单张图片原则上不超过 1 MiB；确有必要时在文章中说明原因。

## 5. 代码与配置变更

- 优先通过 Gemfile 升级 `jekyll-theme-chirpy`，不要复制完整主题源码到仓库。
- 覆盖主题文件前先确认 Gem 提供的配置或数据文件无法满足需求，并在提交中解释原因。
- YAML 使用两个空格缩进；Markdown 保持标题层级连续；文本文件使用 UTF-8 与 LF。
- `Gemfile.lock` 应提交并包含 `x86_64-linux` 平台，以保证 Docker 和 Actions 构建一致。
- 若引入 Node 工具，应提交对应 lockfile，但继续忽略 `node_modules/`，安装过程只能发生在容器内。
- PowerShell 脚本设置 `$ErrorActionPreference = "Stop"`，检查外部命令退出码，不修改全局软件或环境变量。

## 6. 分支、提交与发布

- `main` 始终保持可构建；较大改动使用短生命周期分支。
- 提交应围绕单一目的，信息说明“改了什么”和“为什么”。不要提交 `_site` 或手工维护 `gh-pages`。
- 发布由 `.github/workflows/pages-deploy.yml` 完成，权限保持最小集合：`contents: read`、`pages: write`、`id-token: write`。
- 自定义域名启用前同时核对 Pages 设置、DNS、`url` 和 `baseurl`；凭据只能放在 GitHub Secrets。

## 7. 变更验证清单

提交前至少完成：

```powershell
# 容器内生产构建
.\scripts\build.ps1

# 查看未追踪文件，确认没有缓存和凭据
git status --short
```

并人工检查：

- 首页、文章、分类、标签、归档和关于页可打开；
- 数学公式、代码高亮、图片和 Mermaid 正常显示；
- 窄屏与宽屏布局无明显溢出；
- `url`、`baseurl`、文章日期和内部链接正确；
- `_site/`、缓存、依赖目录和本地密钥未进入 Git 变更。

## 8. Chirpy 升级流程

1. 阅读 Chirpy 与 Chirpy Starter 的发布说明，确认 Ruby/Jekyll 要求。
2. 在独立分支更新 Gemfile 中的主题版本。
3. 只在容器内执行 `bundle update jekyll-theme-chirpy` 和 `bundle lock --add-platform x86_64-linux`。
4. 对比官方 Starter 的 `_config.yml`、workflow 与必要插件，把新增配置有选择地合入。
5. 完成生产构建和页面抽查后再合并；不要用完整主题仓库覆盖本站内容。

## 9. 新文章最小模板

```yaml
---
title: 文章标题
date: YYYY-MM-DD HH:MM:SS +0800
categories: [一级分类, 二级分类]
tags: [标签一, 标签二]
description: 一句话摘要。
math: false
mermaid: false
---
```

规范如需调整，应修改本文档并在 README 中保持命令与实际文件一致。
