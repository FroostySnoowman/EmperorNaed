# Emperor Naed

<p align="center">
  <strong>Red and black portfolio for a Minecraft and Discord configurator. Everything editable from JSON.</strong>
</p>

<p align="center">
  <img alt="Theme" src="https://img.shields.io/badge/Theme-Red%20%26%20Black-ea1c24?style=for-the-badge" />
  <img alt="Frontend" src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-0b0b0b?style=for-the-badge" />
  <img alt="Styling" src="https://img.shields.io/badge/Styling-Tailwind-ea1c24?style=for-the-badge" />
  <img alt="Hosting" src="https://img.shields.io/badge/Hosting-Cloudflare%20Pages-0b0b0b?style=for-the-badge" />
</p>

## What This Is

Eight pages: **Home**, **Timeline**, **Active**, **Work**, **Gallery**, **Skills**, **Reviews** and **Contact**.

No backend and no database. Every heading, project and review lives in a JSON file read when the page loads, so edits go live on a refresh with nothing to rebuild.

The look is type led. Large headings in Instrument Sans, near black grounds, and red used in solid blocks rather than thin lines or outlines. Sections are separated by changes of background colour instead of dividers. There is no invented artwork anywhere: the only image on the site is his own avatar, and the work entries carry image slots that stay hidden until real screenshots are added.

## Stack

| Area | Stack |
| --- | --- |
| App | React 19, Vite 6, TypeScript |
| Styling | Tailwind CSS 3 |
| Routing | React Router 7 |
| Motion | Framer Motion, fade and rise only |
| Content | JSON validated with Zod |

## Getting Started

Needs **Node 20 or newer**.

```bash
cd frontend3
npm install
npm run dev
```

Other commands:

```bash
npm run build      # production build into dist
npm run preview    # preview that build
npm run lint       # eslint
npm run typecheck  # tsc, no emit
```

## Editing The Content

Everything lives in [`public/content/`](public/content/). Edit a file, save, refresh.

| File | Controls |
| --- | --- |
| `site.json` | Name, nav, socials, footer, link preview settings |
| `home.json` | Hero statement, figures, what I do, closing block |
| `timeline.json` | Project timeline entries |
| `active.json` | Active projects and progress |
| `work.json` | Finished work, categories, optional images |
| `gallery.json` | Screenshot gallery, with captions and categories |
| `skills.json` | Skill groups and toolbox rows |
| `reviews.json` | Reviews, the first one is shown in red |
| `contact.json` | Contact channels and the form |

Worth knowing:

- **Nothing is required.** Delete a field and it falls back to a default. Delete a section and it stops rendering.
- **To add an entry, copy one.** Every list is an array, so duplicate an item and give it a new `id`.
- **Typos get caught.** Broken JSON shows a screen naming the file and field rather than a blank page.
- **Adding screenshots.** Drop files into `public/media/`, then reference them as `/media/your-file.png`. On a work entry fill in `image` and `images`. For the gallery, add objects to the `items` array in `gallery.json`:

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
- **The link preview** image is `public/og.png` and its tags come from the `seo` block in `site.json`. Set `seo.url` to the real domain before launch or the preview will have no image.

## Deploying

Cloudflare Pages, with these project settings:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Root directory | `frontend3` |
| Build command | `npm run build` |
| Build output directory | `dist` |

Client side routing comes from [`public/_redirects`](public/_redirects), which sends anything that is not a real file to `index.html`. There is no server side code, so nothing else needs configuring.
