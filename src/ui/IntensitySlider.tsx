import type { Intensity } from '../types'

const LABELS: Record<Intensity, string> = {
  1: 'DEMO 示威',
  2: 'SHOVE 推搡',
  3: 'CLASH 冲突',
  4: 'RIOT 暴动',
  5: 'WAR 巷战',
}

interface IntensitySliderProps {
  value: Intensity
  onChange: (i: Intensity) => void
}

export function IntensitySlider({ value, onChange }: IntensitySliderProps) {
  return (
    <div className="flex flex-col gap-1 select-none">
      <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-widest text-paper/70">
        <span>强度 / Intensity</span>
        <span className="text-riot font-bold">{value} / 5</span>
      </div>
      <div className="flex gap-1">
        {([1, 2, 3, 4, 5] as Intensity[]).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`group relative h-5 flex-1 border border-paper/40 transition-all ${
              n <= value ? 'bg-riot border-riot' : 'bg-transparent hover:bg-paper/10'
            }`}
            aria-label={`Set intensity to ${n}`}
          >
            <span
              className={`absolute inset-0 flex items-center justify-center text-[9px] font-mono ${
                n <= value ? 'text-paper' : 'text-paper/50 group-hover:text-paper'
              }`}
            >
              {n}
            </span>
          </button>
        ))}
      </div>
      <div className="font-stencil text-[10px] uppercase tracking-widest text-riot">
        {LABELS[value]}
      </div>
    </div>
  )
}
