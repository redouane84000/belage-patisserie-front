import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  MapPin,
  TrendingUp,
  Users,
  MessageCircle,
  Sparkles,
  Eye,
  Heart,
  Wallet,
  Mail,
  Copy,
  Check,
  HelpCircle,
} from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import {
  BEL_AGE_WHATSAPP_URL,
  BEL_AGE_WHATSAPP_DISPLAY,
  BEL_AGE_SOCIAL,
  INSCRIPTION_MESSAGE_TEMPLATE,
  INSCRIPTION_ACCEPTANCE_INTRO,
  INSCRIPTION_ACCEPTANCE_CRITERIA,
} from '../../data/resources'
import './Rejoindre.css'

const WA_INSCRIPTION = BEL_AGE_WHATSAPP_URL

const BENEFICES = [
  { icon: Eye, text: 'Plus de visibilité' },
  { icon: MessageCircle, text: 'Plus de demandes clients' },
  { icon: Sparkles, text: 'Mise en avant de vos créations' },
  { icon: Users, text: 'Contact direct avec les clients' },
  { icon: Wallet, text: 'Inscription gratuite' },
  { icon: Heart, text: 'Aucune commission' },
]

const FAQ = [
  {
    q: 'L’inscription est-elle vraiment gratuite ?',
    a: 'Oui. L’inscription est 100 % gratuite. Nous ne prenons aucune commission sur vos ventes. Votre profil vous appartient et les clients vous contactent directement.',
  },
  {
    q: 'Quelle commission sur mes commandes ?',
    a: 'Aucune. Bel Âge Pâtisserie ne prélève pas de commission. La plateforme sert à vous rendre visible et à faciliter la mise en relation.',
  },
  {
    q: 'Comment m’inscrire ?',
    a: 'Copiez le message indiqué sur cette page, complétez-le, envoyez-le sur WhatsApp avec votre logo. Si vous voulez Instagram et/ou TikTok sur votre fiche, renvoyez exactement le même message sur nos comptes @belage_patisserie.',
  },
  {
    q: 'Dois-je envoyer le message sur Instagram et TikTok ?',
    a: 'Uniquement sur les réseaux que vous souhaitez afficher sur votre fiche. WhatsApp est obligatoire. Instagram seulement si vous voulez Instagram ; TikTok seulement si vous voulez TikTok.',
  },
  {
    q: 'Qui peut s’inscrire ?',
    a: 'Pâtissières et cake designers en activité en France, à domicile ou en boutique, qui proposent des créations sur mesure pour particuliers.',
  },
  {
    q: 'Y a-t-il un minimum d’abonnés ?',
    a: 'Non. Nous vérifions surtout la qualité du profil : vraies photos et vidéos de créations, spécialités claires, compte réel. Bel Âge peut refuser une inscription si le profil ne correspond pas à ces critères.',
  },
  {
    q: 'Quel prix indiquer à la part ?',
    a: 'À partir de 3 €/part. Pas de plafond pour l’inscription : indiquez votre tarif réel. Si vous proposez le service influence, précisez vos tarifs pour chaque format (reel, vidéo courte, vidéo longue).',
  },
]

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconTikTok() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
    </svg>
  )
}

