import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Guide } from './UrbanGuide.jsx'
import { playPop, playClick } from '../utils/soundEffects.js'
import { X, MessageSquare, Flame } from 'lucide-react'

// Custom Event emitter so any component (minigame, memory, sticky note) can trigger Menace Guide commentary
export const triggerMenaceComment = (topic) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('menace-guide-event', { detail: { topic } }))
  }
}

export function MenaceGuideOverlay({ reactions, currentChapter }) {
  const [activeComment, setActiveComment] = useState(null)
  const [minimized, setMinimized] = useState(false)
  const lastTopicRef = useRef('')
  const lastTimeRef = useRef(0)
  const lastTextRef = useRef('')
  const idleTimerRef = useRef(null)

  // Determine current emotional arc phase:
  // Phase 1 (Ch 0): The Menace (confident, nosy, sarcastic)
  // Phase 2 (Ch 1-2): The Companion (supportive, investigative, playful)
  // Phase 3 (Ch 3-5): The Softie (quiet, respectful, gentle, stepping aside during intimate moments)
  const arcPhase = currentChapter === 0 ? 'menace' : currentChapter <= 2 ? 'companion' : 'softie'

  // Phase-specific poke banter when she taps on the guide mascot
  const pokeBanterByPhase = {
    menace: [
      { mood: 'laughing_roast', text: "Look at you clicking on me. Girl, I'm just the narrator, go inspect your man's hard work! 😂" },
      { mood: 'menace_smirk', text: "You want me to roast him again? Aight: man literally memorized the Vampire Diaries cast just for you." },
      { mood: 'side_eye', text: "I'm just observing, Sugar Plum. Don't act brand new now." },
      { mood: 'fourth_wall', text: "The camera caught ALL of that. Y'all seeing this, right?" },
      { mood: 'scheming', text: "Aight… I got an idea. Let's see what happens if you tap that big pink button." }
    ],
    companion: [
      { mood: 'proud_friend', text: "Okayyy, Sugar Plum. Look at you discovering all the lore!" },
      { mood: 'laughing_roast', text: "Good food enters the room and suddenly we got a whole dance performance. I respect it! 👑" },
      { mood: 'shocked', text: "She knows all 206 bones in the human body. Put major respect on Dr. Sugar Plum's name!" },
      { mood: 'side_eye', text: "One shot? ONE?! I've seen gas station phone chargers with more battery life than this woman!" },
      { mood: 'proud_friend', text: "Bro has a whole mental spreadsheet of why you're his girl." }
    ],
    softie: [
      { mood: 'quiet_soft', text: "Aight… jokes aside, this right here? This is the good stuff. Take your time, baby girl." },
      { mood: 'quiet_soft', text: "He really wrote these with his whole chest. I'ma let y'all have this moment. ❤️" },
      { mood: 'quiet_soft', text: "Some people listen to raindrops to fall asleep. This man listens to your voice notes." }
    ]
  }

  const showComment = (item) => {
    // Avoid repeating the exact same line twice consecutively
    if (item.text === lastTextRef.current) return
    lastTextRef.current = item.text

    setActiveComment(item)
    // Auto dismiss after 7.5 seconds
    clearTimeout(window.__menaceDismissTimer)
    window.__menaceDismissTimer = setTimeout(() => {
      setActiveComment(null)
    }, 7500)
  }

  // Handle triggered commentary
  useEffect(() => {
    const handleEvent = (e) => {
      const topic = e.detail?.topic
      if (!topic || !reactions[topic]) return

      // In the Softie phase (letters / finale), step aside to give them emotional space
      if (currentChapter >= 4 && topic !== 'songPlay' && topic !== 'letters') return

      const now = Date.now()
      // Cooldown: 4.5 seconds between automatic comments (or 900ms for active interactions like dodgingNo)
      const minInterval = topic === 'dodgingNo' ? 900 : arcPhase === 'softie' ? 6500 : 4200
      if (now - lastTimeRef.current < minInterval && topic === lastTopicRef.current && topic !== 'dodgingNo') return

      lastTimeRef.current = now
      lastTopicRef.current = topic

      const list = reactions[topic]
      // Pick a random line that isn't the previous line
      const filtered = list.filter((l) => l.text !== lastTextRef.current)
      const pick = (filtered.length > 0 ? filtered : list)[Math.floor(Math.random() * (filtered.length || list.length))]
      if (pick) {
        showComment(pick)
      }
    }

    window.addEventListener('menace-guide-event', handleEvent)
    return () => window.removeEventListener('menace-guide-event', handleEvent)
  }, [reactions, currentChapter, arcPhase])

  // Idle Detection: Inactive for 35s triggers gentle banter (disabled during final letter)
  useEffect(() => {
    if (currentChapter >= 4) return // quiet during letters and finale

    const resetIdle = () => {
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        if (reactions.idlePause && currentChapter < 4) {
          const list = reactions.idlePause
          const pick = list[Math.floor(Math.random() * list.length)]
          showComment(pick)
        }
      }, 35000)
    }

    window.addEventListener('pointerdown', resetIdle)
    window.addEventListener('scroll', resetIdle)
    resetIdle()

    return () => {
      clearTimeout(idleTimerRef.current)
      window.removeEventListener('pointerdown', resetIdle)
      window.removeEventListener('scroll', resetIdle)
    }
  }, [reactions, currentChapter])

  // Tap on guide mascot
  const handlePoke = () => {
    playPop(620)
    const currentList = pokeBanterByPhase[arcPhase] || pokeBanterByPhase.menace
    const filtered = currentList.filter((l) => l.text !== lastTextRef.current)
    const pick = (filtered.length > 0 ? filtered : currentList)[Math.floor(Math.random() * (filtered.length || currentList.length))]
    showComment(pick)
    setMinimized(false)
  }

  // Hide in chapter 5 (the grand finale letter) so she can read in peace
  if (currentChapter === 5) return null

  return (
    <aside className="menace-guide-floating-widget" aria-label="Narrator commentary">
      {/* Floating Speech Bubble */}
      <AnimatePresence>
        {activeComment && !minimized && (
          <motion.div
            className="menace-speech-toast"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            role="status"
          >
            <div className="toast-header">
              <span className="toast-tag">
                <Flame size={13} color="#ff385c" /> THE MENACE NARRATOR
              </span>
              <button
                className="toast-close-btn"
                onClick={() => {
                  playClick()
                  setActiveComment(null)
                }}
                aria-label="Dismiss commentary"
              >
                <X size={14} />
              </button>
            </div>
            <p className="toast-text">“{activeComment.text}”</p>
            <div className="toast-tail" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Avatar Widget */}
      <div className="menace-mascot-anchor">
        <button
          className="mascot-avatar-btn"
          onClick={handlePoke}
          title="Tap him to hear his unfiltered thoughts"
          aria-label="Tap narrator guide"
        >
          <Guide mood={activeComment ? activeComment.mood : 'side'} size={65} />
          <span className="mascot-badge-pill">💬 Tap Me</span>
        </button>
      </div>
    </aside>
  )
}
