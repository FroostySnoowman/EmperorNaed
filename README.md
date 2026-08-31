# Emperor Naed

<p align="center">
  <strong>A red and black portfolio for a Minecraft and Discord configurator, with every word of it editable from JSON.</strong>
</p>

<p align="center">
  <img alt="Theme Crimson and Obsidian" src="https://img.shields.io/badge/Theme-Crimson%20%26%20Obsidian-de0f3f?style=for-the-badge" />
  <img alt="Frontend React and Vite" src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-0a0810?style=for-the-badge" />
  <img alt="Styling Tailwind CSS" src="https://img.shields.io/badge/Styling-Tailwind%20CSS-de0f3f?style=for-the-badge" />
  <img alt="Content JSON" src="https://img.shields.io/badge/Content-JSON-0a0810?style=for-the-badge" />
</p>

## What This Is

A single page app portfolio built for **Emperor Naed**, who configures Minecraft servers and Discord communities and trains the staff teams that run them.

There are seven pages. **Home**, **Timeline**, **Work** (active projects plus a filterable showcase), **Gallery** (screenshots only), **Skills**, **Reviews** and **Contact**.

No backend, no database. Every piece of text, every project, review and skill lives in a JSON file that gets read when the page loads, so edits go live on a refresh without rebuilding anything.

## Stack

| Area | Stack |
| --- | --- |
| App | React 19, Vite 6, TypeScript |
| Styling | Tailwind CSS 3, Inter, a near-black and crimson palette |
| Routing | React Router 7 |
| Motion | Framer Motion, used sparingly |
| Content | JSON files validated with Zod |
| Contact form | Pages Function that forwards to a Discord webhook |
| Hosting | Cloudflare Pages |

## Getting Started

You'll need **Node 20 or newer**.

```bash
cd frontend
npm install
npm run dev
```

Then open whatever URL Vite prints, usually `http://localhost:5173`.

The other commands:

```bash
npm run build      # production build into frontend/dist
npm run preview    # preview that build locally
npm run lint       # eslint
npm run typecheck  # tsc, no emit
```

See [Deploying](#deploying) below. It also runs on any static host, as long as unmatched routes fall back to `index.html`.

## Editing The Content

Everything lives in [`frontend/public/content/`](frontend/public/content/). Edit a file, save it, refresh the browser. That's the whole workflow.

| File | Controls |
| --- | --- |
| `site.json` | Name, profile picture, availability badge, nav links, socials, footer |
| `home.json` | Hero, stats, ticker, the "what I do" cards, section previews, closing CTA |
| `timeline.json` | Project timeline entries |
| `work.json` | Active projects with progress, and the finished work showcase |
| `gallery.json` | The image gallery, with captions and categories |
| `skills.json` | Skill groups, the toolbox, and the "how a job goes" steps |
| `reviews.json` | Reviews, star ratings, avatars and screenshots |
| `contact.json` | Contact channels, form labels, and the FAQ |

A few things worth knowing:

- **Nothing is required.** Delete any field you don't want and it falls back to a sensible default. Delete a whole section and it just stops rendering.
- **To add an entry, copy an existing one.** Every list is an array, so duplicate an item, change the values, and give it a new `id`.
- **Typos get caught.** If a file has broken JSON the site shows a screen naming the exact file and field, rather than a blank page.
- **Images** go in [`frontend/public/media/`](frontend/public/media/) and get referenced as `/media/your-file.png`. Gallery shots live in [`frontend/public/media/gallery/`](frontend/public/media/gallery/). The placeholders in both can be deleted once real screenshots exist.
- **The profile picture** is `brand.avatar` in `site.json`, and it shows up in the header, hero, footer and contact form. The loading screen uses it too, but that renders before any JSON has loaded, so its path lives in [`frontend/src/content/bootBrand.ts`](frontend/src/content/bootBrand.ts) instead. Change both if you swap the image.

## Link Previews

Sharing the site in Discord, Slack, iMessage or on X pulls in a proper card: title, description, and a 1200x630 image with his avatar, tagline and stats.

All of it comes from the `seo` block in `site.json`, and gets baked into `index.html` at build time by a small plugin in [`frontend/vite.config.ts`](frontend/vite.config.ts). Crawlers don't run JavaScript, so these tags have to be in the HTML itself rather than set by React.

```json
"seo": {
  "siteName": "Emperor Naed",
  "url": "https://emperornaed.com",
  "title": "Emperor Naed | Minecraft and Discord server configuration",
  "description": "140+ servers configured over 7 years...",
  "image": "/og.png",
  "imageAlt": "Emperor Naed, server and community configurator",
  "themeColor": "#de0f3f"
}
```

Two things to know:

- **Set `url` to the real domain before launch.** Social crawlers need an absolute URL for the preview image, so if this is wrong the card shows up with no image. If you leave it empty the build falls back to `CF_PAGES_URL`, which is the `*.pages.dev` address.
- **`themeColor` is the coloured bar** down the left of a Discord embed. It also tints the browser chrome on mobile.

The preview image is [`frontend/public/og.png`](frontend/public/og.png). Replace it with any 1200x630 PNG and the width and height tags update themselves. After changing anything here, re-share the link through [Discord's embed debugger](https://discord.com/developers/embedded-app-inspector) or paste it in a private channel, since platforms cache previews for a while.

## Contact Form

The form sends to Discord, but never talks to Discord from the browser. It posts to `/api/contact`, and a Pages Function ([`frontend/functions/api/contact.ts`](frontend/functions/api/contact.ts)) forwards it on. The webhook URL lives in an encrypted environment variable, so it stays out of the public bundle where anyone could pull it out and spam the channel.

In the Cloudflare dashboard go to your Pages project, then **Settings > Environment variables**, add `DISCORD_WEBHOOK_URL`, and click **Encrypt**.

To get a webhook URL, go to Discord, then **Server Settings > Integrations > Webhooks > New Webhook**, pick a channel and hit **Copy Webhook URL**.

For local testing put it in `frontend/.dev.vars`, which is gitignored:

```
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
```

The function validates and truncates every field before forwarding, and blocks `@everyone` style mentions.

If you'd rather not use a Pages Function at all, delete the `functions/` folder. The form then falls back to posting straight to `form.webhookUrl` in `contact.json`, or `VITE_DISCORD_WEBHOOK_URL` in a `.env` file. Both of those end up visible in the JavaScript bundle, so only reach for them if you have to. With nothing configured the form still renders and points people at the Discord and email channels instead.

## Deploying

This runs on Cloudflare Pages. Connect the repo and use these settings:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Root directory | `frontend` |
| Build command | `npm run build` |
| Build output directory | `dist` |

Client side routing is handled by [`frontend/public/_redirects`](frontend/public/_redirects), which sends anything that isn't a real file to `index.html`. Pages picks up `functions/` on its own, so `/api/contact` works with no extra configuration.

To try the production build locally exactly as Pages serves it, including the function:

```bash
cd frontend
npm run build
npx wrangler pages dev dist
```