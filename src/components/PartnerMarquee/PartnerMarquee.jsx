import './PartnerMarquee.css'

const PARTNERS = [
  { name: 'Les Gourmandises', style: 'sans' },
  { name: 'Douceurs & Cie', style: 'display' },
  { name: 'La Maison Dorée', style: 'display' },
  { name: 'Atelier Sucré', style: 'display' },
  { name: 'Maison Lenard', style: 'display' },
  { name: 'Pâtisserie Dallieu', style: 'display' },
  { name: 'Babka Zana', style: 'startup' },
  { name: 'Foodette', style: 'startup' },
  { name: 'Pâtisserie Cloud', style: 'startup' },
]

export { PARTNERS }

const TRACK = [...PARTNERS, ...PARTNERS]

export default function PartnerMarquee() {
  return (
    <section className="partner-marquee" aria-label="Partenaires et références" data-home-reveal>
      <div className="partner-marquee__head">
        <p className="partner-marquee__eyebrow">Réseau &amp; références</p>
        <p className="partner-marquee__title">
          Des maisons reconnues, des créatrices ambitieuses
        </p>
      </div>

      <div className="partner-marquee__viewport">
        <div className="partner-marquee__track">
          {TRACK.map((brand, i) => (
            <span
              key={`${brand.name}-${i}`}
              className={`partner-marquee__brand partner-marquee__brand--${brand.style}`}
            >
              {brand.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
