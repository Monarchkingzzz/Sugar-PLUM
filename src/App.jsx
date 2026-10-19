import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { story as S } from './data/loveStory.js'
import { Guide, Say } from './components/UrbanGuide.jsx'
import { Obj } from './components/Wall.jsx'
import LoveSongPlayer from './components/LoveSongPlayer.jsx'
import { ComicBoardViewer } from './components/ComicBoardViewer.jsx'
import {
  MoriahIceCreamInteraction,
  FoodCriticSimulator,
  OneShotStaminaSimulator,
  TwoAmPhoneSimulation,
  VoiceMessageCard
} from './components/InteractiveMinigames.jsx'
import { playPop, playHeart, playChime, playClick } from './utils/soundEffects.js'
import { Sparkles, Heart, Crown, BookOpen, RotateCcw, ArrowRight, ZoomIn, X, Maximize2 } from 'lucide-react'
import { EvasiveChoice } from './components/EvasiveChoice.jsx'
import { MenaceGuideOverlay, triggerMenaceComment } from './components/MenaceGuideOverlay.jsx'
import { WelcomeCrewBackdrop } from './components/WelcomeCrewBackdrop.jsx'

function Photo({ src, caption, quote, title }) {
  const [error, setError] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)

  const handleOpenZoom = () => {
    playPop(620)
    setZoomScale(1)
    setIsZoomed(true)
  }

  return (
    <>
      <figure
        className="comic-photo-frame"
        onClick={handleOpenZoom}
        title="Click to view ultra HD comic panel"
      >
        <div className="hd-badge-pill">
          <Sparkles size={13} color="#ffc83b" />
          <span>✨ ULTRA HD PANEL</span>
        </div>

        {!error && src ? (
          <div className="comic-art-wrapper">
            <img
              src={src}
              alt={caption || 'Memory panel'}
              onError={() => setError(true)}
              className="comic-img-element"
            />
          </div>
        ) : (
          <div className="photo-placeholder">
            <Heart size={36} color="#ff385c" />
            <span>{caption || 'Our Sweet Memory'}</span>
          </div>
        )}

        <div className="photo-tap-hint">
          <ZoomIn size={14} /> Tap to inspect in full HD
        </div>

        {caption && <figcaption className="photo-caption">{caption}</figcaption>}
      </figure>

      {/* Interactive Ultra HD Lightbox Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="hd-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              className="hd-lightbox-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hd-lightbox-header">
                <div className="hd-header-left">
                  <span className="hd-tag">✨ ULTRA HD GRAPHIC NOVEL PANEL</span>
                  <h3 className="hd-title">{title || caption || 'Comic Storyboard Scene'}</h3>
                </div>

                <div className="hd-header-actions">
                  <button
                    className="hd-zoom-btn"
                    onClick={() => setZoomScale((s) => Math.min(s + 0.35, 2.8))}
                    title="Zoom In"
                  >
                    + Zoom
                  </button>
                  <button
                    className="hd-zoom-btn"
                    onClick={() => setZoomScale((s) => Math.max(s - 0.35, 0.7))}
                    title="Zoom Out"
                  >
                    - Zoom
                  </button>
                  <button
                    className="hd-zoom-btn reset"
                    onClick={() => setZoomScale(1)}
                    title="Reset to 100%"
                  >
                    100%
                  </button>
                  <button
                    className="hd-close-btn"
                    onClick={() => setIsZoomed(false)}
                    aria-label="Close HD Viewer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="hd-image-viewport">
                <motion.img
                  src={src}
                  alt={caption || 'HD Memory Panel'}
                  className="hd-viewport-img"
                  style={{ transform: `scale(${zoomScale})` }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                />
              </div>

              {(quote || caption) && (
                <div className="hd-lightbox-caption-box">
                  {quote && (
                    <div className="hd-crisp-speech-balloon">
                      <div className="balloon-tag">💬 ORIGINAL SCENE DIALOGUE</div>
                      <blockquote className="hd-quote-bubble">
                        “{quote.replace(/^[“"']+|[”"']+$/g, '')}”
                      </blockquote>
                    </div>
                  )}
                  {caption && <p className="hd-caption-text">{caption}</p>}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Memory Detail View in Chapter 2
function Memory({ m, back }) {
  const [stage, setStage] = useState(0)

  return (
    <motion.article
      className={`comic-memory-scene ${m.warm ? 'warm' : ''} ${m.night ? 'night' : ''}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="memory-badge-row">
        <span className="comic-badge">{m.badge || 'MEMORABLE CHAPTER'}</span>
        <button
          className="back-btn"
          onClick={() => {
            playPop(440)
            back()
          }}
        >
          ← Back to the Archives
        </button>
      </div>

      <h2 className="memory-title">{m.title}</h2>

      {/* Hero photo for this panel */}
      {m.photo && (
        <Photo
          src={m.photo}
          caption={m.caption}
          quote={m.quote}
          title={m.title}
        />
      )}

      <Say lines={m.intro} onEnd={() => setStage(1)} />

      {stage > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="sincere-narrative"
        >
          {m.quote && <blockquote className="comic-quote">{m.quote}</blockquote>}
          <p className="passage-body">{m.passage}</p>

          {m.extra && <p className="passage-extra">{m.extra}</p>}

          {/* Interactive features mapped to specific panels */}
          {m.id === 'icecream' && <MoriahIceCreamInteraction />}
          {m.id === 'food' && m.dishes && <FoodCriticSimulator dishes={m.dishes} />}
          {m.id === 'shot' && <OneShotStaminaSimulator />}
          {m.id === 'twoam' && <TwoAmPhoneSimulation />}
          {m.id === 'voice_messages' && <VoiceMessageCard />}
        </motion.div>
      )}

      <div className="scene-footer">
        <button
          className="comic-btn"
          onClick={() => {
            playPop(440)
            back()
          }}
        >
          ← Back to All Files
        </button>
      </div>
    </motion.article>
  )
}

