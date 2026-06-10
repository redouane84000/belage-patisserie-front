import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Video,
  Clock,
  Users,
  MessageCircle,
  Calendar,
} from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { CALENDLY_NOUVELLE_REUNION, EBOOK_PREMIUM } from '../../data/resources'
import './Packs.css'

const MODULES = [
  {
    title: 'Module 1 — Les crèmes',
    text: 'Choisir la bonne crème, comprendre les textures, éviter les erreurs fréquentes et obtenir une base stable.',
  },
  {
    title: 'Module 2 — Le montage layer cake',
    text: 'Apprendre à structurer un gâteau, assembler les couches proprement et obtenir un montage droit qui tient.',
  },
  {
    title: 'Module 3 — Le lissage parfait',
    text: 'Maîtriser les bons gestes, les bons outils et les techniques pour obtenir une surface nette et professionnelle.',
  },
  {
    title: 'Module 4 — Finitions & décoration',
    text: 'Réaliser un rendu propre : pochage, décorations, finitions élégantes et présentation professionnelle.',
  },
]

export default function Packs() {
  useScrollReveal('pack-reveal')

  return (
    <div className="packs-page">
      <Navbar />

      <header className="pack-header">
        <p className="pack-header__eyebrow">BEL ÂGE PÂTISSERIE</p>
        <h1 className="pack-header__title">NOS FORMATIONS</h1>
        <p className="pack-header__subtitle">
          Ressources et formations de la marque
        </p>
        <div className="pack-header__line" />
        <p className="pack-header__desc">
          Deux offres exclusives Bel Âge : l&apos;ebook gratuit pour progresser
          en pâtisserie, et la masterclass Cake Design en direct sur Zoom.
        </p>
      </header>

      <section className="pack-offers">
        <article className="pack-offer pack-reveal reveal" id="ebook">
          <div className="pack-offer__icon">
            <BookOpen size={24} strokeWidth={1.6} />
          </div>
          <p className="pack-offer__brand">BEL ÂGE PÂTISSERIE</p>
          <h2 className="pack-offer__title">
            Ebook gratuit — L&apos;Art de la Pâtisserie
          </h2>
          <p className="pack-offer__desc">
            Télécharge gratuitement l&apos;ebook Bel Âge Pâtisserie et découvre
            les bases essentielles pour progresser en pâtisserie : crèmes,
            montage, lissage, finitions et décoration.
          </p>
          <p className="pack-offer__price">Gratuit</p>
          <a
            href={EBOOK_PREMIUM.url}
            download
            className="pack-btn pack-btn--dark"
          >
            Télécharger l&apos;ebook <ArrowRight size={14} strokeWidth={2} />
          </a>
        </article>

        <article
          className="pack-offer pack-offer--featured pack-reveal reveal"
          id="formation"
        >
          <div className="pack-offer__icon">
            <Video size={24} strokeWidth={1.6} />
          </div>
          <p className="pack-offer__brand">BEL ÂGE PÂTISSERIE</p>
          <h2 className="pack-offer__title">
            Formation Cake Design — Masterclass Zoom
          </h2>
          <p className="pack-offer__desc">
            Une masterclass en direct pour apprendre les bases professionnelles
            du cake design, poser tes questions à la coach et progresser avec
            des corrections concrètes.
          </p>

          <ul className="pack-offer__facts">
            <li>
              <Video size={14} strokeWidth={2} />
              Formation en ligne sur Zoom
            </li>
            <li>
              <strong>149 €</strong>
            </li>
            <li>
              <Clock size={14} strokeWidth={2} />6 h de formation en direct
            </li>
            <li>
              <Users size={14} strokeWidth={2} />
              Groupe fermé : 5 participantes maximum
            </li>
            <li>Replay disponible</li>
            <li>
              <MessageCircle size={14} strokeWidth={2} />
              Bonus : accès au groupe WhatsApp privé pendant 7 jours après la
              formation
            </li>
          </ul>

          <div className="pack-offer__slots">
            <p className="pack-offer__slots-title">
              <Calendar size={14} strokeWidth={2} />
              Disponibilités
            </p>
            <ul>
              <li>Mardi : 9h–12h / 14h–17h</li>
              <li>Dimanche : 9h–12h / 14h–17h</li>
            </ul>
          </div>

          <div className="pack-modules">
            {MODULES.map((m) => (
              <div key={m.title} className="pack-module">
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </div>
            ))}
          </div>

          <div className="pack-offer__highlight">
            <p>
              <strong>Déroulé :</strong> 30 min de tour de table et objectifs de
              chaque participante, puis 5h30 de formation intensive sur les 4
              modules.
            </p>
            <p>
              Pas de vidéo pré-enregistrée. Tu es en direct avec la coach. Tu
              poses tes questions, elle corrige et tu progresses vraiment.
            </p>
          </div>

          <p className="pack-offer__conditions">
            Toute réservation est ferme et définitive. Aucun remboursement ne
            sera effectué en cas d&apos;annulation, de désistement ou
            d&apos;absence le jour de la formation. En réservant votre place,
            vous acceptez ces conditions.
          </p>

          <p className="pack-offer__price pack-offer__price--main">149 €</p>
          <a
            href={CALENDLY_NOUVELLE_REUNION}
            target="_blank"
            rel="noopener noreferrer"
            className="pack-btn pack-btn--dark"
          >
            Réserver ma place <ArrowRight size={14} strokeWidth={2} />
          </a>
        </article>
      </section>

      <section className="pack-cta">
        <h2 className="pack-cta__title pack-reveal reveal">
          Vous êtes pâtissière ?
        </h2>
        <p className="pack-cta__sub pack-reveal reveal">
          Rejoignez gratuitement l&apos;annuaire Bel Âge pour gagner en visibilité.
        </p>
        <div className="pack-cta__actions pack-reveal reveal">
          <Link to="/rejoindre" className="pack-btn pack-btn--dark">
            Rejoindre le réseau <ArrowRight size={14} strokeWidth={2} />
          </Link>
          <Link to="/patissieres" className="pack-btn pack-btn--outline">
            Voir les pâtissières <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
