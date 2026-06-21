import './MobileBelAgeFx.css'

/**
 * Hero FX doré Bel Âge — burst, shimmer, rayons (sans bulles/particules).
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
      <div className="belage-mfx__burst" />
      <div className="belage-mfx__shimmer" />
      <div className="belage-mfx__wave" />
    </div>
  )
}
