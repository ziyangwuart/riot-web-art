// 暴动视觉风格预设 — 全部 90s 网络艺术美学
// 调色板、字体栈、滤镜、纹理、字距、字号、透明度、mix-blend、噪音、超链接下划线、虚空黑块、图像叠印

import type { CSSProperties } from 'react'

export type CssVarStyle = CSSProperties

export interface StyleAddons {
  blackVoids: boolean       // 黑色"虚空"块（Mark Napier 原版标志）
  imageRepeats: boolean     // 同一图像多重叠印
  underlinedLinks: boolean  // 超链接带下划线
  hearts: boolean           // 90s 留言板 / 紫色爱心
  stripes: 'diagonal' | 'horizontal' | 'none'  // 警示条
  repeatingBg: boolean      // 平铺背景纹理
  cursor: 'crosshair' | 'pointer' | 'wait' | 'default'
  scrollbar: 'classic' | 'modern' | 'invisible'
  marquee: 'scroll' | 'alternate' | 'none'  // 90s 经典滚动
}

export interface StylePreset {
  id: string
  name: string
  nameEn: string
  tagline: string
  palette: {
    ink: string
    primary: string
    secondary: string
    accent: string
    shadow: string
    shadow2: string
    glow: string
    grid: string
    inkShadow: string
    void: string
    paper: string
  }
  fonts: {
    marker: string
    stencil: string
    typewriter: string
    mono: string
    display: string
    han: string
    zhi: string
  }
  filter: string
  bgPattern: 'grid' | 'stripes' | 'scan' | 'radial' | 'plain'
  letterSpacing: string
  sizeMul: number
  opacityMul: number
  mixBlend: string
  noise: number
  signs: string[]
  addons: StyleAddons
}

const TIMES = '"Times New Roman", Times, "Songti SC", "Noto Serif SC", serif'
const COURIER = '"Courier New", Courier, monospace'
const ARIAL = 'Arial, Helvetica, "PingFang SC", "Microsoft YaHei", sans-serif'
const COMIC = '"Comic Sans MS", "Comic Sans", cursive'

