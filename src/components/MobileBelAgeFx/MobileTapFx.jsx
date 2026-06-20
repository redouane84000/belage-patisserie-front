import { useMobileTapFx } from './useMobileTapFx'
import { useBelAgeMobileFx } from '../../hooks/useMediaQuery'
import './MobileBelAgeFx.css'

export default function MobileTapFx() {
  const isMobile = useBelAgeMobileFx()
  const bursts = useMobileTapFx()

  if (!isMobile) return null

  return (
    <div className="belage-mfx-tap-layer" aria-hidden="true">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="belage-mfx-tap-burst"
          style={{ left: burst.x, top: burst.y }}
        >
          <span className="belage-mfx-tap-burst__shimmer" />
          <span className="belage-mfx-tap-burst__core" />
          <span className="belage-mfx-tap-burst__ring" />
          {burst.sparkles.map((spark) => (
            <span
              key={spark.id}
              className="belage-mfx-tap-burst__spark"
              style={{
                '--angle': `${spark.angle}deg`,
                '--dist': `${spark.dist}px`,
                '--ss': `${spark.size}px`,
                '--sd': `${spark.delay}s`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
