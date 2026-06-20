import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  MessageCircle,
  Star,
  Users,
  Video,
  Zap,
} from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import {
  EBOOK_PREMIUM,
  FORMATION_MASTERCLASS,
  FORMATION_TIERED_CAKES,
} from '../../data/resources'
import {
  FORMATIONS_COMPARE,
  FORMATIONS_HERO,
  MASTERCLASS_MODULES,
  MASTERCLASS_OUTCOMES,
  PAIN_TO_GAIN,
  PREMIUM_OUTCOMES,
  RESERVATION_CONDITIONS,
  ROI_ITEMS,
  TIERED_PROGRAM,
  TRUST_STATS,
} from '../../data/formationsContent'
import './PacksDesktop.css'

const DESKTOP_HERO = {
  eyebrow: 'Formations cake design · visio live',
  headline: 'Passez pro en cake design.',
  headlineAccent: 'Facturez dès votre 1er gâteau.',
  sub: 'Coach en direct, corrections sur vos gestes, deux parcours selon votre niveau — découvrez lequel est fait pour vous.',
  urgency: 'Places limitées · 3 participantes max par session',
}

const HERO_JOURNEY = [
  { href: '#trust', num: '01', title: 'Chiffres & résultats', hint: 'Voir les stats' },
  { href: '#compare', num: '02', title: '149 € ou 699 € ?', hint: 'Comparer les offres', gold: true },
  { href: '#premium', num: '03', title: 'Programme Premium', hint: 'Gâteau 3 étages' },
  { href: '#masterclass', num: '04', title: 'Masterclass', hint: 'Réserver 149 €' },
]

const HERO_TEASERS = [
  {
    href: '#premium',
    tag: 'Le plus demandé',
    price: '699 €',
    title: 'Gâteau 3 étages & cupcakes',
    desc: '2 jours · visio · WhatsApp 7 jours',
  },
  {
    href: '#compare',
    tag: 'Comparer',
    price: '149 € / 699 €',
    title: 'Quelle formation choisir ?',
    desc: 'Tableau complet · réservez en 1 clic',
  },
  {
    href: '#masterclass',
    tag: 'Premier pas',
    price: '149 €',
    title: 'Masterclass Cake Design',
    desc: '1 journée · les bases pro',
  },
]

const COMPARE_ROWS = [
  { label: 'Prix', masterclass: FORMATION_MASTERCLASS.priceLabel, premium: FORMATION_TIERED_CAKES.priceLabel },
  { label: 'Durée', masterclass: '1 journée · 6 h', premium: '2 jours intensifs' },
  { label: 'Format', masterclass: 'Visio live Zoom', premium: 'Visio live · chez vous' },
  { label: 'Places', masterclass: `${FORMATION_MASTERCLASS.maxParticipants} max`, premium: `${FORMATION_TIERED_CAKES.maxParticipants} max` },
  { label: 'Suivi', masterclass: 'WhatsApp 7 jours', premium: 'WhatsApp 7 jours' },
  { label: 'Objectif', masterclass: 'Bases pro du layer cake', premium: 'Gâteau 3 étages + cupcakes premium' },
]

const STICKY_OFFERS = [
  {
    label: 'Formation Premium — Gâteau 3 étages & cupcakes',
    price: '699 €',
    urgency: '3 places / session',
    calendly: FORMATION_TIERED_CAKES.calendly,
    cta: 'Réserver — Premium',
  },
  {
    label: 'Masterclass Cake Design — Crèmes, montage, lissage · 1 journée',
    price: '149 €',
    urgency: '5 places / session',
    calendly: FORMATION_MASTERCLASS.calendly,
    cta: 'Réserver — Masterclass',
  },
]

