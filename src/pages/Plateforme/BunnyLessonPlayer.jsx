import { useEffect, useRef, useState } from 'react'
import Playerjs from 'player.js'

const ALLOW = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen'

export default function BunnyLessonPlayer({ src, title, onTimeUpdate, playerRef }) {
  const frameRef = useRef(null)
  const instanceRef = useRef(null)
  const timeRef = useRef(onTimeUpdate)
  const [playing, setPlaying] = useState(false)
  timeRef.current = onTimeUpdate

  useEffect(() => {
    if (!frameRef.current) return undefined
    const player = new Playerjs.Player(frameRef.current)
    instanceRef.current = player
    if (playerRef) playerRef.current = player
    player.on('play', () => setPlaying(true))
    player.on('pause', () => setPlaying(false))
    player.on('ended', () => setPlaying(false))
    player.on('timeupdate', (payload) => {
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload
      if (typeof data?.seconds === 'number') timeRef.current?.(data.seconds)
    })
    return () => {
      instanceRef.current = null
      if (playerRef) playerRef.current = null
    }
  }, [playerRef])

  function toggle() {
    const player = instanceRef.current
    if (!player) return
    if (typeof player.getPaused === 'function') {
      player.getPaused((paused) => {
        if (paused) player.play()
        else player.pause()
      })
      return
    }
    if (playing) player.pause()
    else player.play()
  }

  return (
    <div className="le-player">
      <div className="le-video">
        <iframe
          ref={frameRef}
          title={title}
          src={src}
          allow={ALLOW}
          allowFullScreen
          playsInline
        />
      </div>
      <div className="le-transport">
        <button type="button" onClick={toggle} aria-pressed={playing}>
          {playing ? 'Mettre en pause' : 'Lecture'}
        </button>
      </div>
    </div>
  )
}
