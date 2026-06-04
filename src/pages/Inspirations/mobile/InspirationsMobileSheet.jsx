import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ArrowRight, MapPin } from 'lucide-react'
import InspirationImage from '../../../components/InspirationImage/InspirationImage'
import './InspirationsMobile.css'

export default function InspirationsMobileSheet({ item, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
    }
  }, [item.id])

  function handleClose() {
    setVisible(false)
    window.setTimeout(onClose, 280)
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div
      className={`insp-m-sheet ${visible ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="insp-m-sheet-title"
    >
      <button
        type="button"
        className="insp-m-sheet__overlay"
        aria-label="Fermer"
        onClick={handleClose}
      />

      <div className="insp-m-sheet__panel">
        <div className="insp-m-sheet__handle" aria-hidden />

        <button
          type="button"
          className="insp-m-sheet__close"
          aria-label="Fermer"
          onClick={handleClose}
        >
          <X size={20} strokeWidth={2} />
        </button>

        <div className="insp-m-sheet__media">
          <InspirationImage
            src={item.image}
            alt={item.alt || item.title}
            className={item.fit === 'contain' ? 'insp-m-img--contain' : ''}
          />
        </div>

        <div className="insp-m-sheet__body">
          <span className="insp-m-sheet__cat">{item.category}</span>
          <h2 id="insp-m-sheet-title" className="insp-m-sheet__title">
            {item.title}
          </h2>
          <p className="insp-m-sheet__text">
            Partagez cette référence à votre pâtissière pour un gâteau sur-mesure
            dans le même esprit.
          </p>
          <Link
            to="/patissieres"
            className="insp-m-sheet__cta"
            onClick={handleClose}
          >
            Je veux ce style <ArrowRight size={15} strokeWidth={2} />
          </Link>
          <Link
            to="/carte"
            className="insp-m-sheet__link"
            onClick={handleClose}
          >
            <MapPin size={14} strokeWidth={2} />
            Voir la carte France
          </Link>
        </div>
      </div>
    </div>
  )
}
