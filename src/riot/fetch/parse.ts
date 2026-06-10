// HTML 解析：抽取文字块、词、链接（含 href）、图片地址
import type { RippedContent, RippedLink } from '../../types'

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'as', 'it', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they',
  'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
  'just', 'into', 'out', 'up', 'down', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'from', 'has', 'have', 'had', 'do', 'does', 'did', 'done', 'doing', 'about', 'above', 'below', 'after',
  'before', 'between', 'through', 'during', 'because', 'if', 'while', 'their', 'them', 'his', 'her', 'its',
  'our', 'your', 'my', 'me', 'us', '的', '了', '和', '是', '在', '我', '你', '他', '她', '它', '们', '也', '就',
  '都', '与', '及', '或', '但', '把', '被', '从', '到', '为', '以', '对', '上', '下', '前', '后', '里', '外',
  '中', '不', '没', '有', '会', '能', '要', '说', '让', '这', '那', '此', '并', '而', '则', '之', '于',
])

export function ripContent(html: string, baseURL: string): RippedContent {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  doc.querySelectorAll(
    'script,style,noscript,iframe,svg,canvas,video,audio,link,meta,header nav,footer,form',
  ).forEach((el) => el.remove())

  const title =
    (doc.querySelector('title')?.textContent || doc.querySelector('h1')?.textContent || baseURL)
      .trim()
      .slice(0, 120)

  const textChunks = extractTextChunks(doc.body)
  const words = extractWords(textChunks.join(' '))
  const links = extractLinks(doc, baseURL)
  const images = extractImages(doc, baseURL)

  return {
    source: baseURL,
    title,
    textChunks,
    words,
    images,
    links,
  }
}

function extractTextChunks(root: Element | null): string[] {
  if (!root) return []
  const chunks: string[] = []
  const blockSelector = 'p,h1,h2,h3,h4,h5,h6,li,blockquote,article,section,div'
  root.querySelectorAll(blockSelector).forEach((el) => {
    const txt = (el.textContent || '').replace(/\s+/g, ' ').trim()
    if (txt.length < 24 || txt.length > 220) return
    if (el.closest('a,button,nav,aside,[role="navigation"]')) return
    chunks.push(txt)
  })
  return uniq(chunks).slice(0, 60)
}

function extractWords(text: string): string[] {
  const out: string[] = []
  const matches = text.match(/[A-Za-z]{3,}|[\u4e00-\u9fa5]{2,}/g) ?? []
  for (const m of matches) {
    const w = m.toLowerCase()
    if (STOP_WORDS.has(w)) continue
    out.push(m)
  }
  const counts = new Map<string, number>()
  for (const w of out) counts.set(w, (counts.get(w) ?? 0) + 1)
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 80)
    .map(([w]) => w)
}

function extractLinks(doc: Document, baseURL: string): RippedLink[] {
  const base = safeBase(baseURL)
  const out: RippedLink[] = []
  const seen = new Set<string>()
  doc.querySelectorAll('a[href]').forEach((a) => {
    const hrefRaw = a.getAttribute('href') || ''
    if (!hrefRaw) return
    if (hrefRaw.startsWith('javascript:') || hrefRaw.startsWith('mailto:') || hrefRaw.startsWith('tel:')) return
    if (hrefRaw === '#' || hrefRaw.startsWith('#')) return
    const t = (a.textContent || '').replace(/\s+/g, ' ').trim()
    if (t.length < 2 || t.length > 80) return
    let abs: string
    try {
      abs = new URL(hrefRaw, base).toString()
    } catch {
      return
    }
    if (!abs.startsWith('http')) return
    if (seen.has(abs)) return
    seen.add(abs)
    let host = ''
    try {
      host = new URL(abs).hostname
    } catch {
      return
    }
    out.push({ text: t, href: abs, host })
    if (out.length >= 40) return
  })
  return out
}

function extractImages(doc: Document, baseURL: string): string[] {
  const out: string[] = []
  const base = safeBase(baseURL)
  doc.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src') || ''
    if (!src) return
    if (src.startsWith('data:')) {
      if (src.length > 16_000) out.push(src)
      return
    }
    let abs: string
    try {
      abs = new URL(src, base).toString()
    } catch {
      return
    }
    const lower = abs.toLowerCase()
    if (lower.endsWith('.svg') || lower.includes('tracking') || lower.includes('pixel')) return
    const w = parseInt(img.getAttribute('width') || '0', 10)
    const h = parseInt(img.getAttribute('height') || '0', 10)
    if ((w > 0 && w < 80) || (h > 0 && h < 80)) return
    out.push(abs)
  })
  doc.querySelectorAll('[style*="background-image"]').forEach((el) => {
    const style = (el as HTMLElement).getAttribute('style') || ''
    const m = style.match(/url\(['"]?([^'")]+)['"]?\)/i)
    if (!m) return
    try {
      const abs = new URL(m[1], base).toString()
      if (!abs.toLowerCase().endsWith('.svg')) out.push(abs)
    } catch {
      /* ignore */
    }
  })
  return uniq(out).slice(0, 30)
}

function safeBase(url: string): string {
  try {
    return new URL(url).origin
  } catch {
    return 'https://example.com'
  }
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}
