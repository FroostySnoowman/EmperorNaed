import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
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

function socialMeta(): Plugin {
  let publicDir = ''

  return {
    name: 'social-meta',
    configResolved(config) {
      publicDir = config.publicDir
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        let site: Record<string, Record<string, unknown>>
        try {
          site = JSON.parse(readFileSync(join(publicDir, 'content', 'site.json'), 'utf8'))
        } catch {
          console.warn('[social-meta] Could not read public/content/site.json, so no meta tags were added.')
          return html
        }

        const seo = site.seo ?? {}
        const brand = site.brand ?? {}

        const base = String(seo.url || process.env.CF_PAGES_URL || '').replace(/\/+$/, '')
        const title = String(seo.title || brand.name || 'Portfolio')
        const description = String(seo.description || brand.tagline || '')
        const siteName = String(seo.siteName || brand.name || '')
        const themeColor = String(seo.themeColor || '#de0f3f')
        const imagePath = String(seo.image || '/og.png')
        const imageUrl = base ? `${base}${imagePath}` : imagePath
        const imageAlt = String(seo.imageAlt || title)
        const size = pngSize(join(publicDir, imagePath))

        const tags = [
          `<meta name="description" content="${escapeAttr(description)}" />`,
          `<meta name="theme-color" content="${escapeAttr(themeColor)}" />`,
          base ? `<link rel="canonical" href="${escapeAttr(`${base}/`)}" />` : '',
          '<meta property="og:type" content="website" />',
          siteName ? `<meta property="og:site_name" content="${escapeAttr(siteName)}" />` : '',
          `<meta property="og:title" content="${escapeAttr(title)}" />`,
          `<meta property="og:description" content="${escapeAttr(description)}" />`,
          base ? `<meta property="og:url" content="${escapeAttr(`${base}/`)}" />` : '',
          `<meta property="og:image" content="${escapeAttr(imageUrl)}" />`,
          '<meta property="og:image:type" content="image/png" />',
          size ? `<meta property="og:image:width" content="${size.width}" />` : '',
          size ? `<meta property="og:image:height" content="${size.height}" />` : '',
          `<meta property="og:image:alt" content="${escapeAttr(imageAlt)}" />`,
          '<meta name="twitter:card" content="summary_large_image" />',
          `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
          `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
          `<meta name="twitter:image" content="${escapeAttr(imageUrl)}" />`,
          `<meta name="twitter:image:alt" content="${escapeAttr(imageAlt)}" />`,
        ]
          .filter(Boolean)
          .map((tag) => `    ${tag}`)
          .join('\n')

        return html
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`)
          .replace('</head>', `${tags}\n  </head>`)
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), socialMeta()],
  server: { port: 5173, host: true },
  build: { outDir: 'dist', sourcemap: false },
})
