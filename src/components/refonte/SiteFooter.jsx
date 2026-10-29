import { Link } from 'react-router-dom'
import {
  BEL_AGE_SOCIAL,
  BEL_AGE_WHATSAPP,
  BEL_AGE_WHATSAPP_DISPLAY,
} from '../../data/resources'
import { Ico } from './IconSprite'

export default function SiteFooter() {
  return (
    <footer className="ftr">
      <div className="ftr-in">
        <div>
          <Link className="logo logo--gold" to="/" aria-label="BEL'ÂGE Pâtisserie — accueil" />
          <p className="script">Formations en ligne</p>
        </div>
        <div>
          <h4>Navigation</h4>
          <ul className="ftr-links">
            <li><Link to="/packs">Nos formations</Link></li>
            <li><Link to="/plateforme">Plateforme de formation</Link></li>
          </ul>
        </div>
        <div>
          <h4>Besoin d’aide ?</h4>
          <ul className="ftr-contact">
            <li>
              <a href="mailto:contact@belage-patisserie.fr">
                <span className="c"><Ico name="i-mail" /></span>
                contact@belage-patisserie.fr
              </a>
            </li>
            <li>
              <a href={`tel:+${BEL_AGE_WHATSAPP}`}>
                <span className="c"><Ico name="i-phone" /></span>
                {BEL_AGE_WHATSAPP_DISPLAY}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Suivez-nous</h4>
          <div className="socials">
            <a href={BEL_AGE_SOCIAL.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Ico name="i-instagram" />
            </a>
            <a href={BEL_AGE_SOCIAL.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
              <Ico name="i-tiktok" />
            </a>
          </div>
        </div>
      </div>
      <div className="ftr-bot">
        <p>© 2026 Bel Âge Pâtisserie — Formations en ligne · Tous droits réservés</p>
        <nav aria-label="Liens légaux">
          <Link to="/mentions-legales">Mentions légales</Link>
        </nav>
      </div>
    </footer>
  )
}
