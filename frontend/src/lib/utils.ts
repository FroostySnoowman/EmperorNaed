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

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function isExternal(href: string): boolean {
  return /^(https?:)?\/\//i.test(href) || href.startsWith('mailto:')
}

export function pad2(value: number): string {
  return String(value).padStart(2, '0')
}
