import { useEffect, useState } from 'react'
import { X, MapPin, ArrowRight } from 'lucide-react'
import { formatPricePerSlice, getPricePerSlice } from '../../../utils/patissiere'
import {
  IconInstagram,
  IconWhatsApp,
  IconTikTok,
  IconPhone,
  initiales,
  formatTel,
} from './patissieresMobileIcons'

export default function PatissieresMobileSheet({ profile: p, onClose }) {
  const [visible, setVisible] = useState(false)
  const [photoOk, setPhotoOk] = useState(false)
  const [showPhone, setShowPhone] = useState(false)

  useEffect(() => {
    setShowPhone(false)
    setPhotoOk(false)
  }, [p?.id])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
    }
  }, [p?.id])

  function handleClose() {
    setVisible(false)
    window.setTimeout(onClose, 280)
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setVisible(false)
        window.setTimeout(onClose, 280)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!p) return null

  return (
    <div
      className={`mob-sheet ${visible ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mob-sheet-title"
    >
      <button
        type="button"
        className="mob-sheet__overlay"
        aria-label="Fermer"
        onClick={handleClose}
      />

      <div className="mob-sheet__panel">
        <div className="mob-sheet__handle" aria-hidden />

        <button
          type="button"
          className="mob-sheet__close"
          aria-label="Fermer la fiche"
          onClick={handleClose}
        >
          <X size={20} strokeWidth={2} />
        </button>

        <div className="mob-sheet__scroll">
          <header className="mob-sheet__head">
            <div className={`mob-sheet__avatar ${p.image ? 'mob-sheet__avatar--logo' : ''}`}>
              {p.image ? (
                <>
                  {!photoOk && <span>{initiales(p.nom)}</span>}
                  <img
                    src={p.image}
                    alt=""
                    className={photoOk ? 'is-visible' : ''}
                    onLoad={() => setPhotoOk(true)}
                    onError={() => setPhotoOk(false)}
                  />
                </>
              ) : (
                <span>{initiales(p.nom)}</span>
              )}
            </div>
            <div>
              <h2 id="mob-sheet-title" className="mob-sheet__name">
                {p.nom}
                {p.badge && (
                  <span className="mob-sheet__sel">Sélection Bel Âge</span>
                )}
              </h2>
              <p className="mob-sheet__loc">
                <MapPin size={13} strokeWidth={2} />
                {p.ville} · {p.region}
              </p>
            </div>
          </header>

          <div className="mob-sheet__tags">
            {p.specialites.map((t) => (
              <span key={t} className="mob-sheet__tag">
                {t}
              </span>
            ))}
          </div>

          <div className="mob-sheet__block">
            <p className="mob-sheet__label">Tarif indicatif</p>
            <p className="mob-sheet__price">
              {formatPricePerSlice(getPricePerSlice(p))}
            </p>
            {p.livraison && (
              <p className="mob-sheet__hint">Livraison disponible</p>
            )}
          </div>

          {p.offersInfluence && p.influenceServices?.length > 0 && (
            <div className="mob-sheet__block">
              <p className="mob-sheet__label">Service influence</p>
              {p.influenceServices.map((s) => (
                <div key={s.type} className="mob-sheet__row">
                  <span>{s.type}</span>
                  <strong>{s.price}</strong>
                </div>
              ))}
            </div>
          )}

          <div className="mob-sheet__block">
            <p className="mob-sheet__label">Réseaux</p>
            <div className="mob-sheet__socials">
              {p.instagram && (
                <button
                  type="button"
                  className="mob-sheet__social mob-sheet__social--insta"
                  onClick={() => window.open(p.instagram, '_blank')}
                >
                  <IconInstagram />
                  Instagram
                  {p.instagram_followers && (
                    <small>{p.instagram_followers}</small>
                  )}
                </button>
              )}
              {p.tiktok && (
                <button
                  type="button"
                  className="mob-sheet__social mob-sheet__social--tiktok"
                  onClick={() => window.open(p.tiktok, '_blank')}
                >
                  <IconTikTok />
                  TikTok
                  {p.tiktok_followers && <small>{p.tiktok_followers}</small>}
                </button>
              )}
            </div>
          </div>

          <div className="mob-sheet__actions">
            {p.whatsapp ? (
              <>
                <button
                  type="button"
                  className="mob-sheet__wa"
                  onClick={() => window.open(`https://wa.me/${p.whatsapp}`, '_blank')}
                >
                  <IconWhatsApp size={18} />
                  Contacter sur WhatsApp
                </button>

                <button
                  type="button"
                  className={`mob-sheet__phone ${showPhone ? 'is-open' : ''}`}
                  onClick={() => setShowPhone((v) => !v)}
                >
                  <IconPhone />
                  {showPhone ? 'Masquer le numéro' : 'Voir le numéro'}
                </button>

                {showPhone && formatTel(p.whatsapp) && (
                  <a className="mob-sheet__tel" href={`tel:+${p.whatsapp}`}>
                    {formatTel(p.whatsapp)}
                  </a>
                )}
              </>
            ) : (
              <p className="mob-sheet__no-phone">
                {p.instagram
                  ? 'Pas de numéro — contactez via Instagram.'
                  : 'Numéro non communiqué.'}
              </p>
            )}

            {p.email && (
              <a className="mob-sheet__email" href={`mailto:${p.email}`}>
                {p.email}
              </a>
            )}

            <button type="button" className="mob-sheet__devis">
              Demander un devis <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
