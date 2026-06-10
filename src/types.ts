export type Screen = 'manifesto' | 'stage'
export type Intensity = 1 | 2 | 3 | 4 | 5
export type StageStatus = 'idle' | 'fetching' | 'parsing' | 'revolting' | 'error'

export interface RippedLink {
  text: string
  href: string
  host: string
}

export interface RippedContent {
  source: string
  title: string
  textChunks: string[]
  words: string[]
  images: string[]
  links: RippedLink[]
}

export interface HistoryNode {
  url: string
  title: string
}

export interface ProgressInfo {
  phase: 'idle' | 'fetching' | 'parsing' | 'images' | 'done'
  done: number
  total: number
  phaseText: string
}

export interface RiotState {
  screen: Screen
  intensity: Intensity
  status: StageStatus
  target: string
  content: RippedContent | null
  paused: boolean
  errorMessage: string
  history: HistoryNode[]
  transitionKey: number
  progress: ProgressInfo
  styleSeed: number
  ignite: (url: string) => Promise<void>
  goBack: () => Promise<void>
  cycleStyle: () => void
  setIntensity: (i: Intensity) => void
  togglePause: () => void
  reset: () => void
  setScreen: (s: Screen) => void
  setError: (msg: string) => void
}
