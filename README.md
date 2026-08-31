# Emperor Naed

<p align="center">
  <strong>A red-and-black portfolio for a Minecraft &amp; Discord configurator — every word of it editable from JSON.</strong>
</p>

<p align="center">
  <img alt="Theme Crimson and Obsidian" src="https://img.shields.io/badge/Theme-Crimson%20%26%20Obsidian-de0f3f?style=for-the-badge" />
  <img alt="Frontend React and Vite" src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-0a0810?style=for-the-badge" />
  <img alt="Styling Tailwind CSS" src="https://img.shields.io/badge/Styling-Tailwind%20CSS-de0f3f?style=for-the-badge" />
  <img alt="Content JSON" src="https://img.shields.io/badge/Content-JSON-0a0810?style=for-the-badge" />
</p>

## What This Is

A single-page-app portfolio built for **Emperor Naed** — server configuration, plugin configuration, Discord engineering, and staff management.

Six pages: **Home**, **Timeline**, **Work** (active projects + a filterable showcase), **Skills**, **Reviews**, and **Contact**.

There is no backend and no database. Every piece of text, every project, review, and skill lives in a JSON file that is read when the page loads — so edits go live on a refresh, with no rebuild.

## Stack

| Area | Stack |
| --- | --- |
| App | React 19, Vite 6, TypeScript |
| Styling | Tailwind CSS 3 with a custom crimson/obsidian palette |
| Routing | React Router 7 |
| Motion | Framer Motion, Lenis smooth scroll |
| Content | JSON files validated with Zod |
| Contact form | Posts straight to a Discord webhook |

## Getting Started

Needs **Node 20+**.

```bash
cd frontend
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

Other commands:

```bash
npm run build      # production build into frontend/dist
npm run preview    # preview that build locally
npm run lint       # eslint
npm run typecheck  # tsc, no emit
```

Deploy by uploading `frontend/dist` to any static host. It is a single-page app, so point all unmatched routes at `index.html`.

## Editing The Content

Everything lives in [`frontend/public/content/`](frontend/public/content/). Edit a file, save, refresh the browser — that is the whole workflow.

| File | Controls |
| --- | --- |
| `site.json` | Name, profile picture, availability badge, nav links, socials, footer |
| `home.json` | Hero, stats, ticker, "what I do" cards, section previews, closing CTA |
| `timeline.json` | Project timeline entries |
| `work.json` | Active projects (with progress) and the finished-work showcase |
| `skills.json` | Skill groups with levels, the toolbox, and the "how I work" steps |
| `reviews.json` | Reviews, star ratings, avatars, and screenshots |
| `contact.json` | Contact channels, form labels, and the FAQ |

A few things worth knowing:

- **Nothing is required.** Delete any field you do not want and the site falls back to a sensible default. Delete a whole section and it simply stops rendering.
- **Add entries by copying one.** Every list is an array — duplicate an item, change the values, give it a new `id`.
- **Typos are caught.** If a file has broken JSON, the site shows a screen naming the exact file and field instead of a blank page.
- **Images** go in [`frontend/public/media/`](frontend/public/media/) and are referenced as `/media/your-file.png`. The placeholders shipped there can be deleted once real screenshots exist.
- **The profile picture** is `brand.avatar` in `site.json`, and appears in the header, hero, footer and contact form. The loading screen shows it too, but that renders before any JSON has loaded — so its path lives in [`frontend/src/content/bootBrand.ts`](frontend/src/content/bootBrand.ts) instead. Change both if you swap the image.

## Contact Form

The form posts to a Discord webhook. Set it in either place:

1. `form.webhookUrl` in `contact.json`, or
2. `VITE_DISCORD_WEBHOOK_URL` in a `frontend/.env` file — this wins, and keeps the URL out of git.

```bash
cd frontend
cp .env.example .env   # then paste the webhook URL
```

To create one: Discord → **Server Settings → Integrations → Webhooks → New Webhook**, pick a channel, then **Copy Webhook URL**.

Without a webhook the form still renders and politely points people at the Discord and email channels instead.