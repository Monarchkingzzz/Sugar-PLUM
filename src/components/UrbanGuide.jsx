import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playPop, playClick } from '../utils/soundEffects.js'

// Authentic Boondocks 2D Character Sprites directly from the model sheet:
// - guide-side.png: Neutral skeptical side-eye (judging silently, iconic pose)
// - guide-smirk.png: Knowing, sarcastic smirk with one raised eyebrow
// - guide-shock.png: Stunned disbelief, eyes wide, mouth agape
// - guide-laugh.png: Teasing laugh, mischievous grin
// - guide-pointing.png: Pointing toward the action/button with confident smirk
// - guide-direct.png: Looking directly at her with an unbothered, cool gaze
// Authentic Boondocks-inspired 2D Character Sprites from the model sheet:
// 12 Distinct Facial Expressions:
// 1.  side_eye: Neutral skeptical side-eye (judging silently, iconic pose)
// 2.  menace_smirk: Knowing, sarcastic smirk, one eyebrow arched
// 3.  laughing_roast: Full-body laughing roast, bouncing shoulders
// 4.  shocked: Genuine surprise, wide eyes, recoil
// 5.  fake_disrespected: Comedic offence, hand on chest ("Excuse me?!")
// 6.  scheming: Playful plotting, devious grin, fingers tapping
// 7.  no_victory: Tracking fleeing NO button with laughing delight
// 8.  championship: Over-the-top victory celebration, arms in air, trophy energy
// 9.  awkward_freeze: Realises he said too much, frozen smile, sweat drop
// 10. proud_friend: Approving nod, genuine warm admiration
// 11. quiet_soft: Tenderness, warmth, sincere smile, slower breathing
// 12. fourth_wall: Silent disbelief directed straight at the viewer, direct stare
const SPRITE_MAP = {
  // Primary 12 Expressions
  side_eye: '/images/guide-side.png',
  menace_smirk: '/images/guide-smirk.png',
  laughing_roast: '/images/guide-laugh.png',
  shocked: '/images/guide-shock.png',
  fake_disrespected: '/images/guide-disrespected.png',
  scheming: '/images/guide-scheming.png',
  no_victory: '/images/guide-laugh.png',
  championship: '/images/guide-championship.png',
  awkward_freeze: '/images/guide-freeze.png',
  proud_friend: '/images/guide-pointing.png',
  quiet_soft: '/images/guide-soft.png',
  fourth_wall: '/images/guide-direct.png',

  // Convenience Aliases
  side: '/images/guide-side.png',
  smirk: '/images/guide-smirk.png',
  laugh: '/images/guide-laugh.png',
  shock: '/images/guide-shock.png',
  disrespected: '/images/guide-disrespected.png',
  freeze: '/images/guide-freeze.png',
  proud: '/images/guide-pointing.png',
  pointing: '/images/guide-pointing.png',
  soft: '/images/guide-soft.png',
  warm: '/images/guide-soft.png',
  love: '/images/guide-soft.png',
  direct: '/images/guide-direct.png',
  hype: '/images/guide-pointing.png'
}