export default function Rejoindre() {
  useScrollReveal('rej-reveal')
  const [copied, setCopied] = useState(false)

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(INSCRIPTION_MESSAGE_TEMPLATE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* sélection manuelle si clipboard indisponible */
    }
  }

  return (
    <div className="rejoindre-page">
      <Navbar />

      <header className="rej-header">
        <p className="rej-header__eyebrow">Première plateforme française</p>
        <h1 className="rej-header__title">
          Rejoignez gratuitement le réseau BEL ÂGE PÂTISSERIE
        </h1>
        <p className="rej-header__subtitle">
          La première plateforme française pensée pour mettre en avant les
          pâtissier(e)s et faciliter la mise en relation avec les clients.
        </p>
        <div className="rej-header__line" />
        <p className="rej-header__desc">
          L&apos;inscription est 100 % gratuite. Nous ne prenons aucune commission
          sur vos ventes. Votre profil permet aux clients de vous découvrir, de
          voir vos spécialités, votre zone géographique, vos créations et vos
          réseaux sociaux.
        </p>
        <div className="rej-header__cta">
          <a href="#inscription" className="rej-btn rej-btn--dark">
            Rejoindre gratuitement le réseau{' '}
            <ArrowRight size={14} strokeWidth={2} />
          </a>
          <Link to="/carte" className="rej-btn rej-btn--outline">
            Voir la carte France <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </header>

      <section className="rej-band">
        <div className="rej-band__item rej-reveal reveal">
          <strong>100 %</strong>
          <span>gratuit</span>
        </div>
        <div className="rej-band__item rej-reveal reveal">
          <strong>0 %</strong>
          <span>de commission</span>
        </div>
        <div className="rej-band__item rej-reveal reveal">
          <strong>France</strong>
          <span>annuaire national</span>
        </div>
        <div className="rej-band__item rej-reveal reveal">
          <strong>Direct</strong>
          <span>contact client</span>
        </div>
      </section>

      <section className="rej-section">
        <h2 className="rej-section__title rej-reveal reveal">
          Comment ça fonctionne ?
        </h2>
        <div className="rej-header__line rej-reveal reveal" />
        <p className="rej-section__intro rej-reveal reveal">
          Le client se rend sur la plateforme, choisit une pâtissière proche de
          chez lui ou filtre selon ses besoins : wedding cake, layer cake, number
          cake, cake design, budget à la part, localisation ou service influence.
          Il accède ensuite à vos informations de contact pour vous joindre
          directement.
        </p>
        <ul className="rej-contact-list rej-reveal reveal">
          <li>
            <MapPin size={16} strokeWidth={2} />
            Trouver un prestataire près de chez soi
          </li>
          <li>
            <Mail size={16} strokeWidth={2} />
            Instagram, TikTok, téléphone, email sur votre fiche
          </li>
          <li>
            <TrendingUp size={16} strokeWidth={2} />
            Objectif : visibilité et ventes, sans intermédiaire payant
          </li>
        </ul>
      </section>

      <section className="rej-section rej-section--alt">
        <h2 className="rej-section__title rej-reveal reveal">Vos bénéfices</h2>
        <div className="rej-header__line rej-reveal reveal" />
        <div className="rej-benefices">
          {BENEFICES.map(({ icon: Icon, text }) => (
            <div key={text} className="rej-benefice rej-reveal reveal">
              <Icon size={20} strokeWidth={1.6} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rej-section" id="inscription">
        <h2 className="rej-section__title rej-reveal reveal">
          Rejoindre le réseau — c&apos;est simple
        </h2>
        <div className="rej-header__line rej-reveal reveal" />
        <p className="rej-section__intro rej-reveal reveal">
          Une seule démarche : copiez le message ci-dessous, complétez les
          informations, puis envoyez-le. Commencez par WhatsApp avec votre logo.
          Si vous souhaitez aussi Instagram et/ou TikTok sur votre fiche, collez
          le <strong>même message</strong> sur nos comptes (uniquement les
          réseaux que vous voulez afficher).
        </p>

        <ol className="rej-simple-steps rej-reveal reveal">
          <li>
            <strong>1.</strong> Copiez le modèle et remplacez les [ ] par vos
            informations.
          </li>
          <li>
            <strong>2.</strong> Envoyez le message + votre logo sur WhatsApp Bel
            Âge ({BEL_AGE_WHATSAPP_DISPLAY}).
          </li>
          <li>
            <strong>3.</strong> Instagram et/ou TikTok : collez le même message en
            privé à {BEL_AGE_SOCIAL.instagramHandle} — seulement si vous voulez
            ce réseau sur votre fiche.
          </li>
        </ol>

        <div className="rej-template rej-reveal reveal">
          <div className="rej-template__head">
            <p className="rej-template__label">Message à envoyer</p>
            <button
              type="button"
              className={`rej-template__copy ${copied ? 'is-copied' : ''}`}
              onClick={copyTemplate}
            >
              {copied ? (
                <>
                  <Check size={14} strokeWidth={2} />
                  Copié
                </>
              ) : (
                <>
                  <Copy size={14} strokeWidth={2} />
                  Copier le message
                </>
              )}
            </button>
          </div>
          <pre className="rej-template__body">{INSCRIPTION_MESSAGE_TEMPLATE}</pre>
          <p className="rej-template__hint">
            Prix affiché sur la fiche : <strong>à partir de 3 €/part</strong> (pas
            de maximum pour l&apos;inscription). Service influence : indiquez vos
            tarifs pour les 3 formats si vous proposez ce service.
          </p>
        </div>

        <div className="rej-criteria rej-reveal reveal">
          <h3 className="rej-criteria__title">Conditions d&apos;acceptation</h3>
          <p className="rej-criteria__intro">{INSCRIPTION_ACCEPTANCE_INTRO}</p>
          <ul className="rej-criteria__list">
            {INSCRIPTION_ACCEPTANCE_CRITERIA.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rej-channels rej-reveal reveal" id="comment-envoyer">
          <h3 className="rej-channels__title">
            <HelpCircle size={18} strokeWidth={2} />
            Où envoyer votre message ?
          </h3>

          <div className="rej-channel">
            <div className="rej-channel__icon rej-channel__icon--wa">
              <MessageCircle size={20} strokeWidth={2} />
            </div>
            <div className="rej-channel__body">
              <strong>WhatsApp — obligatoire</strong>
              <p>
                Envoyez le message complété + la photo de votre logo (image
                d&apos;entreprise). Depuis le numéro que vous voulez afficher sur
                votre fiche.
              </p>
              <a
                href={WA_INSCRIPTION}
                target="_blank"
                rel="noopener noreferrer"
                className="rej-btn rej-btn--dark rej-channel__btn"
              >
                <MessageCircle size={14} strokeWidth={2} />
                Ouvrir WhatsApp — {BEL_AGE_WHATSAPP_DISPLAY}
              </a>
            </div>
          </div>

          <div className="rej-channel">
            <div className="rej-channel__icon">
              <IconInstagram />
            </div>
            <div className="rej-channel__body">
              <strong>Instagram — si vous voulez Instagram sur la fiche</strong>
              <p>
                Depuis <em>votre</em> compte Instagram, envoyez un message privé
                à {BEL_AGE_SOCIAL.instagramHandle} avec le <strong>même texte</strong>{' '}
                (copier-coller). Pas besoin si vous avez mis « Non » pour Instagram.
              </p>
              <a
                href={BEL_AGE_SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rej-btn rej-btn--outline rej-channel__btn"
              >
                Ouvrir Instagram {BEL_AGE_SOCIAL.instagramHandle}
              </a>
            </div>
          </div>

          <div className="rej-channel">
            <div className="rej-channel__icon">
              <IconTikTok />
            </div>
            <div className="rej-channel__body">
              <strong>TikTok — si vous voulez TikTok sur la fiche</strong>
              <p>
                Depuis <em>votre</em> compte TikTok, envoyez le <strong>même message</strong>{' '}
                à {BEL_AGE_SOCIAL.tiktokHandle}. Pas besoin si vous avez mis « Non »
                pour TikTok.
              </p>
              <a
                href={BEL_AGE_SOCIAL.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="rej-btn rej-btn--outline rej-channel__btn"
              >
                Ouvrir TikTok {BEL_AGE_SOCIAL.tiktokHandle}
              </a>
            </div>
          </div>
        </div>

        <div className="rej-inscription-box rej-reveal reveal">
          <Sparkles size={28} strokeWidth={1.6} className="rej-inscription-box__icon" />
          <div>
            <h3>Prête à rejoindre l&apos;annuaire ?</h3>
            <p>
              Copiez le message, complétez-le, envoyez sur WhatsApp avec votre
              logo. Puis sur Instagram et/ou TikTok si vous le souhaitez.
              Réponse sous 48 à 72 h ouvrées.
            </p>
          </div>
          <a
            href={WA_INSCRIPTION}
            target="_blank"
            rel="noopener noreferrer"
            className="rej-btn rej-btn--dark"
          >
            <MessageCircle size={16} strokeWidth={2} />
            Commencer sur WhatsApp
          </a>
        </div>
      </section>

      <section className="rej-section rej-section--alt">
        <h2 className="rej-section__title rej-reveal reveal">
          Questions fréquentes
        </h2>
        <div className="rej-faq">
          {FAQ.map((item) => (
            <details key={item.q} className="rej-faq__item rej-reveal reveal">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rej-final rej-reveal reveal">
        <h2>Rejoignez l&apos;annuaire Bel Âge dès aujourd&apos;hui</h2>
        <p>
          Des familles cherchent chaque mois une pâtissière de confiance pour
          leurs événements. Soyez visible là où elles regardent déjà.
        </p>
        <div className="rej-final__actions">
          <a
            href={WA_INSCRIPTION}
            target="_blank"
            rel="noopener noreferrer"
            className="rej-btn rej-btn--dark"
          >
            Rejoindre gratuitement le réseau{' '}
            <ArrowRight size={14} strokeWidth={2} />
          </a>
          <Link to="/patissieres" className="rej-btn rej-btn--outline">
            Voir les pâtissières
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
