/* Purely decorative animated pitch — no client JS needed */

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {/* Ambient colour orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#00ff85]/5 blur-[100px] animate-float-slow" />
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full bg-[#00b4ff]/4 blur-[120px] animate-float-slow delay-700" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#00ff85]/3 blur-[80px] animate-float-slow delay-400" />

      {/* Animated SVG pitch */}
      <svg
        viewBox="0 0 900 520"
        className="absolute inset-0 w-full h-full opacity-[0.18]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow-sm">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-md">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Pitch outline */}
        <rect x="60" y="30" width="780" height="460" fill="none" stroke="#00ff85" strokeWidth="1.5" opacity="0.6" />

        {/* Centre line */}
        <line x1="450" y1="30" x2="450" y2="490" stroke="#00ff85" strokeWidth="1" opacity="0.4" />

        {/* Centre circle */}
        <circle cx="450" cy="260" r="80" fill="none" stroke="#00ff85" strokeWidth="1" opacity="0.45" />

        {/* Centre spot */}
        <circle cx="450" cy="260" r="4" fill="#00ff85" opacity="0.9" filter="url(#glow-sm)" className="animate-pulse-glow" />

        {/* Left penalty box */}
        <rect x="60" y="145" width="160" height="230" fill="none" stroke="#00ff85" strokeWidth="1" opacity="0.4" />
        {/* Left 6-yard box */}
        <rect x="60" y="195" width="60" height="130" fill="none" stroke="#00ff85" strokeWidth="0.8" opacity="0.3" />
        {/* Left penalty spot */}
        <circle cx="170" cy="260" r="2.5" fill="#00ff85" opacity="0.5" />
        {/* Left goal */}
        <rect x="34" y="225" width="26" height="70" fill="none" stroke="#00ff85" strokeWidth="1.2" opacity="0.5" />

        {/* Right penalty box */}
        <rect x="680" y="145" width="160" height="230" fill="none" stroke="#00ff85" strokeWidth="1" opacity="0.4" />
        {/* Right 6-yard box */}
        <rect x="780" y="195" width="60" height="130" fill="none" stroke="#00ff85" strokeWidth="0.8" opacity="0.3" />
        {/* Right penalty spot */}
        <circle cx="730" cy="260" r="2.5" fill="#00ff85" opacity="0.5" />
        {/* Right goal */}
        <rect x="840" y="225" width="26" height="70" fill="none" stroke="#00ff85" strokeWidth="1.2" opacity="0.5" />

        {/* Corner arcs */}
        <path d="M60 30 Q75 30 75 45" fill="none" stroke="#00ff85" strokeWidth="1" opacity="0.3" />
        <path d="M840 30 Q825 30 825 45" fill="none" stroke="#00ff85" strokeWidth="1" opacity="0.3" />
        <path d="M60 490 Q75 490 75 475" fill="none" stroke="#00ff85" strokeWidth="1" opacity="0.3" />
        <path d="M840 490 Q825 490 825 475" fill="none" stroke="#00ff85" strokeWidth="1" opacity="0.3" />

        {/* ── Green team (attacking right) ── */}
        {/* GK */}
        <circle cx="110" cy="260" r="6" fill="#00ff85" opacity="0.95" filter="url(#glow-sm)" className="animate-player-1 delay-200" />
        {/* CB left */}
        <circle cx="210" cy="195" r="6" fill="#00ff85" opacity="0.9" filter="url(#glow-sm)" className="animate-player-2 delay-300" />
        {/* CB right */}
        <circle cx="210" cy="325" r="6" fill="#00ff85" opacity="0.9" filter="url(#glow-sm)" className="animate-player-1 delay-100" />
        {/* LB */}
        <circle cx="195" cy="140" r="6" fill="#00ff85" opacity="0.85" className="animate-player-3 delay-200" />
        {/* RB */}
        <circle cx="195" cy="380" r="6" fill="#00ff85" opacity="0.85" className="animate-player-2 delay-400" />
        {/* CM left */}
        <circle cx="330" cy="210" r="6" fill="#00ff85" opacity="0.9" filter="url(#glow-sm)" className="animate-player-3 delay-100" />
        {/* CM right */}
        <circle cx="330" cy="310" r="6" fill="#00ff85" opacity="0.9" filter="url(#glow-sm)" className="animate-player-1 delay-500" />
        {/* CAM */}
        <circle cx="370" cy="260" r="6" fill="#00ff85" opacity="0.95" filter="url(#glow-sm)" className="animate-player-2 delay-200" />
        {/* LW */}
        <circle cx="430" cy="155" r="6" fill="#00ff85" opacity="0.9" className="animate-player-1 delay-300" />
        {/* RW */}
        <circle cx="430" cy="365" r="6" fill="#00ff85" opacity="0.9" className="animate-player-3 delay-400" />
        {/* ST */}
        <circle cx="490" cy="260" r="6" fill="#00ff85" opacity="0.95" filter="url(#glow-sm)" className="animate-player-2 delay-100" />

        {/* ── Blue team (defending right) ── */}
        {/* GK */}
        <circle cx="790" cy="260" r="6" fill="#00b4ff" opacity="0.95" filter="url(#glow-sm)" className="animate-player-2 delay-100" />
        {/* CB left */}
        <circle cx="690" cy="205" r="6" fill="#00b4ff" opacity="0.9" filter="url(#glow-sm)" className="animate-player-1 delay-400" />
        {/* CB right */}
        <circle cx="690" cy="315" r="6" fill="#00b4ff" opacity="0.9" filter="url(#glow-sm)" className="animate-player-3 delay-200" />
        {/* LB */}
        <circle cx="705" cy="145" r="6" fill="#00b4ff" opacity="0.85" className="animate-player-2 delay-500" />
        {/* RB */}
        <circle cx="705" cy="375" r="6" fill="#00b4ff" opacity="0.85" className="animate-player-1 delay-300" />
        {/* CM left */}
        <circle cx="570" cy="215" r="6" fill="#00b4ff" opacity="0.9" filter="url(#glow-sm)" className="animate-player-3 delay-100" />
        {/* CM right */}
        <circle cx="570" cy="305" r="6" fill="#00b4ff" opacity="0.9" filter="url(#glow-sm)" className="animate-player-2 delay-200" />
        {/* CAM */}
        <circle cx="530" cy="260" r="6" fill="#00b4ff" opacity="0.95" filter="url(#glow-sm)" className="animate-player-1 delay-300" />
        {/* LW */}
        <circle cx="465" cy="160" r="6" fill="#00b4ff" opacity="0.9" className="animate-player-3 delay-400" />
        {/* RW */}
        <circle cx="465" cy="360" r="6" fill="#00b4ff" opacity="0.9" className="animate-player-2 delay-100" />
        {/* ST */}
        <circle cx="400" cy="260" r="6" fill="#00b4ff" opacity="0.95" filter="url(#glow-sm)" className="animate-player-1 delay-200" />

        {/* Ball */}
        <circle cx="450" cy="260" r="7" fill="white" opacity="0.95" filter="url(#glow-md)" className="animate-player-1 delay-100" />

        {/* Pitch stripe (subtle) */}
        {[0,1,2,3,4,5,6].map(i => (
          <rect
            key={i}
            x={60 + i * 111}
            y="30"
            width="111"
            height="460"
            fill={i % 2 === 0 ? 'rgba(0,255,133,0.012)' : 'transparent'}
          />
        ))}
      </svg>

      {/* Fade to dark at the bottom so page content reads cleanly */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#060d09]" />
      {/* Slight vignette on sides */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#060d09] to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#060d09] to-transparent" />
    </div>
  )
}
