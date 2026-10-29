import { Users, FileText, Gift, Lightbulb } from 'lucide-react'
import { HIDDEN_ROUTES } from '../../config/hiddenRoutes'
import './FeaturesStrip.css'

const FEATURES = [
  {
    icon: Users,
    title: 'Nos formations',
    desc: 'Layer Cake, Flower Cupcake et Wedding Cake',
  },
  {
    icon: FileText,
    title: 'Paiement sécurisé',
    desc: 'Achetez une formation et recevez vos accès',
  },
  {
    icon: Gift,
    title: 'Votre espace',
    desc: 'Retrouvez les formations déjà achetées',
  },
  {
    icon: Lightbulb,
    title: 'Plateforme',
    desc: 'Suivez les vidéos depuis votre compte',
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
