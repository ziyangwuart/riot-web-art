// 链接铁轨：底部贴边的可滚动链接条 + 导航历史走马灯
import { useRef } from 'react'
import type { HistoryNode, RippedLink } from '../../types'
import { useStore } from '../../state/store'

interface LinkRailProps {
  links: RippedLink[]
  history: HistoryNode[]
  onNavigate: (href: string) => void
}

export function LinkRail({ links, history, onNavigate }: LinkRailProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const goBack = useStore((s) => s.goBack)

  if (links.length === 0 && history.length <= 1) return null

  return (
    <div className="fixed left-0 right-0 bottom-0 z-40 pointer-events-none">
      <div className="bg-ink/90 border-t-2 border-riot/60 backdrop-blur-sm pointer-events-auto">
        {/* 导航历史走马灯 */}
        {history.length > 0 && (
          <div className="px-3 py-1.5 border-b border-paper/10 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <span className="font-mono text-[9px] text-paper/40 tracking-widest uppercase shrink-0">
              NAV ::
            </span>
            {history.length > 1 && (
              <button
                onClick={goBack}
                className="shrink-0 font-mono text-[10px] text-riot border border-riot/60 px-1.5 py-0.5 hover:bg-riot hover:text-paper transition-colors"
                title="返回上一页暴动"
              >
                ◀ BACK
              </button>
            )}
            {history.map((h, i) => {
              const isLast = i === history.length - 1
              return (
                <div key={`${h.url}-${i}`} className="flex items-center gap-1.5 shrink-0">
                  {i > 0 && <span className="text-paper/30 text-[10px]">›</span>}
                  <button
                    onClick={() => onNavigate(h.url)}
                    className={`font-mono text-[10px] uppercase tracking-wide max-w-[160px] truncate ${
                      isLast
                        ? 'text-paper bg-riot/30 border border-riot px-1.5 py-0.5'
                        : 'text-paper/60 hover:text-paper border border-paper/20 hover:border-paper/60 px-1.5 py-0.5'
                    }`}
                    title={h.title}
                  >
                    {i + 1}. {stripScheme(h.url)}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* 链接铁轨 */}
        {links.length > 0 && (
          <div className="px-3 py-2 flex items-center gap-2">
            <span className="font-mono text-[9px] text-riot tracking-widest uppercase shrink-0">
              CAPTURED LINKS
            </span>
            <span className="text-paper/30 font-mono text-[10px] shrink-0">({links.length})</span>
            <span className="text-paper/20 font-mono text-[10px] shrink-0">▸</span>
            <div
              ref={railRef}
              className="flex-1 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap py-1"
              style={{ scrollbarWidth: 'thin' }}
            >
              {links.slice(0, 60).map((l, i) => (
                <button
                  key={`${l.href}-${i}`}
                  onClick={() => onNavigate(l.href)}
                  className="shrink-0 inline-flex items-center gap-1 bg-paper text-ink hover:bg-riot hover:text-paper border border-ink hover:border-riot px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide max-w-[220px] truncate transition-colors"
                  title={l.href}
                >
                  <span className="text-riot group-hover:text-paper">▸</span>
                  <span className="truncate">{l.text}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => railRef.current?.scrollBy({ left: 240, behavior: 'smooth' })}
              className="shrink-0 font-mono text-[10px] text-paper/60 hover:text-riot border border-paper/30 hover:border-riot px-1.5 py-0.5"
            >
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function stripScheme(url: string): string {
  return url.replace(/^https?:\/\//, '').slice(0, 32)
}