export const STYLE_PRESETS: StylePreset[] = [
  // ───── THE REFERENCE ─────
  {
    id: 'netscape',
    name: 'Netscape',
    nameEn: 'NETSCAPE 1998',
    tagline: 'the original riot',
    palette: {
      ink: '#ffcc00',          // 标志性的黄
      primary: '#0000ee',      // 经典链接蓝
      secondary: '#000080',    // 海军蓝
      accent: '#ff0000',       // 警示红
      shadow: '#000000',       // 黑色虚空
      shadow2: '#444444',
      glow: 'rgba(255, 204, 0, 0.4)',
      grid: 'rgba(0, 0, 238, 0.25)',
      inkShadow: '#000000',
      void: '#000000',
      paper: '#ffffff',
    },
    fonts: {
      marker: TIMES,
      stencil: TIMES,
      typewriter: COURIER,
      mono: COURIER,
      display: TIMES,
      han: TIMES,
      zhi: TIMES,
    },
    filter: 'none',
    bgPattern: 'plain',
    letterSpacing: '0em',
    sizeMul: 1,
    opacityMul: 1,
    mixBlend: 'normal',
    noise: 0.25,
    signs: ['HOME', 'NEXT', 'BOOKMARK', 'TOP OF PAGE'],
    addons: {
      blackVoids: true,
      imageRepeats: true,
      underlinedLinks: true,
      hearts: false,
      stripes: 'none',
      repeatingBg: false,
      cursor: 'crosshair',
      scrollbar: 'classic',
      marquee: 'scroll',
    },
  },
  // ───── WEBMASTER ─────
  {
    id: 'webmaster',
    name: '站长',
    nameEn: 'WEBMASTER 1997',
    tagline: 'maroon + table layout',
    palette: {
      ink: '#c0c0c0',          // 灰银
      primary: '#800000',      // 酒红
      secondary: '#222222',
      accent: '#ffcc00',
      shadow: '#666666',
      shadow2: '#999999',
      glow: 'rgba(128, 0, 0, 0.18)',
      grid: 'rgba(128, 0, 0, 0.2)',
      inkShadow: '#800000',
      void: '#000000',
      paper: '#ffffff',
    },
    fonts: {
      marker: TIMES,
      stencil: TIMES,
      typewriter: COURIER,
      mono: COURIER,
      display: '"Times New Roman", Times, serif',
      han: TIMES,
      zhi: TIMES,
    },
    filter: 'contrast(1.05)',
    bgPattern: 'grid',
    letterSpacing: '0.02em',
    sizeMul: 1,
    opacityMul: 1,
    mixBlend: 'normal',
    noise: 0.4,
    signs: ['GUESTBOOK', 'AWARDS', 'WEBRING', 'NEXT 5 ›'],
    addons: {
      blackVoids: false,
      imageRepeats: true,
      underlinedLinks: true,
      hearts: false,
      stripes: 'none',
      repeatingBg: true,
      cursor: 'crosshair',
      scrollbar: 'classic',
      marquee: 'alternate',
    },
  },
  // ───── CONSTRUCTION ─────
  {
    id: 'construction',
    name: '施工中',
    nameEn: 'UNDER CONSTRUCTION',
    tagline: 'animated GIF energy',
    palette: {
      ink: '#000000',
      primary: '#ffcc00',
      secondary: '#ffffff',
      accent: '#ff0000',
      shadow: '#1a1a1a',
      shadow2: '#333333',
      glow: 'rgba(255, 204, 0, 0.25)',
      grid: 'rgba(255, 204, 0, 0.35)',
      inkShadow: '#000000',
      void: '#000000',
      paper: '#ffffff',
    },
    fonts: {
      marker: COURIER,
      stencil: '"Courier New", Courier, monospace',
      typewriter: COURIER,
      mono: COURIER,
      display: '"Courier New", Courier, monospace',
      han: COURIER,
      zhi: COURIER,
    },
    filter: 'none',
    bgPattern: 'stripes',
    letterSpacing: '0.1em',
    sizeMul: 1.05,
    opacityMul: 1,
    mixBlend: 'normal',
    noise: 0.5,
    signs: ['UNDER CONSTRUCTION', 'TUNNEL', 'COMING SOON', 'BEST VIEWED IN 800x600'],
    addons: {
      blackVoids: true,
      imageRepeats: true,
      underlinedLinks: true,
      hearts: false,
      stripes: 'diagonal',
      repeatingBg: true,
      cursor: 'wait',
      scrollbar: 'modern',
      marquee: 'scroll',
    },
  },
  // ───── WEBRING ─────
  {
    id: 'webring',
    name: '环链',
    nameEn: 'WEBRING 1999',
    tagline: 'circular navigation',
    palette: {
      ink: '#003300',          // 深绿
      primary: '#66ff99',      // 霓虹绿
      secondary: '#ccffcc',
      accent: '#ffff66',
      shadow: '#001a00',
      shadow2: '#004d00',
      glow: 'rgba(102, 255, 153, 0.22)',
      grid: 'rgba(102, 255, 153, 0.25)',
      inkShadow: '#000000',
      void: '#000000',
      paper: '#001a00',
    },
    fonts: {
      marker: TIMES,
      stencil: '"Times New Roman", Times, serif',
      typewriter: COURIER,
      mono: COURIER,
      display: '"Times New Roman", Times, serif',
      han: TIMES,
      zhi: TIMES,
    },
    filter: 'contrast(1.1) saturate(1.1)',
    bgPattern: 'radial',
    letterSpacing: '0em',
    sizeMul: 1,
    opacityMul: 1,
    mixBlend: 'screen',
    noise: 0.3,
    signs: ['◂ PREV', 'NEXT ▸', 'RANDOM', 'JOIN RING'],
    addons: {
      blackVoids: false,
      imageRepeats: true,
      underlinedLinks: true,
      hearts: false,
      stripes: 'none',
      repeatingBg: false,
      cursor: 'crosshair',
      scrollbar: 'classic',
      marquee: 'scroll',
    },
  },
  // ───── GUESTBOOK ─────
  {
    id: 'guestbook',
    name: '留言板',
    nameEn: 'GUESTBOOK ♥',
    tagline: 'purple hearts forever',
    palette: {
      ink: '#ffccff',          // 粉紫
      primary: '#cc33cc',      // 紫
      secondary: '#330066',
      accent: '#ff66cc',
      shadow: '#cc99cc',
      shadow2: '#aa66aa',
      glow: 'rgba(204, 51, 204, 0.22)',
      grid: 'rgba(204, 51, 204, 0.22)',
      inkShadow: '#330066',
      void: '#000000',
      paper: '#ffffff',
    },
    fonts: {
      marker: COMIC,
      stencil: '"Comic Sans MS", "Comic Sans", cursive',
      typewriter: COURIER,
      mono: COURIER,
      display: '"Comic Sans MS", "Comic Sans", cursive',
      han: '"Comic Sans MS", "Comic Sans", cursive',
      zhi: '"Comic Sans MS", "Comic Sans", cursive',
    },
    filter: 'contrast(1.05) saturate(1.1)',
    bgPattern: 'plain',
    letterSpacing: '0.02em',
    sizeMul: 1.05,
    opacityMul: 1,
    mixBlend: 'normal',
    noise: 0.35,
    signs: ['SIGN HERE!', '♥ THANKS 4 VISITING ♥', 'RATE MY PAGE', 'ADD TO FAVES'],
    addons: {
      blackVoids: false,
      imageRepeats: true,
      underlinedLinks: true,
      hearts: true,
      stripes: 'none',
      repeatingBg: true,
      cursor: 'pointer',
      scrollbar: 'classic',
      marquee: 'alternate',
    },
  },
  // ───── PLAIN HTML ─────
  {
    id: 'plain',
    name: '原味',
    nameEn: 'PLAIN HTML',
    tagline: 'no CSS, just love',
    palette: {
      ink: '#ffffff',
      primary: '#0000ee',
      secondary: '#000000',
      accent: '#ff0000',
      shadow: '#cccccc',
      shadow2: '#666666',
      glow: 'rgba(0, 0, 238, 0.05)',
      grid: 'rgba(0, 0, 0, 0.1)',
      inkShadow: '#000000',
      void: '#000000',
      paper: '#ffffff',
    },
    fonts: {
      marker: TIMES,
      stencil: '"Times New Roman", Times, serif',
      typewriter: COURIER,
      mono: COURIER,
      display: '"Times New Roman", Times, serif',
      han: TIMES,
      zhi: TIMES,
    },
    filter: 'none',
    bgPattern: 'plain',
    letterSpacing: '0em',
    sizeMul: 1,
    opacityMul: 0.95,
    mixBlend: 'normal',
    noise: 0.15,
    signs: ['[home]', '[back]', '[top]', '[email me]'],
    addons: {
      blackVoids: false,
      imageRepeats: false,
      underlinedLinks: true,
      hearts: false,
      stripes: 'none',
      repeatingBg: false,
      cursor: 'default',
      scrollbar: 'classic',
      marquee: 'none',
    },
  },
  // ───── TERMINAL ─────
  {
    id: 'terminal',
    name: '终端',
    nameEn: 'TERMINAL',
    tagline: 'green phosphor',
    palette: {
      ink: '#000000',
      primary: '#33ff33',
      secondary: '#aaffaa',
      accent: '#ffff33',
      shadow: '#001a00',
      shadow2: '#003300',
      glow: 'rgba(51, 255, 51, 0.25)',
      grid: 'rgba(51, 255, 51, 0.2)',
      inkShadow: '#000000',
      void: '#000000',
      paper: '#000000',
    },
    fonts: {
      marker: COURIER,
      stencil: '"Courier New", Courier, monospace',
      typewriter: COURIER,
      mono: COURIER,
      display: '"Courier New", Courier, monospace',
      han: COURIER,
      zhi: COURIER,
    },
    filter: 'none',
    bgPattern: 'scan',
    letterSpacing: '0em',
    sizeMul: 1,
    opacityMul: 1,
    mixBlend: 'screen',
    noise: 0.2,
    signs: ['$ ls -la', '> ACCESS', '> REBOOT', '> cd /riot'],
    addons: {
      blackVoids: false,
      imageRepeats: false,
      underlinedLinks: false,
      hearts: false,
      stripes: 'none',
      repeatingBg: false,
      cursor: 'wait',
      scrollbar: 'invisible',
      marquee: 'none',
    },
  },
  // ───── ZINE ─────
  {
    id: 'zine',
    name: '复印',
    nameEn: 'ZINE / XEROX',
    tagline: 'cut & paste',
    palette: {
      ink: '#f4f1de',
      primary: '#0a0a0a',
      secondary: '#0a0a0a',
      accent: '#d72638',
      shadow: '#d6d3d1',
      shadow2: '#a8a29e',
      glow: 'rgba(0, 0, 0, 0.06)',
      grid: 'rgba(0, 0, 0, 0.2)',
      inkShadow: '#0a0a0a',
      void: '#000000',
      paper: '#ffffff',
    },
    fonts: {
      marker: '"Special Elite", "Courier New", monospace',
      stencil: '"Special Elite", "Courier New", monospace',
      typewriter: '"Special Elite", "Courier New", monospace',
      mono: '"Space Mono", "Courier New", monospace',
      display: '"Special Elite", "Courier New", monospace',
      han: '"Special Elite", "Courier New", monospace',
      zhi: '"Special Elite", "Courier New", monospace',
    },
    filter: 'contrast(1.15) grayscale(0.2)',
    bgPattern: 'plain',
    letterSpacing: '0.05em',
    sizeMul: 1,
    opacityMul: 0.95,
    mixBlend: 'multiply',
    noise: 0.7,
    signs: ['COPY', 'XEROX', 'READ', 'DISTRIBUTE'],
    addons: {
      blackVoids: true,
      imageRepeats: true,
      underlinedLinks: false,
      hearts: false,
      stripes: 'none',
      repeatingBg: false,
      cursor: 'default',
      scrollbar: 'modern',
      marquee: 'none',
    },
  },
]

export function hashStr(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function pickStyleFor(url: string): StylePreset {
  const idx = hashStr(url || 'default') % STYLE_PRESETS.length
  return STYLE_PRESETS[idx]
}

export function styleToCssVars(s: StylePreset): CssVarStyle {
  return {
    ['--primary' as string]: s.palette.primary,
    ['--secondary' as string]: s.palette.secondary,
    ['--accent' as string]: s.palette.accent,
    ['--ink' as string]: s.palette.ink,
    ['--shadow' as string]: s.palette.shadow,
    ['--grid' as string]: s.palette.grid,
    ['--glow' as string]: s.palette.glow,
    ['--ink-shadow' as string]: s.palette.inkShadow,
    ['--void' as string]: s.palette.void,
    ['--paper' as string]: s.palette.paper,
  }
}
