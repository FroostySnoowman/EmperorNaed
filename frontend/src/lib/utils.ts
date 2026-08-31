export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function splitNumeric(value: string): { prefix: string; number: number | null; suffix: string } {
  const match = value.match(/^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/)
  if (!match) return { prefix: value, number: null, suffix: '' }
  return { prefix: match[1] ?? '', number: Number(match[2]), suffix: match[3] ?? '' }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function initialsOf(name: string, fallback = 'EN'): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  const letters = name.replace(/[^a-zA-Z]/g, '')
  if (letters.length >= 2) return letters.slice(0, 2).toUpperCase()
  return fallback
}

export function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const value of values) {
    const trimmed = value.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)
    out.push(trimmed)
  }
  return out
}

export function isExternal(href: string): boolean {
  return /^(https?:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('discord:')
}
