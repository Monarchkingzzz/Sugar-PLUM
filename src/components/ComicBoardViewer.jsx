import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, Heart, Sparkles, Crown } from 'lucide-react'
import { playPop, playHeart } from '../utils/soundEffects.js'

export function ComicBoardViewer({ onClose }) {
  const [activePanel, setActivePanel] = useState(null)
  const [boardZoom, setBoardZoom] = useState(1)

  const panels = [
    {
      id: 'hero',
      title: 'AIGHT, SO BOOM... IT’S FOR YOU',
      tag: 'THE OPENING',
      desc: 'No special occasion. No big explanation. Just you. Just me. 💛',
      quote: '“Same sky. Same city. Different story.”',
      img: '/memories/hero.jpg'
    },
    {
      id: 'first_date',
      title: 'THE FIRST DATE (MORIAH DELI)',
      tag: 'THE SPARK',
      desc: 'Strawberry ice cream, neon lights, and the kiss that started it all.',
      quote:
        '“Sometimes you don’t realize a moment is becoming a memory you’ll keep forever until you’re already living it.”',
      img: '/memories/first_date_full.jpg'
    },
    {
      id: 'food_critic',
      title: 'THE FOOD CRITIC CHRONICLES™',
      tag: 'MICHELIN TASTE TEST',
      desc: 'Good food, big smiles, and that legendary happy shoulder dance.',
      quote:
        '“Nobody has adequately explained what happens when Sugar Plum finds something good to eat.”',
      img: '/memories/food_critic.jpg'
    },
    {
      id: 'one_shot',
      title: 'ONE SHOT. CASE CLOSED.',
      tag: 'LEGENDARY LIGHTWEIGHT',
      desc: 'One shot in and she is ready for a nap and cuddles. Case permanently closed.',
      quote: '“I’ve seen phone batteries with more stamina!”',
      img: '/memories/one_shot.jpg'
    },
    {
      id: 'two_am',
      title: 'THE 2 AM MESSAGE',
      tag: 'LATE NIGHT THOUGHTS',
      desc: 'Wide awake thinking about him. Afraid to wake him up... but he would have picked up instantly.',
      quote: '“I would have answered on the first ring. I smiled for hours.”',
      img: '/memories/two_am.jpg'
    },
    {
      id: 'little_things',
      title: 'THE LITTLE THINGS THAT GET ME',
      tag: 'GRAFFITI LOVE WALL',
      desc: 'Cheek kisses, Vampire Diaries smile, soft tummy, and her realness.',
      quote: '“You don’t have to perform. I love you exactly as you are.”',
      img: '/memories/little_things.jpg'
    },
    {
      id: 'smart_beautiful',
      title: 'THE SMART & BEAUTIFUL SIDE OF YOU',
      tag: 'DR. SUGAR PLUM',
      desc: 'Anatomy, physiology, memorizing 206 bones in the human body.',
      quote: '“She is funny, fine, caring, AND studying medicine? Out of my league!”',
      img: '/memories/smart_beautiful.jpg'
    },
    {
      id: 'voice_messages',
      title: 'YOUR VOICE MESSAGES',
      tag: 'BEDTIME PROTOCOL',
      desc: 'Nightly audio notes that bring total peace and comfort before sleep.',
      quote: '“I can’t imagine a world without your voice in it.”',
      img: '/memories/voice_messages.jpg'
    },
    {
      id: 'hope_for_us',
      title: 'MY HOPE FOR US',
      tag: 'THE VISION',
      desc: 'Looking out over the city skyline at twilight. Locked in forever.',
      quote: '“I hope one day you’ll be my wife. A hope that lives in my heart.”',
      img: '/memories/hope_for_us.jpg'
    }
  ]

  const handleOpenPanel = (p) => {
    playPop(640)
    setActivePanel(p)
  }

  return (
    <motion.div
      className="comic-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="comic-modal-container">
        <div className="comic-modal-header">
          <div className="modal-title-wrap">
            <Crown size={24} color="#ffc83b" />
            <h2>Sugar Plum Graphic Novel Storyboard</h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => {
              playPop(420)
              onClose()
            }}
            aria-label="Close Storyboard"
          >
            <X size={22} />
          </button>
        </div>

        <div className="modal-sub-row">
          <p className="modal-sub">
            ✨ The complete remastered comic moodboard in 2K resolution! Tap any panel to zoom in or inspect individual HD scenes:
          </p>
          <div className="board-zoom-controls">
            <button
              className="board-zoom-btn"
              onClick={() => setBoardZoom((z) => Math.min(z + 0.3, 2.5))}
              title="Zoom In Master Board"
            >
              +
            </button>
            <button
              className="board-zoom-btn"
              onClick={() => setBoardZoom((z) => Math.max(z - 0.3, 0.8))}
              title="Zoom Out Master Board"
            >
              -
            </button>
            <button
              className="board-zoom-btn reset"
              onClick={() => setBoardZoom(1)}
              title="Reset Zoom"
            >
              100%
            </button>
          </div>
        </div>

        {/* Master Image with interactive view */}
        <div className="master-board-wrapper">
          <div className="master-board-scroll-area">
            <motion.img
              src="/comic-board.jpg"
              alt="Sugar Plum Graphic Novel Master Board"
              className="master-board-img"
              style={{ transform: `scale(${boardZoom})` }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          </div>
        </div>

        {/* Interactive panel jump buttons */}
        <div className="storyboard-panel-grid">
          {panels.map((p) => (
            <button
              key={p.id}
              className={`panel-chip-btn ${activePanel?.id === p.id ? 'active' : ''}`}
              onClick={() => handleOpenPanel(p)}
            >
              <Sparkles size={14} color="#ffc83b" />
              <span>{p.title}</span>
            </button>
          ))}
        </div>

        {/* Active Panel Detail Box */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              className="panel-spotlight-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="spotlight-header-row">
                <div className="spotlight-tag">{activePanel.tag}</div>
                <button
                  className="spotlight-close-chip"
                  onClick={() => {
                    playPop(420)
                    setActivePanel(null)
                  }}
                >
                  ✕ Close Spotlight
                </button>
              </div>

              <div className="spotlight-body-layout">
                {activePanel.img && (
                  <div className="spotlight-img-box">
                    <img
                      src={activePanel.img}
                      alt={activePanel.title}
                      className="spotlight-panel-img"
                    />
                    <span className="spotlight-hd-label">✨ ULTRA HD PANEL</span>
                  </div>
                )}
                <div className="spotlight-text-box">
                  <h3 className="spotlight-title">{activePanel.title}</h3>
                  <p className="spotlight-desc">{activePanel.desc}</p>
                  <blockquote className="spotlight-quote">{activePanel.quote}</blockquote>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
