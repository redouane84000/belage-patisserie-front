import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import IconSprite, { Ico } from '../../components/refonte/IconSprite'
import SiteHeader from '../../components/refonte/SiteHeader'
import SiteFooter from '../../components/refonte/SiteFooter'
import MobileTabBar from '../../components/refonte/MobileTabBar'
import { productLanding } from '../../content/productLandings'
import './product-landing.css'

export default function TrainingProduct() {
  const { slug } = useParams()
  const page = productLanding(slug)
  const [open, setOpen] = useState(0)
  const [added, setAdded] = useState(false)

  if (!page) return <Navigate to="/packs" replace />

  const taughtShots = page.kind === 'course' && page.gallery?.length
    ? page.gallery.slice(0, 1)
    : page.gallery

  function addToCart() {
    if (page.kind !== 'course') return
    const current = JSON.parse(localStorage.getItem('belage-training-cart') || '[]')
    localStorage.setItem('belage-training-cart', JSON.stringify([...new Set([...current, page.id])]))
    setAdded(true)
  }

  return (
    <div className="bl lp">
      <IconSprite />
      <SiteHeader variant="bar" />

      <main>
        <section className="lp-hero" aria-labelledby="lp-title">
          <div className="lp-hero__copy">
            <nav className="lp-crumbs" aria-label="Fil d’Ariane">
              <Link to="/">Accueil</Link>
              <span>/</span>
              <Link to="/packs">Nos formations</Link>
              <span>/</span>
              <span>{page.title}</span>
            </nav>
            <p className="lp-eyebrow">{page.eyebrow}</p>
            <h1 id="lp-title">{page.title}</h1>
            <p className="lp-lead">{page.lead}</p>
            <ul className="lp-meta">
              <li><Ico name="i-clock" />{page.duration}</li>
              <li><Ico name="i-chapters" />{page.chapterLabel}</li>
            </ul>
            <p className="lp-price">
              <strong>{page.priceLabel}</strong>
              {page.crossedLabel && <s>{page.crossedLabel}</s>}
              {page.discountLabel && <em>{page.discountLabel}</em>}
            </p>
            <div className="lp-cta">
              <Link className="btn btn--champ" to={page.checkout}>
                Acheter la formation <Ico name="i-arrow" className="arr" />
              </Link>
              {page.kind === 'course' && (
                <button className="btn btn--login" type="button" onClick={addToCart}>
                  {added ? 'Ajouté au panier' : 'Ajouter au panier'}
                </button>
              )}
            </div>
            <p className="lp-secure">Paiement sécurisé avec Stripe · Accès dans votre espace après validation</p>
          </div>
          <figure className="lp-hero__photo ph">
            <img src={page.photo || page.gallery[0]?.src} alt={page.alt || page.gallery[0]?.alt || page.title} width="1440" height="1920" />
          </figure>
        </section>

        <section className="lp-sec" aria-labelledby="lp-learn">
          <div className="lp-wrap">
            <p className="kicker">La formation</p>
            <h2 className="h2" id="lp-learn">Ce que vous allez travailler</h2>
            <div className="lp-outcomes">
              {(page.outcomes || []).map((item) => (
                <article key={item}>
                  <Ico name="i-check" />
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {page.kind === 'course' && page.modules?.length > 0 && (
          <section className="lp-sec lp-sec--ivory" aria-labelledby="lp-program">
            <div className="lp-wrap">
              <p className="kicker">Programme</p>
              <h2 className="h2" id="lp-program">{page.chapterCount} {page.chapterUnit}</h2>
              <div className="lp-program">
                {page.modules.map((module, index) => {
                  const expanded = open === index
                  return (
                    <article key={module.title} className={expanded ? 'is-open' : undefined}>
                      <button type="button" aria-expanded={expanded} onClick={() => setOpen(expanded ? -1 : index)}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <strong>{module.title}</strong>
                        {module.duration && <small>{module.duration}</small>}
                        <Ico name="i-down" />
                      </button>
                      {expanded && <p>{module.description}</p>}
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {page.kind === 'pack' && (
          <section className="lp-sec lp-sec--ivory" aria-labelledby="lp-included">
            <div className="lp-wrap">
              <p className="kicker">Inclus</p>
              <h2 className="h2" id="lp-included">Les trois formations</h2>
              <div className="lp-pack-grid">
                {page.courses.map((course) => (
                  <article key={course.id}>
                    <h3>{course.title}</h3>
                    <p>{course.shortDescription}</p>
                    <ul>
                      <li>{course.chapterLabel}</li>
                      <li>{course.duration}</li>
                      <li>{course.priceLabel} à l’unité</li>
                    </ul>
                    <Link to={`/formations/${course.slug}`}>Voir la formation</Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {taughtShots?.length > 0 && (
          <section className="lp-sec" aria-labelledby="lp-gallery">
            <div className="lp-wrap">
              <p className="kicker">Réalisations</p>
              <h2 className="h2" id="lp-gallery">Le rendu enseigné</h2>
              <div className={`lp-gallery lp-gallery--${taughtShots.length}`}>
                {taughtShots.map((item) => (
                  <figure className="ph" key={item.src}>
                    <img src={item.src} alt={item.alt} loading="lazy" />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="lp-sec lp-sec--ivory" aria-labelledby="lp-why">
          <div className="lp-wrap">
            <p className="kicker">Pourquoi cette formation</p>
            <h2 className="h2" id="lp-why">Ce que le programme permet</h2>
            <div className="lp-why">
              {page.why.map((item) => (
                <article key={item.title}>
                  <Ico name={item.icon} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-offer" aria-labelledby="lp-offer">
          <figure className="ph">
            <img src={page.photo || page.gallery[0]?.src} alt="" />
          </figure>
          <div>
            <p className="lp-eyebrow">{page.eyebrow}</p>
            <h2 id="lp-offer">{page.title}</h2>
            <p>{page.shortDescription || page.lead}</p>
            <p className="lp-price"><strong>{page.priceLabel}</strong>{page.crossedLabel && <s>{page.crossedLabel}</s>}</p>
            <Link className="btn btn--champ" to={page.checkout}>
              Acheter maintenant <Ico name="i-arrow" className="arr" />
            </Link>
          </div>
        </section>

        <section className="lp-sec" aria-labelledby="lp-faq">
          <div className="lp-wrap lp-wrap--narrow">
            <p className="kicker">Questions</p>
            <h2 className="h2" id="lp-faq">Avant de commencer</h2>
            <div className="lp-faq">
              {page.faq.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="lp-sticky only-d">
        <span>{page.title} · {page.priceLabel}</span>
        <Link className="btn btn--bx" to={page.checkout}>Acheter</Link>
      </div>

      <SiteFooter />
      <MobileTabBar active="formations" />
    </div>
  )
}
