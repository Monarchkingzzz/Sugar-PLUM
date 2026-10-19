import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, Music, Disc3, Sparkles, Upload, RotateCcw } from 'lucide-react'
import { playPop, playHeart } from '../utils/soundEffects.js'

const fmt = (s) =>
  !isFinite(s)
    ? '0:00'
    : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

// Procedural Lo-Fi / Neo-Soul Romantic Ambient Synth for when an mp3 isn't loaded
class RomanticSynthesizer {
  constructor() {
    this.ctx = null
    this.isPlaying = false
    this.timer = null
    this.step = 0
    this.masterGain = null
    // Sweet Neo-Soul / R&B Chords (frequencies in Hz):
    // Chord 1: Dmaj9 [D3, A3, C#4, E4, F#4]
    // Chord 2: F#m7 [F#2, C#3, E3, A3, C#4]
    // Chord 3: Bm9 [B2, F#3, A3, C#4, D4]
    // Chord 4: Gmaj9 [G2, D3, F#3, B3, D4]
    this.progression = [
      [146.83, 220.0, 277.18, 329.63, 369.99],
      [92.5, 138.59, 164.81, 220.0, 277.18],
      [123.47, 185.0, 220.0, 277.18, 293.66],
      [98.0, 146.83, 185.0, 246.94, 293.66]
    ]
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  playChord(notes) {
    if (!this.ctx || !this.isPlaying) return
    const now = this.ctx.currentTime
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      osc.type = idx === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, now)

      // Warm lowpass filter for that vintage Lo-Fi feel
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(900, now)

      // Attack & decay envelope
      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + 0.35)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 4.0)
    })
  }

  start() {
    this.init()
    this.isPlaying = true
    this.step = 0
    const tick = () => {
      if (!this.isPlaying) return
      const chord = this.progression[this.step % this.progression.length]
      this.playChord(chord)
      this.step++
      this.timer = setTimeout(tick, 3200)
    }
    tick()
  }

  stop() {
    this.isPlaying = false
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  setVolume(v) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(v * 0.22, this.ctx.currentTime)
    }
  }
}

const DB_NAME = 'SugarPlumAudioDB'
const STORE_NAME = 'customSong'

function saveAudioToDB(file, name) {
  try {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME)
    }
    req.onsuccess = (e) => {
      const db = e.target.result
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put({ blob: file, name, date: Date.now() }, 'active')
    }
  } catch (err) {
    console.warn('Could not cache audio in IndexedDB:', err)
  }
}

function loadAudioFromDB(callback) {
  try {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME)
    }
    req.onsuccess = (e) => {
      const db = e.target.result
      const tx = db.transaction(STORE_NAME, 'readonly')
      const getReq = tx.objectStore(STORE_NAME).get('active')
      getReq.onsuccess = () => {
        if (getReq.result && getReq.result.blob) {
          callback(getReq.result)
        }
      }
    }
  } catch (err) {
    console.warn('IndexedDB load error:', err)
  }
}

function clearAudioFromDB() {
  try {
    const req = indexedDB.open(DB_NAME, 1)
    req.onsuccess = (e) => {
      const db = e.target.result
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete('active')
    }
  } catch (err) {}
}

const synthInstance = new RomanticSynthesizer()

