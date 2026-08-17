# Codex project notes

This repository is RainierGu's personal homepage.

## Stack

- Frontend: Next.js + React + Tailwind CSS
- Primary hosting: Vercel

## Important conventions

- Do not commit secrets. Use Vercel environment variables for API keys.
- Static images and PDFs belong under `public/assets/`.
- Articles live in `posts/`.
- Chatter notes live in `chatters/`.
- Moments live in `moments/`.
- Global homepage configuration lives in `siteConfig.ts`.

## Deployment

Use Vercel for production because this project uses Next.js API routes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
