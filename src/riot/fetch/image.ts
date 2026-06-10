// 图片代理 + 跨域转 dataURL
// 1) 并行抓取：所有候选一次性跑，2.5s 超时
// 2) 单图内三源并行（直接 / weserv / corsproxy）
// 3) 边抓边回调：拿到一张就调 onProgress，让舞台实时补图
// 4) 关键：使用 Promise.allSettled + 首选非空结果，避免 Promise.any 把 null 错误判赢

import type { RippedContent } from '../../types'

const PER_IMAGE_TIMEOUT_MS = 2_500
const MAX_IMAGES = 10
const MAX_SIDE = 260
const MAX_CONCURRENT = 4 // 一次最多同时解码 4 张，避免解码阻塞主线程

const PROXY_HOSTS = [
  (u: string) => `https://images.weserv.nl/?url=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
]

export interface ImageProgress {
  done: number
  total: number
  latest?: string
}

export async function preloadImages(
  urls: string[],
  onProgress?: (p: ImageProgress) => void,
  signal?: AbortSignal,
): Promise<string[]> {
  const queue = urls.slice(0, MAX_IMAGES)
  const out: string[] = []
  let done = 0
  let cancelled = false

  const onAbort = () => {
    cancelled = true
  }
  if (signal) {
    if (signal.aborted) return []
    signal.addEventListener('abort', onAbort)
  }

  // 简易并发控制
  const tasks = queue.map((url) => async () => {
    if (cancelled || signal?.aborted) return
    const data = await fetchImageAsDataURL(url, signal)
    if (cancelled || signal?.aborted) return
    done += 1
    if (data) out.push(data)
    onProgress?.({ done, total: queue.length, latest: data ?? undefined })
  })

  // 限并发执行
  await runConcurrent(tasks, MAX_CONCURRENT)

  if (signal) signal.removeEventListener('abort', onAbort)
  return out
}

async function runConcurrent<T>(tasks: (() => Promise<T>)[], limit: number): Promise<void> {
  const workers: Promise<void>[] = []
  let i = 0
  const next = async () => {
    const task = tasks[i++]
    if (!task) return
    try {
      await task()
    } catch {
      /* swallow */
    }
    if (i < tasks.length) {
      workers.push(next())
    }
  }
  for (let k = 0; k < Math.min(limit, tasks.length); k++) {
    workers.push(next())
  }
  await Promise.all(workers)
}

export async function fetchImageAsDataURL(
  url: string,
  signal?: AbortSignal,
): Promise<string | null> {
  if (url.startsWith('data:')) return url

  const sources = [url, ...PROXY_HOSTS.map((b) => b(url))]
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PER_IMAGE_TIMEOUT_MS)

  const onParentAbort = () => controller.abort()
  if (signal) {
    if (signal.aborted) {
      clearTimeout(timer)
      return null
    }
    signal.addEventListener('abort', onParentAbort)
  }

  try {
    // 用 allSettled 而不是 any：避免 fast-fail null 抢先被当作成功
    const results = await Promise.allSettled(
      sources.map((src) => tryDirect(src, controller.signal)),
    )
    if (signal?.aborted) return null
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) return r.value
    }
    return null
  } finally {
    clearTimeout(timer)
    controller.abort()
    if (signal) signal.removeEventListener('abort', onParentAbort)
  }
}

function tryDirect(src: string, signal: AbortSignal): Promise<string | null> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve(null)
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.referrerPolicy = 'no-referrer'
    let resolved = false
    const finish = (v: string | null) => {
      if (resolved) return
      resolved = true
      img.src = ''
      resolve(v)
    }
    img.onload = () => {
      try {
        const w = img.naturalWidth
        const h = img.naturalHeight
        if (w === 0 || h === 0) {
          finish(null)
          return
        }
        const scale = Math.min(1, MAX_SIDE / Math.max(w, h))
        const cw = Math.max(1, Math.round(w * scale))
        const ch = Math.max(1, Math.round(h * scale))
        const c = document.createElement('canvas')
        c.width = cw
        c.height = ch
        const ctx = c.getContext('2d')
        if (!ctx) {
          finish(null)
          return
        }
        ctx.drawImage(img, 0, 0, cw, ch)
        finish(c.toDataURL('image/jpeg', 0.68))
      } catch {
        finish(null)
      }
    }
    img.onerror = () => finish(null)
    img.onabort = () => finish(null)
    signal.addEventListener(
      'abort',
      () => finish(null),
      { once: true },
    )
    img.src = src
  })
}

export function mergeImages(prev: string[] | undefined, next: string[]): string[] {
  const seen = new Set(next)
  return [...(prev ?? []).filter((u) => !seen.has(u)), ...next]
}

export function selectImages(content: Pick<RippedContent, 'images'>, urls: string[]): string[] {
  return content.images
}
