import { useEffect, useRef, useState } from 'react'
import { useStore, loadLastUrl, normalizeUrl } from '../state/store'
import { GlitchText } from '../ui/GlitchText'
import { Stamp } from '../ui/Stamp'

const PRESETS = [
  { label: 'baidu.com', url: 'baidu.com', tag: '搜索引擎' },
  { label: 'cnn.com', url: 'cnn.com', tag: '新闻媒体' },
  { label: '新华网', url: 'xinhuanet.com', tag: '中文媒体' },
  { label: '新浪', url: 'sina.com.cn', tag: '门户' },
  { label: '人民日报', url: 'people.com.cn', tag: '机关报' },
  { label: 'wired.com', url: 'wired.com', tag: '科技' },
]

export function ManifestoScreen() {
  const ignite = useStore((s) => s.ignite)
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const last = loadLastUrl()
    if (last) setValue(last)
    setTimeout(() => inputRef.current?.focus(), 600)
  }, [])

  const submit = (raw: string) => {
    const norm = normalizeUrl(raw)
    if (!norm) {
      setShake(true)
      setError('✕ 无效地址')
      setTimeout(() => setShake(false), 500)
      setTimeout(() => setError(''), 2200)
      return
    }
    ignite(norm)
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-ink text-paper select-none">
      {/* 背景：旋转的标语 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-40 w-[150%] -rotate-12 opacity-[0.06]">
          <div className="font-stencil text-paper text-[14rem] leading-none whitespace-nowrap animate-marquee">
            BURN THE FEED · KILL THE NOISE · OCCUPY THE PIXEL · RIOT IS A LANGUAGE · RIOT IS A LANGUAGE ·
          </div>
        </div>
        <div className="absolute -bottom-20 -right-40 w-[150%] -rotate-6 opacity-[0.05]">
          <div className="font-marker text-riot text-[10rem] leading-none whitespace-nowrap animate-marquee">
            ✦ DON'T READ THE NEWS, REWRITE IT ✦ DON'T READ THE NEWS, REWRITE IT ✦
          </div>
        </div>
      </div>

      {/* 角落印章 */}
      <div className="absolute top-6 left-6 z-20">
        <Stamp text="NO PEACE" rotate={-12} size={0.95} color="riot" />
      </div>
      <div className="absolute top-6 right-6 z-20">
        <Stamp text="BURN THE FEED" rotate={8} size={0.85} color="paper" />
      </div>
      <div className="absolute bottom-16 left-6 z-20 hidden md:block">
        <Stamp text="after M.NAPIER 1999" rotate={-4} size={0.7} color="flare" />
      </div>
      <div className="absolute bottom-16 right-6 z-20 hidden md:block">
        <Stamp text="EST. RIOT//2026" rotate={5} size={0.7} color="paper" />
      </div>

      {/* 中央内容 */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        {/* 副标 */}
        <div className="mb-4 flex items-center gap-3 text-paper/60 font-mono text-[10px] tracking-[0.4em] uppercase">
          <span className="w-8 h-px bg-riot" />
          <span>web art piece no. 001</span>
          <span className="w-8 h-px bg-riot" />
        </div>

        {/* 主标 */}
        <div className={`mb-3 ${shake ? 'animate-glitchX' : ''}`}>
          <h1
            className="glitch font-stencil text-paper text-[clamp(4rem,18vw,16rem)] leading-[0.85] tracking-tight text-center"
            data-text="RIOT"
            style={{ textShadow: '6px 6px 0 #d72638' }}
          >
            RIOT
          </h1>
        </div>

        <div className="mb-8 max-w-2xl text-center px-4">
          <p className="font-han text-paper/85 text-base md:text-lg leading-relaxed">
            输<span className="text-riot">入</span>一个网站，把它的文字、图片、链接拉进街头——
            <span className="font-marker text-riot"> 让它们上街。</span>
          </p>
          <p className="mt-2 font-mono text-[10px] text-paper/40 tracking-widest uppercase">
            type a URL · press enter · watch the page rebel
          </p>
        </div>

        {/* 输入框 */}
        <div className={`w-full max-w-3xl ${shake ? 'animate-glitchX' : ''}`}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit(value)
            }}
            className="flex items-stretch gap-0 border-2 border-paper bg-ink/80 backdrop-blur-sm riot-border"
          >
            <span className="px-3 md:px-4 flex items-center font-mono text-riot text-sm md:text-base select-none">
              ▸
            </span>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="www.example.com"
              className="flex-1 bg-transparent text-paper placeholder:text-paper/30 no-cursor font-mono text-sm md:text-lg py-3 md:py-4 px-1 outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              className="bg-riot text-paper font-stencil uppercase tracking-widest text-xs md:text-sm px-4 md:px-7 py-3 md:py-4 hover:bg-paper hover:text-ink transition-colors border-l-2 border-paper"
            >
              起义
              <span className="hidden md:inline ml-2 opacity-60">↵</span>
            </button>
          </form>

          <div className="mt-3 min-h-[1.25rem] font-mono text-[11px] text-riot/90">
            {error}
          </div>
        </div>

        {/* 范例 */}
        <div className="mt-2 w-full max-w-3xl">
          <div className="text-paper/40 font-mono text-[10px] tracking-widest uppercase mb-2">
            ◦ burn one of these ◦
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.url}
                onClick={() => submit(p.url)}
                className="group relative border border-riot/40 bg-ink/60 hover:bg-riot hover:text-paper text-paper/85 px-3 py-1.5 font-mono text-xs transition-all"
                title={p.tag}
              >
                <span className="opacity-50 group-hover:opacity-100 mr-2">▸</span>
                {p.label}
                <span className="ml-2 text-paper/40 group-hover:text-paper/80 text-[10px]">
                  {p.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-10 text-paper/30 font-mono text-[9px] tracking-widest uppercase text-center">
          works best on desktop · no data is stored · all chaos is local
        </div>
      </div>

      {/* 角落 4 句口号，循环淡入 */}
      <div className="absolute top-1/2 left-2 -translate-y-1/2 hidden lg:flex flex-col gap-12 pointer-events-none">
        {['SCROLL NO MORE', 'UNFOLLOW', 'OCCUPY', 'MUTINY'].map((t, i) => (
          <div
            key={t}
            className="font-marker text-riot text-xs -rotate-90 origin-left whitespace-nowrap opacity-40"
            style={{ animation: `flicker 3s ${i * 0.7}s infinite` }}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  )
}