// Animation configurations mapped specifically to each of the 12 emotions
const EMOTION_ANIMATIONS = {
  side_eye: {
    animate: { y: [0, -3, 0], rotate: [0, 2, 0] },
    transition: { repeat: Infinity, duration: 3.8, ease: 'easeInOut' }
  },
  menace_smirk: {
    animate: { y: [-2, -6, -2], rotate: [0, -2.5, 0], scale: 1.03 },
    transition: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' }
  },
  laughing_roast: {
    animate: { y: [0, -8, 2, -6, 0], rotate: [-3, 5, -3] },
    transition: { repeat: Infinity, duration: 0.65, ease: 'easeInOut' }
  },
  shocked: {
    animate: { y: [-12, -2, -10], scale: [1, 1.08, 1.04], rotate: [-2, 2, 0] },
    transition: { duration: 0.45, ease: 'easeOut' }
  },
  fake_disrespected: {
    animate: { rotate: [-6, 3, -1], x: [-3, 3, 0], y: [0, -4, 0] },
    transition: { duration: 0.8, ease: 'easeInOut' }
  },
  scheming: {
    animate: { rotate: [-1.5, 1.5, -1.5], scale: [1, 1.03, 1], y: [0, -2, 0] },
    transition: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' }
  },
  no_victory: {
    animate: { rotate: [0, 6, -3, 5], y: [0, -7, 1, -5, 0] },
    transition: { repeat: Infinity, duration: 0.75, ease: 'easeInOut' }
  },
  championship: {
    animate: { y: [-18, 2, -14, 0], scale: [1, 1.12, 1.05], rotate: [-2, 2, 0] },
    transition: { repeat: Infinity, duration: 1.1, ease: 'easeInOut' }
  },
  awkward_freeze: {
    animate: { x: [0, 1, -1, 0], y: 0, rotate: 0 },
    transition: { duration: 0.2 }
  },
  proud_friend: {
    animate: { y: [0, -4, 0], rotate: [0, 2, 0] },
    transition: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' }
  },
  quiet_soft: {
    animate: { y: [0, -2, 0], rotate: [0, -1.5, 0] },
    transition: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' }
  },
  fourth_wall: {
    animate: { scale: [1, 1.05, 1.05], rotate: 0, y: [0, -2, 0] },
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

export function Guide({ mood = 'side_eye', size = 125 }) {
  const [loadError, setLoadError] = useState(false)
  const normMood = mood || 'side_eye'
  const spriteSrc = SPRITE_MAP[normMood] || SPRITE_MAP.side_eye
  const animConfig = EMOTION_ANIMATIONS[normMood] || EMOTION_ANIMATIONS.side_eye

  return (
    <motion.div
      className={`guide-character boondocks-sprite-guide mood-${normMood}`}
      style={{ width: size, height: 'auto', minWidth: size }}
      animate={animConfig.animate}
      transition={animConfig.transition}
    >
      <div className="sprite-frame">
        {/* Dynamic Reaction Badges */}
        {normMood === 'championship' && (
          <motion.div
            className="guide-fx-badge victory"
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
          >
            🏆 100/10
          </motion.div>
        )}
        {normMood === 'awkward_freeze' && (
          <div className="guide-fx-badge sweat">💧</div>
        )}
        {normMood === 'shocked' && (
          <div className="guide-fx-badge impact">⚡</div>
        )}
        {normMood === 'laughing_roast' && (
          <div className="guide-fx-badge tears">💀</div>
        )}
        {normMood === 'quiet_soft' && (
          <div className="guide-fx-badge heart">❤️</div>
        )}

        {!loadError ? (
          <img
            src={spriteSrc}
            alt={`Guide character expressing ${normMood}`}
            className="guide-sprite-img"
            onError={() => setLoadError(true)}
          />
        ) : (
          <img
            src="/images/guide-huey.jpg"
            alt="Guide character"
            className="guide-sprite-img"
          />
        )}
      </div>
    </motion.div>
  )
}

// Interactive Speech bubble with narrator commentary and live mood changes
export function Say({ lines, onEnd, hideGuide = false, currentMoodOverride }) {
  const [index, setIndex] = useState(0)
  const isLast = index >= lines.length - 1

  useEffect(() => {
    setIndex(0)
  }, [lines])

  useEffect(() => {
    if (isLast && onEnd) {
      onEnd()
    }
  }, [isLast, onEnd])

  const current = lines[Math.min(index, lines.length - 1)]
  const lineMood = current ? current[0] : 'side'
  const text = current ? current[1] : ''

  // Use override mood if passed (e.g. from interaction clicks!), else line mood
  const activeMood = currentMoodOverride || lineMood

  const handleNext = () => {
    playPop(580)
    setIndex((prev) => Math.min(prev + 1, lines.length - 1))
  }

  return (
    <div className="comic-say-row">
      {!hideGuide && <Guide mood={activeMood} />}
      <div className="comic-speech-bubble" role="region" aria-live="polite">
        <div className="bubble-tail" />
        <div className="bubble-header">
          <span className="narrator-tag">👑 THE GUIDE (YOUR MAN)</span>
          <span className="counter-tag">
            {index + 1} / {lines.length}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="comic-speech-text"
          >
            “{text}”
          </motion.p>
        </AnimatePresence>

        <div className="bubble-footer">
          {!isLast ? (
            <button className="comic-btn mini" onClick={handleNext}>
              Hear what he says next ➜
            </button>
          ) : (
            <span className="bubble-done-badge">✨ Keep going, baby ✨</span>
          )}
        </div>
      </div>
    </div>
  )
}
