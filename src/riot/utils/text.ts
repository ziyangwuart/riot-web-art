// 文本处理工具
const PUNCT = /[，。！？；：、,.!?;:"""''()（）\[\]【】《》<>·…—\-—_/\\|]/g

export function cleanText(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

export function chunksToShort(chunk: string, max = 18): string[] {
  // 将长句切成短语，每段 ≤ max 字符
  if (chunk.length <= max) return [chunk]
  const out: string[] = []
  let i = 0
  while (i < chunk.length) {
    let end = Math.min(i + max, chunk.length)
    if (end < chunk.length) {
      const last = chunk.slice(i, end)
      const cut = Math.max(last.lastIndexOf(' '), last.lastIndexOf('，'), last.lastIndexOf(','))
      if (cut > max * 0.4) end = i + cut + 1
    }
    out.push(chunk.slice(i, end).trim())
    i = end
  }
  return out.filter(Boolean)
}

export function splitWords(s: string): string[] {
  return s.split(PUNCT).filter((w) => w.length > 1)
}

export function mixedChant(words: string[], count: number): string[] {
  if (words.length === 0) return []
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    out.push(words[Math.floor(Math.random() * words.length)])
  }
  return out
}
