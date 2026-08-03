import { ArrowRight, Calendar, Check, Clock, MessageCircle, Users, Video } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EBOOK_PREMIUM, FORMATION_MASTERCLASS } from '../../data/resources'
import {
  MASTERCLASS_MODULES,
  MASTERCLASS_OUTCOMES,
  RESERVATION_CONDITIONS,
  TRUST_STATS,
} from '../../data/formationsContent'
import './PacksSingle.css'

export default function PacksSingle() {
  const bookingUrl = FORMATION_MASTERCLASS.calendly

  return (
    <main className="formation-page">
      <section className="formation-hero">
        <div className="formation-shell formation-hero__grid">
          <div>
            <span className="formation-kicker">Formation cake design · visio live</span>
            <h1>Passez pro en cake design.<span> Facturez dès votre premier gâteau.</span></h1>
            <p className="formation-hero__lead">
              Une masterclass en direct pour maîtriser les crèmes, le montage, le lissage et
              les finitions — avec les corrections de la coach à chaque étape.
            </p>
            <div className="formation-hero__facts">
              <span><Clock size={15} /> {FORMATION_MASTERCLASS.duration}</span>
              <span><Users size={15} /> {FORMATION_MASTERCLASS.maxParticipants} participantes max</span>
              <span><Video size={15} /> Zoom en direct</span>
            </div>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="formation-button">
              Réserver ma place · {FORMATION_MASTERCLASS.priceLabel}<ArrowRight size={17} />
            </a>
          </div>

          <aside className="formation-hero__offer">
            <span>Masterclass Cake Design</span>
            <strong>{FORMATION_MASTERCLASS.priceLabel}</strong>
            <p>1 journée intensive · en visio live</p>
            <ul>
              <li><Check size={15} /> Corrections en direct</li>
              <li><Check size={15} /> Replay disponible</li>
              <li><Check size={15} /> WhatsApp privé pendant 7 jours</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="formation-stats formation-shell" aria-label="Les atouts de la formation">
        {TRUST_STATS.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
            <small>{stat.sub}</small>
          </div>
        ))}
      </section>

      <section className="formation-shell formation-program">
        <header className="formation-heading">
          <span className="formation-kicker">Le programme</span>
          <h2>Les bases qui font la différence.</h2>
          <p>Une méthode claire, concrète et applicable dès votre prochaine commande.</p>
        </header>
        <div className="formation-modules">
          {MASTERCLASS_MODULES.map((module, index) => (
            <article key={module.title}>
              <span>0{index + 1}</span>
              <h3>{module.title}</h3>
              <p>{module.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="formation-shell formation-details">
        <div className="formation-details__copy">
          <span className="formation-kicker">À la fin de la journée</span>
          <h2>Vous repartez avec une vraie méthode.</h2>
          <ul>
            {MASTERCLASS_OUTCOMES.map((outcome) => (
              <li key={outcome}><Check size={17} /> {outcome}</li>
            ))}
          </ul>
        </div>
        <aside className="formation-details__card">
          <Calendar size={22} />
          <h3>Réservez votre créneau</h3>
          <p>Choisissez directement la session qui vous convient sur Calendly.</p>
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="formation-button">
            Voir les disponibilités <ArrowRight size={16} />
          </a>
          <p className="formation-legal"><MessageCircle size={14} /> {RESERVATION_CONDITIONS}</p>
        </aside>
      </section>

      <section className="formation-shell formation-bottom">
        <a href={EBOOK_PREMIUM.url} download className="formation-bottom__ebook">
          Télécharger l’ebook gratuit <ArrowRight size={16} />
        </a>
        <Link to="/rejoindre" className="formation-bottom__network">
          Déjà formée ? Rejoindre l’annuaire <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  )
}
