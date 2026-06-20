import { HERO_FX_SPARKLES } from './mobileHeroFxSparkles'
import './MobileBelAgeFx.css'

/**
 * Hero FX doré Bel Âge — aurora, burst, sparkles, shimmer.
 * inline : intégré dans une section hero (ex. /packs)
 * route  : overlay fixe en haut à chaque changement d’onglet
 */
export default function MobileHeroFx({ variant = 'inline', className = '' }) {
  const rootClass =
    variant === 'route'
      ? 'belage-mfx belage-mfx--route'
      : 'belage-mfx belage-mfx--inline'

  return (
    <div className={`${rootClass}${className ? ` ${className}` : ''}`} aria-hidden="true">
      <div className="belage-mfx__rays" />
      <div className="belage-mfx__aurora belage-mfx__aurora--1" />
      <div className="belage-mfx__aurora belage-mfx__aurora--2" />
      <div className="belage-mfx__burst" />
      <div className="belage-mfx__shimmer" />
      <div className="belage-mfx__orbs">
        <span className="belage-mfx__orb belage-mfx__orb--1" />
        <span className="belage-mfx__orb belage-mfx__orb--2" />
        <span className="belage-mfx__orb belage-mfx__orb--3" />
      </div>
      <div className="belage-mfx__sparkles">
        {HERO_FX_SPARKLES.map((s) => (
          <span
            key={s.id}
            className="belage-mfx__sparkle"
            style={{
              '--sx': s.left,
              '--sy': s.top,
              '--ss': `${s.size}px`,
              '--sd': s.delay,
              '--st': s.duration,
              '--drift': s.drift,
            }}
          />
        ))}
      </div>
      <div className="belage-mfx__wave" />
    </div>
  )
}