// Chapter 1: Introduction & Opening
function Ch1({ next, openStoryboard }) {
  const [done, setDone] = useState(false)
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="comic-stage center">
      <div className="hero-crown-badge">
        <Crown size={22} color="#111" />
        <span>SPECIAL EDITION • VOL. 1</span>
      </div>

      <motion.div 
        className="welcome-mama-banner"
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Sparkles size={16} color="#ffc83b" />
        <span>welcome mama u looking fine as ever baby</span>
        <Heart size={16} color="#ff385c" fill="#ff385c" />
      </motion.div>

      <Say lines={S.opening} onEnd={() => setDone(true)} />

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hero-center-box"
        >
          <div className="hero-artwork-frame">
            <img src="/memories/hero.jpg" alt="Sugar Plum Hero" className="hero-img" />
            <div className="hero-tagline-overlay">
              <span className="small-script">{S.tagline}</span>
            </div>
          </div>

          <h1 className="hero-title">{S.title}</h1>
          <p className="hero-subtitle">{S.subtitle}</p>

          {!revealed ? (
            <div className="hero-cta-group">
              <button
                className="comic-btn primary pulse"
                onClick={() => {
                  playPop(560)
                  setRevealed(true)
                }}
              >
                What is this about? ➜
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="reveal-card"
            >
              <div className="reveal-tag">💛 REAL TALK</div>
              <p className="reveal-p">{S.reveal[0]}</p>
              <p className="reveal-p bold">{S.reveal[1]}</p>

              {/* The Legendary YES vs NO Menace Interactive Moment */}
              <EvasiveChoice config={S.evasiveChoice} onComplete={next} />

              <div className="button-pair" style={{ marginTop: 16 }}>
                <button
                  className="comic-btn secondary mini"
                  onClick={() => {
                    playPop(500)
                    openStoryboard()
                  }}
                >
                  <BookOpen size={16} /> View Graphic Novel Storyboard
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}

// Chapter 2: The Lore Is Crazy (The Archive)
function Ch2({ next }) {
  const [openId, setOpenId] = useState(null)
  const [seen, setSeen] = useState([])

  const pickMemory = (id) => {
    playPop(600)
    setOpenId(id)
    setSeen((prev) => (prev.includes(id) ? prev : [...prev, id]))
    const topicMap = {
      icecream: 'moriahDeli',
      food: 'foodCritic',
      shot: 'oneShot',
      twoam: 'twoAm',
      voice_messages: 'voiceNotes',
      smart_beautiful: 'medicalGenius',
      hope_for_us: 'hopeForUs'
    }
    if (topicMap[id]) {
      triggerMenaceComment(topicMap[id])
    }
  }

  if (openId) {
    const mem = S.memories.find((m) => m.id === openId)
    return (
      <div className="comic-stage">
        <Memory key={openId} m={mem} back={() => setOpenId(null)} />
      </div>
    )
  }

  return (
    <div className="comic-stage">
      <Say lines={S.archiveIntro} />

      <div className="archive-header-row">
        <h3>📂 THE CONFIDENTIAL ARCHIVES</h3>
        <span className="archive-progress">
          {seen.length} of {S.memories.length} files reviewed
        </span>
      </div>

      <div className="comic-archive-grid">
        {S.memories.map((m, i) => (
          <motion.button
            key={m.id}
            className={`archive-file-card f${i % 4} ${seen.includes(m.id) ? 'opened' : ''}`}
            whileHover={{ scale: 1.04, rotate: (i % 2 === 0 ? 1.5 : -1.5) }}
            whileTap={{ scale: 0.96 }}
            onClick={() => pickMemory(m.id)}
          >
            <div className="file-pin" />
            <div className="file-badge">{m.badge}</div>
            {m.photo && (
              <div className="file-thumb">
                <img src={m.photo} alt={m.title} />
              </div>
            )}
            <h4 className="file-title">{m.title}</h4>
            <span className="file-stamp">
              {seen.includes(m.id) ? '✓ REVIEWED WITH LOVE' : 'TAP TO OPEN'}
            </span>
          </motion.button>
        ))}
      </div>

      {seen.length > 0 && (
        <div className="continue-row">
          <button
            className="comic-btn primary"
            onClick={() => {
              playPop(520)
              next()
            }}
          >
            On to the Graffiti Love Wall ➜
          </button>
        </div>
      )}
    </div>
  )
}

// Chapter 3: The Little Things That Get Me (The Wall)
function Ch3({ next }) {
  const [found, setFound] = useState([])
  const [cur, setCur] = useState(null)

  const pickReason = (i) => {
    setCur(i)
    setFound((f) => (f.includes(i) ? f : [...f, i]))
    triggerMenaceComment('wallSticky')
  }

  const activeReason = cur !== null && S.reasons[cur]
  const allDiscovered = found.length === S.reasons.length

  return (
    <div className="comic-stage">
      <Say lines={S.reasonsIntro} />

      <div className="wall-header-box">
        <div className="wall-title-flex">
          <Crown size={22} color="#ffc83b" />
          <h3>THE LITTLE THINGS THAT GET ME</h3>
        </div>
        <p className="wall-counter">
          {found.length} of {S.reasons.length} sticky notes uncovered
        </p>
      </div>

      {/* Brick Wall with Grafitti and Taped Sticky Notes */}
      <div className="comic-graffiti-wall">
        <div className="wall-graffiti-crown">👑</div>
        <div className="wall-graffiti-heart">♡</div>
        <div className="wall-graffiti-tag">Sugar Plum</div>

        <div className="notes-grid">
          {S.reasons.map((r, i) => (
            <Obj
              key={i}
              i={i}
              r={r}
              found={found.includes(i)}
              onPick={pickReason}
            />
          ))}
        </div>
      </div>

      {/* Sticky Note Detail Popup Modal */}
      <AnimatePresence>
        {activeReason && (
          <motion.div
            key={cur}
            className="note-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCur(null)}
          >
            <motion.div
              className="note-popup-card"
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="note-card-tape" />

              <div className="note-popup-header-row">
                <Guide
                  mood={
                    activeReason.guide
                      ? activeReason.guide[0]
                      : activeReason.icon === 'tv'
                      ? 'side'
                      : activeReason.icon === 'laugh'
                      ? 'laugh'
                      : activeReason.icon === 'plum'
                      ? 'love'
                      : 'warm'
                  }
                  size={75}
                />
                <div className="note-popup-titles">
                  <span className="note-popup-tag">WHY HE ADORES YOU</span>
                  <h3>{activeReason.label}</h3>
                </div>
              </div>

              {activeReason.guide && (
                <div className="narrator-aside">
                  <em>💬 Guide: “{activeReason.guide[1]}”</em>
                </div>
              )}
              <p className="note-popup-text">{activeReason.text}</p>
              <button
                className="comic-btn mini"
                onClick={() => {
                  playPop(460)
                  setCur(null)
                }}
              >
                Close Note ♡
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {allDiscovered && !activeReason && (
        <motion.div
          className="all-found-celebration"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Say lines={S.allFound} />
          <button
            className="comic-btn primary"
            onClick={() => {
              playChime()
              next()
            }}
          >
            Read His Personal Letters ➜
          </button>
        </motion.div>
      )}
    </div>
  )
}

// Chapter 4: Things I Don't Always Say Out Loud (The Letters)
function Ch4({ next }) {
  const [openLetter, setOpenLetter] = useState(null)
  const [readLetters, setReadLetters] = useState([])

  const handleOpen = (i) => {
    playPop(620)
    setOpenLetter(i)
    setReadLetters((r) => [...new Set([...r, i])])
    triggerMenaceComment('letters')
  }

  return (
    <div className="comic-stage">
      <Say lines={S.lettersIntro} />

      <div className="envelopes-row">
        {S.letters.map((l, i) => (
          <motion.button
            key={i}
            className={`wax-envelope-btn ${readLetters.includes(i) ? 'opened' : ''}`}
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleOpen(i)}
            aria-label={`Open letter: ${l.title}`}
          >
            <div className="envelope-seal">{l.seal || '💌'}</div>
            <span className="envelope-label">{l.title}</span>
            <small className="envelope-status">
              {readLetters.includes(i) ? 'Read ♡' : 'Tap to unfold'}
            </small>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {openLetter !== null && (
          <motion.div
            className="letter-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenLetter(null)}
          >
            <motion.div
              className="parchment-letter-card"
              initial={{ opacity: 0, y: 40, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="letter-header">
                <h3>{S.letters[openLetter].title}</h3>
                <span className="letter-corner-crown">👑</span>
              </div>
              <div className="letter-body-content">
                {S.letters[openLetter].body.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
              <div className="letter-footer">
                <button
                  className="comic-btn mini"
                  onClick={() => {
                    playPop(480)
                    setOpenLetter(null)
                  }}
                >
                  Fold it back up
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {readLetters.length === S.letters.length && openLetter === null && (
        <div className="continue-row">
          <button
            className="comic-btn primary"
            onClick={() => {
              playHeart()
              next()
            }}
          >
            A Special Melody For You ➜
          </button>
        </div>
      )}
    </div>
  )
}

// Chapter 5: A Little Melody For You
function Ch5({ next, player }) {
  const [done, setDone] = useState(false)
  useEffect(() => {
    triggerMenaceComment('songPlay')
  }, [])
  return (
    <div className="comic-stage">
      <Say lines={S.songIntro} onEnd={() => setDone(true)} />
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="song-stage-wrap"
        >
          {player}
          <div className="continue-row">
            <button
              className="comic-btn primary"
              onClick={() => {
                playPop(540)
                next()
              }}
            >
              The Final Word From Him ➜
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Chapter 6: For My Sugar Plum (Grand Finale)
function Ch6({ replay }) {
  const [doneNarrator, setDoneNarrator] = useState(false)
  const [finishedReading, setFinishedReading] = useState(false)
  const [heartsBurst, setHeartsBurst] = useState(false)

  const handleSendKiss = () => {
    playChime()
    playHeart()
    setHeartsBurst(true)
    setTimeout(() => setHeartsBurst(false), 4000)
  }

  return (
    <div className="comic-stage final-stage">
      {!doneNarrator && (
        <div className="final-narrator-box">
          <Say lines={S.finalIntro} onEnd={() => {}} />
          <button
            className="comic-btn primary"
            onClick={() => {
              playPop(540)
              setDoneNarrator(true)
            }}
          >
            Let Him Speak For Himself ♡
          </button>
        </div>
      )}

      {doneNarrator && (
        <motion.div
          className="grand-finale-card"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="finale-artwork">
            <img
              src="/memories/hope_for_us.jpg"
              alt="My Hope For Us"
              className="finale-img"
            />
            <div className="finale-badge">LOCKED IN FOREVER 👑</div>
          </div>

          <div className="finale-dedication-header">
            <span className="dedication-to">To: Celine (My Beautiful Sugar Plum) 🌸</span>
            <span className="dedication-divider">•</span>
            <span className="dedication-from">From: Maurice (Your Man, Always) ❤️</span>
          </div>

          <div className="finale-letter-body">
            {S.finalLetter.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'salutation'
                    : i >= S.finalLetter.length - 2
                    ? 'sign-off'
                    : 'body-p'
                }
              >
                {p}
              </p>
            ))}
          </div>

          {!finishedReading ? (
            <div className="finale-actions">
              <button
                className="comic-btn primary pulse"
                onClick={() => {
                  playHeart()
                  setFinishedReading(true)
                }}
              >
                I've Read Every Word ♡
              </button>
            </div>
          ) : (
            <motion.div
              className="closing-celebration"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="closing-crown">👑</div>
              <h2 className="closing-title">{S.closing}</h2>

              <div className="finale-button-group">
                <button className="comic-btn kiss-btn" onClick={handleSendKiss}>
                  <Heart size={20} fill="#ff385c" color="#ff385c" /> Send Him A Kiss
                </button>
                <button
                  className="comic-btn replay-btn"
                  onClick={() => {
                    playPop(480)
                    replay()
                  }}
                >
                  <RotateCcw size={18} /> Replay Experience
                </button>
              </div>

              {heartsBurst && (
                <motion.div
                  className="hearts-burst-banner"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  💖 Kiss received! He’s smiling right now! 💖
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}

// Main App Container
export default function App() {
  const [chapter, setChapter] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [showStoryboard, setShowStoryboard] = useState(false)

  // Welcome Banter when Sugar Plum first arrives in Chapter 1 with Huey, Riley & Granddad
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerMenaceComment('welcomeCrew')
    }, 1800)
    return () => clearTimeout(timer)
  }, [])

  const handleCrewMemberClick = (member) => {
    playPop(580)
    if (member === 'huey') {
      triggerMenaceComment('welcomeCrew')
    } else if (member === 'riley') {
      triggerMenaceComment('welcomeCrew')
    } else {
      triggerMenaceComment('welcomeCrew')
    }
  }

  const goToChapter = (n) => {
    playClick()
    setChapter(n)
    setMaxReached((m) => Math.max(m, n))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const next = () => goToChapter(Math.min(chapter + 1, 5))

  const songPlayer = <LoveSongPlayer song={S.song} />

  const pages = [
    <Ch1 next={next} openStoryboard={() => setShowStoryboard(true)} />,
    <Ch2 next={next} />,
    <Ch3 next={next} />,
    <Ch4 next={next} />,
    null,
    <Ch6 replay={() => goToChapter(0)} />
  ]

  return (
    <div className={`comic-app ch${chapter}`}>
      {/* Huey, Riley & Granddad Welcome Crew Backdrop Layer */}
      <WelcomeCrewBackdrop 
        currentChapter={chapter} 
        onCharacterClick={handleCrewMemberClick} 
      />

      {/* The Menace Guide Interactive Companion */}
      <MenaceGuideOverlay
        reactions={S.menaceReactions}
        currentChapter={chapter}
      />

      {/* Comic Storyboard Modal */}
      <AnimatePresence>
        {showStoryboard && (
          <ComicBoardViewer onClose={() => setShowStoryboard(false)} />
        )}
      </AnimatePresence>

      {/* Top Comic Navigation Bar */}
      <nav className="comic-nav-bar" aria-label="Chapters">
        <div className="nav-container">
          <div className="nav-brand">
            <Crown size={20} color="#ffc83b" />
            <span className="brand-title">SUGAR PLUM</span>
          </div>

          <ol className="chapter-step-list">
            {S.chapters.map((title, i) => (
              <li key={i}>
                <button
                  disabled={i > maxReached}
                  aria-current={i === chapter ? 'step' : undefined}
                  onClick={() => goToChapter(i)}
                  title={title}
                  className="chapter-pip-btn"
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ol>

          <button
            className="storyboard-toggle-btn"
            onClick={() => {
              playPop(520)
              setShowStoryboard(true)
            }}
          >
            <BookOpen size={16} />
            <span className="btn-label">Comic Board</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-viewport">
        <AnimatePresence mode="wait">
          <motion.section
            key={chapter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <div className="chapter-header-tag">
              <span className="ch-num">CHAPTER {chapter + 1}</span>
              <h2 className="ch-title">{S.chapters[chapter]}</h2>
            </div>

            {chapter === 4 ? (
              <Ch5 next={next} player={null} />
            ) : (
              pages[chapter]
            )}
          </motion.section>
        </AnimatePresence>

        {/* Music Player keeps state across chapters */}
        <div hidden={chapter !== 4} className="player-persistent-wrapper">
          {songPlayer}
        </div>
      </main>
    </div>
  )
}
