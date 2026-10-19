import {
  Heart,
  Tv,
  Hand,
  Sparkles,
  Brain,
  Bone,
  Smile,
  Laugh,
  HeartHandshake,
  Utensils,
  Mic,
  Crown
} from 'lucide-react'
import { motion } from 'framer-motion'
import { playPop } from '../utils/soundEffects.js'

const icons = {
  heart: Heart,
  tv: Tv,
  hand: Hand,
  sparkle: Sparkles,
  brain: Brain,
  bone: Bone,
  mask: Smile,
  laugh: Laugh,
  care: HeartHandshake,
  food: Utensils,
  mic: Mic,
  plum: Crown
}

export const Obj = ({ r, i, found, onPick }) => {
  const IconComponent = icons[r.icon] || Heart

  const handleClick = () => {
    playPop(520 + (i % 6) * 40)
    onPick(i)
  }

  // Slight natural rotation for authentic sticky note effect
  const rot = (i % 5) * 1.5 - 3

  return (
    <motion.button
      className={`sticky-note note-color-${i % 4} ${found ? 'unlocked' : ''}`}
      style={{
        backgroundColor: r.color || '#fff1b8',
        transform: `rotate(${rot}deg)`
      }}
      whileHover={{ scale: 1.08, rotate: 0, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      aria-label={`${r.label} ${found ? '(opened)' : ''}`}
    >
      {/* Scotch tape graphic on top of note */}
      <div className="sticky-tape" />

      {found && <div className="sticky-heart-seal">♡</div>}

      <div className="sticky-icon-wrap">
        <IconComponent size={26} strokeWidth={2.2} />
      </div>

      <span className="sticky-note-text">{r.label}</span>
      <small className="sticky-tap-hint">{found ? 'Read again' : 'Tap to reveal'}</small>
    </motion.button>
  )
}
