import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronDown,
  ClipboardList,
  Clock,
  MessageCircle,
  Sparkles,
  Star,
  Users,
  Video,
  Wallet,
  Zap,
} from 'lucide-react'
import {
  BEL_AGE_BRAND,
  EBOOK_PREMIUM,
  FORMATION_MASTERCLASS,
  FORMATION_TIERED_CAKES,
} from '../../data/resources'
import {
  MASTERCLASS_MODULES,
  PREMIUM_OUTCOMES,
  RESERVATION_CONDITIONS,
  ROI_ITEMS,
  TIERED_PROGRAM,
  TRUST_STATS,
} from '../../data/formationsContent'
import './PacksMobile.css'
import MobileHeroFx from '../../components/MobileBelAgeFx/MobileHeroFx'

const MOBILE_HERO = {
  eyebrow: 'Formations cake design · visio live',
  headline: 'Passez pro en cake design.',
  headlineAccent: 'Facturez dès votre 1er gâteau.',
  sub: 'Coach en direct, corrections sur vos gestes — ouvrez les cartes ci-dessous pour tout voir.',
  urgency: 'Places limitées · 3 participantes max par session',
}

const HERO_TEASERS = [
  {
    href: '#pack-m-premium',
    tag: 'Le plus demandé',
    price: '699 €',
    title: 'Gâteau 3 étages & cupcakes',
    desc: '2 jours · visio · WhatsApp 7 jours',
  },
  {
    href: '#pack-m-masterclass',
    tag: 'Premier pas',
    price: '149 €',
    title: 'Masterclass Cake Design',
    desc: '1 journée · les bases pro',
  },
]

const HERO_JOURNEY = [
  { href: '#pack-m-trust', num: '01', title: 'Chiffres clés', hint: 'Stats Bel Âge' },
  { href: '#pack-m-premium', num: '02', title: 'Premium · 699 €', hint: 'Ouvrir les cartes', gold: true },
  { href: '#pack-m-masterclass', num: '03', title: 'Masterclass · 149 €', hint: 'Programme & tarif' },
  { href: '#pack-m-final', num: '04', title: 'Ebook & annuaire', hint: 'Aller en bas' },
]

const STICKY_OFFERS = [
  {
    short: 'Premium · 699 €',
    urgency: '3 places',
    calendly: FORMATION_TIERED_CAKES.calendly,
    cta: 'Réserver',
  },
  {
    short: 'Masterclass · 149 €',
    urgency: '5 places',
    calendly: FORMATION_MASTERCLASS.calendly,
    cta: 'Réserver',
  },
]

function ExpandTile({ id, icon: Icon, title, isOpen, onToggle, stagger, variant, children }) {
  return (
    <div
      className={`pack-m-tile ${isOpen ? 'is-open' : ''} ${variant ? `pack-m-tile--${variant}` : ''}`}
      style={{ '--stagger': stagger }}
    >
      <button
        type="button"
        className="pack-m-tile__head"
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
      >
        <span className={`pack-m-tile__icon ${isOpen ? 'is-bounce' : ''}`}>
          <Icon size={17} strokeWidth={1.8} />
        </span>
        <span className="pack-m-tile__title">{title}</span>
        <ChevronDown size={14} className="pack-m-tile__chev" aria-hidden="true" />
      </button>
      <div className="pack-m-tile__body">
        <div className="pack-m-tile__inner">{children}</div>
      </div>
    </div>
  )
}

