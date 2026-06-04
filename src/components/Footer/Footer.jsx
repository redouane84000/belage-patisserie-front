import { Link } from 'react-router-dom'
import { MapPin, Mail, ChevronDown } from 'lucide-react'
import {
  BEL_AGE_WHATSAPP_URL,
  BEL_AGE_WHATSAPP_DISPLAY,
} from '../../data/resources'
import './Footer.css'

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

function IconWhatsApp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.847L.057 23.882l6.196-1.438A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.659-.502-5.187-1.381l-.371-.22-3.679.853.882-3.574-.242-.389A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  )
}

const NAV_LINKS = [
  { label: 'Trouver une pâtissière', to: '/patissieres' },
  { label: 'Carte France', to: '/carte' },
  { label: 'Inspirations', to: '/inspirations' },
  { label: 'Nos Packs & Formations', to: '/packs' },
  { label: 'Rejoindre le réseau', to: '/rejoindre' },
  { label: 'Demander un devis', to: '/contact' },
]

const LEGAL_LINKS = [
  { label: 'Mentions légales', to: '/mentions-legales' },
  { label: 'CGU', to: '/mentions-legales#cgu' },
  { label: 'Politique de confidentialité', to: '/mentions-legales#confidentialite' },
  { label: 'Gestion des cookies', to: '/mentions-legales#cookies' },
]

const SOCIALS = [
  { href: 'https://instagram.com/belage_patisserie', icon: IconInstagram, label: 'Instagram' },
  { href: 'https://tiktok.com/@belage_patisserie', icon: IconTikTok, label: 'TikTok' },
  { href: 'https://facebook.com/belage.patisserie', icon: IconFacebook, label: 'Facebook' },
]

function FooterAccordion({ title, children, defaultOpen = false }) {
  return (
    <details className="site-footer__acc" open={defaultOpen}>
      <summary className="site-footer__acc-head">
        {title}
        <ChevronDown size={16} strokeWidth={2} className="site-footer__acc-chevron" />
      </summary>
      <div className="site-footer__acc-body">{children}</div>
    </details>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      {/* Version desktop — inchangée */}
      <div className="site-footer__main site-footer__main--desktop">
        <div className="site-footer__col site-footer__col--brand">
          <Link to="/" className="site-footer__logo">
            <span className="site-footer__logo-name">BEL ÂGE</span>
            <span className="site-footer__logo-sub">PATISSERIE</span>
          </Link>
          <p className="site-footer__tagline">
            La première marketplace française dédiée aux pâtissières et cake designers
            indépendantes.
          </p>
          <div className="site-footer__socials">
            {SOCIALS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__social"
                aria-label={label}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer__col site-footer__col--nav">
          <p className="site-footer__heading">Navigation</p>
          <ul className="site-footer__links">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="site-footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="site-footer__heading site-footer__heading--spaced">Légal</p>
          <ul className="site-footer__links">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="site-footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col site-footer__col--contact">
          <p className="site-footer__heading">Contact</p>

          <div className="site-footer__info">
            <MapPin size={14} strokeWidth={2} className="site-footer__info-icon" />
            <div>
              <p>10 Rue de l&apos;Arménie</p>
              <p>84000 Avignon, France</p>
            </div>
          </div>

          <div className="site-footer__info">
            <Mail size={14} strokeWidth={2} className="site-footer__info-icon" />
            <a href="mailto:contact@belage-patisserie.fr" className="site-footer__mailto">
              contact@belage-patisserie.fr
            </a>
          </div>

          <div className="site-footer__info">
            <span className="site-footer__wa-icon">
              <IconWhatsApp />
            </span>
            <a
              href={BEL_AGE_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__wa"
            >
              WhatsApp — {BEL_AGE_WHATSAPP_DISPLAY}
            </a>
          </div>

          <div className="site-footer__sep" />

          <p className="site-footer__heading site-footer__heading--small">
            Informations légales
          </p>
          <div className="site-footer__legal-text">
            <p>Bel Âge Pâtisserie</p>
            <p>Entrepreneur individuel</p>
            <p>SIREN : 890 061 872</p>
            <p>SIRET : 890 061 872 00036</p>
            <p>N° TVA : FR86890061872</p>
            <p>Dirigeant : Miriam Belhadj</p>
            <p>Activité : Services des traiteurs</p>
            <p>Immatriculation : 06/01/2021</p>
            <p>Siège social : 10 Rue de l&apos;Arménie, 84000 Avignon</p>
          </div>
          <p className="site-footer__prototype">
            * Site en cours de développement — prototype non commercial
          </p>
        </div>
      </div>

      {/* Version mobile compacte — accordéons */}
      <div className="site-footer__mobile">
        <Link to="/" className="site-footer__logo site-footer__logo--mob">
          <span className="site-footer__logo-name">BEL ÂGE</span>
          <span className="site-footer__logo-sub">PATISSERIE</span>
        </Link>

        <FooterAccordion title="Informations">
          <p className="site-footer__tagline site-footer__tagline--mob">
            La première marketplace française dédiée aux pâtissières et cake
            designers indépendantes.
          </p>
          <div className="site-footer__socials site-footer__socials--mob">
            {SOCIALS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__social"
                aria-label={label}
              >
                <Icon />
              </a>
            ))}
          </div>
        </FooterAccordion>

        <FooterAccordion title="Navigation">
          <ul className="site-footer__links site-footer__links--mob">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="site-footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterAccordion>

        <FooterAccordion title="Adresse & Contact">
          <div className="site-footer__info site-footer__info--mob">
            <MapPin size={14} strokeWidth={2} />
            <div>
              <p>10 Rue de l&apos;Arménie</p>
              <p>84000 Avignon, France</p>
            </div>
          </div>
          <a href="mailto:contact@belage-patisserie.fr" className="site-footer__mailto site-footer__mailto--mob">
            contact@belage-patisserie.fr
          </a>
          <a
            href={BEL_AGE_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer__wa site-footer__wa--mob"
          >
            WhatsApp — {BEL_AGE_WHATSAPP_DISPLAY}
          </a>
        </FooterAccordion>

        <FooterAccordion title="Conditions & Légal">
          <ul className="site-footer__links site-footer__links--mob">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="site-footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="site-footer__legal-text site-footer__legal-text--mob">
            <p>Bel Âge Pâtisserie · EI</p>
            <p>SIREN 890 061 872 · SIRET 890 061 872 00036</p>
            <p>N° TVA FR86890061872</p>
            <p>Dirigeant : Miriam Belhadj</p>
            <p>Immatriculation : 06/01/2021</p>
          </div>
          <p className="site-footer__prototype site-footer__prototype--mob">
            * Prototype non commercial
          </p>
        </FooterAccordion>
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__copy">
          © {year} Bel Âge Pâtisserie · Tous droits réservés
        </p>
        <p className="site-footer__bottom-links">
          <Link to="/mentions-legales">Mentions légales</Link>
          <span aria-hidden="true">·</span>
          <Link to="/mentions-legales#cgu">CGU</Link>
          <span aria-hidden="true">·</span>
          <Link to="/contact">Contact</Link>
        </p>
      </div>
    </footer>
  )
}