export default function PacksDesktop() {
  useScrollReveal('pack-d-reveal')
  const [stickyVisible, setStickyVisible] = useState(false)
  const [stickySlide, setStickySlide] = useState(0)

  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!stickyVisible) return undefined
    const id = window.setInterval(() => {
      setStickySlide((prev) => (prev + 1) % STICKY_OFFERS.length)
    }, 5500)
    return () => window.clearInterval(id)
  }, [stickyVisible])

  const activeOffer = STICKY_OFFERS[stickySlide]

  return (
    <div className="pack-d">
      {/* ── Hero — contraste & envie de scroller ── */}
      <section className="pack-d-hero pack-d-hero--warm">
        <div className="pack-d-hero__warm-bg" aria-hidden="true" />
        <div className="pack-d-hero__warm-accent" aria-hidden="true" />

        <div className="pack-d-hero__inner pack-d-hero__inner--split">
          <div className="pack-d-hero__copy pack-d-reveal reveal">
            <span className="pack-d-hero__pill">{DESKTOP_HERO.eyebrow}</span>

            <h1 className="pack-d-hero__title pack-d-hero__title--warm">
              {DESKTOP_HERO.headline}
              <span>{DESKTOP_HERO.headlineAccent}</span>
            </h1>

            <p className="pack-d-hero__lead pack-d-hero__lead--warm">{DESKTOP_HERO.sub}</p>

            <div className="pack-d-hero__highlights">
              <span><Star size={12} fill="currentColor" /> Gâteau 100 parts · 500 € min</span>
              <span><Zap size={12} fill="currentColor" /> Formation amortie dès la 1ère commande</span>
            </div>

            <div className="pack-d-hero__actions">
              <a
                href={FORMATION_TIERED_CAKES.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="pack-d-btn pack-d-btn--gold pack-d-btn--lg"
              >
                Réserver Premium · {FORMATION_TIERED_CAKES.priceLabel}
                <ArrowRight size={16} strokeWidth={2} />
              </a>
              <a href="#compare" className="pack-d-btn pack-d-btn--dark">
                Voir les 2 parcours
                <ArrowRight size={16} strokeWidth={2} />
              </a>
            </div>

            <p className="pack-d-hero__urgency">
              <Clock size={13} strokeWidth={2} />
              {DESKTOP_HERO.urgency}
            </p>
          </div>

          <nav className="pack-d-hero__teasers pack-d-reveal reveal" aria-label="Explorer la page">
            <p className="pack-d-hero__teasers-label">Explorez la page ↓</p>
            {HERO_TEASERS.map((item, i) => (
              <a key={item.href} href={item.href} className="pack-d-hero-teaser" style={{ '--i': i }}>
                <span className="pack-d-hero-teaser__top">
                  <em>{item.tag}</em>
                  <strong>{item.price}</strong>
                </span>
                <span className="pack-d-hero-teaser__title">{item.title}</span>
                <span className="pack-d-hero-teaser__desc">{item.desc}</span>
                <span className="pack-d-hero-teaser__link">
                  Découvrir <ArrowRight size={14} strokeWidth={2.5} />
                </span>
              </a>
            ))}
          </nav>
        </div>

        <a href="#compare" className="pack-d-hero__scroll-cue" aria-label="Descendre dans la page">
          <span>Découvrir les formations ↓</span>
          <ChevronDown size={18} strokeWidth={2.5} />
          <span className="pack-d-hero__scroll-cue-line" aria-hidden="true" />
        </a>

        <div className="pack-d-hero__journey">
          <div className="pack-d-hero__journey-head">
            <p>Tout est détaillé ci-dessous — par où commencer ?</p>
            <span>4 sections · cliquez pour y aller</span>
          </div>
          <div className="pack-d-hero__journey-steps">
            {HERO_JOURNEY.map((step) => (
              <a
                key={step.href}
                href={step.href}
                className={`pack-d-hero-jstep${step.gold ? ' pack-d-hero-jstep--gold' : ''}`}
              >
                <span className="pack-d-hero-jstep__num">{step.num}</span>
                <span className="pack-d-hero-jstep__title">{step.title}</span>
                <span className="pack-d-hero-jstep__hint">
                  {step.hint} <ArrowRight size={11} strokeWidth={2.5} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bandeau chiffres ── */}
      <section className="pack-d-trust pack-d-reveal reveal" id="trust">
        {TRUST_STATS.map((s) => (
          <div key={s.label} className="pack-d-trust__item">
            <span className="pack-d-trust__value">{s.value}</span>
            <span className="pack-d-trust__label">{s.label}</span>
            <span className="pack-d-trust__sub">{s.sub}</span>
          </div>
        ))}
      </section>

      {/* ── Problème → solution ── */}
      <section className="pack-d-pitch pack-d-reveal reveal">
        <div className="pack-d-pitch__head">
          <span className="pack-d-badge">Pourquoi Bel Âge</span>
          <h2>Vous méritez mieux qu&apos;un tuto YouTube.</h2>
          <p>
            Bel Âge Pâtisserie forme des pâtissières qui veulent facturer leurs
            créations au juste prix — avec un accompagnement humain, en direct.
          </p>
        </div>
        <div className="pack-d-pitch__grid">
          {PAIN_TO_GAIN.map((item) => (
            <article key={item.pain} className="pack-d-pitch__card">
              <p className="pack-d-pitch__pain">{item.pain}</p>
              <div className="pack-d-pitch__arrow" aria-hidden="true" />
              <p className="pack-d-pitch__gain">
                <Check size={14} strokeWidth={2.5} />
                {item.gain}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Comparatif 149 vs 699 ── */}
      <section className="pack-d-compare pack-d-reveal reveal" id="compare">
        <div className="pack-d-compare__head">
          <h2>Quelle formation choisir ?</h2>
          <p>Deux parcours, un même niveau d&apos;exigence Bel Âge. Réservez directement sur Calendly.</p>
        </div>

        <div className="pack-d-compare__cards">
          {FORMATIONS_COMPARE.map((col) => {
            const formation =
              col.id === 'premium' ? FORMATION_TIERED_CAKES : FORMATION_MASTERCLASS
            return (
              <div
                key={col.id}
                className={`pack-d-compare__card ${col.highlight ? 'pack-d-compare__card--featured' : ''}`}
              >
                <span className="pack-d-badge">{col.badge}</span>
                <h3>{formation.title.replace('Formation Cake Design — ', '')}</h3>
                <p className="pack-d-compare__price">{formation.priceLabel}</p>
                <p className="pack-d-compare__duration">{formation.duration}</p>
                <ul>
                  {(col.id === 'premium' ? PREMIUM_OUTCOMES : MASTERCLASS_OUTCOMES).map((line) => (
                    <li key={line}>
                      <Check size={13} strokeWidth={2.5} />
                      {line}
                    </li>
                  ))}
                </ul>
                <a
                  href={formation.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`pack-d-btn ${col.highlight ? 'pack-d-btn--gold pack-d-btn--block' : 'pack-d-btn--dark pack-d-btn--block'}`}
                >
                  {col.ctaLabel}
                  <ArrowRight size={14} strokeWidth={2} />
                </a>
              </div>
            )
          })}
        </div>

        <div className="pack-d-compare__table-wrap">
          <table className="pack-d-compare__table">
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">Masterclass</th>
                <th scope="col">Premium</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>{row.masterclass}</td>
                  <td className="pack-d-compare__td--highlight">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Formation flagship 699€ ── */}
      <section className="pack-d-premium" id="premium">
        <div className="pack-d-premium__visual pack-d-reveal reveal">
          <div className="pack-d-premium__sticky-cta">
            <p className="pack-d-premium__sticky-label">Formation la plus demandée</p>
            <p className="pack-d-premium__sticky-price">{FORMATION_TIERED_CAKES.priceLabel}</p>
            <p className="pack-d-premium__sticky-meta">2 jours · visio live · 7 jours WhatsApp</p>
            <a
              href={FORMATION_TIERED_CAKES.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="pack-d-btn pack-d-btn--gold pack-d-btn--block"
            >
              Je réserve ma place maintenant
            </a>
            <p className="pack-d-premium__sticky-urgency">
              <Star size={11} fill="currentColor" />
              {FORMATION_TIERED_CAKES.maxParticipants} places / session ·{' '}
              {FORMATION_TIERED_CAKES.sessionsPerMonth} sessions / mois
            </p>
          </div>
        </div>

        <div className="pack-d-premium__content">
          <div className="pack-d-section-head pack-d-reveal reveal">
            <span className="pack-d-badge">699 € · 2 jours</span>
            <h2>Gâteau 3 étages &amp; Flower Cupcakes</h2>
            <p>
              <strong>Objectif :</strong> repartir capable de vendre un gâteau 100 parts
              à partir de 500 € et un bouquet cupcakes à partir de 90 €. Technique
              complète, corrections en direct, méthode Bel Âge.
            </p>
          </div>

          <div className="pack-d-outcomes pack-d-reveal reveal">
            <h3>Ce que vous saurez faire à la fin</h3>
            <ul>
              {PREMIUM_OUTCOMES.map((line) => (
                <li key={line}>
                  <Check size={14} strokeWidth={2.5} />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="pack-d-facts pack-d-reveal reveal">
            {[
              { icon: Video, text: 'Visio live — pas de replay seul' },
              { icon: Clock, text: '2 jours · mercredi & jeudi' },
              { icon: Users, text: '3 participantes maximum' },
              { icon: MessageCircle, text: 'Groupe WhatsApp 7 jours' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="pack-d-fact">
                <Icon size={16} strokeWidth={1.8} />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="pack-d-roi pack-d-reveal reveal">
            <h3>La formation se rembourse dès la 1ère commande</h3>
            <div className="pack-d-roi__grid">
              {ROI_ITEMS.map((item) => (
                <div key={item.label} className="pack-d-roi__cell">
                  <span className="pack-d-roi__value">{item.value}</span>
                  <span className="pack-d-roi__label">{item.label}</span>
                  <span className="pack-d-roi__sub">{item.sub}</span>
                </div>
              ))}
            </div>
            <p className="pack-d-roi__foot">
              Un seul gâteau événementiel couvre le prix de la formation. Une compétence
              que vous gardez à vie.
            </p>
          </div>

          <div className="pack-d-timeline pack-d-reveal reveal">
            <h3>Programme jour par jour</h3>
            {TIERED_PROGRAM.map((step) => (
              <div key={step.title + step.time} className="pack-d-timeline__step">
                <div className="pack-d-timeline__marker">
                  <span>{step.day}</span>
                </div>
                <div className="pack-d-timeline__body">
                  <p className="pack-d-timeline__time">{step.time}</p>
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pack-d-includes pack-d-reveal reveal">
            <h3>Inclus dans votre réservation</h3>
            <ul>
              {[
                'Corrections en direct sur votre plan de travail',
                'Groupe WhatsApp privé 7 jours après la formation',
                'Liste matériel & ingrédients envoyée à l\'inscription',
                'Seulement 4 sessions par mois — places limitées',
              ].map((line) => (
                <li key={line}>
                  <Check size={14} strokeWidth={2.5} />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <p className="pack-d-legal pack-d-reveal reveal">{RESERVATION_CONDITIONS}</p>

          <a
            href={FORMATION_TIERED_CAKES.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="pack-d-btn pack-d-btn--gold pack-d-btn--xl pack-d-reveal reveal"
          >
            Oui, je réserve — {FORMATION_TIERED_CAKES.priceLabel}
            <ArrowRight size={18} strokeWidth={2} />
          </a>
        </div>
      </section>

      {/* ── Masterclass 149€ ── */}
      <section className="pack-d-masterclass pack-d-reveal reveal" id="masterclass">
        <div className="pack-d-masterclass__head">
          <div>
            <span className="pack-d-badge pack-d-badge--dark">149 € · 1 journée</span>
            <h2>Masterclass Cake Design</h2>
            <p>
              <strong>Parfait si vous débutez</strong> ou si vous voulez consolider
              les bases avant le premium. 4 modules, tour de table, replay et WhatsApp 7 jours.
            </p>
          </div>
          <div className="pack-d-masterclass__price-block">
            <span className="pack-d-masterclass__price">{FORMATION_MASTERCLASS.priceLabel}</span>
            <span className="pack-d-masterclass__duration">{FORMATION_MASTERCLASS.duration}</span>
            <a
              href={FORMATION_MASTERCLASS.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="pack-d-btn pack-d-btn--dark"
            >
              Réserver ma masterclass
              <ArrowRight size={14} strokeWidth={2} />
            </a>
          </div>
        </div>

        <div className="pack-d-masterclass__grid">
          <div className="pack-d-masterclass__modules">
            {MASTERCLASS_MODULES.map((m, i) => (
              <article key={m.title} className="pack-d-module" style={{ '--i': i }}>
                <span className="pack-d-module__num">0{i + 1}</span>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </article>
            ))}
          </div>

          <aside className="pack-d-masterclass__aside">
            <div className="pack-d-aside-card pack-d-aside-card--accent">
              <p>
                <strong>En direct avec la coach.</strong> Pas de vidéo pré-enregistrée :
                vous posez vos questions, elle corrige — vous progressez vraiment.
              </p>
            </div>
            <div className="pack-d-aside-card">
              <Calendar size={18} strokeWidth={1.6} />
              <h4>Créneaux disponibles</h4>
              <ul>
                <li>Mardi · 9h–12h / 14h–17h</li>
                <li>Dimanche · 9h–12h / 14h–17h</li>
              </ul>
            </div>
            <p className="pack-d-legal">{RESERVATION_CONDITIONS}</p>
          </aside>
        </div>
      </section>

      {/* ── Ebook strip ── */}
      <section className="pack-d-ebook pack-d-reveal reveal" id="ebook">
        <div className="pack-d-ebook__icon">
          <BookOpen size={28} strokeWidth={1.4} />
        </div>
        <div className="pack-d-ebook__copy">
          <p className="pack-d-eyebrow pack-d-eyebrow--light">Offert · PDF gratuit</p>
          <h2>Ebook — L&apos;Art de la Pâtisserie Bel Âge</h2>
          <p>Crèmes, montage, lissage, finitions : téléchargez les bases avant de réserver.</p>
        </div>
        <a href={EBOOK_PREMIUM.url} download className="pack-d-btn pack-d-btn--light">
          Télécharger maintenant
          <ArrowRight size={14} strokeWidth={2} />
        </a>
      </section>

      {/* ── CTA annuaire ── */}
      <section className="pack-d-final pack-d-reveal reveal">
        <h2>Déjà formée ? Rejoignez l&apos;annuaire Bel Âge</h2>
        <p>Visibilité gratuite auprès de milliers de clients qui cherchent une pâtissière près de chez eux.</p>
        <div className="pack-d-final__actions">
          <Link to="/rejoindre" className="pack-d-btn pack-d-btn--gold">
            Rejoindre le réseau <ArrowRight size={14} strokeWidth={2} />
          </Link>
          <Link to="/patissieres" className="pack-d-btn pack-d-btn--outline-dark">
            Voir les pâtissières
          </Link>
        </div>
      </section>

      {/* Sticky conversion bar — alternance Premium / Masterclass */}
      <div className={`pack-d-sticky ${stickyVisible ? 'is-visible' : ''}`}>
        <div className="pack-d-sticky__glow" aria-hidden="true" />
        <div className="pack-d-sticky__shimmer" aria-hidden="true" />
        <div className="pack-d-sticky__progress" aria-hidden="true">
          <span key={stickySlide} className="pack-d-sticky__progress-bar" />
        </div>

        <div className="pack-d-sticky__inner">
          <div className="pack-d-sticky__live" aria-hidden="true">
            <span className="pack-d-sticky__live-dot" />
            Visio live
          </div>

          <div className="pack-d-sticky__rotator" aria-live="polite">
            {STICKY_OFFERS.map((offer, index) => (
              <div
                key={offer.label}
                className={`pack-d-sticky__slide ${index === stickySlide ? 'is-active' : ''}`}
                aria-hidden={index !== stickySlide}
              >
                <p className="pack-d-sticky__headline">
                  <span className="pack-d-sticky__headline-text">{offer.label}</span>
                  <span className="pack-d-sticky__headline-price">· {offer.price}</span>
                </p>
                <span className="pack-d-sticky__urgency">
                  <Star size={10} fill="currentColor" />
                  {offer.urgency}
                </span>
              </div>
            ))}
          </div>

          <div className="pack-d-sticky__actions">
            <div className="pack-d-sticky__dots" aria-hidden="true">
              {STICKY_OFFERS.map((offer, index) => (
                <button
                  key={offer.label}
                  type="button"
                  className={`pack-d-sticky__dot ${index === stickySlide ? 'is-active' : ''}`}
                  onClick={() => setStickySlide(index)}
                  tabIndex={-1}
                  aria-label={`Formation ${index + 1}`}
                />
              ))}
            </div>

            <a
              key={activeOffer.calendly + stickySlide}
              href={activeOffer.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="pack-d-btn pack-d-btn--gold pack-d-btn--sm pack-d-sticky__cta"
            >
              {activeOffer.cta}
              <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
