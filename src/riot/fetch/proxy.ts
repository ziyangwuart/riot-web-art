// 跨域抓取 — 三个公共代理并行竞速，谁先返回有效 HTML 谁赢
// 同时用 AbortController 取消其他请求，避免带宽浪费

interface ProxyCandidate {
  name: string
  build: (u: string) => string
}

const PROXIES: ProxyCandidate[] = [
  { name: 'allorigins', build: (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}` },
  { name: 'corsproxy', build: (u) => `https://corsproxy.io/?${encodeURIComponent(u)}` },
  { name: 'codetabs', build: (u) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}` },
]

const HARD_TIMEOUT_MS = 12_000

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
    // Promise.any 拿到第一个成功的结果，并自动忽略其他失败
    const winner = await Promise.any(jobs)
    controller.abort() // 取消其它仍在进行的请求
    return winner
  } catch (e) {
    throw new Error(
      `无法访问目标站点（所有公共代理都失败或超时）。\n${
        e instanceof Error ? e.message : String(e)
      }`,
    )
  } finally {
    clearTimeout(t)
  }
}
