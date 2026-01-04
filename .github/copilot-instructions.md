# Repo guide for AI coding agents

This file gives concise, actionable context for editing and running this monorepo.

- **Big picture:** This is a pnpm monorepo with two primary apps:
  - `apps/studio` — a Sanity Content Studio (Sanity v5). Schemas live in `apps/studio/schemaTypes` and the desk layout is under `apps/studio/structure`.
  - `apps/web` — a Next.js app (App Router) in `apps/web/src/app`. Pages use dynamic routes (example: `app/events/[slug]/page.tsx`).

- **How to run locally:** Node >= 20 and pnpm >= 10 are required (see root `package.json`). Common commands:
  - Start both apps in parallel from the repo root: `pnpm dev` (runs `pnpm run --parallel dev`).
  - Start only the web app: `pnpm --filter web dev` (runs `next dev`).
  - Start only the studio: `pnpm --filter studio dev` (runs `sanity dev`).
  - Build both: `pnpm build`. Per-app builds: `pnpm --filter web build` or `pnpm --filter studio build`.

- **Sanity-specific notes (apps/studio):**
  - Schema pattern: files export typed constants and are aggregated in `apps/studio/schemaTypes/index.ts`. Example: `apps/studio/schemaTypes/artistType.ts` uses `defineType`/`defineField`.
  - Custom desk structure sits in `apps/studio/structure` (see `structure/index.ts` and `defaultDocumentNode.ts`). Use those when adding or changing document lists or filters.
  - Config: `apps/studio/sanity.config.ts` contains `projectId: "mvlcc84s"` and `dataset: "production"`. The Studio conditionally enables tools (e.g., `vision`) based on `currentUser` roles — do not assume all tools are available to every user.

- **Web-Sanity integration (apps/web):**
  - Sanity client is at `apps/web/src/sanity/client.ts` (matches the Studio `projectId`/`dataset`). Use `client`, `urlFor` from `apps/web/src/sanity/*` when building pages/components.
  - Pages use the Next.js App Router under `apps/web/src/app`. Follow the existing layout and routing conventions (server components by default unless `.client` used).

- **Patterns & conventions:**
  - Sanity schema files export a constant named `<thing>Type` (e.g., `artistType`) and are referenced by name in the `schemaTypes` array.
  - Keep Sanity schema changes local to `apps/studio/schemaTypes` and update `schemaTypes/index.ts` to include new types.
  - Desk structure uses GROQ-like filters (see `.filter('date >= now()')`) — follow those patterns for listing documents.
  - Next pages fetch via the Sanity `client` with server-side data fetching; prefer using the existing `client` API rather than re-creating clients.

- **Critical files to inspect when making changes:**
  - Repo root: `package.json` (pnpm scripts, Node/pnpm engines)
  - Studio: `apps/studio/sanity.config.ts`, `apps/studio/schemaTypes/*`, `apps/studio/structure/*`
  - Web: `apps/web/src/sanity/client.ts`, `apps/web/src/sanity/image.ts`, `apps/web/src/app` (routes and pages)

- **Build & debug tips:**
  - When iterating on schema changes, use `pnpm --filter studio dev` and open the Studio to verify document types and desk layout.
  - For web runtime issues, run `pnpm --filter web dev` and inspect server logs at `localhost:3000` (Next default).

- **Non-goals / do not assume:**
  - Do not change `projectId` or `dataset` without coordinating with the owner — both Studio and web client rely on these values.
  - Do not assume the Studio exposes the `vision` tool to all users; code checks `currentUser` roles.

If any of the above is unclear or you want more detail (e.g., sample GROQ queries, example page data flow), tell me which area to expand. 
