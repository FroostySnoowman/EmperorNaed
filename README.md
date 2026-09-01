# Emperor Naed

<p align="center">
  <strong>A red and black portfolio for a Minecraft and Discord configurator, with every word of it editable from JSON.</strong>
</p>

<p align="center">
  <img alt="Theme Red and Black" src="https://img.shields.io/badge/Theme-Red%20%26%20Black-ea1c24?style=for-the-badge" />
  <img alt="Frontend React and Vite" src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-0b0b0b?style=for-the-badge" />
  <img alt="Styling Tailwind CSS" src="https://img.shields.io/badge/Styling-Tailwind%20CSS-ea1c24?style=for-the-badge" />
  <img alt="Hosting Cloudflare Pages" src="https://img.shields.io/badge/Hosting-Cloudflare%20Pages-0b0b0b?style=for-the-badge" />
</p>

## What This Is

A portfolio for **Emperor Naed**, who configures Minecraft servers and Discord communities and trains the staff teams that run them.

Eight pages: **Home**, **Timeline**, **Active**, **Work**, **Gallery**, **Skills**, **Reviews** and **Contact**.

No backend and no database. Every heading, project and review lives in a JSON file that is read when the page loads, so edits go live on a refresh with nothing to rebuild.

## Stack

| Area | Stack |
| --- | --- |
| App | React 19, Vite 6, TypeScript |
| Styling | Tailwind CSS 3 |
| Routing | React Router 7 |
| Motion | Framer Motion |
| Content | JSON validated with Zod |
| Hosting | Cloudflare Pages |

## Getting Started

You'll need **Node 20 or newer**.

```bash
cd frontend
npm install
npm run dev
```

The other commands:

```bash
npm run build      # production build into dist
npm run preview    # preview that build locally
npm run lint       # eslint
npm run typecheck  # tsc, no emit
```

## Editing The Content

Everything lives in [`frontend/public/content/`](frontend/public/content/). Edit a file, save it, refresh the browser. That's the whole workflow.

| File | Controls |
| --- | --- |
| `site.json` | Name, nav links, socials, footer, link preview settings |
| `home.json` | Hero statement, figures, what I do, closing block |
| `timeline.json` | Project timeline entries |
| `active.json` | Active projects and progress |
| `work.json` | Finished work, categories, optional images |
| `gallery.json` | Screenshot gallery, with captions and categories |
| `skills.json` | Skill groups and toolbox rows |
| `reviews.json` | Reviews, the first one is shown in red |
| `contact.json` | Contact channels |

A few things worth knowing:

- **Nothing is required.** Delete any field you don't want and it falls back to a sensible default. Delete a whole section and it just stops rendering.
- **To add an entry, copy an existing one.** Every list is an array, so duplicate an item, change the values, and give it a new `id`.
- **Typos get caught.** If a file has broken JSON the site shows a screen naming the exact file and field, rather than a blank page.
- **The profile picture** is the one thing not driven by JSON. It sits at [`frontend/public/media/emperor-naed.png`](frontend/public/media/emperor-naed.png) and is used by the header, hero and footer, so replacing that file swaps it everywhere.
- **Adding screenshots.** Drop files into [`frontend/public/media/`](frontend/public/media/), then reference them as `/media/your-file.png`. On a work entry fill in `image` and `images`. For the gallery, add objects to the `items` array in `gallery.json`:

```json
{
  "id": "hub-spawn",
  "src": "/media/hub-spawn.png",
  "alt": "Hub spawn on Aurora Network",
  "caption": "Hub spawn, Aurora Network",
  "category": "Minecraft"
}
```

The gallery shows an empty state until that array has something in it, and the category filter appears on its own once there is more than one category.

## Search And Link Previews

Every page is written out as its own HTML file at build time, so each one gets its own title, description, canonical link, preview card and structured data. Crawlers don't run JavaScript, so this has to happen in the HTML rather than in React. Titles and descriptions come from each content file's `intro`.

The build also writes `sitemap.xml`, `robots.txt`, `llms.txt`, `site.webmanifest`, a `_headers` file with security and caching rules, and a real `404.html`. None of those are edited by hand.

Four fields in the `seo` block of `site.json` matter:

- **`url`** has to be the real domain before launch. Canonical links, the sitemap and the preview image all need an absolute URL. Left empty, the build falls back to whichever host URL is in the environment, `CF_PAGES_URL` on Cloudflare or `VERCEL_PROJECT_PRODUCTION_URL` on Vercel.
- **`image`** is [`frontend/public/og.png`](frontend/public/og.png). Any 1200x630 PNG works and the size tags update themselves. Platforms cache previews, so re-share the link in a private channel after changing it.
- **`themeColor`** is the coloured bar down the left of a Discord embed. It also tints browser chrome on mobile.
- **`allowAiTraining`** ships as `true`. Setting it to `false` still lets ChatGPT, Claude and Perplexity read the site to answer live questions and cite it, and only turns away the crawlers that collect training data.

Once the domain is live, submit `https://your-domain/sitemap.xml` to [Google Search Console](https://search.google.com/search-console).

## Deploying

Runs on Cloudflare Pages or Vercel with no code changes. Both build from the `frontend` directory and serve `dist`.

| Setting | Cloudflare Pages | Vercel |
| --- | --- | --- |
| Framework preset | None | Other |
| Root directory | `frontend` | `frontend` |
| Build command | `npm run build` | `npm run build` |
| Output directory | `dist` | `dist` |

Every page is a real file in `dist`, so routing needs no configuration on either host and unknown paths get a genuine 404. Caching and security headers come from the generated `_headers` file on Cloudflare and from [`frontend/vercel.json`](frontend/vercel.json) on Vercel. Each host ignores the other's file.

`vercel.json` also sets `cleanUrls`, so the served URL is `/work` rather than `/work.html`, which is what the canonical links and the sitemap point at.

To try the production build locally exactly as Cloudflare serves it:

```bash
cd frontend
npm run build
npx wrangler pages dev dist
```
