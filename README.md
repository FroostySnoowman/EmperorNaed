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

The look is type led. Large headings in Instrument Sans, near black grounds, and red used in solid blocks rather than thin lines or outlines. Sections are separated by changes of background colour instead of dividers. There is no invented artwork anywhere: the only image on the site is his own avatar, and the work entries carry image slots that stay hidden until real screenshots are added.

## Stack

| Area | Stack |
| --- | --- |
| App | React 19, Vite 6, TypeScript |
| Styling | Tailwind CSS 3 |
| Routing | React Router 7 |
| Motion | Framer Motion, fade and rise only |
| Content | JSON validated with Zod |
| Hosting | Cloudflare Pages |

## Getting Started

You'll need **Node 20 or newer**.

```bash
cd frontend
npm install
npm run dev
```

Then open whatever URL Vite prints.

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

  The gallery shows a friendly empty state until that array has something in it, and the category filter appears on its own once there is more than one category.
- **The profile picture** is the one thing not driven by JSON. It sits at [`frontend/public/media/emperor-naed.png`](frontend/public/media/emperor-naed.png) and is used by the header, hero and footer, so replacing that file swaps it everywhere.

## Link Previews

Sharing the site in Discord, Slack, iMessage or on X pulls in a proper card: title, description and a 1200x630 image.

All of it comes from the `seo` block in `site.json` and gets baked into the HTML at build time by a plugin in [`frontend/vite.config.ts`](frontend/vite.config.ts). Crawlers don't run JavaScript, so these tags have to be in the HTML itself rather than set by React.

```json
"seo": {
  "siteName": "Emperor Naed",
  "url": "https://emperornaed.com",
  "title": "Emperor Naed | Minecraft and Discord server configuration",
  "description": "Minecraft networks, plugin and permission setup...",
  "image": "/og.png",
  "imageAlt": "Emperor Naed, server and community configuration",
  "themeColor": "#e11d2e"
}
```

Two things to know:

- **Set `url` to the real domain before launch.** Social crawlers need an absolute URL for the preview image, so if this is wrong the card shows up with no image. If you leave it empty the build falls back to `CF_PAGES_URL`, which is the `*.pages.dev` address.
- **`themeColor` is the coloured bar** down the left of a Discord embed. It also tints the browser chrome on mobile.

The preview image is [`frontend/public/og.png`](frontend/public/og.png). Replace it with any 1200x630 PNG and the width and height tags update themselves. After changing anything here, re-share the link in a private channel, since platforms cache previews for a while.

## Search Engine Setup

Every page is written out as its own HTML file at build time, so each one ships with its own title, description, canonical link, social preview tags and structured data instead of all eight sharing the home page's. Crawlers that do not run JavaScript still read the right thing on every page.

Titles and descriptions come from each content file's `intro`, so writing better copy is the same job as improving the search result. The structured data describes him as a person, lists the work entries, and adds breadcrumbs, which is what search engines read to understand who the site belongs to.

The build also writes `sitemap.xml`, `robots.txt`, `site.webmanifest`, a `_headers` file with security and caching rules, and a real `404.html`. None of those are edited by hand. The only field they depend on is `seo.url`, which has to be the live domain.

Once the domain is live, add the site to [Google Search Console](https://search.google.com/search-console) and submit `https://your-domain/sitemap.xml`.

## Deploying

This runs on Cloudflare Pages. Connect the repo and use these settings:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Root directory | `frontend` |
| Build command | `npm run build` |
| Build output directory | `dist` |

Routing needs no configuration. Each page is a real file in `dist`, so Pages serves it directly and anything unknown gets a genuine 404 rather than a page pretending to be found. There is no server side code.

To try the production build locally exactly as Pages serves it:

```bash
cd frontend
npm run build
npx wrangler pages dev dist
```