export default function PacksMobile() {
  const [openPremium, setOpenPremium] = useState(null)
  const [openMaster, setOpenMaster] = useState(null)
  const [openEbook, setOpenEbook] = useState(null)
  const [stickySlide, setStickySlide] = useState(0)

  const togglePremium = (id) => setOpenPremium((prev) => (prev === id ? null : id))
  const toggleMaster = (id) => setOpenMaster((prev) => (prev === id ? null : id))
  const toggleEbook = (id) => setOpenEbook((prev) => (prev === id ? null : id))

  useEffect(() => {
    const id = window.setInterval(() => {
      setStickySlide((prev) => (prev + 1) % STICKY_OFFERS.length)
    }, 5000)
    return () => window.clearInterval(id)
  }, [])

  const activeSticky = STICKY_OFFERS[stickySlide]

  return (
    <div className="pack-m">
      {/* Hero — même énergie desktop, layout mobile */}
      <section className="pack-m-hero pack-m-hero--warm">
        <div className="pack-m-hero__warm-bg" aria-hidden="true" />
        <div className="pack-m-hero__warm-accent" aria-hidden="true" />
        <MobileHeroFx variant="inline" />

        <div className="pack-m-hero__splash">
          <span className="pack-m-hero__pill pack-m-hero__enter" style={{ '--enter-i': 0 }}>
            {MOBILE_HERO.eyebrow}
          </span>
          <h1 className="pack-m-hero__title pack-m-hero__enter" style={{ '--enter-i': 1 }}>
            {MOBILE_HERO.headline}
            <span className="pack-m-hero__title-shine">{MOBILE_HERO.headlineAccent}</span>
          </h1>
          <p className="pack-m-hero__lead pack-m-hero__enter" style={{ '--enter-i': 2 }}>
            {MOBILE_HERO.sub}
          </p>

          <div className="pack-m-hero__highlights pack-m-hero__enter" style={{ '--enter-i': 3 }}>
            <span><Star size={11} fill="currentColor" /> Gâteau 100 parts · 500 € min</span>
            <span><Zap size={11} fill="currentColor" /> Formation amortie dès la 1ère commande</span>
          </div>
        </div>

        <div className="pack-m-hero__actions pack-m-hero__enter" style={{ '--enter-i': 4 }}>
          <a href="#pack-m-premium" className="pack-m-btn pack-m-btn--gold">
            Voir Premium · 699 €
            <ArrowRight size={14} strokeWidth={2.5} />
          </a>
          <a href="#pack-m-masterclass" className="pack-m-btn pack-m-btn--outline">
            Masterclass · 149 €
            <ArrowRight size={14} strokeWidth={2.5} />
          </a>
        </div>

        <p className="pack-m-hero__urgency">
          <Clock size={12} strokeWidth={2} />
          {MOBILE_HERO.urgency}
        </p>

        <nav className="pack-m-hero__teasers" aria-label="Aperçu des formations">
          <p className="pack-m-hero__teasers-label">Tapez une carte pour explorer ↓</p>
          {HERO_TEASERS.map((item, i) => (
            <a key={item.href} href={item.href} className="pack-m-hero-teaser" style={{ '--i': i }}>
              <span className="pack-m-hero-teaser__top">
                <em>{item.tag}</em>
                <strong>{item.price}</strong>
              </span>
              <span className="pack-m-hero-teaser__title">{item.title}</span>
              <span className="pack-m-hero-teaser__desc">{item.desc}</span>
              <span className="pack-m-hero-teaser__link">
                Ouvrir <ArrowRight size={12} strokeWidth={2.5} />
              </span>
            </a>
          ))}
        </nav>

        <a href="#pack-m-premium" className="pack-m-hero__scroll-cue" aria-label="Descendre dans la page">
          <span>Découvrir les cartes ↓</span>
          <ChevronDown size={16} strokeWidth={2.5} />
        </a>

        <div className="pack-m-hero__journey">
          <div className="pack-m-hero__journey-head">
            <p>Par où commencer ?</p>
            <span>4 étapes</span>
          </div>
          <div className="pack-m-hero__journey-steps">
            {HERO_JOURNEY.map((step) => (
              <a
                key={step.href}
                href={step.href}
                className={`pack-m-hero-jstep${step.gold ? ' pack-m-hero-jstep--gold' : ''}`}
              >
                <span className="pack-m-hero-jstep__num">{step.num}</span>
                <span className="pack-m-hero-jstep__title">{step.title}</span>
                <span className="pack-m-hero-jstep__hint">
                  {step.hint} <ArrowRight size={10} strokeWidth={2.5} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Bandeau chiffres — chevauche le hero */}
      <section className="pack-m-trust" id="pack-m-trust">
        {TRUST_STATS.map((s) => (
          <div key={s.label} className="pack-m-trust__cell">
            <strong className="pack-m-trust__value">{s.value}</strong>
            <span className="pack-m-trust__label">{s.label}</span>
            <span className="pack-m-trust__sub">{s.sub}</span>
          </div>
        ))}
      </section>

      {/* ── Premium 699 € ── */}
      <section className="pack-m-block pack-m-block--premium" id="pack-m-premium">
        <header className="pack-m-block__head">
          <span className="pack-m-badge pack-m-badge--gold">Premium · 2 jours</span>
          <h2>Gâteau 3 étages &amp; Cupcakes</h2>
          <p className="pack-m-block__price">{FORMATION_TIERED_CAKES.priceLabel}</p>
        </header>

        <div className="pack-m-grid">
          <ExpandTile
            id="prog"
            icon={Calendar}
            title="Programme"
            isOpen={openPremium === 'prog'}
            onToggle={togglePremium}
            stagger={0}
          >
            <img
              src={BEL_AGE_BRAND.cakePhoto}
              alt=""
              className="pack-m-tile__img"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <ul className="pack-m-list">
              {TIERED_PROGRAM.map((step) => (
                <li key={step.title}>
                  <strong>{step.time}</strong> — {step.title}. {step.text}
                </li>
              ))}
            </ul>
          </ExpandTile>

          <ExpandTile
            id="roi"
            icon={Wallet}
            title="Tarif & Rentabilité"
            isOpen={openPremium === 'roi'}
            onToggle={togglePremium}
            stagger={1}
          >
            <ul className="pack-m-list pack-m-list--roi">
              {ROI_ITEMS.map((item) => (
                <li key={item.label}>
                  <strong>{item.value}</strong> {item.label}
                  <span>{item.sub}</span>
                </li>
              ))}
            </ul>
            <p className="pack-m-tile__note">
              Dès la 1ère commande, la formation est amortie.
            </p>
          </ExpandTile>

          <ExpandTile
            id="acc"
            icon={Users}
            title="Accompagnement"
            isOpen={openPremium === 'acc'}
            onToggle={togglePremium}
            stagger={2}
          >
            <ul className="pack-m-list">
              {PREMIUM_OUTCOMES.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="pack-m-tile__note">
              {FORMATION_TIERED_CAKES.maxParticipants} participantes max · corrections en direct.
            </p>
          </ExpandTile>

          <ExpandTile
            id="suivi"
            icon={MessageCircle}
            title="Suivi 7 jours"
            isOpen={openPremium === 'suivi'}
            onToggle={togglePremium}
            stagger={3}
          >
            <ul className="pack-m-list">
              <li>Groupe WhatsApp privé après la formation.</li>
              <li>La coach reste disponible jusqu&apos;à votre autonomie.</li>
              <li>{FORMATION_TIERED_CAKES.sessionsPerMonth} sessions / mois — places limitées.</li>
            </ul>
          </ExpandTile>

          <ExpandTile
            id="prev"
            icon={ClipboardList}
            title="À prévoir"
            isOpen={openPremium === 'prev'}
            onToggle={togglePremium}
            stagger={4}
          >
            <ul className="pack-m-list">
              <li>Visio depuis chez vous.</li>
              <li>Matériel &amp; ingrédients de votre côté.</li>
              <li>Liste envoyée dès l&apos;inscription.</li>
            </ul>
          </ExpandTile>

          <ExpandTile
            id="book-p"
            icon={Sparkles}
            title="Réserver"
            isOpen={openPremium === 'book-p'}
            onToggle={togglePremium}
            stagger={5}
            variant="cta"
          >
            <p className="pack-m-tile__note">{RESERVATION_CONDITIONS}</p>
            <a
              href={FORMATION_TIERED_CAKES.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="pack-m-btn pack-m-btn--gold"
            >
              Réserver · {FORMATION_TIERED_CAKES.priceLabel}
              <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </ExpandTile>
        </div>
      </section>

      {/* ── Masterclass 149 € ── */}
      <section className="pack-m-block" id="pack-m-masterclass">
        <header className="pack-m-block__head">
          <span className="pack-m-badge">Masterclass · 1 jour</span>
          <h2>Cake Design — Les bases</h2>
          <p className="pack-m-block__price pack-m-block__price--dark">
            {FORMATION_MASTERCLASS.priceLabel}
          </p>
        </header>

        <div className="pack-m-grid">
          <ExpandTile
            id="mod"
            icon={Video}
            title="Programme"
            isOpen={openMaster === 'mod'}
            onToggle={toggleMaster}
            stagger={0}
          >
            <ul className="pack-m-list">
              {MASTERCLASS_MODULES.map((m) => (
                <li key={m.title}>
                  <strong>{m.title}</strong> — {m.text}
                </li>
              ))}
            </ul>
          </ExpandTile>

          <ExpandTile
            id="tarif-m"
            icon={Wallet}
            title="Tarif"
            isOpen={openMaster === 'tarif-m'}
            onToggle={toggleMaster}
            stagger={1}
          >
            <ul className="pack-m-list">
              <li>
                <strong>{FORMATION_MASTERCLASS.priceLabel}</strong> — {FORMATION_MASTERCLASS.duration}
              </li>
              <li>Tour de table 30 min + 5h30 de formation.</li>
              <li>Replay disponible.</li>
            </ul>
          </ExpandTile>

          <ExpandTile
            id="slots"
            icon={Calendar}
            title="Créneaux"
            isOpen={openMaster === 'slots'}
            onToggle={toggleMaster}
            stagger={2}
          >
            <ul className="pack-m-list">
              <li>Mardi · 9h–12h / 14h–17h</li>
              <li>Dimanche · 9h–12h / 14h–17h</li>
              <li>{FORMATION_MASTERCLASS.maxParticipants} participantes maximum.</li>
            </ul>
          </ExpandTile>

          <ExpandTile
            id="suivi-m"
            icon={MessageCircle}
            title="Suivi"
            isOpen={openMaster === 'suivi-m'}
            onToggle={toggleMaster}
            stagger={3}
          >
            <ul className="pack-m-list">
              <li>En direct avec la coach — pas de vidéo seule.</li>
              <li>WhatsApp privé 7 jours après la session.</li>
            </ul>
          </ExpandTile>

          <ExpandTile
            id="book-m"
            icon={Sparkles}
            title="Réserver"
            isOpen={openMaster === 'book-m'}
            onToggle={toggleMaster}
            stagger={4}
            variant="cta"
          >
            <p className="pack-m-tile__note">{RESERVATION_CONDITIONS}</p>
            <a
              href={FORMATION_MASTERCLASS.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="pack-m-btn pack-m-btn--dark"
            >
              Réserver · {FORMATION_MASTERCLASS.priceLabel}
              <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </ExpandTile>
        </div>
      </section>

      {/* Ebook — tuile compacte */}
      <section className="pack-m-block pack-m-block--ebook" id="ebook">
        <ExpandTile
          id="ebook"
          icon={BookOpen}
          title="Ebook gratuit"
          isOpen={openEbook === 'ebook'}
          onToggle={toggleEbook}
          stagger={0}
        >
          <p className="pack-m-tile__note">
            L&apos;Art de la Pâtisserie Bel Âge — crèmes, montage, lissage, finitions.
          </p>
          <a href={EBOOK_PREMIUM.url} download className="pack-m-btn pack-m-btn--ghost-dark">
            Télécharger le PDF <ArrowRight size={14} strokeWidth={2} />
          </a>
        </ExpandTile>
      </section>

      <section className="pack-m-final" id="pack-m-final">
        <h2>Déjà formée ?</h2>
        <Link to="/rejoindre" className="pack-m-btn pack-m-btn--gold">
          Rejoindre l&apos;annuaire <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </section>

      <div className="pack-m-sticky-spacer" aria-hidden="true" />

      {/* Barre sticky compacte — toujours visible */}
      <div className="pack-m-sticky is-visible">
        <div className="pack-m-sticky__progress" aria-hidden="true">
          <span key={stickySlide} className="pack-m-sticky__progress-bar" />
        </div>

        <div className="pack-m-sticky__row">
          <div className="pack-m-sticky__rotator" aria-live="polite">
            {STICKY_OFFERS.map((offer, index) => (
              <div
                key={offer.short}
                className={`pack-m-sticky__slide ${index === stickySlide ? 'is-active' : ''}`}
                aria-hidden={index !== stickySlide}
              >
                <span className="pack-m-sticky__label">{offer.short}</span>
                <span className="pack-m-sticky__chip">
                  <Zap size={8} fill="currentColor" />
                  {offer.urgency}
                </span>
              </div>
            ))}
          </div>

          <a
            key={activeSticky.calendly + stickySlide}
            href={activeSticky.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="pack-m-sticky__cta"
          >
            {activeSticky.cta}
            <ArrowRight size={13} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </div>
  )
}
