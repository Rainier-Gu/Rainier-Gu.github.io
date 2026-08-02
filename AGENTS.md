# Codex project notes

This repository is RainierGu's personal homepage.

## Stack

- Frontend: Next.js + React + Tailwind CSS
- Primary hosting: Vercel
- Local CMS/admin: `my-blog-manager/`

## Important conventions

- Do not commit secrets. Use Vercel environment variables for API keys.
- Static images and PDFs belong under `public/assets/`.
- Articles live in `posts/`.
- Chatter notes live in `chatters/`.
- Moments live in `moments/`.
- Global homepage configuration lives in `siteConfig.ts`.
- When changing public-facing content, keep matching data in `my-blog-manager/` in sync if the local manager should show the same content.

## Deployment

GitHub Pages is no longer the primary deployment target because this template uses Next.js API routes.
Use Vercel for production.
