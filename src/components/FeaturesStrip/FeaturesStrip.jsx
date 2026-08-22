import { Users, FileText, Gift, Lightbulb } from 'lucide-react'
import { HIDDEN_ROUTES } from '../../config/hiddenRoutes'
import './FeaturesStrip.css'

const FEATURES = [
  {
    icon: Users,
    title: 'Annuaire de prestataires',
    desc: 'Trouvez la pâtissière idéale pour votre projet',
  },
  {
    icon: FileText,
    title: 'Demandes de devis',
    desc: 'Comparez plusieurs devis et choisissez la meilleure offre',
  },
  {
    icon: Gift,
    title: 'Packs prédéfinis',
    desc: 'Des formules pensées pour tous vos événements',
  },
  {
    icon: Lightbulb,
    title: 'Inspirations',
    desc: "Explorez des créations uniques et trouvez l'inspiration",
    to: '/inspirations',
  },
]

const VISIBLE_FEATURES = FEATURES.filter(({ to }) => !to || !HIDDEN_ROUTES.has(to))

export default function FeaturesStrip() {
  return (
    <section className="features">
      <div className="features__grid">
        {VISIBLE_FEATURES.map(({ icon: Icon, title, desc }, index) => (
          <article
            key={title}
            className="feature"
            data-home-reveal
            style={{ '--home-reveal-i': index }}
          >
            <Icon
              size={24}
              strokeWidth={1.6}
              className="feature__icon"
              aria-hidden="true"
            />
            <h3 className="feature__title">{title}</h3>
            <p className="feature__desc">{desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
