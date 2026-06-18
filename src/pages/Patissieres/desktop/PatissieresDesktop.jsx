import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import Navbar from '../../../components/Navbar/Navbar'
import Footer from '../../../components/Footer/Footer'
import ProviderSectionPicker from '../../../components/ProviderSectionPicker/ProviderSectionPicker'
import { FILTRE_INFLUENCE } from '../../../data/providerSections'
import {
  formatProviderPrice,
  providerPriceCaption,
} from '../../../utils/patissiere'
import { filterProvidersForDirectory } from '../../../utils/providerFilter'
import './PatissieresDesktop.css'

function initiales(nom) {
  return nom
    .split(' ')
    .map((mot) => mot[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function IconInstagram() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.847L.057 23.882l6.196-1.438A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.659-.502-5.187-1.381l-.371-.22-3.679.853.882-3.574-.242-.389A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  )
}

function IconTikTok() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function formatTel(whatsapp) {
  if (!whatsapp || typeof whatsapp !== 'string') return null
  const cc = whatsapp.slice(0, 2)
  const reste = whatsapp.slice(2)
  if (!reste.length) return `+${cc}`
  const groupes = reste.slice(1).match(/.{1,2}/g) || []
  return `+${cc} ${reste[0]} ${groupes.join(' ')}`
}

function Carte({ p, highlight, cardRef, index, sectionId = 'patisserie' }) {
  const [photoOk, setPhotoOk] = useState(false)
  const [showPhone, setShowPhone] = useState(false)
  return (
    <article
      ref={cardRef}
      className={`pcard ${highlight ? 'is-highlight' : ''} ${p.image ? 'pcard--brand' : ''} ${p.badge ? 'pcard--sel-badge' : ''}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {p.badge && (
        <div
          className="pcard__badge"
          title="Sélection Bel Âge"
          aria-label="Profil sélection Bel Âge"
        >
          <span className="pcard__badge-ring" aria-hidden />
          <span className="pcard__badge-inner">
            <svg
              className="pcard__badge-star"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                fill="currentColor"
                d="M12 2.5l2.2 6.3h6.6l-5.3 3.9 2 6.3L12 15.8l-5.5 4.2 2-6.3-5.3-3.9h6.6L12 2.5z"
              />
            </svg>
            <span className="pcard__badge-letter">{p.badgeLetter || 'B'}</span>
          </span>
        </div>
      )}

      <header className="pcard__head">
        <div className="pcard__avatar-wrap">
          <div className={`pcard__avatar ${p.image ? 'pcard__avatar--logo' : ''}`}>
            {p.image ? (
              <>
                {!photoOk && (
                  <span className="pcard__avatar-fallback">{initiales(p.nom)}</span>
                )}
                <img
                  className={`pcard__avatar-img ${photoOk ? 'is-visible' : ''}`}
                  src={p.image}
                  alt=""
                  onLoad={() => setPhotoOk(true)}
                  onError={() => setPhotoOk(false)}
                />
              </>
            ) : (
              <span className="pcard__avatar-initials">{initiales(p.nom)}</span>
            )}
          </div>
        </div>

        <div className="pcard__head-info">
          <h3 className="pcard__name">{p.nom}</h3>
          <p className="pcard__loc">
            <MapPin size={11} strokeWidth={2} /> {p.ville}
          </p>
          {p.specialites[0] && (
            <span className="pcard__head-spec">{p.specialites[0]}</span>
          )}
        </div>
      </header>

      <div className="pcard__body">
        <div className="pcard__main">
          {p.specialites.length > 1 && (
            <div className="pcard__tags">
              {p.specialites.slice(1, 4).map((t) => (
                <span key={t} className="pcard__tag">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="pcard__sep" />

          <div className="pcard__tarifs">
            <p className="pcard__tarifs-title">Tarif indicatif</p>
            <div className="pcard__tarif-line pcard__tarif-line--part">
              <span>{providerPriceCaption(sectionId)}</span>
              <strong>{formatProviderPrice(p)}</strong>
            </div>
          </div>

          {p.offersInfluence && p.influenceServices?.length > 0 && (
            <>
              <div className="pcard__sep" />
              <div className="pcard__influence">
                <p className="pcard__influence-title">Service influence disponible</p>
                {p.influenceServices.map((s) => (
                  <div key={s.type} className="pcard__tarif-line">
                    <span>{s.type}</span>
                    <strong>{s.price}</strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="pcard__foot">
          <div className="pcard__sep" />

          <p className="pcard__contact-title">Réseaux</p>
          <div className="socials">
            {p.instagram && (
              <button
                className="social social--insta"
                type="button"
                onClick={() => window.open(p.instagram, '_blank')}
              >
                <IconInstagram />
                <span className="social__text">
                  <span className="social__name">Instagram</span>
                  {p.instagram_followers && (
                    <span className="social__count">
                      {p.instagram_followers} abonnés
                    </span>
                  )}
                </span>
              </button>
            )}

            {p.tiktok && (
              <button
                className="social social--tiktok"
                type="button"
                onClick={() => window.open(p.tiktok, '_blank')}
              >
                <IconTikTok />
                <span className="social__text">
                  <span className="social__name">TikTok</span>
                  {p.tiktok_followers && (
                    <span className="social__count">
                      {p.tiktok_followers} abonnés
                    </span>
                  )}
                </span>
              </button>
            )}
          </div>

          <p className="pcard__contact-title pcard__contact-title--mt">
            Contact direct
          </p>
          {p.whatsapp ? (
            <>
              <button
                className="contact-btn contact-btn--wa"
                type="button"
                onClick={() => window.open(`https://wa.me/${p.whatsapp}`, '_blank')}
              >
                <IconWhatsApp />
                <span className="contact-btn__text">
                  <span className="contact-btn__line1">WhatsApp</span>
                  <span className="contact-btn__line2">
                    Rentrer en contact directement
                  </span>
                </span>
              </button>

              <button
                className={`reveal-btn ${showPhone ? 'is-open' : ''}`}
                type="button"
                onClick={() => setShowPhone((v) => !v)}
              >
                <IconPhone />
                {showPhone ? 'Masquer le numéro' : 'Voir le numéro'}
              </button>

              {showPhone && formatTel(p.whatsapp) && (
                <div className="phone-box">
                  <IconPhone />
                  <a href={`tel:+${p.whatsapp}`}>{formatTel(p.whatsapp)}</a>
                </div>
              )}
            </>
          ) : (
            <p className="pcard__no-phone">
              {p.instagram
                ? 'Pas de numéro — contactez via Instagram ci-dessus.'
                : 'Numéro non communiqué.'}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export default function PatissieresDesktop({ section, sectionId, onSectionChange }) {
  const [filtre, setFiltre] = useState('Tous')
  const [searchParams] = useSearchParams()
  const idParam = Number(searchParams.get('id'))
  const highlightRef = useRef(null)
  const providers = section.providers

  useEffect(() => {
    setFiltre('Tous')
  }, [sectionId])

  const filtered = filterProvidersForDirectory(providers, {
    filtre,
    showInfluenceFilter: section.showInfluenceFilter,
  })

  useEffect(() => {
    if (!idParam || !highlightRef.current) return
    highlightRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }, [idParam])

  const count = filtered.length

  return (
    <div className="patissieres-desktop">
      <Navbar />

      <header className="ph-header">
        <ProviderSectionPicker
          activeId={sectionId}
          onChange={onSectionChange}
          className="ph-sections"
        />

        <div className="ph-header__top">
          <h1 className="ph-title">{section.pageTitle}</h1>
          <p className="ph-filters-label">Filtres rapides</p>
        </div>
        <p className="ph-subtitle">
          {providers.length} {section.creatorLabel}
          {providers.length > 1 ? 's' : ''}
          {section.id === 'patisserie' && (
            <>
              {' '}
              sélectionnée{providers.length > 1 ? 's' : ''} pour leur excellence
            </>
          )}
          {filtre !== 'Tous' && (
            <span className="ph-subtitle__filtered">
              {' '}
              · {count} affichée{count > 1 ? 's' : ''}
            </span>
          )}
        </p>
        <div className="ph-line" />
        <p className="ph-desc">{section.pageDesc}</p>

        <div className="ph-pills">
          {section.quickFilters.map((f) => (
            <button
              key={f}
              type="button"
              className={`pill ${filtre === f ? 'is-active' : ''}`}
              onClick={() => setFiltre(f)}
            >
              {f}
            </button>
          ))}
          {section.showInfluenceFilter && (
            <button
              type="button"
              className={`pill pill--influence ${filtre === FILTRE_INFLUENCE ? 'is-active' : ''}`}
              onClick={() => setFiltre(FILTRE_INFLUENCE)}
            >
              {FILTRE_INFLUENCE}
            </button>
          )}
        </div>
      </header>

      <section className="ph-grid">
        {filtered.length === 0 ? (
          <p className="ph-empty">{section.emptyMessage}</p>
        ) : (
          filtered.map((p, i) => (
          <Carte
            key={`${filtre}-${p.id}`}
            p={p}
            index={i}
            sectionId={sectionId}
            highlight={p.id === idParam}
            cardRef={p.id === idParam ? highlightRef : null}
          />
          ))
        )}
      </section>

      <Footer />
    </div>
  )
}
