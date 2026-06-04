import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import './Mentions.css'

const SECTIONS = [
  {
    title: 'Éditeur du site',
    content: (
      <>
        <p>
          <strong>Nom :</strong> Bel Âge Pâtisserie
          <br />
          <strong>Forme juridique :</strong> Entrepreneur individuel
          <br />
          <strong>SIREN :</strong> 890 061 872
          <br />
          <strong>SIRET :</strong> 890 061 872 00036
          <br />
          <strong>Numéro TVA intracommunautaire :</strong> FR86890061872
          <br />
          <strong>Dirigeant :</strong> Miriam Belhadj
          <br />
          <strong>Adresse :</strong> 10 Rue de l&apos;Arménie, 84000 Avignon, France
          <br />
          <strong>Email :</strong>{' '}
          <a href="mailto:contact@belage-patisserie.fr">contact@belage-patisserie.fr</a>
          <br />
          <strong>Activité :</strong> Services des traiteurs (NAF 5621Z)
          <br />
          <strong>Date de création :</strong> 06 janvier 2021
        </p>
        <p>
          <em>
            Ce site est actuellement un prototype non commercial, présenté à titre de
            démonstration. Aucune transaction financière n&apos;est effectuée via ce site.
          </em>
        </p>
      </>
    ),
  },
  {
    title: 'Hébergement',
    content: (
      <p>
        Hébergeur : [À compléter lors du déploiement]
        <br />
        (ex. Vercel, Netlify, OVH…)
      </p>
    ),
  },
  {
    title: 'Propriété intellectuelle',
    content: (
      <p>
        L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo, icônes)
        est la propriété exclusive de Bel Âge Pâtisserie ou de ses partenaires. Toute
        reproduction, même partielle, est interdite sans autorisation écrite préalable.
      </p>
    ),
  },
  {
    id: 'confidentialite',
    title: 'Données personnelles — RGPD',
    content: (
      <>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
          Informatique et Libertés, vous disposez d&apos;un droit d&apos;accès, de
          rectification et de suppression de vos données personnelles.
        </p>
        <p>
          Les données collectées via les formulaires de ce site sont utilisées uniquement
          dans le cadre de la mise en relation entre clients et pâtissières.
        </p>
        <p>
          Pour exercer vos droits, contactez-nous à :{' '}
          <a href="mailto:contact@belage-patisserie.fr">contact@belage-patisserie.fr</a>
        </p>
        <p>
          Vous pouvez également adresser une réclamation à la CNIL :{' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            www.cnil.fr
          </a>
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies',
    content: (
      <p>
        Ce site utilise des cookies techniques nécessaires à son fonctionnement. Aucun cookie
        publicitaire ou de tracking tiers n&apos;est utilisé sans votre consentement
        préalable.
      </p>
    ),
  },
  {
    id: 'cgu',
    title: 'Conditions générales d\'utilisation',
    content: (
      <>
        <p>
          En accédant à ce site, vous acceptez les présentes conditions d&apos;utilisation.
        </p>
        <p>
          Bel Âge Pâtisserie agit en qualité d&apos;intermédiaire entre les clients et les
          pâtissières indépendantes. Nous ne sommes pas partie aux contrats conclus entre les
          utilisateurs et les prestataires.
        </p>
        <p>
          Les pâtissières sont responsables de la qualité de leurs prestations. Bel Âge
          Pâtisserie décline toute responsabilité quant aux transactions effectuées
          directement entre les parties.
        </p>
        <p>
          Bel Âge Pâtisserie se réserve le droit de modifier ces CGU à tout moment. Les
          utilisateurs seront informés par email de toute modification substantielle.
        </p>
      </>
    ),
  },
  {
    title: 'Résolution des litiges',
    content: (
      <>
        <p>
          En cas de litige, une solution amiable sera recherchée avant tout recours
          judiciaire.
        </p>
        <p>
          Conformément à l&apos;article L.612-1 du Code de la Consommation, vous pouvez
          recourir gratuitement à un médiateur de la consommation.
        </p>
        <p>
          Juridiction compétente : Tribunal de commerce d&apos;Avignon.
          <br />
          Droit applicable : Droit français.
        </p>
      </>
    ),
  },
]

export default function Mentions() {
  return (
    <div className="mentions-page">
      <Navbar />
      <main className="mentions-content">
        <h1 className="mentions-content__title">Mentions légales &amp; CGU</h1>
        <p className="mentions-content__date">Dernière mise à jour : juin 2025</p>
        <div className="mentions-content__line" />

        {SECTIONS.map((section) => (
          <section
            key={section.title}
            id={section.id}
            className="mentions-section"
          >
            <h2>{section.title}</h2>
            {section.content}
          </section>
        ))}
      </main>
      <Footer />
    </div>
  )
}
