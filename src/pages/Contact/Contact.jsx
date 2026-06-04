import { useState } from 'react'
import { MapPin, Mail, Clock } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import {
  BEL_AGE_WHATSAPP_URL,
  BEL_AGE_WHATSAPP_DISPLAY,
} from '../../data/resources'
import './Contact.css'

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconTikTok() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  )
}

const SUBJECTS = [
  'Demande d\'information générale',
  'Je suis une pâtissière, je veux m\'inscrire',
  'Problème technique',
  'Partenariat commercial',
  'Autre',
]

const SOCIALS = [
  { href: 'https://instagram.com/belage_patisserie', icon: IconInstagram, label: 'Instagram' },
  { href: 'https://tiktok.com/@belage_patisserie', icon: IconTikTok, label: 'TikTok' },
  { href: 'https://facebook.com/belage.patisserie', icon: IconFacebook, label: 'Facebook' },
]

export default function Contact() {
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [objet, setObjet] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!email.trim() || !message.trim()) return
    setSent(true)
  }

  return (
    <div className="contact-page">
      <Navbar />

      <section className="contact-hero">
        <h1>Contactez-nous</h1>
        <p>Notre équipe vous répond sous 24h</p>
      </section>

      <section className="contact-main">
        <div className="contact-form-col">
          <h2>Envoyer un message</h2>

          {sent ? (
            <p className="contact-success">
              Merci pour votre message. Nous vous répondrons sous 24 h à l&apos;adresse
              indiquée.
            </p>
          ) : (
            <div className="contact-form">
              <div className="contact-form__row">
                <div className="contact-field">
                  <label htmlFor="contact-prenom">Prénom</label>
                  <input
                    id="contact-prenom"
                    type="text"
                    placeholder="Votre prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-nom">Nom</label>
                  <input
                    id="contact-nom"
                    type="text"
                    placeholder="Votre nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="vous@exemple.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-objet">Objet</label>
                <select
                  id="contact-objet"
                  value={objet}
                  onChange={(e) => setObjet(e.target.value)}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  placeholder="Décrivez votre demande…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button type="button" className="contact-submit" onClick={handleSend}>
                Envoyer
              </button>
              <p className="contact-rgpd">
                Vos données sont protégées conformément à notre politique de
                confidentialité (RGPD).
              </p>
            </div>
          )}
        </div>

        <aside className="contact-card">
          <h3>Nos coordonnées</h3>
          <div className="contact-card__line" />

          <div className="contact-card__block">
            <MapPin size={16} strokeWidth={2} />
            <div>
              <p>10 Rue de l&apos;Arménie</p>
              <p>84000 Avignon, France</p>
            </div>
          </div>

          <div className="contact-card__block">
            <Mail size={16} strokeWidth={2} />
            <a href="mailto:contact@belage-patisserie.fr">
              contact@belage-patisserie.fr
            </a>
          </div>

          <div className="contact-card__block contact-card__block--wa">
            <p className="contact-card__wa-label">Disponible 7j/7 · 9h–19h</p>
            <a
              href={BEL_AGE_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-wa-btn"
            >
              WhatsApp — {BEL_AGE_WHATSAPP_DISPLAY}
            </a>
          </div>

          <div className="contact-card__block">
            <Clock size={16} strokeWidth={2} />
            <div>
              <p>Lundi – Vendredi : 9h – 18h</p>
              <p>Samedi : 10h – 14h</p>
              <p>Dimanche : Fermé</p>
            </div>
          </div>

          <div className="contact-card__socials">
            {SOCIALS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card__social"
                aria-label={label}
              >
                <Icon />
              </a>
            ))}
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  )
}
