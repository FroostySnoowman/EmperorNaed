import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

type Json = Record<string, unknown>

function obj(value: unknown): Json {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Json) : {}
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function list(value: unknown): Json[] {
  return Array.isArray(value) ? value.map(obj) : []
}

const PAGE_SOURCES: Record<string, string> = {
  '/timeline': 'timeline.json',
  '/active': 'active.json',
  '/work': 'work.json',
  '/gallery': 'gallery.json',
  '/skills': 'skills.json',
  '/reviews': 'reviews.json',
  '/contact': 'contact.json',
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function pngSize(path: string): { width: number; height: number } | null {
  try {
    const buffer = readFileSync(path)
    if (buffer.length < 24 || buffer.readUInt32BE(12) !== 0x49484452) return null
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
  } catch {
    return null
  }
}

function readJson(publicDir: string, file: string): Json | null {
  try {
    return JSON.parse(readFileSync(join(publicDir, 'content', file), 'utf8')) as Json
  } catch {
    return null
  }
}

function trimTitle(value: string): string {
  return value.trim().replace(/[.]$/, '')
}

type Route = { path: string; label: string; title: string; description: string; index: boolean }

function buildRoutes(publicDir: string): { site: Json; routes: Route[] } {
  const site = readJson(publicDir, 'site.json') ?? {}
  const seo = obj(site.seo)
  const brand = obj(site.brand)
  const nav = list(site.nav)

  const routes: Route[] = []

  routes.push({
    path: '/',
    label: 'Home',
    title: str(seo.title) || str(brand.name) || 'Portfolio',
    description: str(seo.description) || str(brand.summary),
    index: true,
  })

  for (const item of nav) {
    const path = str(item.to)
    if (path === '/' || !PAGE_SOURCES[path]) continue
    const page = readJson(publicDir, PAGE_SOURCES[path])
    const intro = obj(page?.intro)
    const title = trimTitle(str(intro.title) || str(item.label))
    routes.push({
      path,
      label: str(item.label),
      title: title ? `${title} | ${str(brand.name)}`.trim() : str(seo.title),
      description: str(intro.lede) || str(seo.description),
      index: true,
    })
  }

  return { site, routes }
}

const PAGE_TYPES: Record<string, string> = {
  '/': 'ProfilePage',
  '/timeline': 'CollectionPage',
  '/active': 'CollectionPage',
  '/work': 'CollectionPage',
  '/gallery': 'CollectionPage',
  '/reviews': 'CollectionPage',
  '/contact': 'ContactPage',
}

function workItemList(publicDir: string, url: string, brandName: string): Json | null {
  const items = list(readJson(publicDir, 'work.json')?.items).filter((item) => str(item.title))
  if (items.length === 0) return null
  return {
    '@type': 'ItemList',
    '@id': `${url}#projects`,
    name: 'Configuration work',
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: str(item.title),
        description: str(item.summary),
        ...(str(item.year) ? { dateCreated: str(item.year) } : {}),
        ...(str(item.category) ? { genre: str(item.category) } : {}),
        ...(brandName ? { creator: { '@type': 'Person', name: brandName } } : {}),
      },
    })),
  }
}

function structuredData(site: Json, route: Route, base: string, imageUrl: string, publicDir: string): string {
  const brand = obj(site.brand)
  const seo = obj(site.seo)
  const sameAs = list(site.socials)
    .map((social) => str(social.href))
    .filter((href) => {
      if (!/^https?:\/\//i.test(href)) return false
      let url: URL
      try {
        url = new URL(href)
      } catch {
        return false
      }
      const segments = url.pathname.split('/').filter(Boolean)
      if (segments.length === 0) return false
      return !segments.some((segment) => /^0+$/.test(segment))
    })
  const url = base ? `${base}${route.path === '/' ? '/' : route.path}` : route.path

  const page: Json = {
    '@type': PAGE_TYPES[route.path] ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: route.title,
    description: route.description,
    isPartOf: { '@id': `${base}/#website` },
    about: { '@id': `${base}/#person` },
    primaryImageOfPage: imageUrl,
    inLanguage: 'en',
  }
  if (route.path === '/') page.mainEntity = { '@id': `${base}/#person` }

  const graph: Json[] = [page]

  if (route.path === '/') {
    graph.push(
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: `${base}/`,
        name: str(seo.siteName) || str(brand.name),
        description: str(seo.description),
        publisher: { '@id': `${base}/#person` },
        inLanguage: 'en',
      },
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: str(brand.name),
        jobTitle: str(brand.role),
        description: str(brand.summary),
        url: `${base}/`,
        image: `${base}/apple-touch-icon.png`,
        knowsAbout: [
          'Minecraft server configuration',
          'Plugin configuration',
          'Discord community management',
          'Server performance tuning',
          'Staff training and moderation',
        ],
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
    )
  } else {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: route.label, item: url },
      ],
    })
  }

  if (route.path === '/work') {
    const projects = workItemList(publicDir, url, str(brand.name))
    if (projects) graph.push(projects)
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}

