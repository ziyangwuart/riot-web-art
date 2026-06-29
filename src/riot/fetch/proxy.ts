// 跨域抓取 — 优先走站点自带的 Pages Function（与部署域同源，浏览器永远可达）
// 公共代理仅作为最后兜底

interface ProxyCandidate {
  name: string
  build: (u: string) => string
}

const PROXIES: ProxyCandidate[] = [
  // ★ 自建代理：部署在 https://riot-web-art.pages.dev/api/proxy，与站点同域，无 CORS 问题
  {
    name: 'riot-pages-fn',
    build: (u) => `https://riot-web-art.pages.dev/api/proxy?url=${encodeURIComponent(u)}`,
  },
  // 公共代理作为兜底（如果自建挂了）
  { name: 'allorigins', build: (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}` },
  { name: 'corsproxy', build: (u) => `https://corsproxy.io/?${encodeURIComponent(u)}` },
]

const HARD_TIMEOUT_MS = 15_000

export async function fetchViaProxy(url: string): Promise<string> {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), HARD_TIMEOUT_MS)

  const jobs = PROXIES.map(async (p) => {
    const endpoint = p.build(url)
    try {
      const res = await fetch(endpoint, {
        headers: { Accept: 'text/html,application/xhtml+xml,*/*' },
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(`${p.name} HTTP ${res.status}`)
      const text = await res.text()
      if (text.length < 32) throw new Error(`${p.name} returned empty`)
      return text
    } catch (e) {
      throw e
    }
  })

  try {
    const winner = await Promise.any(jobs)
    controller.abort()
    return winner
  } catch (e) {
    throw new Error(
      `无法访问目标站点（所有代理都失败或超时）。\n${
        e instanceof Error ? e.message : String(e)
      }`,
    )
  } finally {
    clearTimeout(t)
  }
}