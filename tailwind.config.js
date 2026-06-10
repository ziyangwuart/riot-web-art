/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 全部改用 CSS 变量，可在 :root / [data-style] 里覆盖
        ink: 'var(--ink)',
        riot: 'var(--primary)',
        paper: 'var(--secondary)',
        flare: 'var(--accent)',
        smoke: 'var(--shadow)',
        ash: 'var(--shadow-2)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        shadow: 'var(--shadow)',
        'shadow-2': 'var(--shadow-2)',
      },
      fontFamily: {
        marker: 'var(--font-marker), cursive',
        stencil: 'var(--font-stencil), sans-serif',
        typewriter: 'var(--font-typewriter), monospace',
        mono: 'var(--font-mono), monospace',
        display: 'var(--font-display), sans-serif',
        han: 'var(--font-han), serif',
        zhi: 'var(--font-zhi), cursive',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        stamp: {
          '0%': { transform: 'rotate(-15deg) scale(2)', opacity: '0' },
          '60%': { transform: 'rotate(-12deg) scale(1)', opacity: '1' },
          '100%': { transform: 'rotate(-8deg) scale(1)', opacity: '1' },
        },
        glitchX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-3px)' },
          '40%': { transform: 'translateX(2px)' },
          '60%': { transform: 'translateX(-1px)' },
          '80%': { transform: 'translateX(3px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translate(0,0) rotate(0)' },
          '20%': { transform: 'translate(-1px,1px) rotate(-0.5deg)' },
          '40%': { transform: 'translate(2px,-1px) rotate(0.6deg)' },
          '60%': { transform: 'translate(-2px,2px) rotate(-0.3deg)' },
          '80%': { transform: 'translate(1px,-2px) rotate(0.4deg)' },
        },
        flickerOn: {
          '0%': { opacity: '0', filter: 'brightness(3) blur(4px)' },
          '40%': { opacity: '0.7' },
          '70%': { filter: 'brightness(1.5) blur(0)' },
          '100%': { opacity: '1', filter: 'brightness(1) blur(0)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        rise: {
          '0%': { transform: 'translateY(100vh)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-20vh)', opacity: '0' },
        },
        drop: {
          '0%': { transform: 'translateY(-30vh) rotate(-12deg)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(18deg)', opacity: '0.9' },
        },
        burn: {
          '0%, 100%': { filter: 'contrast(1) hue-rotate(0deg)' },
          '50%': { filter: 'contrast(1.4) hue-rotate(20deg)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '10%': { transform: 'scale(1.05)' },
          '20%': { transform: 'scale(0.97)' },
          '30%': { transform: 'scale(1.03)' },
        },
      },
      animation: {
        flicker: 'flicker 1.6s ease-in-out infinite',
        stamp: 'stamp 0.6s ease-out forwards',
        glitchX: 'glitchX 0.3s steps(4) infinite',
        shake: 'shake 0.4s ease-in-out infinite',
        flickerOn: 'flickerOn 0.5s ease-out forwards',
        scan: 'scan 3s linear infinite',
        marquee: 'marquee 18s linear infinite',
        rise: 'rise 14s linear infinite',
        drop: 'drop 7s linear infinite',
        burn: 'burn 0.8s ease-in-out infinite',
        blink: 'blink 1s steps(1) infinite',
        heartbeat: 'heartbeat 0.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
