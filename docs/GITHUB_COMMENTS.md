# GitHub 评论系统配置指南

本站已经接入 Gitalk。Gitalk 会把每个页面的评论保存为 GitHub Issues：

- 评论仓库：`Rainier-Gu/Rainier-Gu.github.io`
- 仓库拥有者：`Rainier-Gu`
- 管理员：`Rainier-Gu`
- 评论位置：文章页、杂谈页、关于页、友链页、音乐页、说说页

现在还差最后一步：在 GitHub 创建 OAuth App，并把 `Client ID` 和 `Client Secret` 填到 Vercel 环境变量里。

## 1. 确认 GitHub 仓库开启 Issues

打开：

```text
https://github.com/Rainier-Gu/Rainier-Gu.github.io/settings
```

找到 `Features`，确认 `Issues` 已勾选。

如果没开，Gitalk 无法为每篇文章创建评论 Issue。

## 2. 创建 GitHub OAuth App

打开 GitHub OAuth Apps 页面：

```text
https://github.com/settings/developers
```

依次点击：

```text
OAuth Apps -> New OAuth App
```

填写：

| 项目 | 填写内容 |
| --- | --- |
| Application name | `RainierGu Blog Comments` |
| Homepage URL | `https://rainiergu.vercel.app` |
| Application description | 可不填，或写 `Gitalk comments for RainierGu blog` |
| Authorization callback URL | `https://rainiergu.vercel.app/` |

注意：callback URL 建议带最后的 `/`。Gitalk 登录时会从文章页跳转回当前页面，GitHub 会按这个站点根路径做匹配。

创建完成后，复制：

- `Client ID`
- `Client Secret`

## 3. 在 Vercel 配置环境变量

打开 Vercel 项目：

```text
https://vercel.com/drizzlingrain/personal_page/settings/environment-variables
```

新增两个变量，环境选择 `Production`、`Preview`、`Development` 都勾上：

```text
NEXT_PUBLIC_GITALK_CLIENT_ID=你的 Client ID
NEXT_PUBLIC_GITALK_CLIENT_SECRET=你的 Client Secret
```

可选变量已经有默认值，一般不用填：

```text
NEXT_PUBLIC_GITALK_OWNER=Rainier-Gu
NEXT_PUBLIC_GITALK_REPO=Rainier-Gu.github.io
NEXT_PUBLIC_GITALK_ADMIN=Rainier-Gu
```

## 4. 重新部署

环境变量保存后，需要重新部署一次。

最简单做法：

```powershell
git commit --allow-empty -m "Redeploy with Gitalk env"
git push
```

也可以在 Vercel 的 Deployments 页面点击最新部署右侧菜单，选择 `Redeploy`。

## 5. 第一次初始化评论区

部署完成后：

1. 打开任意文章页，例如：

   ```text
   https://rainiergu.vercel.app/posts/welcome
   ```

2. 滚到评论区，点击 GitHub 登录。
3. 用 GitHub 账号授权。
4. 如果页面提示初始化 Issue，点击初始化。

之后每个页面都会对应一个 GitHub Issue，读者评论会保存在该 Issue 下。

## 6. 常见问题

### 评论区仍显示“尚未配置”

说明 Vercel 没读到环境变量。检查：

- 变量名是否完全一致。
- 是否勾选了 Production。
- 配置后是否重新部署。

### 登录 GitHub 后跳回页面但评论没出现

检查 OAuth App 的 `Authorization callback URL` 是否是：

```text
https://rainiergu.vercel.app/
```

如果你以后换主域名，也要同步修改这个 callback URL。

### 第一次评论提示没有 Issue

这是正常的。站长本人登录后，Gitalk 会为当前页面创建对应 Issue。

### Client Secret 要不要保密？

Gitalk 的工作方式决定了 OAuth App 的 `Client Secret` 最终会进入前端代码，所以它不适合作为高安全密钥使用。这里采用 Vercel 环境变量，是为了避免把它直接提交到 GitHub 仓库；但浏览器端仍可能看到它。

如果你以后想要更少暴露凭证的方案，可以改用 Giscus（GitHub Discussions）或 Utterances（GitHub Issues App）。
