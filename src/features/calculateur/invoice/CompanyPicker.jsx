import { useEffect, useMemo, useState } from 'react'
import { ADHOC_COMPANY_ID, blankCustomCompany } from './invoiceDefaults'
import { filterAnnuaireCompanies } from './invoiceAnnuaire'
import { getCompanyLists } from './invoiceStorage'

function readLogoFile(file, cb) {
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => cb(reader.result)
  reader.readAsDataURL(file)
}

function tabForCompanyId(id) {
  if (id === ADHOC_COMPANY_ID || (!String(id).startsWith('annuaire-') && id)) return 'autre'
  return 'annuaire'
}

function CompanyCard({ company, selected, onClick, index = 0 }) {
  return (
    <button
      type="button"
      className={`invoice-co-card${selected ? ' is-selected' : ''}`}
      style={{ '--i': index }}
      onClick={onClick}
    >
      <div className="invoice-co-card__logo">
        {company.logo ? (
          <img src={company.logo} alt="" crossOrigin="anonymous" />
        ) : (
          <span>{(company.name || '?').slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      <div className="invoice-co-card__body">
        <div className="invoice-co-card__name">{company.name}</div>
        {company.ville && <div className="invoice-co-card__meta">{company.ville}</div>}
      </div>
      {company.category && <span className="invoice-co-card__tag">{company.category}</span>}
      {selected && (
        <span className="invoice-co-card__sel" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </button>
  )
}

function CompanyStack({ title, count, companies, companyId, onSelect }) {
  return (
    <div className="invoice-co-section">
      <h4 className="invoice-co-section__title">
        {title}
        <span>{count}</span>
      </h4>
      <div className="invoice-co-grid invoice-co-grid--stack">
        {companies.map((c, i) => (
          <CompanyCard
            key={c.id}
            index={i}
            company={c}
            selected={companyId === c.id}
            onClick={() => onSelect(c.id)}
          />
        ))}
      </div>
    </div>
  )
}

function CompanyFields({ value, onChange, idPrefix = 'co' }) {
  return (
    <div className="invoice-co-fields">
      <div className="field">
        <label htmlFor={`${idPrefix}-name`}>Nom de l&apos;entreprise</label>
        <input
          id={`${idPrefix}-name`}
          className="inp"
          placeholder="Ex. Atelier Sucré Martin"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-addr`}>Adresse</label>
        <textarea
          id={`${idPrefix}-addr`}
          className="inp invoice-textarea"
          rows={2}
          placeholder="Rue, code postal, ville"
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
        />
      </div>
      <div className="invoice-form__row">
        <div className="field">
          <label htmlFor={`${idPrefix}-email`}>E-mail</label>
          <input
            id={`${idPrefix}-email`}
            className="inp"
            type="email"
            value={value.email}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor={`${idPrefix}-phone`}>Téléphone</label>
          <input
            id={`${idPrefix}-phone`}
            className="inp"
            value={value.phone}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-logo`}>Logo (optionnel)</label>
        <input
          id={`${idPrefix}-logo`}
          className="inp"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) readLogoFile(f, (logo) => onChange({ ...value, logo }))
          }}
        />
        {value.logo && <img src={value.logo} alt="" className="invoice-modal__logo-preview" />}
      </div>
    </div>
  )
}

export default function CompanyPicker({
  companyId,
  adhocCompany,
  customVersion,
  onSelectCompany,
  onAdhocChange,
  onOpenSaveCompany,
}) {
  const [search, setSearch] = useState('')
  const [sourceTab, setSourceTab] = useState(() => tabForCompanyId(companyId))

  useEffect(() => {
    setSourceTab(tabForCompanyId(companyId))
  }, [companyId])

  const { annuaire, custom } = useMemo(() => getCompanyLists(), [customVersion])

  const filteredAnnuaire = useMemo(() => filterAnnuaireCompanies(annuaire, search), [annuaire, search])
  const patissieres = filteredAnnuaire.filter((c) => c.id.startsWith('annuaire-p-'))
  const photographesList = filteredAnnuaire.filter((c) => c.id.startsWith('annuaire-ph-'))

  return (
    <section className="invoice-form__block invoice-form__block--emitter">
      <div className="invoice-form__eyebrow">Émetteur de la facture</div>
      <h3 className="invoice-form__title">Qui facture ?</h3>
      <p className="invoice-form__hint invoice-form__hint--mobile-short">
        Fiche annuaire Bel Âge ou entreprise personnalisée.
      </p>

      <div className="invoice-source-tabs" role="tablist">
        {[
          ['annuaire', 'Annuaire Bel Âge', annuaire.length],
          ['autre', 'Entreprise perso', null],
        ].map(([key, label, count]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={sourceTab === key}
            className={`invoice-source-tabs__btn${sourceTab === key ? ' is-active' : ''}`}
            onClick={() => setSourceTab(key)}
          >
            {label}
            {count != null && <span className="invoice-source-tabs__count">{count}</span>}
          </button>
        ))}
      </div>

      {sourceTab === 'annuaire' && (
        <div className="invoice-source-panel">
          <div className="invoice-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3-3" strokeLinecap="round" />
            </svg>
            <input
              className="inp invoice-search__input"
              placeholder="Rechercher une pâtissière, une ville…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="invoice-co-scroll">
            {patissieres.length > 0 && (
              <CompanyStack
                title="Pâtissières du réseau"
                count={patissieres.length}
                companies={patissieres}
                companyId={companyId}
                onSelect={onSelectCompany}
              />
            )}

            {photographesList.length > 0 && (
              <CompanyStack
                title="Photographes & vidéastes"
                count={photographesList.length}
                companies={photographesList}
                companyId={companyId}
                onSelect={onSelectCompany}
              />
            )}
          </div>

          {filteredAnnuaire.length === 0 && (
            <p className="invoice-empty">Aucune fiche ne correspond à votre recherche.</p>
          )}
        </div>
      )}

      {sourceTab === 'autre' && (
        <div className="invoice-source-panel">
          <div className="invoice-adhoc-panel">
            <div className="invoice-adhoc-panel__head">
              <div>
                <strong>Votre entreprise</strong>
                <p>Hors annuaire — saisissez librement vos coordonnées</p>
              </div>
            </div>
            <CompanyFields
              idPrefix="adhoc"
              value={adhocCompany || blankCustomCompany()}
              onChange={(co) => {
                onSelectCompany(ADHOC_COMPANY_ID)
                onAdhocChange(co)
              }}
            />
          </div>

          {custom.length > 0 && (
            <div className="invoice-co-section">
              <h4 className="invoice-co-section__title">
                Mes entreprises enregistrées
                <span>{custom.length}</span>
              </h4>
              <div className="invoice-co-grid invoice-co-grid--stack">
                {custom.map((c, i) => (
                  <CompanyCard
                    key={c.id}
                    index={i}
                    company={{ ...c, category: 'Enregistrée' }}
                    selected={companyId === c.id}
                    onClick={() => onSelectCompany(c.id)}
                  />
                ))}
              </div>
            </div>
          )}

          <button type="button" className="invoice-save-co-btn" onClick={onOpenSaveCompany}>
            <span className="invoice-save-co-btn__icon">+</span>
            <span>
              <strong>Enregistrer cette entreprise</strong>
              <small>Pour la réutiliser sur vos prochaines factures</small>
            </span>
          </button>
        </div>
      )}
    </section>
  )
}

export { CompanyFields, readLogoFile }
