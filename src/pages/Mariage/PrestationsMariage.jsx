import { useMemo, useState } from 'react'
import { ArrowRight, Check, Gift, Heart, Maximize2, MessageCircle, Minus, Plus, Ruler } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { BEL_AGE_WHATSAPP_URL } from '../../data/resources'
import {
  WEDDING_BROCHURES,
  WEDDING_CREATIONS,
  WEDDING_MAX_KM,
  WEDDING_MAX_PARTS,
  WEDDING_MIN_PARTS,
  WEDDING_OPTIONS,
  WEDDING_PACKS,
  buildQuote,
  buildWhatsAppQuoteMessage,
  clampParts,
  formatEuro,
  getVariant,
  packStartPrice,
} from '../../data/mariage/prestationsMariage'
import './PrestationsMariage.css'

const HERO_STATS = [
  { value: '3', label: 'offres clés en main' },
  { value: '60 → 260', label: 'parts servies' },
  { value: '100 km', label: 'livraison offerte en Luxe' },
]

const PROMISES = [
  {
    icon: Heart,
    title: 'Une création signature',
    text: 'Wedding cake, Italian cake ou cupcakes floraux — même prix à nombre de parts égal.',
  },
  {
    icon: Ruler,
    title: 'Un prix qui suit vos invités',
    text: 'Plus la table est grande, moins la part supplémentaire coûte cher.',
  },
  {
    icon: Gift,
    title: 'Des prestations offertes',
    text: 'Jets d’étincelles en Premium, jets et un décor au choix en Luxe.',
  },
]

function defaultVariants() {
  return WEDDING_OPTIONS.reduce((acc, option) => {
    acc[option.id] = option.variants[0].id
    return acc
  }, {})
}

