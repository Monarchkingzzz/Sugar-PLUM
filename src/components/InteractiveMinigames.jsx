import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Sparkles,
  Utensils,
  PhoneCall,
  BatteryMedium,
  Wifi,
  Moon
} from 'lucide-react'
import { playPop, playHeart, playChime } from '../utils/soundEffects.js'
import { Guide } from './UrbanGuide.jsx'

// 1. Moriah Deli Interactive Ice Cream Spoonfuls with Guide Reactions
export function MoriahIceCreamInteraction() {
  const [bites, setBites] = useState(0)
  const maxBites = 4
  const sparkPercent = Math.min(100, Math.round((bites / maxBites) * 100))

  // Dynamic Guide mood per bite
  const moodMap = ['side', 'smirk', 'warm', 'shock', 'love']
  const commentaryMap = [
    '“Waiting for you to take that first bite...”',
    '“There goes that cute little smile...”',
    '“Eyes lit up. Brain short-circuiting in real time.”',
    '“Certified spark right here at Moriah Deli!”',
    '“And then came our first kiss. Folded completely. ♡”'
  ]

  const takeBite = () => {
    playPop(480 + bites * 70)
    if (bites + 1 >= maxBites) {
      playHeart()
    }
    setBites((prev) => (prev < maxBites ? prev + 1 : 0))
  }

  const currentMood = moodMap[bites] || 'side'
  const currentComment = commentaryMap[bites] || commentaryMap[0]

  return (
    <div className="interactive-card icecream-card">
      <div className="card-top-tag">🍨 MORIAH DELI TASTE TEST</div>
      <h4>Take A Spoonful With Him</h4>
      <p className="subtext">
        Click the spoon to taste the ice cream that sparked this whole love story:
      </p>

      {/* Dynamic Guide Reaction Banner */}
      <div className="minigame-guide-reaction">
        <Guide mood={currentMood} size={68} />
        <div className="mini-speech-bubble">
          <p>{currentComment}</p>
        </div>
      </div>

      <div className="icecream-bowl-area">
        <motion.div
          className="icecream-graphic"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={takeBite}
        >
          <div className="sundae-dish">
            {bites < 4 && <div className="sundae-strawberry">🍓</div>}
            <div className={`scoop scoop-strawberry bite-${bites}`}>
              <div className="ice-cream-drizzle" />
            </div>
            <div className="sundae-glass-cup" />
          </div>
          <button className="spoon-action-btn">
            🥄 {bites === 0 ? 'First Bite' : bites < 4 ? 'Another Spoonful' : 'Order Another Scoop! ↻'}
          </button>
        </motion.div>

        <div className="spark-meter-box">
          <div className="meter-label">
            <span>✨ Love Spark Level:</span>
            <strong>{bites === 4 ? '1,000,000% (LOCKED IN)' : `${sparkPercent}%`}</strong>
          </div>
          <div className="meter-track">
            <motion.div
              className="meter-fill"
              style={{ width: `${sparkPercent}%` }}
              animate={{
                background:
                  bites === 4
                    ? 'linear-gradient(90deg, #ff385c, #ffc83b)'
                    : 'linear-gradient(90deg, #e8742a, #ffc83b)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// 2. The Food Critic Simulator (Happy Dance Mode) with Dynamic Reactions
export function FoodCriticSimulator({ dishes }) {
  const [activeDish, setActiveDish] = useState(0)

  const dishMoods = ['hype', 'smirk', 'warm', 'love']
  const dishQuotes = [
    '“Look at the shoulder shimmy! NASA could never explain this.”',
    '“The table went completely silent. She is in the zone.”',
    '“First forkful triggered an instant giggle. Never change.”',
    '“Takes her straight back to that Moriah Deli glow. Five stars.”'
  ]

  const handleSelectDish = (index) => {
    setActiveDish(index)
    playPop(520)
    playChime()
  }

  const currentMood = dishMoods[activeDish] || 'hype'

  return (
    <div className="interactive-card food-critic-card">
      <div className="card-top-tag">👑 TASTE TEST & DANCE SIMULATOR</div>
      <h4>Sugar Plum's Official Menu Ratings</h4>
      <p className="subtext">
        Pick a dish from the spread to trigger her patented happy dance:
      </p>

      {/* Guide reaction to the food choice */}
      <div className="minigame-guide-reaction">
        <Guide mood={currentMood} size={68} />
        <div className="mini-speech-bubble">
          <p>{dishQuotes[activeDish]}</p>
        </div>
      </div>

      <div className="dish-selector-pills">
        {dishes.map((dish, i) => (
          <button
            key={i}
            className={`dish-pill-btn ${activeDish === i ? 'active' : ''}`}
            onClick={() => handleSelectDish(i)}
          >
            {dish.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeDish}
          className="dance-reaction-box"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="dancing-avatar-badge">
            <motion.div
              className="dancer-emoji"
              animate={{
                rotate: [-8, 8, -8],
                y: [0, -8, 0]
              }}
              transition={{ repeat: Infinity, duration: 0.45 }}
            >
              💃🏽✨
            </motion.div>
            <span className="dance-status">
              Wiggle Factor: <strong>MAXIMUM WIGGLY 🔥</strong>
            </span>
          </div>

          <div className="field-note-bubble">
            <p className="dish-report-text">{dishes[activeDish].note}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// 3. One Shot Case Closed - Lightweight Stamina Meter with Boondocks Side-Eye
export function OneShotStaminaSimulator() {
  const [shots, setShots] = useState(1)

  return (
    <div className="interactive-card oneshot-card">
      <div className="card-top-tag">🥂 OFFICIAL STAMINA REPORT</div>
      <h4>The 1-Shot Tolerance Test</h4>
      <p className="subtext">
        Documenting how long Sugar Plum lasts once an adult beverage enters the scene:
      </p>

      {/* Guide Side-Eye / Shock reaction */}
      <div className="minigame-guide-reaction">
        <Guide mood={shots === 1 ? 'side' : 'shock'} size={68} />
        <div className="mini-speech-bubble">
          <p>
            {shots === 1
              ? '“One shot? ONE? I have seen dollar store phone cords with more stamina.”'
              : '“Two shots?! Somebody call an Uber, she is officially dreaming!”'}
          </p>
        </div>
      </div>

      <div className="stamina-slider-row">
        <label>Shots Consumed:</label>
        <div className="shot-toggle-pills">
          <button
            className={`shot-pill ${shots === 1 ? 'active' : ''}`}
            onClick={() => {
              playPop(460)
              setShots(1)
            }}
          >
            1 Shot
          </button>
          <button
            className={`shot-pill ${shots === 2 ? 'active' : ''}`}
            onClick={() => {
              playPop(520)
              setShots(2)
            }}
          >
            2 Shots (Danger)
          </button>
        </div>
      </div>

      <div className="stamina-comparison">
        <div className="compare-item">
          <span>Sugar Plum’s Consciousness:</span>
          <div className="stamina-bar-outer">
            <div
              className="stamina-bar-fill"
              style={{
                width: shots === 1 ? '12%' : '0%',
                background: '#ff385c'
              }}
            />
          </div>
          <small>
            {shots === 1
              ? '12% (Giggling at the wall, eyes heavy)'
              : '0% (Asleep on his shoulder in 2.5 seconds)'}
          </small>
        </div>

        <div className="compare-item">
          <span>iPhone 6 at 1% Battery:</span>
          <div className="stamina-bar-outer">
            <div className="stamina-bar-fill" style={{ width: '28%', background: '#ffc83b' }} />
          </div>
          <small>28% (Still outlasting her by a mile)</small>
        </div>
      </div>

      <div className="case-closed-stamp">
        🚨 VERDICT: CASE CLOSED. EXPERIMENT TERMINATED EXPEDITIOUSLY. 🚨
      </div>
    </div>
  )
}

// 4. The 2 AM Smartphone Screen with Guide Smirk / Warmth
export function TwoAmPhoneSimulation() {
  const [called, setCalled] = useState(false)

  const handleCall = () => {
    playChime()
    playHeart()
    setCalled(true)
  }

  return (
    <div className="interactive-card phone-simulator-card">
      <div className="card-top-tag">🌙 2:00 AM SCREENSHOT</div>

      <div className="minigame-guide-reaction">
        <Guide mood={called ? 'warm' : 'smirk'} size={68} />
        <div className="mini-speech-bubble">
          <p>
            {called
              ? '“Told you! He would wake up at any hour of the night just to hear your voice.”'
              : '“Look at her in bed trying to be considerate. Girl, he is staring at the phone!”'}
          </p>
        </div>
      </div>

      <div className="midnight-phone">
        <div className="phone-top-bar">
          <span>2:00 AM</span>
          <div className="phone-icons">
            <Moon size={13} />
            <Wifi size={13} />
            <BatteryMedium size={14} color="#ff385c" />
          </div>
        </div>

        <div className="phone-chat-screen">
          <div className="chat-date-pill">Late Night Thoughts</div>

          <div className="chat-bubble her">
            <p>You awake?</p>
            <span className="chat-time">1:58 AM</span>
          </div>

          <div className="chat-bubble her">
            <p>I almost called you just now... but didn't want to wake you up 🥺♡</p>
            <span className="chat-time">2:00 AM</span>
          </div>

          <div className="chat-bubble his-reply">
            <p>Baby, I would've answered on the first ring. I'm always here for you. ♡</p>
            <span className="chat-time">2:00 AM • Read</span>
          </div>
        </div>

        <div className="phone-bottom-action">
          {!called ? (
            <button className="ring-him-btn" onClick={handleCall}>
              <PhoneCall size={16} /> Tap to test what happens if you call
            </button>
          ) : (
            <motion.div
              className="call-answered-alert"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              📞 <strong>ANSWERED IN 0.001 SECONDS!</strong>
              <p>“Hey beautiful... I was awake thinking about you anyway.”</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

// 5. Interactive Voice Message Note Player with Guide Warm Reaction
export function VoiceMessageCard() {
  const [playing, setPlaying] = useState(false)
  const [seconds, setSeconds] = useState(14)

  const toggleVoiceNote = () => {
    playPop(650)
    setPlaying(!playing)
  }

  return (
    <div className="interactive-card voice-memo-card">
      <div className="card-top-tag">🎙️ AUDIO MEMO ARCHIVE</div>
      <h4>Voice Note #42: “Goodnight Handsome”</h4>
      <p className="subtext">
        The nightly routine that keeps him smiling to sleep:
      </p>

      {/* Guide reacts with warm devotion */}
      <div className="minigame-guide-reaction">
        <Guide mood={playing ? 'love' : 'warm'} size={68} />
        <div className="mini-speech-bubble">
          <p>
            {playing
              ? '“Listening to her voice notes on repeat. Man found his peace.”'
              : '“Hit play. This man literally has a bedtime playlist of her voice.”'}
          </p>
        </div>
      </div>

      <div className="voice-memo-player-ui">
        <button
          className={`memo-play-toggle ${playing ? 'playing' : ''}`}
          onClick={toggleVoiceNote}
          aria-label={playing ? 'Pause memo' : 'Play memo'}
        >
          {playing ? '⏸' : '▶'}
        </button>

        <div className="memo-wave-bars">
          {[24, 45, 60, 35, 78, 90, 42, 65, 80, 55, 30, 70, 95, 60, 40, 85, 50, 68].map(
            (h, idx) => (
              <motion.span
                key={idx}
                className="wave-bar"
                style={{ height: `${h}%` }}
                animate={
                  playing
                    ? {
                        scaleY: [0.4, 1.4, 0.4],
                        backgroundColor: ['#ffc83b', '#ff385c', '#ffc83b']
                      }
                    : { scaleY: 1 }
                }
                transition={{
                  repeat: Infinity,
                  duration: 0.6 + (idx % 4) * 0.1,
                  ease: 'easeInOut'
                }}
              />
            )
          )}
        </div>

        <span className="memo-timestamp">0:{seconds} / 0:48</span>
      </div>

      <div className="voice-quote-pill">
        🎧 “Some people count sheep. This man counts every syllable of your voice notes.”
      </div>
    </div>
  )
}
