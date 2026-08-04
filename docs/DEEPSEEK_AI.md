# DeepSeek AI 猫猫助手接入指南

本站的 AI 猫猫助手入口在 `components/CyberCat.tsx`，真正调用模型的服务端接口在 `app/api/chat/route.ts`。

现在接口已经切换为 DeepSeek 的 OpenAI 兼容 Chat Completions 调用方式：

- API 地址：`https://api.deepseek.com/chat/completions`
- 默认模型：`deepseek-v4-flash`
- 可选模型：`deepseek-v4-pro`
- 必需环境变量：`DEEPSEEK_API_KEY`
- 可选环境变量：`DEEPSEEK_MODEL`

## 1. 申请 DeepSeek API Key

打开 DeepSeek 平台：

```text
https://platform.deepseek.com/api_keys
```

创建一个新的 API Key，复制保存。

注意：API Key 只显示一次，不要发到公开仓库，也不要写进 `siteConfig.ts`。

## 2. 本地开发环境配置

在项目根目录的 `.env.local` 里添加：

```env
DEEPSEEK_API_KEY=你的 DeepSeek API Key
```

如果想强制指定模型，也可以添加：

```env
DEEPSEEK_MODEL=deepseek-v4-flash
```

通常不需要设置 `DEEPSEEK_MODEL`，因为 `siteConfig.ts` 已经默认使用 `deepseek-v4-flash`。

千万不要写成：

```env
NEXT_PUBLIC_DEEPSEEK_API_KEY=xxx
```

带 `NEXT_PUBLIC_` 的变量会暴露给浏览器，模型密钥不应该公开。

## 3. Vercel 线上环境配置

进入 Vercel 项目：

```text
personal_page → Settings → Environment Variables
```

添加：

```env
DEEPSEEK_API_KEY=你的 DeepSeek API Key
```

建议至少勾选：

- Production
- Preview

如果之后想切换模型，可以再添加：

```env
DEEPSEEK_MODEL=deepseek-v4-pro
```

不添加 `DEEPSEEK_MODEL` 时，网站会使用 `siteConfig.ts` 里的默认模型。

## 4. 本地测试

安装依赖后运行：

```powershell
npm run build
npm run dev
```

打开：

```text
http://localhost:4000
```

点击右下角猫猫的聊天按钮，发送一句话测试。

也可以直接检查接口状态：

```text
http://localhost:4000/api/chat
```

如果显示：

```json
{
  "status": "Ready",
  "provider": "DeepSeek",
  "model": "deepseek-v4-flash"
}
```

说明接口已经切到 DeepSeek。

## 5. 常见问题

### 提示 `DEEPSEEK_API_KEY is not configured on the server`

说明本地或 Vercel 没有配置 `DEEPSEEK_API_KEY`。

本地检查 `.env.local`，线上检查 Vercel Environment Variables。

### 本地可以用，线上不能用

通常是 Vercel 没有配置环境变量，或者配置后没有重新部署。

解决方法：

1. 在 Vercel 添加 `DEEPSEEK_API_KEY`
2. 重新部署 Production
3. 打开浏览器无痕窗口再测试

### 想换更强模型

把 `siteConfig.ts` 里的：

```ts
modelId: "deepseek-v4-flash"
```

改成：

```ts
modelId: "deepseek-v4-pro"
```

或者不改代码，直接在 Vercel 添加：

```env
DEEPSEEK_MODEL=deepseek-v4-pro
```

后者更适合临时切换。
