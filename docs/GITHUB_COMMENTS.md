# GitHub 评论系统配置指南

评论保存在 GitHub Issues 中。浏览器只接收公开的 OAuth `Client ID`；`Client Secret` 和用户访问令牌只在服务端使用，访问令牌保存在加密的 HttpOnly Cookie 中。

- 评论仓库：`Rainier-Gu/Rainier-Gu.github.io`
- 仓库拥有者：`Rainier-Gu`
- 管理员：`Rainier-Gu`
- 兼容旧评论：继续使用 `Gitalk` 和页面 ID 两个 Issue 标签

## 1. 开启 Issues

打开仓库 Settings，在 `Features` 中确认 `Issues` 已勾选。

## 2. 创建 GitHub OAuth App

打开 `https://github.com/settings/developers`，选择 `OAuth Apps -> New OAuth App`：

| 项目 | 填写内容 |
| --- | --- |
| Application name | `RainierGu Blog Comments` |
| Homepage URL | `https://rainiergu.vercel.app` |
| Authorization callback URL | `https://rainiergu.vercel.app/` |

Callback URL 使用站点根路径。登录时应用会带上当前评论页面作为同域子路径，并使用随机 `state` 防止登录 CSRF。

## 3. 配置 Vercel 环境变量

```env
NEXT_PUBLIC_GITALK_CLIENT_ID=你的 Client ID
GITALK_CLIENT_SECRET=你的 Client Secret
NEXT_PUBLIC_GITALK_OWNER=Rainier-Gu
NEXT_PUBLIC_GITALK_REPO=Rainier-Gu.github.io
NEXT_PUBLIC_GITALK_ADMIN=Rainier-Gu
```

只有 `Client ID`、仓库名和管理员名可以带 `NEXT_PUBLIC_`。`GITALK_CLIENT_SECRET` 绝不能带这个前缀，也不要写进 `siteConfig.ts` 或提交到 Git。

如果旧部署曾使用 `NEXT_PUBLIC_GITALK_CLIENT_SECRET`，请在 GitHub OAuth App 设置中立即生成新 Secret、删除旧 Secret，再把新值保存为 `GITALK_CLIENT_SECRET`。

可选：配置只读或最小权限的服务端 GitHub Token，可提高匿名读取评论时的 API 限额。

```env
GITHUB_COMMENTS_TOKEN=可选的服务端 Token
```

## 4. 重新部署并初始化

保存环境变量后重新部署。打开任意评论页，用管理员 GitHub 账号登录并发表第一条评论；服务端会创建对应 Issue 和标签。非管理员不能创建新讨论，但可以在已经初始化的讨论中评论。

## 5. 安全说明

- OAuth `state` 会在服务端校验，有效期 10 分钟。
- GitHub 用户令牌使用 AES-GCM 加密后存入 `HttpOnly`、`SameSite=Lax` Cookie，有效期 7 天。
- 评论提交只接受同源 JSON 请求，并有长度限制和限流。
- 评论正文按纯文本渲染，不执行 GitHub 评论中的 HTML。
- 更换 `GITALK_CLIENT_SECRET` 会自动使已有登录会话失效。