export default function PrestationsMariage() {
  // Note : `wed-reveal` ne doit porter que sur des éléments dont la classe
  // ne change jamais — sinon un re-rendu React efface la classe `visible`
  // ajoutée par l'observateur et l'élément redevient invisible.
  useScrollReveal('wed-reveal')

  const [creationId, setCreationId] = useState('wedding-cake')
  const [packId, setPackId] = useState('premium')
  const [parts, setParts] = useState(100)
  const [km, setKm] = useState(30)
  const [variantByOption, setVariantByOption] = useState(defaultVariants)
  const [selectedOptionIds, setSelectedOptionIds] = useState([])

  const creation = useMemo(
    () => WEDDING_CREATIONS.find((item) => item.id === creationId) ?? WEDDING_CREATIONS[0],
    [creationId],
  )
  const pack = useMemo(
    () => WEDDING_PACKS.find((item) => item.id === packId) ?? WEDDING_PACKS[0],
    [packId],
  )
  const quote = useMemo(
    () => buildQuote({ pack, parts, km, selectedOptionIds }),
    [pack, parts, km, selectedOptionIds],
  )
  /** Décor effectivement offert par l'offre (Luxe), pour l'afficher au client. */
  const offeredDecorName = useMemo(
    () => quote.lines.find((line) => line.offered && line.option.category === 'decor')?.option.name,
    [quote],
  )
  const whatsAppUrl = useMemo(() => {
    const message = buildWhatsAppQuoteMessage({ pack, creation, parts, km, quote, variantByOption })
    return `${BEL_AGE_WHATSAPP_URL}?text=${encodeURIComponent(message)}`
  }, [pack, creation, parts, km, quote, variantByOption])

  const toggleOption = (optionId) => {
    setSelectedOptionIds((current) =>
      current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId],
    )
  }

  const pickVariant = (optionId, variantId) =>
    setVariantByOption((current) => ({ ...current, [optionId]: variantId }))

  const stepParts = (delta) => setParts((current) => clampParts(current + delta))

  const selectPack = (id) => setPackId(id)

  return (
    <div className="wed-page">
      <Navbar />

      <main>
        {/* ---------------------------------------------------------- Hero */}
        <section className="wed-hero">
          <span className="wed-hero__glow" aria-hidden="true" />

          <div className="wed-shell wed-hero__grid">
            <div className="wed-hero__copy">
              <span className="wed-kicker wed-kicker--light">Bel Âge Pâtisserie · Prestations mariage</span>
              <h1>
                Gâteaux de mariage
                <span className="wed-hero__accent"> &amp; décors d’exception</span>
              </h1>
              <p className="wed-hero__lead">
                Une création signature, une mise en scène florale et un prix annoncé avant même de
                nous écrire. Composez votre devis en moins d’une minute.
              </p>

              <div className="wed-hero__actions">
                <a href="#devis" className="wed-btn wed-btn--gold">
                  Composer mon devis <ArrowRight size={17} />
                </a>
                <a href="#offres" className="wed-btn wed-btn--ghost">
                  Voir les trois offres
                </a>
              </div>

              <ul className="wed-hero__stats">
                {HERO_STATS.map((stat) => (
                  <li key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <figure className="wed-hero__frame">
              <img src="/mariage/hero-mariage.jpg" alt="Wedding cake Bel Âge et bouquet de cupcakes floraux" />
              <span className="wed-hero__shimmer" aria-hidden="true" />
              <figcaption className="wed-hero__badge">
                <small>À partir de</small>
                <strong>{formatEuro(packStartPrice(WEDDING_PACKS[0]))}</strong>
                <small>la création, 60 parts</small>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ----------------------------------------------------- Promesses */}
        <div className="wed-shell wed-reveal">
          <section className="wed-promises">
            {PROMISES.map(({ icon: Icon, title, text }) => (
              <article key={title} className="wed-promise">
                <Icon size={20} strokeWidth={1.6} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </section>
        </div>

        {/* -------------------------------------------------- Les créations */}
        <section className="wed-shell wed-creations">
          <header className="wed-heading wed-reveal">
            <span className="wed-kicker">Étape 1</span>
            <h2>Choisissez votre création</h2>
            <p>
              Une seule création par mariage, à partir de 60 parts. À nombre de parts égal, les trois
              sont au même prix.
            </p>
          </header>

          <div className="wed-creations__grid wed-reveal">
            {WEDDING_CREATIONS.map((item) => {
              const isActive = item.id === creationId
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`wed-creation${isActive ? ' is-on' : ''}`}
                  onClick={() => setCreationId(item.id)}
                  aria-pressed={isActive}
                >
                  <span className="wed-creation__media">
                    <img src={item.image} alt={item.alt} loading="lazy" />
                    {isActive && (
                      <span className="wed-creation__flag"><Check size={13} strokeWidth={3} /> Choisie</span>
                    )}
                  </span>
                  <span className="wed-creation__body">
                    <strong>{item.name}</strong>
                    <span>{item.text}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ------------------------------------------------- Les trois offres */}
        <section id="offres" className="wed-shell wed-packs">
          <header className="wed-heading wed-reveal">
            <span className="wed-kicker">Étape 2</span>
            <h2>Trois offres pour votre mariage</h2>
            <p>
              La création est la même dans les trois offres. Ce qui change, ce sont les prestations
              offertes et la livraison.
            </p>
          </header>

          <div className="wed-packs__grid wed-reveal">
            {WEDDING_PACKS.map((item) => {
              const isActive = item.id === packId
              return (
                <article
                  key={item.id}
                  className={`wed-pack${item.featured ? ' is-featured' : ''}${isActive ? ' is-active' : ''}`}
                >
                  {item.featured && <span className="wed-pack__badge">Le plus choisi</span>}
                  <h3>{item.name}</h3>
                  <p className="wed-pack__tagline">{item.tagline}</p>

                  <p className="wed-pack__price">
                    <small>dès</small>
                    <strong>{formatEuro(packStartPrice(item))}</strong>
                    <small>pour 60 parts</small>
                  </p>

                  <ul className="wed-pack__list">
                    {item.includes.map((line) => (
                      <li key={line}><Check size={15} strokeWidth={2.2} /> {line}</li>
                    ))}
                    {item.extras.map((line) => (
                      <li key={line} className="is-extra"><Plus size={14} strokeWidth={2.2} /> {line}</li>
                    ))}
                  </ul>

                  <p className="wed-pack__delivery">Livraison : {item.deliveryLabel}</p>

                  <button
                    type="button"
                    className={`wed-btn ${isActive ? 'wed-btn--gold' : 'wed-btn--outline'} wed-pack__cta`}
                    onClick={() => selectPack(item.id)}
                    aria-pressed={isActive}
                  >
                    {isActive ? (
                      <>
                        <Check size={16} strokeWidth={3} /> Offre sélectionnée
                      </>
                    ) : (
                      <>
                        Choisir {item.name} <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </article>
              )
            })}
          </div>
        </section>

        {/* -------------------------------------------------- Le simulateur */}
        <section id="devis" className="wed-shell wed-config">
          <header className="wed-heading wed-reveal">
            <span className="wed-kicker">Étape 3</span>
            <h2>Votre devis en direct</h2>
            <p>Ajustez les curseurs : le total se met à jour immédiatement.</p>
          </header>

          <div className="wed-config__grid">
            <div className="wed-config__panel wed-reveal">
              <fieldset className="wed-field">
                <legend>Votre création</legend>
                <div className="wed-choices">
                  {WEDDING_CREATIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`wed-choice${item.id === creationId ? ' is-on' : ''}`}
                      onClick={() => setCreationId(item.id)}
                      aria-pressed={item.id === creationId}
                    >
                      <strong>{item.name}</strong>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="wed-field">
                <legend>Votre offre</legend>
                <div className="wed-choices">
                  {WEDDING_PACKS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`wed-choice${item.id === packId ? ' is-on' : ''}`}
                      onClick={() => selectPack(item.id)}
                      aria-pressed={item.id === packId}
                    >
                      <strong>{item.name}</strong>
                      <span>dès {formatEuro(packStartPrice(item))}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="wed-field">
                <legend>Nombre de parts</legend>
                <div className="wed-stepper">
                  <button type="button" onClick={() => stepParts(-5)} aria-label="Retirer 5 parts">
                    <Minus size={18} />
                  </button>
                  <output>
                    <strong>{parts}</strong>
                    <span>parts</span>
                  </output>
                  <button type="button" onClick={() => stepParts(5)} aria-label="Ajouter 5 parts">
                    <Plus size={18} />
                  </button>
                </div>
                <input
                  type="range"
                  className="wed-range"
                  min={WEDDING_MIN_PARTS}
                  max={WEDDING_MAX_PARTS}
                  step={1}
                  value={parts}
                  onChange={(event) => setParts(clampParts(event.target.value))}
                  aria-label="Nombre de parts"
                />
                <p className="wed-field__hint">
                  {quote.tier.label} : chaque part en plus coûte {formatEuro(quote.tier.step)}.
                </p>
              </fieldset>

              <fieldset className="wed-field">
                <legend>Distance de livraison</legend>
                <div className="wed-stepper wed-stepper--flat">
                  <output>
                    <strong>{km}</strong>
                    <span>km</span>
                  </output>
                  <span className="wed-field__tag">
                    {km === 0
                      ? 'Retrait à l’atelier'
                      : quote.delivery === 0
                        ? 'Livraison offerte'
                        : formatEuro(quote.delivery)}
                  </span>
                </div>
                <input
                  type="range"
                  className="wed-range"
                  min={0}
                  max={WEDDING_MAX_KM}
                  step={5}
                  value={km}
                  onChange={(event) => setKm(Number(event.target.value))}
                  aria-label="Distance de livraison en kilomètres"
                />
                <p className="wed-field__hint">{pack.deliveryLabel}</p>
              </fieldset>

              <fieldset className="wed-field">
                <legend>Décors &amp; effets</legend>

                {pack.freeDecorCount > 0 && (
                  <p className={`wed-field__nudge${quote.freeDecorsLeft === 0 ? ' is-done' : ''}`}>
                    <Gift size={14} />
                    {quote.freeDecorsLeft > 0
                      ? `Votre offre ${pack.name} comprend un décor au choix offert — sélectionnez-le ci-dessous.`
                      : `Décor offert appliqué : ${offeredDecorName}.`}
                  </p>
                )}

                <div className="wed-optlist">
                  {WEDDING_OPTIONS.map((option) => {
                    const includedByPack = pack.includedOptionIds.includes(option.id)
                    const checked = includedByPack || selectedOptionIds.includes(option.id)
                    const line = quote.lines.find((item) => item.option.id === option.id)
                    const offered = Boolean(line?.offered)

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`wed-opt${checked ? ' is-on' : ''}${includedByPack ? ' is-locked' : ''}`}
                        onClick={() => !includedByPack && toggleOption(option.id)}
                        aria-pressed={checked}
                        aria-disabled={includedByPack}
                      >
                        <span className="wed-opt__box">{checked && <Check size={13} strokeWidth={3} />}</span>
                        <span className="wed-opt__name">{option.name}</span>
                        <span className={`wed-opt__price${offered ? ' is-free' : ''}`}>
                          {offered ? (includedByPack ? 'Inclus' : 'Offert') : formatEuro(option.price)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            </div>

            <aside className="wed-quote wed-reveal">
              <span className="wed-quote__kicker">Votre estimation</span>

              <ul className="wed-quote__lines">
                <li>
                  <span>{creation.name} · {parts} parts · offre {pack.name}</span>
                  <b>{formatEuro(quote.packPrice)}</b>
                </li>
                {quote.lines.map((line) => (
                  <li key={line.option.id} className={line.offered ? 'is-free' : ''}>
                    <span>{line.option.name}</span>
                    <b>{line.offered ? 'Offert' : formatEuro(line.price)}</b>
                  </li>
                ))}
                {quote.freeDecorsLeft > 0 && (
                  <li className="is-pending">
                    <span>Décor offert par l’offre {pack.name}</span>
                    <b>À choisir</b>
                  </li>
                )}
                <li>
                  <span>{km === 0 ? 'Retrait à l’atelier' : `Livraison · ${km} km`}</span>
                  <b>
                    {km === 0 ? '—' : quote.delivery === 0 ? 'Offerte' : formatEuro(quote.delivery)}
                  </b>
                </li>
              </ul>

              {quote.offeredValue > 0 && (
                <p className="wed-quote__savings">
                  <Gift size={15} /> {formatEuro(quote.offeredValue)} de prestations offertes avec
                  l’offre {pack.name}
                </p>
              )}

              <div className="wed-quote__total" key={quote.total}>
                <span>Total estimé</span>
                <strong>{formatEuro(quote.total)}</strong>
              </div>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="wed-btn wed-btn--gold wed-quote__cta"
              >
                <MessageCircle size={17} /> Demander un devis sur WhatsApp
              </a>
              <p className="wed-quote__legal">
                Estimation indicative. Votre message WhatsApp sera prérempli avec ces choix — la date
                n’est pas encore réservée.
              </p>
            </aside>
          </div>
        </section>

        {/* ------------------------------------------------ Décors à la carte */}
        <section id="decors" className="wed-shell wed-options">
          <header className="wed-heading wed-reveal">
            <span className="wed-kicker">En option</span>
            <h2>Les décors à la carte</h2>
            <p>Deux décors existent en deux coloris : choisissez le vôtre, l’aperçu change.</p>
          </header>

          <div className="wed-options__grid wed-reveal">
            {WEDDING_OPTIONS.map((option) => {
              const variant = getVariant(option, variantByOption[option.id])
              const includedByPack = pack.includedOptionIds.includes(option.id)
              const checked = includedByPack || selectedOptionIds.includes(option.id)
              const line = quote.lines.find((item) => item.option.id === option.id)
              const offered = Boolean(line?.offered)

              return (
                <article key={option.id} className={`wed-card${checked ? ' is-on' : ''}`}>
                  <figure className="wed-card__media">
                    <img key={variant.id} src={variant.image} alt={variant.alt} loading="lazy" />
                    <span className="wed-card__price">{formatEuro(option.price)}</span>
                    {option.variants.length > 1 && (
                      <span className="wed-card__variants-tag">{option.variants.length} coloris</span>
                    )}
                  </figure>

                  <div className="wed-card__body">
                    <span className="wed-card__tagline">{option.tagline}</span>
                    <h3>{option.name}</h3>
                    <p>{option.text}</p>

                    {option.variants.length > 1 && (
                      <div className="wed-swatches">
                        <span className="wed-swatches__label">Coloris&nbsp;:</span>
                        <div className="wed-swatches__row" role="group" aria-label={`Coloris ${option.name}`}>
                          {option.variants.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              className={`wed-swatch${item.id === variant.id ? ' is-on' : ''}`}
                              style={{ '--wed-swatch': item.swatch }}
                              onClick={() => pickVariant(option.id, item.id)}
                              aria-pressed={item.id === variant.id}
                            >
                              <span aria-hidden="true" />
                              <em>{item.label}</em>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="wed-card__note">{option.note}</p>

                    <button
                      type="button"
                      className={`wed-btn ${checked ? 'wed-btn--gold' : 'wed-btn--outline'} wed-card__cta`}
                      onClick={() => !includedByPack && toggleOption(option.id)}
                      aria-pressed={checked}
                      aria-disabled={includedByPack}
                    >
                      {includedByPack
                        ? `Inclus dans l’offre ${pack.name}`
                        : offered
                          ? 'Ajouté · offert'
                          : checked
                            ? 'Ajouté au devis'
                            : 'Ajouter à mon devis'}
                      {!checked && <Plus size={16} />}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* ------------------------------------------------------- Brochures */}
        <section className="wed-shell wed-brochures">
          <div className="wed-brochures__inner wed-reveal">
            <h2>Nos brochures</h2>
            <ul>
              {WEDDING_BROCHURES.map((item) => (
                <li key={item.id}>
                  <a href={item.src} target="_blank" rel="noopener noreferrer">
                    <img src={item.src} alt={item.alt} loading="lazy" />
                    <span>{item.label} <Maximize2 size={13} /></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --------------------------------------------------------- CTA */}
        <section className="wed-cta">
          <div className="wed-shell wed-cta__inner wed-reveal">
            <span className="wed-kicker wed-kicker--light">Votre date est unique</span>
            <h2>Parlons de votre mariage</h2>
            <p>
              Un seul canal, direct et sans formulaire : envoyez-nous votre date, votre lieu et votre
              nombre d’invités sur WhatsApp.
            </p>
            <div className="wed-cta__actions">
              <a
                href={BEL_AGE_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="wed-btn wed-btn--gold"
              >
                <MessageCircle size={17} /> Écrire sur WhatsApp
              </a>
              <a href="#devis" className="wed-btn wed-btn--ghost">
                Revenir au simulateur
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