function metaFor(site: Json, route: Route, base: string, publicDir: string, noindex = false): string {
  const seo = obj(site.seo)
  const brand = obj(site.brand)
  const imagePath = str(seo.image) || '/og.png'
  const imageUrl = base ? `${base}${imagePath}` : imagePath
  const imageAlt = str(seo.imageAlt) || route.title
  const size = pngSize(join(publicDir, imagePath))
  const canonical = base ? `${base}${route.path === '/' ? '/' : route.path}` : ''

  const tags = [
    `<meta name="description" content="${escapeAttr(route.description)}" />`,
    `<meta name="author" content="${escapeAttr(str(brand.name))}" />`,
    `<meta name="theme-color" content="${escapeAttr(str(seo.themeColor) || '#ea1c24')}" />`,
    noindex
      ? '<meta name="robots" content="noindex, follow" />'
      : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />',
    canonical ? `<link rel="canonical" href="${escapeAttr(canonical)}" />` : '',
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="en_GB" />',
    `<meta property="og:site_name" content="${escapeAttr(str(seo.siteName) || str(brand.name))}" />`,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
    canonical ? `<meta property="og:url" content="${escapeAttr(canonical)}" />` : '',
    `<meta property="og:image" content="${escapeAttr(imageUrl)}" />`,
    '<meta property="og:image:type" content="image/png" />',
    size ? `<meta property="og:image:width" content="${size.width}" />` : '',
    size ? `<meta property="og:image:height" content="${size.height}" />` : '',
    `<meta property="og:image:alt" content="${escapeAttr(imageAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(imageUrl)}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttr(imageAlt)}" />`,
    '<link rel="manifest" href="/site.webmanifest" />',
    base
      ? `<script type="application/ld+json">${structuredData(site, route, base, imageUrl, publicDir).replace(/</g, '\\u003c')}</script>`
      : '',
  ]

  return tags.filter(Boolean).map((tag) => `    ${tag}`).join('\n')
}

function applyMeta(html: string, title: string, meta: string): string {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`)
    .replace('</head>', `${meta}\n  </head>`)
}

function seoPlugin(): Plugin {
  let publicDir = ''
  let outDir = ''
  let isBuild = false

  return {
    name: 'seo',
    configResolved(config) {
      publicDir = config.publicDir
      outDir = join(config.root, config.build.outDir)
      isBuild = config.command === 'build'
    },

    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (isBuild) return html
        const { site, routes } = buildRoutes(publicDir)
        const base = (str(obj(site.seo).url) || process.env.CF_PAGES_URL || '').replace(/\/+$/, '')
        const home = routes[0]
        if (!home) return html
        return applyMeta(html, home.title, metaFor(site, home, base, publicDir))
      },
    },

    closeBundle() {
      const { site, routes } = buildRoutes(publicDir)
      const base = (str(obj(site.seo).url) || process.env.CF_PAGES_URL || '').replace(/\/+$/, '')
      if (!base) {
        console.warn('[seo] No seo.url in site.json and no CF_PAGES_URL, so canonical, sitemap and JSON-LD are skipped.')
      }

      let template: string
      try {
        template = readFileSync(join(outDir, 'index.html'), 'utf8')
      } catch {
        return
      }

      for (const route of routes) {
        const html = applyMeta(template, route.title, metaFor(site, route, base, publicDir))
        const target = route.path === '/' ? join(outDir, 'index.html') : join(outDir, `${route.path.slice(1)}.html`)
        mkdirSync(dirname(target), { recursive: true })
        writeFileSync(target, html)
      }

      const notFound: Route = {
        path: '/404',
        label: 'Not found',
        title: `Page not found | ${str(obj(site.brand).name)}`.trim(),
        description: 'That page does not exist.',
        index: false,
      }
      writeFileSync(
        join(outDir, '404.html'),
        applyMeta(template, notFound.title, metaFor(site, notFound, base, publicDir, true)),
      )

      if (base) {
        const lastmod = new Date().toISOString().slice(0, 10)
        const urls = routes
          .map((route) => {
            const loc = `${base}${route.path === '/' ? '/' : route.path}`
            const priority = route.path === '/' ? '1.0' : route.path === '/work' ? '0.9' : '0.8'
            const freq = route.path === '/active' ? 'weekly' : 'monthly'
            return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
          })
          .join('\n')
        writeFileSync(
          join(outDir, 'sitemap.xml'),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        )
        writeFileSync(
          join(outDir, 'robots.txt'),
          `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
        )
      }

      const brand = obj(site.brand)
      const seo = obj(site.seo)
      writeFileSync(
        join(outDir, 'site.webmanifest'),
        JSON.stringify(
          {
            name: str(seo.siteName) || str(brand.name),
            short_name: str(brand.name),
            description: str(seo.description),
            start_url: '/',
            display: 'standalone',
            background_color: '#0b0b0b',
            theme_color: str(seo.themeColor) || '#ea1c24',
            icons: [
              { src: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
              { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
            ],
          },
          null,
          2,
        ),
      )

      writeFileSync(
        join(outDir, '_headers'),
        [
          '/*',
          '  X-Content-Type-Options: nosniff',
          '  Referrer-Policy: strict-origin-when-cross-origin',
          '  X-Frame-Options: SAMEORIGIN',
          '  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()',
          '  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload',
          '',
          '/assets/*',
          '  Cache-Control: public, max-age=31536000, immutable',
          '',
          '/content/*',
          '  Cache-Control: public, max-age=0, must-revalidate',
          '',
          '/media/*',
          '  Cache-Control: public, max-age=86400',
          '',
          '/og.png',
          '  Cache-Control: public, max-age=86400',
          '',
        ].join('\n'),
      )

      console.log(`[seo] ${routes.length} prerendered routes, sitemap, robots, manifest, headers and 404 written.`)
    },
  }
}

export default defineConfig({
  plugins: [react(), seoPlugin()],
  server: { port: 5373, host: true },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === 'INVALID_ANNOTATION' && warning.id?.includes('/node_modules/')) return
        defaultHandler(warning)
      },
    },
  },
})
