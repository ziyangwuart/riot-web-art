interface StampProps {
  text: string
  rotate?: number
  size?: number
  color?: 'riot' | 'paper' | 'flare'
  className?: string
}

export function Stamp({
  text,
  rotate = -8,
  size = 1,
  color = 'riot',
  className = '',
}: StampProps) {
  const colorMap = {
    riot: 'text-riot border-riot',
    paper: 'text-paper border-paper',
    flare: 'text-flare border-flare',
  }
  return (
    <div
      className={`inline-flex items-center justify-center border-2 px-3 py-1 font-stencil uppercase tracking-widest ${colorMap[color]} ${className}`}
      style={{
        transform: `rotate(${rotate}deg) scale(${size})`,
        fontSize: `${0.8 * size}rem`,
        letterSpacing: `${0.2 * size}em`,
        opacity: 0.92,
        boxShadow: `inset 0 0 0 1px currentColor, 0 0 0 1px currentColor`,
        background: 'rgba(10,10,10,0.4)',
      }}
    >
      <span style={{ textShadow: '1px 0 0 currentColor, -1px 0 0 currentColor' }}>{text}</span>
    </div>
  )
}