export default function LoveSongPlayer({ song }) {
  const audioRef = useRef(null)
  const fileInputRef = useRef(null)
  const [status, setStatus] = useState('checking')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.85)
  const [isSynthMode, setIsSynthMode] = useState(false)
  const [coverError, setCoverError] = useState(false)
  const [customTrack, setCustomTrack] = useState(null) // { url, name }
  const [isDragging, setIsDragging] = useState(false)
  const [uploadNotice, setUploadNotice] = useState('')

  // Check IndexedDB on mount for previously uploaded audio
  useEffect(() => {
    loadAudioFromDB((data) => {
      if (data && data.blob) {
        const url = URL.createObjectURL(data.blob)
        setCustomTrack({
          url,
          name: data.name || 'Uploaded Romantic Track'
        })
        setUploadNotice(`Loaded saved track: ${data.name}`)
      }
    })
  }, [])

  // Active audio URL: custom uploaded track takes priority
  const activeAudioSrc = customTrack ? customTrack.url : song.audio

  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    const onLoaded = () => {
      setDuration(el.duration)
      setStatus('ready')
      setIsSynthMode(false)
    }
    const onTime = () => setCurrentTime(el.currentTime)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)
    let hasTriedFallback = false
    const onError = () => {
      if (!customTrack && song?.fallbackAudio && !hasTriedFallback) {
        hasTriedFallback = true
        if (el) {
          el.src = song.fallbackAudio
          el.load()
        }
        return
      }
      if (!customTrack) {
        // Fallback seamlessly to Lo-Fi synthesizer
        setStatus('ready')
        setIsSynthMode(true)
        setDuration(180)
      }
    }

    el.addEventListener('loadedmetadata', onLoaded)
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('ended', onEnded)
    el.addEventListener('error', onError)

    el.load()

    return () => {
      el.removeEventListener('loadedmetadata', onLoaded)
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('error', onError)
      el.pause()
      synthInstance.stop()
    }
  }, [activeAudioSrc, customTrack])

  useEffect(() => {
    if (audioRef.current && !isSynthMode) {
      audioRef.current.volume = volume
    }
    synthInstance.setVolume(volume)
  }, [volume, isSynthMode])

  // Handle synth time ticker
  useEffect(() => {
    let interval = null
    if (isSynthMode && isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((t) => (t >= 180 ? 0 : t + 1))
      }, 1000)
    } else {
      if (interval) clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSynthMode, isPlaying])

  const togglePlayback = () => {
    playPop(620)
    if (isSynthMode) {
      if (isPlaying) {
        synthInstance.stop()
        setIsPlaying(false)
      } else {
        synthInstance.start()
        setIsPlaying(true)
        playHeart()
      }
    } else {
      const el = audioRef.current
      if (!el) return
      if (el.paused) {
        el.play().catch(() => {
          setIsSynthMode(true)
          synthInstance.start()
          setIsPlaying(true)
        })
      } else {
        el.pause()
      }
    }
  }

  // Handle Audio File Upload (MPEG, MP3, WAV, M4A, etc.)
  const processUploadedFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('audio/') && !/\.(mp3|mpeg|wav|m4a|aac|ogg)$/i.test(file.name)) {
      alert('Please upload an audio file (MPEG, MP3, WAV, or M4A).')
      return
    }

    const cleanName = file.name.replace(/\.[^/.]+$/, '')
    const url = URL.createObjectURL(file)

    setCustomTrack({
      url,
      name: cleanName
    })
    setIsSynthMode(false)
    saveAudioToDB(file, cleanName)
    playPop(640)
    setUploadNotice(`✨ Uploaded: "${cleanName}"! Tap play to listen with Sugar Plum.`)

    setTimeout(() => {
      const el = audioRef.current
      if (el) {
        el.load()
        el.play().then(() => setIsPlaying(true)).catch(() => {})
      }
    }, 200)
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      processUploadedFile(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processUploadedFile(file)
    }
  }

  const handleResetTrack = () => {
    playPop(480)
    clearAudioFromDB()
    setCustomTrack(null)
    setUploadNotice('')
    setIsSynthMode(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = song.audio
      audioRef.current.load()
    }
  }

  return (
    <section
      className={`comic-song-player ${isDragging ? 'drag-over' : ''}`}
      aria-label="Our Love Soundtrack"
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <audio ref={audioRef} src={activeAudioSrc} preload="metadata" />

      {/* Hidden file input for MPEG / MP3 uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.mpeg,.wav,.m4a,.aac,.ogg"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />

      <div className="player-top-row">
        <div className="player-comic-badge">
          <Sparkles size={16} /> OFFICIAL SOUNDTRACK • FOR HER
        </div>

        {/* Upload Audio Trigger Button */}
        <button
          className="audio-upload-btn"
          onClick={() => {
            playPop(520)
            fileInputRef.current?.click()
          }}
          title="Upload your MPEG / MP3 love song"
        >
          <Upload size={14} />
          <span>{customTrack ? 'Upload Different Song' : 'Upload Your Song (MPEG / MP3)'}</span>
        </button>
      </div>

      {uploadNotice && (
        <div className="audio-upload-success-toast">
          <span>{uploadNotice}</span>
          {customTrack && (
            <button className="reset-song-link" onClick={handleResetTrack} title="Revert to theme">
              <RotateCcw size={12} /> Reset to Original Track
            </button>
          )}
        </div>
      )}

      <div className="player-inner">
        {/* Spinning Vinyl & Cover Container */}
        <div className="cover-art-wrapper">
          <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}>
            <Disc3 size={110} strokeWidth={1} color="#111" />
          </div>
          <div className="cover-frame">
            {!coverError && song.cover ? (
              <img
                src={song.cover}
                alt="Album Cover"
                onError={() => setCoverError(true)}
              />
            ) : (
              <div className="cover-placeholder">
                <Music size={44} color="#ffc83b" />
              </div>
            )}
          </div>
        </div>

        {/* Track Details */}
        <div className="player-meta">
          <div className="meta-title-group">
            <h3 className="track-title">
              {customTrack ? customTrack.name : song.title || 'Our World (Sugar Plum Theme)'}
            </h3>
            {customTrack && (
              <span className="custom-track-badge">💿 CUSTOM TRACK LOADED</span>
            )}
          </div>

          <p className="track-artist">
            {customTrack
              ? 'Dedicated Song Uploaded For Sugar Plum'
              : song.artist || 'Written & Dedicated to Sugar Plum'}
          </p>

          {isSynthMode && !customTrack && (
            <div className="synth-mode-pill">
              ✨ Live Romantic Lo-Fi Chords Playing ✨
            </div>
          )}

          {/* Progress row */}
          <div className="player-time-row">
            <span className="time-num">{fmt(currentTime)}</span>
            <input
              type="range"
              aria-label="Seek track"
              min="0"
              max={duration || 180}
              step="0.5"
              value={currentTime}
              onChange={(e) => {
                const val = +e.target.value
                setCurrentTime(val)
                if (audioRef.current && !isSynthMode) {
                  audioRef.current.currentTime = val
                }
              }}
              className="comic-range"
            />
            <span className="time-num">{fmt(duration || 180)}</span>
          </div>

          {/* Controls */}
          <div className="player-actions">
            <button
              className="comic-play-btn"
              onClick={togglePlayback}
              aria-label={isPlaying ? 'Pause song' : 'Play song'}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: 3 }} />}
            </button>

            <div className="volume-control">
              <Volume2 size={18} />
              <input
                type="range"
                aria-label="Volume slider"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(+e.target.value)}
                className="comic-range mini"
              />
            </div>

            {customTrack && (
              <button
                className="comic-btn mini reset-track-btn"
                onClick={handleResetTrack}
                title="Switch back to original theme"
              >
                <RotateCcw size={13} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
