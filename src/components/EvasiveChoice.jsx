import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Guide } from './UrbanGuide.jsx'
import { playPop, playHeart, playChime, playClick } from '../utils/soundEffects.js'
import { Crown, Sparkles, Heart, CheckCircle2, Award } from 'lucide-react'

export function EvasiveChoice({ config, onComplete }) {
  const containerRef = useRef(null)
  const [dodgeCount, setDodgeCount] = useState(0)
  const [noPos, setNoPos] = useState({ x: 0, y: 0, rot: 0 })
  const [status, setStatus] = useState('pending') // 'pending' | 'celebrating' | 'revealed'
  const [heartsBurst, setHeartsBurst] = useState([])

  // Random dodge offset generation that stays inside container bounds and avoids YES button
  const handleDodge = (e) => {
    if (status !== 'pending') return
    if (e && e.type === 'touchstart') {
      // Prevent default click on mobile touch so button hops away
      e.preventDefault()
    }

    playPop(500 + Math.min(dodgeCount * 40, 400))

    setDodgeCount((prev) => {
      const nextCount = prev + 1

      // Compute bounded offsets
      // Available x range: roughly -140px to +140px, y range: -60px to +60px
      const angle = (nextCount * 137.5) * (Math.PI / 180) // golden ratio distribution
      const dist = 55 + (nextCount % 4) * 22
      const rawX = Math.cos(angle) * dist
      const rawY = Math.sin(angle) * (dist * 0.65)

      // Clamp within safe arena boundaries
      const clampedX = Math.max(-130, Math.min(130, rawX))
      const clampedY = Math.max(-55, Math.min(55, rawY))
      const rot = ((nextCount % 5) - 2) * 8

      setNoPos({ x: clampedX, y: clampedY, rot })
      return nextCount
    })
  }

  // Handle YES button click: Championship victory then tender romantic pivot
  const handleYes = () => {
    playChime()
    playHeart()
    setStatus('celebrating')

    // Create floating confetti hearts
    const hearts = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 320,
      y: -60 - Math.random() * 180,
      scale: 0.6 + Math.random() * 0.8,
      rot: (Math.random() - 0.5) * 60
    }))
    setHeartsBurst(hearts)

    // After 2.4s of championship celebration, pivot to tender surprise reveal
    setTimeout(() => {
      setStatus('revealed')
      playPop(620)
    }, 2400)
  }

  // Active guide dialogue & mood
  const currentDodge =
    config.dodges[Math.min(dodgeCount, config.dodges.length - 1)] || config.dodges[0]

  return (
    <section className="evasive-arena-card" aria-label="A playful surprise for you">
      {/* Top Banner Tag */}
      <div className="arena-top-tag">
        <Sparkles size={16} /> SPECIAL INTERACTIVE MOMENT
      </div>

      <h3 className="arena-question">{config.question}</h3>

      {/* Guide Dynamic Reaction Bar */}
      <div className="arena-guide-row">
        {status === 'pending' && (
          <>
            <Guide mood={currentDodge.mood} size={76} />
            <div className="arena-speech-bubble" aria-live="polite">
              <span className="speech-author">👑 NARRATOR:</span>
              <p className="speech-quote">
                {dodgeCount === 0
                  ? "“Go 'head, pick your answer. Don't be shy now.”"
                  : currentDodge.text}
              </p>
            </div>
          </>
        )}

        {status === 'celebrating' && (
          <motion.div
            className="championship-announcement"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Guide mood={config.yesCelebration.mood} size={84} />
            <div className="arena-speech-bubble celebration">
              <span className="speech-author">🏆 CHAMPIONSHIP MOMENT:</span>
              <p className="celebration-shout">{config.yesCelebration.shout}</p>
            </div>
          </motion.div>
        )}

        {status === 'revealed' && (
          <motion.div
            className="tender-pivot-announcement"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Guide mood={config.tenderPivot.mood} size={76} />
            <div className="arena-speech-bubble tender">
              <span className="speech-author">❤️ FOR YOU:</span>
              <p className="tender-quote">{config.tenderPivot.text}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Button Arena (When pending) */}
      {status === 'pending' && (
        <div ref={containerRef} className="buttons-playground-area">
          {/* YES Button - Prominent, accessible, keyboard-ready */}
          <button
            className="comic-btn yes-choice-btn pulse"
            onClick={handleYes}
            aria-label="Yes, open the surprise"
          >
            {config.yesLabel}
          </button>

          {/* Evasive NO Button - Dodges smoothly on hover & touch */}
          <motion.button
            className="comic-btn no-choice-btn"
            style={{
              x: noPos.x,
              y: noPos.y,
              rotate: noPos.rot,
              scale: Math.max(0.78, 1 - dodgeCount * 0.035)
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            onMouseEnter={handleDodge}
            onTouchStart={handleDodge}
            onClick={handleDodge}
            aria-label={
              dodgeCount >= 4
                ? 'Still trying to click No'
                : 'No, dodge button'
            }
          >
            {dodgeCount === 0
              ? config.noLabel
              : dodgeCount < 3
              ? 'NO? 😂'
              : dodgeCount < 6
              ? 'CAN’T TOUCH THIS 💨'
              : 'OKAY FINE JUST CLICK YES 🥺'}
          </motion.button>
        </div>
      )}

      {/* Confetti Explosion during Celebration */}
      {status === 'celebrating' && (
        <div className="confetti-hearts-container" aria-hidden="true">
          {heartsBurst.map((h) => (
            <motion.div
              key={h.id}
              className="floating-heart"
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{
                x: h.x,
                y: h.y,
                scale: h.scale,
                rotate: h.rot,
                opacity: 0
              }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            >
              💖
            </motion.div>
          ))}
          <div className="victory-comic-stamp">BOOM! SHE SAID YES! 🏆</div>
        </div>
      )}

      {/* Revealed Surprise (The VIP Boyfriend Perks Pass) */}
      {status === 'revealed' && (
        <motion.div
          className="vip-surprise-card"
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="vip-card-header">
            <div className="vip-seal">
              <Crown size={28} color="#ffc83b" />
            </div>
            <div>
              <span className="vip-tag">{config.surprise.tag}</span>
              <h4 className="vip-title">{config.surprise.title}</h4>
              <p className="vip-subtitle">{config.surprise.subtitle}</p>
            </div>
          </div>

          <div className="vip-perks-list">
            {config.surprise.perks.map((p, idx) => (
              <div key={idx} className="perk-item">
                <span className="perk-icon">{p.icon}</span>
                <div className="perk-info">
                  <strong>{p.title}</strong>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="vip-card-footer">
            <span className="vip-signoff">{config.surprise.signOff}</span>
            <button
              className="comic-btn primary"
              onClick={() => {
                playPop(540)
                if (onComplete) onComplete()
              }}
            >
              Step Inside Our World ➜
            </button>
          </div>
        </motion.div>
      )}

      {status === 'pending' && dodgeCount >= 3 && (
        <p className="dodge-hint-text">
          💡 Pro-tip: You might wanna just tap that big pink <strong>YES</strong> button. Bro made you a whole VIP pass.
        </p>
      )}
    </section>
  )
}
