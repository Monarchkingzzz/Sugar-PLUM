// Authentic Boondocks & Graphic Novel Urban Inked Badges & Icons
// Styled with heavy black comic ink lines, cel shading, and urban comic flair

export function BoondocksAfroPick({ size = 32, color = '#ffc83b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="boondocks-svg-icon">
      {/* Black Fist Handle */}
      <path d="M14 22C12 24 12 27 13 30C14 33 17 34 20 33C23 32 24 29 23 26C22 23 20 22 18 22H14Z" fill="#110d17" stroke="#000" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M15 25C15 25 17 25 18 27C19 29 18 31 16 31" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      {/* Pick Tines (Prongs) */}
      <line x1="12" y1="21" x2="12" y2="5" stroke="#110d17" strokeWidth="3" strokeLinecap="round"/>
      <line x1="12" y1="21" x2="12" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      
      <line x1="16" y1="20" x2="16" y2="3" stroke="#110d17" strokeWidth="3" strokeLinecap="round"/>
      <line x1="16" y1="20" x2="16" y2="3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      
      <line x1="20" y1="20" x2="20" y2="3" stroke="#110d17" strokeWidth="3" strokeLinecap="round"/>
      <line x1="20" y1="20" x2="20" y2="3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      
      <line x1="24" y1="21" x2="24" y2="5" stroke="#110d17" strokeWidth="3" strokeLinecap="round"/>
      <line x1="24" y1="21" x2="24" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function BoondocksGraffitiCrown({ size = 32, color = '#ffc83b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="boondocks-svg-icon">
      <path d="M4 27L6 11L13 18L18 7L23 18L30 11L32 27H4Z" fill={color} stroke="#000" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M4 27L6 11L13 18L18 7L23 18L30 11L32 27H4Z" fill="url(#crownShine)" opacity="0.6"/>
      {/* Crown base bar */}
      <rect x="4" y="27" width="28" height="5" rx="2" fill="#e8742a" stroke="#000" strokeWidth="2.5"/>
      {/* Jewel studs */}
      <circle cx="10" cy="29.5" r="1.5" fill="#fff" stroke="#000" strokeWidth="1"/>
      <circle cx="18" cy="29.5" r="1.5" fill="#ff385c" stroke="#000" strokeWidth="1"/>
      <circle cx="26" cy="29.5" r="1.5" fill="#fff" stroke="#000" strokeWidth="1"/>
      <defs>
        <linearGradient id="crownShine" x1="4" y1="7" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.8"/>
          <stop offset="1" stopColor="#000" stopOpacity="0.2"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export function BoondocksSprayCan({ size = 32, color = '#ff385c' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="boondocks-svg-icon">
      {/* Spray Nozzle */}
      <rect x="15" y="3" width="6" height="5" rx="1.5" fill="#e2e8f0" stroke="#000" strokeWidth="2"/>
      <rect x="16" y="8" width="4" height="3" fill="#64748b" stroke="#000" strokeWidth="1.5"/>
      {/* Dome Top */}
      <path d="M10 16C10 12 13 11 18 11C23 11 26 12 26 16V17H10V16Z" fill="#94a3b8" stroke="#000" strokeWidth="2.5"/>
      {/* Can Body */}
      <rect x="10" y="17" width="16" height="15" rx="2" fill={color} stroke="#000" strokeWidth="2.5"/>
      {/* Cel Shadow stripe */}
      <path d="M22 17H26V32H22V17Z" fill="#000" opacity="0.3"/>
      {/* Graffiti swirl on can */}
      <path d="M12 24C14 21 16 26 20 23" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      {/* Spray bursts */}
      <circle cx="25" cy="5" r="1" fill="#ffc83b"/>
      <circle cx="29" cy="3" r="1.5" fill="#ffc83b"/>
      <circle cx="32" cy="7" r="1" fill="#ffc83b"/>
    </svg>
  )
}

export function BoondocksAudioMic({ size = 32, color = '#38bdf8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="boondocks-svg-icon">
      {/* Mic Head */}
      <rect x="12" y="4" width="12" height="16" rx="6" fill={color} stroke="#000" strokeWidth="2.5"/>
      <line x1="12" y1="12" x2="24" y2="12" stroke="#000" strokeWidth="2"/>
      <line x1="18" y1="4" x2="18" y2="20" stroke="#000" strokeWidth="1.5"/>
      {/* Cradle */}
      <path d="M8 14C8 20 12 24 18 24C24 24 28 20 28 14" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      {/* Stand */}
      <line x1="18" y1="24" x2="18" y2="30" stroke="#000" strokeWidth="3"/>
      <path d="M12 32H24" stroke="#000" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Soundwaves */}
      <path d="M5 8C3 12 3 16 5 20" stroke="#ffc83b" strokeWidth="2" strokeLinecap="round"/>
      <path d="M31 8C33 12 33 16 31 20" stroke="#ffc83b" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export function BoondocksComicHeart({ size = 28, color = '#ff385c' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="boondocks-svg-icon">
      <path
        d="M18 31.5L6.5 20C2 15.5 3 8 9.5 5.5C13.5 4 16.5 7 18 9C19.5 7 22.5 4 26.5 5.5C33 8 34 15.5 29.5 20L18 31.5Z"
        fill={color}
        stroke="#000"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Cel highlight */}
      <path
        d="M8 10C9 7.5 12 6.5 14 7"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function BoondocksComicFlame({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="boondocks-svg-icon">
      {/* Outer red flame */}
      <path
        d="M18 3C18 3 11 11 11 19C11 25.5 14 31 20 31C26 31 29 25.5 28 19C27 13 22 9 22 9C22 9 23 15 20 16C17 17 18 3 18 3Z"
        fill="#ff385c"
        stroke="#000"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* Inner yellow/gold core */}
      <path
        d="M18 16C18 16 14 20 14 24C14 27.5 16 29 19 29C22 29 24 27.5 23 24C22 20 18 16 18 16Z"
        fill="#ffc83b"
      />
    </svg>
  )
}

export function BoondocksComicStar({ size = 24, color = '#ffc83b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="boondocks-svg-icon">
      <path
        d="M16 2L19 12L29 15L19 18L16 28L13 18L3 15L13 12L16 2Z"
        fill={color}
        stroke="#000"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="15" r="2" fill="#fff" />
    </svg>
  )
}

export function BoondocksWaxSeal({ seal = 'afro_pick', size = 44 }) {
  return (
    <div className="boondocks-wax-seal-wrapper" style={{ width: size, height: size }}>
      <div className="wax-seal-outer-stamp">
        {seal === 'afro_pick' || seal === '👑' || seal === 'spark' ? (
          <BoondocksAfroPick size={Math.round(size * 0.72)} />
        ) : seal === 'spray_can' || seal === '✨' || seal === 'little_things' ? (
          <BoondocksSprayCan size={Math.round(size * 0.72)} />
        ) : seal === 'audio_mic' || seal === '🌙' || seal === 'midnight' ? (
          <BoondocksAudioMic size={Math.round(size * 0.72)} />
        ) : (
          <BoondocksGraffitiCrown size={Math.round(size * 0.72)} />
        )}
      </div>
    </div>
  )
}
