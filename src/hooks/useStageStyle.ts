// 根据 URL + 用户 seed 选当前舞台的视觉风格
import { useMemo } from 'react'
import { STYLE_PRESETS, type StylePreset, hashStr } from '../riot/styles'
import { useStore } from '../state/store'

export function useStageStyle(): StylePreset {
  const url = useStore((s) => s.target)
  const seed = useStore((s) => s.styleSeed)
  return useMemo(() => {
    const base = hashStr(url || 'default')
    const idx = (base + seed) % STYLE_PRESETS.length
    return STYLE_PRESETS[idx]
  }, [url, seed])
}
