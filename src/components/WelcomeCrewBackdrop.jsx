import { motion } from 'framer-motion'
import { Sparkles, MessageCircle } from 'lucide-react'

export function WelcomeCrewBackdrop({ currentChapter, onCharacterClick }) {
  // The crew is primarily featured in Chapter 1 (Welcome & Real Talk), 
  // but remains gently ambient in other chapters without obstructing content.
  const isCh1 = currentChapter === 0

  return (
    <div 
      className={`welcome-crew-backdrop-container ${isCh1 ? 'focus-welcome' : 'ambient-welcome'}`}
      aria-label="Welcome crew background scene"
    >
      {/* Warm Ambient Glow behind characters */}
      <div className="crew-atmosphere-glow" />

      {/* --- ROBERT FREEMAN (GRANDDAD) ---
          Warm, pleased welcoming presence on the left flank */}
      <motion.div
        className="crew-member granddad-wrapper"
        initial={{ opacity: 0, x: -50, y: 30 }}
        animate={{ 
          opacity: isCh1 ? 1 : 0.45, 
          x: 0, 
          y: 0 
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onClick={() => onCharacterClick?.('granddad')}
        title="Robert 'Granddad' Freeman welcomes Sugar Plum"
      >
        {isCh1 && (
          <motion.div 
            className="crew-speech-bubble left-bubble"
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            <span>Welcome to the family, Sugar Plum! Don't let these boys give you a headache!</span>
          </motion.div>
        )}
        <motion.div
          animate={{
            y: [0, -5, 0],
            rotate: [0, 0.8, 0]
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="character-interactive-box"
        >
          <img
            src="/images/crew-granddad.png"
            alt="Granddad welcoming Sugar Plum"
            className="crew-img granddad-img"
          />
        </motion.div>
      </motion.div>

      {/* --- HUEY FREEMAN ---
          Composed, observant, respectful subtle nod on the balcony/rooftop backdrop */}
      <motion.div
        className="crew-member huey-wrapper"
        initial={{ opacity: 0, y: 40 }}
        animate={{ 
          opacity: isCh1 ? 1 : 0.5, 
          y: 0 
        }}
        transition={{ duration: 0.9, delay: 0.4 }}
        onClick={() => onCharacterClick?.('huey')}
        title="Huey Freeman gives the subtle nod of respect"
      >
        {isCh1 && (
          <motion.div 
            className="crew-speech-bubble center-bubble"
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.4 }}
          >
            <span>*composed nod* Respect. Bro definitely found someone real.</span>
          </motion.div>
        )}
        <motion.div
          animate={{
            y: [0, -3, 0],
            rotate: [0, -0.6, 0]
          }}
          transition={{
            duration: 5.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="character-interactive-box"
        >
          <img
            src="/images/crew-huey.png"
            alt="Huey Freeman observing and giving a respectful nod"
            className="crew-img huey-img"
          />
        </motion.div>
      </motion.div>

      {/* --- RILEY FREEMAN ---
          Visibly excited, hyped, energetic welcoming energy on the right flank */}
      <motion.div
        className="crew-member riley-wrapper"
        initial={{ opacity: 0, x: 50, y: 30 }}
        animate={{ 
          opacity: isCh1 ? 1 : 0.45, 
          x: 0, 
          y: 0 
        }}
        transition={{ duration: 0.8, delay: 0.3 }}
        onClick={() => onCharacterClick?.('riley')}
        title="Riley Freeman hyped and welcoming Sugar Plum"
      >
        {isCh1 && (
          <motion.div 
            className="crew-speech-bubble right-bubble"
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.4 }}
          >
            <span>YOOO! Sugar Plum in the building! My boy is big ballin' now!</span>
          </motion.div>
        )}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, -1.2, 0]
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="character-interactive-box"
        >
          <img
            src="/images/crew-riley.png"
            alt="Riley Freeman hyped to see Sugar Plum"
            className="crew-img riley-img"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
