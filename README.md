# RainierGu

基于 [Jekyll](https://jekyllrb.com/) 与 [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) 的个人学术/技术博客，内容包括物理课程笔记、科研学习记录、技术文章与项目展示。

当前仓库为 `RainierGu/RainierGu.github.io`，GitHub Pages 地址按用户站点配置为：

<https://rainiergu.github.io/>

## 技术栈

- Jekyll + Chirpy 7.6
- Ruby 3.4（只在容器和 GitHub Actions 中运行）
- Docker Compose + VS Code Dev Containers
- GitHub Actions + GitHub Pages

## 为什么使用 Docker

Windows 主机只需要 Git、Docker Desktop、VS Code 和 Dev Containers 扩展。Ruby、Bundler、Jekyll 及项目依赖全部留在容器内，gems 使用 Docker named volume 缓存，不向仓库写入 `vendor/`。项目当前没有 Node 依赖；将来若引入，`node_modules/` 也不得提交。

## Windows 本地开发

```powershell
git clone https://github.com/RainierGu/RainierGu.github.io.git
cd RainierGu.github.io
docker compose up --build
```

浏览器访问 <http://localhost:4000/>。首次构建需要下载镜像和 gems，之后会复用 `bundle-cache` volume。

也可以运行：

```powershell
.\scripts\dev.ps1
```

停止前台服务按 `Ctrl+C`，然后清理容器：

```powershell
docker compose down
```

进入正在运行的容器：

```powershell
docker compose exec site bash
```

服务尚未运行时，启动一次性 shell：

```powershell
docker compose run --rm site bash
```

## 使用 Dev Container

1. 用 VS Code 打开仓库。
2. 安装 Microsoft 的 Dev Containers 扩展。
3. 执行命令面板中的 **Dev Containers: Reopen in Container**。
4. 容器创建完成后，在终端运行：

   ```bash
   bundle exec jekyll serve --host 0.0.0.0 --port 4000 --livereload --force_polling
   ```

Dev Container 与 Compose 共用同一份 `Dockerfile`、服务定义和 gem 缓存。

## 常用命令

```powershell
# 启动开发服务器
docker compose up --build

# 查看日志
docker compose logs -f site

# 生产构建，输出到 _site/
.\scripts\build.ps1

# 仅清理安全的本地构建缓存
.\scripts\clean.ps1

# 删除容器；保留 gem 缓存
docker compose down

# 连同 gem 缓存一起删除（下次需重新下载依赖）
docker compose down --volumes
```

不要在 Windows 主机执行 `bundle install`、`gem install`、`jekyll` 或 `npm install`。

## 新建文章

在 `_posts/` 创建 `YYYY-MM-DD-english-slug.md`：

```yaml
---
title: 文章标题
date: 2026-07-08 20:00:00 +0800
categories: [物理, 课程笔记]
tags: [力学, 推导]
description: 一句话摘要。
math: true       # 使用公式时添加
mermaid: true    # 使用 Mermaid 时添加
---
```

行内公式统一写为 `\(...\)`，行间公式使用 `$$...$$`，不使用单美元符号行内公式。图片放在 `assets/img/posts/`。

## 站点配置

个人信息集中在 `_config.yml`、`_data/contact.yml` 与 `_tabs/about.md`：

- `title`、`tagline`、`description`：站点文案；
- `url`：协议加域名，不以 `/` 结尾；
- `baseurl`：当前用户站点为根路径，保持空字符串；
- `github.username`、`social`：署名与社交链接；
- `avatar`：头像路径；
- `comments.provider` 与 `analytics`：目前留空关闭，配置完整后再启用。

修改 `_config.yml` 后应重启开发服务器。第一次维护网站建议阅读 [新手操作手册](docs/BEGINNER_GUIDE.md)，项目约定见 [开发规范](docs/DEVELOPMENT_STANDARDS.md)。

## 生产构建

```powershell
.\scripts\build.ps1
```

该脚本构建 Docker 镜像，在容器中按 `_config.yml` 的 `baseurl` 生成生产站点，并运行 HTML 链接检查。当前产物位于 `_site/`，整个 `_site/` 目录只用于检查，不提交 Git。

## 部署到 GitHub Pages

`.github/workflows/pages-deploy.yml` 会在 `main` 分支收到 push 时构建、校验并部署 `_site`，也支持在 Actions 页面手动运行。无需创建 `gh-pages` 分支。

首次部署需要在 GitHub 网页完成：

1. 打开仓库 **Settings → Pages**。
2. 在 **Build and deployment → Source** 选择 **GitHub Actions**。
3. 确认仓库允许 Actions 运行；推送到 `main` 后查看 **Actions** 页面。
4. 部署成功后访问 <https://rainiergu.github.io/>。

如绑定自定义域名，在 Pages 设置中填写域名，再将 `_config.yml` 的 `url` 改成新域名，并保持 `baseurl` 为空；然后按 GitHub 指引配置 DNS。不要提交 DNS 服务商 token 或其他凭据。

## 常见问题

- **提示 `docker` 不是命令**：Docker Desktop 安装后重新打开 PowerShell/VS Code，让新的 `PATH` 生效。
- **Docker Hub 或 RubyGems 连接超时**：不要把代理写入仓库。若本机代理监听 `127.0.0.1:7897`，可仅在当前 PowerShell 会话执行：

  ```powershell
  $env:HTTP_PROXY = "http://127.0.0.1:7897"
  $env:HTTPS_PROXY = "http://127.0.0.1:7897"
  docker pull ruby:3.4-bookworm
  docker compose build --build-arg HTTP_PROXY=http://host.docker.internal:7897 --build-arg HTTPS_PROXY=http://host.docker.internal:7897
  ```

  构建完成后可运行 `Remove-Item Env:HTTP_PROXY, Env:HTTPS_PROXY` 清除本会话变量。
- **页面打开但样式丢失**：核对 `url` 与 `baseurl`；当前用户站点必须保持 `baseurl: ""`。
- **Windows 修改文件后不刷新**：确认命令包含 `--force_polling`，并暴露了 35729 端口。
- **端口 4000 被占用**：停止占用程序，或临时修改 `compose.yaml` 左侧宿主机端口。
- **依赖状态异常**：运行 `docker compose down --volumes` 后重新 `docker compose up --build`。
- **Actions 的 Bundler 平台错误**：在容器中运行 `bundle lock --add-platform x86_64-linux` 并提交更新后的 `Gemfile.lock`。
- **配置修改未生效**：`_config.yml` 不会被 Jekyll 热重载，重启 Compose 服务。

## 目录说明

```text
_posts/                 博客文章
_tabs/                  关于、分类、标签、归档页面
assets/img/             头像、文章图片与站点图标
.devcontainer/          VS Code Dev Container 配置
.github/workflows/      GitHub Pages 自动部署
docs/                   可复用的开发规范
scripts/                Windows PowerShell 辅助脚本
```
