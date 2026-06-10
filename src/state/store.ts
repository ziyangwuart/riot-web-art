import { create } from 'zustand'
import type {
  HistoryNode,
  Intensity,
  ProgressInfo,
  RiotState,
  RippedContent,
  Screen,
  StageStatus,
} from '../types'
import { fetchViaProxy } from '../riot/fetch/proxy'
import { ripContent } from '../riot/fetch/parse'
import { preloadImages, mergeImages } from '../riot/fetch/image'

const STORAGE_KEY = 'riot:last-url'

const initialProgress: ProgressInfo = {
  phase: 'idle',
  done: 0,
  total: 0,
  phaseText: '',
}

// 模块级：用来取消上一次未完成的图片预加载
let currentImageToken = 0

export const useStore = create<RiotState>((set, get) => ({
  screen: 'manifesto',
  intensity: 3,
  status: 'idle',
  target: '',
  content: null,
  paused: false,
  errorMessage: '',
  history: [],
  transitionKey: 0,
  progress: initialProgress,
  styleSeed: 0,

  ignite: async (rawUrl: string) => {
    const url = normalizeUrl(rawUrl)
    if (!url) {
      set({ errorMessage: '需要一个有效的 URL。', status: 'error' })
      return
    }
    const cur = get()
    const isNew = url !== cur.target

    // 取消上一次预加载（递增 token，旧的回调全部失效）
    currentImageToken += 1
    const myToken = currentImageToken
    const controller = new AbortController()

    set({
      target: url,
      status: 'fetching',
      screen: 'stage',
      errorMessage: '',
      content: isNew ? null : cur.content,
      transitionKey: isNew ? cur.transitionKey + 1 : cur.transitionKey,
      progress: { phase: 'fetching', done: 0, total: 0, phaseText: '占领中' },
    })

    try {
      // 阶段 1：拉 HTML（代理并行竞速）
      const html = await fetchViaProxy(url)
      if (myToken !== currentImageToken) return // 已被新页面取代

      // 阶段 2：解析，立即放行舞台（文字 + 链接先上场）
      const ripped = ripContent(html, url)
      if (
        ripped.textChunks.length === 0 &&
        ripped.images.length === 0 &&
        ripped.links.length === 0
      ) {
        throw new Error('抓取到了页面，但里面没剩下任何可暴动的素材。')
      }
      const content: RippedContent = { ...ripped, images: [] }
      set((s) => {
        const node: HistoryNode = { url, title: ripped.title || url }
        const last = s.history[s.history.length - 1]
        const next = last && last.url === url ? s.history : [...s.history, node]
        return {
          status: 'revolting',
          content,
          paused: false,
          history: next,
          progress: {
            phase: 'images',
            done: 0,
            total: Math.min(ripped.images.length, 10),
            phaseText: '补图中',
          },
        }
      })
      try {
        localStorage.setItem(STORAGE_KEY, url)
      } catch {
        /* localStorage may be disabled */
      }

      // 阶段 3：图片后台并行加载，拿到一张补一张
      if (ripped.images.length > 0) {
        preloadImages(
          ripped.images,
          (p) => {
            if (myToken !== currentImageToken) return
            set((s) => {
              if (!s.content || s.target !== url) return s
              const merged = mergeImages(s.content.images, p.latest ? [p.latest] : [])
              return {
                content: { ...s.content, images: merged },
                progress: { ...s.progress, done: p.done },
              }
            })
          },
          controller.signal,
        )
          .then((finalImgs) => {
            if (myToken !== currentImageToken) return
            set((s) => {
              if (!s.content || s.target !== url) return s
              return {
                content: { ...s.content, images: finalImgs },
                progress: { ...s.progress, phase: 'done' },
              }
            })
          })
          .catch(() => {
            /* aborted */
          })
      } else {
        set((s) => ({ progress: { ...s.progress, phase: 'done' } }))
      }
    } catch (err) {
      if (myToken !== currentImageToken) return // 旧任务失败不必管
      const msg = err instanceof Error ? err.message : '未知错误'
      set({ status: 'error', errorMessage: msg, screen: 'stage', progress: initialProgress })
    }
  },

  goBack: async () => {
    const hist = get().history
    if (hist.length <= 1) return
    const prev = hist[hist.length - 2]
    set({ history: hist.slice(0, -1) })
    await get().ignite(prev.url)
  },

  setIntensity: (i: Intensity) => set({ intensity: i }),
  togglePause: () => set((s) => ({ paused: !s.paused })),
  cycleStyle: () =>
    set((s) => ({ styleSeed: s.styleSeed + 1, transitionKey: s.transitionKey + 1 })),
  reset: () => {
    currentImageToken += 1
    set({
      screen: 'manifesto',
      status: 'idle',
      content: null,
      errorMessage: '',
      history: [],
      progress: initialProgress,
      styleSeed: 0,
    })
  },
  setScreen: (s: Screen) => set({ screen: s }),
  setError: (msg: string) => set({ errorMessage: msg, status: 'error' }),
}))

export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const u = new URL(withScheme)
    if (!u.hostname.includes('.')) return null
    return u.toString()
  } catch {
    return null
  }
}

export function loadLastUrl(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}
