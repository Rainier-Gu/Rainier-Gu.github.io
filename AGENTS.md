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
