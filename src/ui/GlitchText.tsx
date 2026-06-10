import { useEffect, useState } from 'react'

interface GlitchTextProps {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div'
}

export function GlitchText({ text, className = '', delay = 0, as: Tag = 'span' }: GlitchTextProps) {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    if (visible >= text.length) return
    const t = setTimeout(() => setVisible((v) => v + 1), delay)
    return () => clearTimeout(t)
  }, [visible, text.length, delay])

  return (
    <Tag className={className} data-text={text}>
      {text.slice(0, visible)}
      {visible < text.length && <span className="animate-blink text-riot">▍</span>}
    </Tag>
  )
}
