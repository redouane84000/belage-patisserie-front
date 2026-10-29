import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import IconSprite, { Ico } from '../../components/refonte/IconSprite'
import SiteHeader from '../../components/refonte/SiteHeader'
import SiteFooter from '../../components/refonte/SiteFooter'
import MobileTabBar from '../../components/refonte/MobileTabBar'
import { COURSE_ASSETS } from '../../content/courseAssets'
import { CATALOG_COURSES, PACK_OFFER } from '../../content/courseMeta'
import Navbar from '../../components/Navbar/Navbar'
import { Checkout } from './PacksSingle'
import { useState } from 'react'

const ROW_COPY = {
  'layer-cake': {
    desktop: 'Apprenez à réaliser un layer cake stable, élégant et gourmand.',
    mobile: 'Construire, garnir et lisser un layer cake stable et élégant.',
  },
  'flower-cupcake': {
    desktop: 'Maîtrisez l’art du pochage floral et créez des cupcakes spectaculaires.',
    mobile: 'Pochage floral, harmonie des couleurs et composition d’un bouquet gourmand.',
  },
  'wedding-cake': {
    desktop: 'Réalisez une pièce montée élégante, stable et prête pour le transport.',
    mobile: 'Préparer une pièce élégante, stable et prête pour le transport.',
  },
}

const CHECKOUT_ITEMS = CATALOG_COURSES.map((course) => ({
  id: course.id,
  title: course.title,
  price: course.price,
}))

export default function Packs() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const buy = params.get('acheter')
  const buyingPack = buy === 'trio'
  const buyingCourse = CATALOG_COURSES.find((course) => course.id === buy)

  if (buyingPack || buyingCourse) {
    const items = buyingPack
      ? CHECKOUT_ITEMS
      : [{ id: buyingCourse.id, title: buyingCourse.title, price: buyingCourse.price }]
    const total = buyingPack ? PACK_OFFER.price : buyingCourse.price
    return (
      <div className="packs-page">
        <Navbar />
        <Checkout
          items={items}
          total={total}
          customer={customer}
          setCustomer={setCustomer}
          onBack={() => navigate(buyingCourse ? `/formations/${buyingCourse.slug}` : '/packs')}
        />
      </div>
    )
  }

  return (
    <div className="bl page-f">
      <IconSprite />
      <SiteHeader variant="bar" />

      <main className="f-main">
        <figure className="silk-tr only-d" aria-hidden="true">
          <img src={COURSE_ASSETS.decor.silk} alt="" width="412" height="416" />
        </figure>
        <div className="f-wrap">
          <nav className="crumbs" aria-label="Fil d’Ariane">
            <Link to="/">Accueil</Link><span>/</span><span>Nos formations</span>
          </nav>
          <h1 className="f-title">Nos formations</h1>
          <p className="f-sub">Des formations complètes pour développer votre talent <br className="only-d" />et créer des pâtisseries d’exception.</p>

          <div className="rows">
            {CATALOG_COURSES.map((course) => {
              const assets = COURSE_ASSETS[course.id]
              const copy = ROW_COPY[course.id]
              return (
                <article className="row" data-course={course.id} key={course.id}>
                  <figure className="ph">
                    <img src={assets.rowDesktop} alt={assets.alt} width="720" height="880" loading={course.id === 'layer-cake' ? 'eager' : 'lazy'} decoding="async" />
                  </figure>
                  <div className="row-body">
                    <h3 className={course.id === 'layer-cake' ? undefined : 'bx'}>{course.title}</h3>
                    <p className="desc">
                      <span className="only-d">{copy.desktop}</span>
                      <span className="only-m">{copy.mobile}</span>
                    </p>
                    <ul className="stack">
                      <li><Ico name="i-chapters" className={course.id === 'layer-cake' ? 'bx' : ''} />{course.chapterLabel}</li>
                      <li><Ico name="i-clock" className="bx" />{course.duration}</li>
                    </ul>
                    <div className="row-foot">
                      <p className="price">{course.priceLabel}</p>
                      <Link className="btn btn--bx only-d" to={`/formations/${course.slug}`}>
                        Voir la formation <Ico name="i-arrow" className="arr" />
                      </Link>
                      <Link className="round-btn only-m" to={`/formations/${course.slug}`} aria-label={`Voir la formation ${course.title}`}>
                        <span><Ico name="i-arrow" /></span>
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <section className="pack2 only-d" aria-labelledby="pack-title">
            <h3 id="pack-title">{PACK_OFFER.title}</h3>
            <span className="rule" aria-hidden="true" />
            <figure className="tile t1 ph">
              <img src={COURSE_ASSETS.pack.tiles[0]} alt="Layer cake" width="721" height="879" loading="lazy" />
            </figure>
            <span className="petal" aria-hidden="true" />
            <figure className="tile t2 ph">
              <img src={COURSE_ASSETS.pack.tiles[1]} alt="Wedding cake" width="1440" height="1920" loading="lazy" />
            </figure>
            <figure className="tile t3 ph">
              <img src={COURSE_ASSETS.pack.tiles[2]} alt="Bouquet de cupcakes floraux" width="1320" height="1531" loading="lazy" />
            </figure>
            <ul className="list">
              {CATALOG_COURSES.map((course) => (
                <li key={course.id}><Ico name="i-check" />{course.title}</li>
              ))}
            </ul>
            <span className="badge">{PACK_OFFER.discountLabel}</span>
            <p className="p2price"><strong>{PACK_OFFER.priceLabel}</strong><s>{PACK_OFFER.crossedLabel}</s></p>
            <Link className="btn btn--champ" to="/formations/pack-complet">
              Découvrir le pack <Ico name="i-arrow" className="arr" />
            </Link>
          </section>

          <Link className="mpack only-m" to="/packs?acheter=trio" aria-label={`${PACK_OFFER.title}, les 3 formations, ${PACK_OFFER.priceLabel}`}>
            <figure className="ph">
              <img src={COURSE_ASSETS.pack.mobile} alt="" width="296" height="308" loading="lazy" />
            </figure>
            <div className="mpack-body">
              <h3>Pack Complet</h3>
              <p className="sub">Les 3 formations</p>
              <span className="mbadge">{PACK_OFFER.discountLabel}</span>
              <hr />
              <p className="mprice">
                <s>{PACK_OFFER.crossedLabel}</s>
                <strong>{PACK_OFFER.priceLabel}</strong>
                <Ico name="i-chev" className="chev" />
              </p>
            </div>
          </Link>
        </div>
        <figure className="roses-bl only-d" aria-hidden="true">
          <img src={COURSE_ASSETS.decor.roses} alt="" width="408" height="288" loading="lazy" />
        </figure>
      </main>

      <SiteFooter />
      <MobileTabBar active="formations" />
    </div>
  )
}
