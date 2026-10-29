import { Link } from 'react-router-dom'
import IconSprite, { Ico } from '../../components/refonte/IconSprite'
import SiteHeader from '../../components/refonte/SiteHeader'
import SiteFooter from '../../components/refonte/SiteFooter'
import MobileTabBar from '../../components/refonte/MobileTabBar'
import { COURSE_ASSETS } from '../../content/courseAssets'
import { CATALOG_COURSES, PACK_OFFER } from '../../content/courseMeta'

const CARD_COPY = {
  'layer-cake': 'Apprenez à réaliser un layer cake stable, élégant et gourmand.',
  'flower-cupcake': 'Maîtrisez l’art du pochage floral et créez des cupcakes spectaculaires.',
  'wedding-cake': 'Réalisez une pièce montée élégante, stable et prête pour le transport.',
}

export default function Home() {
  return (
    <div className="bl page-home">
      <IconSprite />
      <SiteHeader />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <figure className="hero-photo">
            <picture>
              <source media="(max-width:767px)" srcSet={COURSE_ASSETS.home.heroMobile} />
              <img
                src={COURSE_ASSETS.home.hero}
                alt="Pièce montée florale aux roses et fruits rouges"
                width="1408"
                height="1392"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </figure>
          <span className="petal p1" aria-hidden="true" />
          <span className="petal p2" aria-hidden="true" />
          <span className="petal p3" aria-hidden="true" />

          <div className="hero-in">
            <p className="eyebrow">Formations en <span className="gold">ligne</span></p>
            <h1 className="h1" id="hero-title">
              <span className="only-d">
                <span className="ln"><span className="ivory">Pâtisserie</span></span>
                <span className="ln"><span className="gold">d’exception</span></span>
              </span>
              <span className="only-m m">Maîtrisez l’art de la pâtisserie créative</span>
            </h1>
            <p className="lead">
              <span className="only-d">Apprenez à créer des gâteaux élégants, raffinés et gourmands grâce à des formations complètes, accessibles à votre rythme.</span>
              <span className="only-m">Des formations complètes pour créer des gâteaux élégants, raffinés et gourmands, à votre rythme.</span>
            </p>
            <Link className="btn btn--champ hero-cta" to="/packs">
              Découvrir nos formations <Ico name="i-arrow" className="arr" />
            </Link>
          </div>

          <ul className="feats">
            <li><Ico name="i-pro" /><span>Formations<br />professionnelles</span></li>
            <li><Ico name="i-books" /><span>3 formations<br />complètes</span></li>
            <li><Ico name="i-clock" /><span>À votre<br />rythme</span></li>
          </ul>

          <svg className="wave" viewBox="0 0 1440 96" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 96V58C260 74 560 78 860 62S1290 22 1440 30v66z" fill="#F8EFE9" />
            <path d="M700 70C960 58 1180 30 1440 34" fill="none" stroke="rgba(226,190,140,.55)" strokeWidth="1.4" />
          </svg>
        </section>

        <section className="sec" id="formations" aria-labelledby="sec-title">
          <div className="wrap">
            <div className="sec-head">
              <div className="reveal">
                <p className="kicker">Nos formations</p>
                <h2 className="h2" id="sec-title">Des savoir-faire <em>uniques</em></h2>
              </div>
              <p className="sec-aside reveal">3 formations pour développer<br />votre créativité et votre expertise.</p>
            </div>

            <div className="cards">
              {CATALOG_COURSES.map((course) => {
                const assets = COURSE_ASSETS[course.id]
                return (
                  <article className="card" data-course={course.id} key={course.id}>
                    <figure className="ph">
                      <img src={assets.cardDesktop} alt={assets.alt} width="721" height="879" loading="lazy" decoding="async" />
                    </figure>
                    <span className="sheen" aria-hidden="true" />
                    <div className="card-body">
                      <h3>{course.title}</h3>
                      <p className="desc">{CARD_COPY[course.id]}</p>
                      <ul className="meta">
                        <li><Ico name="i-clock" className="i-bx" />{course.duration}</li>
                        <li><Ico name="i-chapters" className="i-gold" />{course.chapterLabel}</li>
                      </ul>
                      <div className="card-foot">
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
          </div>

          <div className="pack-zone">
            <div className="pack only-d">
              <figure className="ph">
                <img src={COURSE_ASSETS.pack.banner} alt="Layer cake aux fruits rouges" width="721" height="879" loading="lazy" />
              </figure>
              <span className="petal pp" aria-hidden="true" />
              <figure className="ph decor" aria-hidden="true">
                <img src={COURSE_ASSETS.pack.decor} alt="" width="332" height="512" loading="lazy" />
              </figure>
              <div className="pack-body">
                <h3>{PACK_OFFER.title}</h3>
                <p className="pack-desc">Accédez aux 3 formations et maîtrisez toutes les techniques de la pâtisserie moderne.</p>
                <ul className="meta">
                  <li><Ico name="i-books" />3 formations</li>
                  <li><Ico name="i-clock" />À votre rythme</li>
                </ul>
                <div className="pack-buy">
                  <p className="pack-price"><strong>{PACK_OFFER.priceLabel}</strong><s>{PACK_OFFER.crossedLabel}</s></p>
                  <Link className="btn btn--champ" to="/formations/pack-complet">
                    Découvrir le pack <Ico name="i-arrow" className="arr" />
                  </Link>
                </div>
              </div>
            </div>

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
        </section>
      </main>

      <SiteFooter />
      <MobileTabBar active="home" />
    </div>
  )
}
