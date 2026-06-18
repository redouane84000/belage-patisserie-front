import { useCallback, useMemo, useRef, useState } from 'react'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import { useCalculatorStore } from '../CalculatorContext'
import { eur } from '../engine/format'
import CompanyPicker, { CompanyFields } from './CompanyPicker'
import { computeInvoice } from './computeInvoice'
import { downloadInvoicePdf, printInvoice } from './exportInvoice'
import {
  ADHOC_COMPANY_ID,
  blankCustomCompany,
  blankInvoice,
  blankInvoiceLine,
  invoicePdfName,
} from './invoiceDefaults'
import { findCompanyById, saveInvoiceRecord, upsertCustomCompany } from './invoiceStorage'
import './invoice.css'

function formatAddress(text) {
  if (!text) return null
  const lines = text.split('\n')
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ))
}

function resolveActiveCompany(invoice) {
  if (invoice.companyId === ADHOC_COMPANY_ID) {
    const adhoc = invoice.adhocCompany || blankCustomCompany()
    return {
      ...adhoc,
      id: ADHOC_COMPANY_ID,
      name: adhoc.name?.trim() || 'Mon entreprise',
    }
  }
  return findCompanyById(invoice.companyId)
}

export default function InvoiceBuilder({ onBack, draft }) {
  const { toast } = useCalculatorStore()
  const printRef = useRef(null)
  const isCompact = useMediaQuery('(max-width: 1023px)')
  const [mobilePane, setMobilePane] = useState('form')
  const [invoice, setInvoice] = useState(blankInvoice)
  const [customVersion, setCustomVersion] = useState(0)
  const [showNewCo, setShowNewCo] = useState(false)
  const [newCo, setNewCo] = useState(blankCustomCompany())
  const [exporting, setExporting] = useState(false)

  const company = useMemo(() => resolveActiveCompany(invoice), [invoice, customVersion])
  const totals = computeInvoice(invoice)

  const patch = useCallback((patchObj) => {
    setInvoice((inv) => ({ ...inv, ...patchObj }))
  }, [])

  const patchLine = (id, field, value) => {
    setInvoice((inv) => ({
      ...inv,
      lines: inv.lines.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    }))
  }

  const addLine = () => patch({ lines: [...invoice.lines, blankInvoiceLine()] })
  const removeLine = (id) => {
    if (invoice.lines.length <= 1) return
    patch({ lines: invoice.lines.filter((l) => l.id !== id) })
  }

  const importFromDraft = () => {
    if (!draft?.name) return
    const line = {
      ...blankInvoiceLine(),
      label: draft.name,
      qty: 1,
      unitPrice: +draft.currentPrice || +draft.suggested || 0,
    }
    patch({ lines: [line, ...invoice.lines.filter((l) => l.label || l.unitPrice)] })
  }

  const saveNewCompany = () => {
    const name = newCo.name.trim()
    if (!name) return
    const id = newCo.id || `co-${Date.now()}`
    upsertCustomCompany({ ...newCo, id, name })
    setCustomVersion((v) => v + 1)
    patch({ companyId: id })
    setShowNewCo(false)
    setNewCo(blankCustomCompany())
    toast('Entreprise enregistrée')
  }

  const openSaveCompany = () => {
    if (invoice.companyId === ADHOC_COMPANY_ID && invoice.adhocCompany?.name) {
      setNewCo({ ...blankCustomCompany(), ...invoice.adhocCompany })
    } else {
      setNewCo(blankCustomCompany())
    }
    setShowNewCo(true)
  }

  const ensurePreviewReady = async () => {
    if (isCompact && mobilePane !== 'preview') {
      setMobilePane('preview')
      await new Promise((r) => setTimeout(r, 350))
    }
    return printRef.current
  }

  const handleSavePdf = async () => {
    setExporting(true)
    try {
      const el = await ensurePreviewReady()
      const saved = saveInvoiceRecord(invoice)
      patch({ savedId: saved.savedId })
      await downloadInvoicePdf(el, invoicePdfName(invoice, company?.name))
      toast('Facture enregistrée et PDF téléchargé')
    } catch (err) {
      console.error(err)
      toast('Erreur lors de l\'enregistrement PDF')
    } finally {
      setExporting(false)
    }
  }

  const handlePrint = async () => {
    setExporting(true)
    try {
      const el = await ensurePreviewReady()
      printInvoice(el)
      toast('Impression lancée')
    } catch (err) {
      console.error(err)
      toast('Erreur lors de l\'impression')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className={`invoice-builder${isCompact ? ' invoice-builder--compact' : ''}`}>
      <div className="invoice-builder__toolbar no-print">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Retour
        </button>
        {isCompact && (
          <div className="invoice-mobile-tabs">
            <button
              type="button"
              className={`invoice-mobile-tabs__btn${mobilePane === 'form' ? ' is-active' : ''}`}
              onClick={() => setMobilePane('form')}
            >
              Formulaire
            </button>
            <button
              type="button"
              className={`invoice-mobile-tabs__btn${mobilePane === 'preview' ? ' is-active' : ''}`}
              onClick={() => setMobilePane('preview')}
            >
              Aperçu facture
            </button>
          </div>
        )}
        <div className="invoice-builder__actions">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={exporting}
            onClick={handleSavePdf}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3v12M8 11l4 4 4-4M4 21h16" />
            </svg>
            Enregistrer PDF
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={exporting}
            onClick={handlePrint}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Imprimer
          </button>
        </div>
      </div>

      <div className="invoice-builder__grid">
        <div className={`invoice-form no-print${isCompact && mobilePane !== 'form' ? ' invoice-form--hidden' : ''}`}>
          <CompanyPicker
            companyId={invoice.companyId}
            adhocCompany={invoice.adhocCompany}
            customVersion={customVersion}
            onSelectCompany={(id) => patch({ companyId: id })}
            onAdhocChange={(adhocCompany) => patch({ adhocCompany, companyId: ADHOC_COMPANY_ID })}
            onOpenSaveCompany={openSaveCompany}
          />

          <section className="invoice-form__block">
            <div className="invoice-form__eyebrow">Client</div>
            <h3 className="invoice-form__title">Destinataire de la facture</h3>
            <div className="invoice-form__row">
              <div className="field">
                <label>N° facture</label>
                <input
                  className="inp"
                  placeholder="FAC-2026-001"
                  value={invoice.number}
                  onChange={(e) => patch({ number: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Date</label>
                <input
                  className="inp"
                  type="date"
                  value={invoice.date}
                  onChange={(e) => patch({ date: e.target.value })}
                />
              </div>
            </div>
            <div className="field">
              <label>Nom du client</label>
              <input
                className="inp"
                placeholder="Mme Dupont"
                value={invoice.clientName}
                onChange={(e) => patch({ clientName: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Adresse du client</label>
              <textarea
                className="inp invoice-textarea"
                rows={3}
                placeholder="Adresse de facturation"
                value={invoice.clientAddress}
                onChange={(e) => patch({ clientAddress: e.target.value })}
              />
            </div>
          </section>

          <section className="invoice-form__block">
            <div className="invoice-form__head">
              <div>
                <div className="invoice-form__eyebrow">Prestations</div>
                <h3 className="invoice-form__title">Produits & services</h3>
              </div>
              {draft?.name && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={importFromDraft}>
                  Importer le calcul
                </button>
              )}
            </div>
            <div className="invoice-lines">
              <div className="invoice-lines__head" aria-hidden>
                <span>Désignation</span>
                <span>Qté</span>
                <span>Prix HT</span>
                <span />
              </div>
              {invoice.lines.map((line) => (
                <div key={line.id} className="invoice-line">
                  <input
                    className="inp"
                    placeholder="Layer cake 20 parts…"
                    value={line.label}
                    onChange={(e) => patchLine(line.id, 'label', e.target.value)}
                  />
                  <input
                    className="inp invoice-line__qty"
                    type="number"
                    min="0"
                    step="1"
                    value={line.qty}
                    onChange={(e) => patchLine(line.id, 'qty', e.target.value)}
                  />
                  <input
                    className="inp invoice-line__price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    value={line.unitPrice || ''}
                    onChange={(e) => patchLine(line.id, 'unitPrice', e.target.value)}
                  />
                  <button
                    type="button"
                    className="invoice-line__del"
                    onClick={() => removeLine(line.id)}
                    aria-label="Supprimer la ligne"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-ghost btn-sm invoice-add-line" onClick={addLine}>
              + Ajouter une ligne
            </button>
          </section>

          <section className="invoice-form__block invoice-form__block--vat">
            <div className="invoice-form__eyebrow">Montants</div>
            <h3 className="invoice-form__title">TVA & notes</h3>
            <label className="invoice-toggle">
              <input
                type="checkbox"
                checked={invoice.vatEnabled}
                onChange={(e) => patch({ vatEnabled: e.target.checked })}
              />
              <span>Appliquer la TVA sur cette facture</span>
            </label>
            {invoice.vatEnabled && (
              <div className="field invoice-vat-rate">
                <label>Taux de TVA (%)</label>
                <input
                  className="inp"
                  type="number"
                  min="0"
                  step="0.1"
                  value={invoice.vatRate}
                  onChange={(e) => patch({ vatRate: e.target.value })}
                />
              </div>
            )}
            <div className="field">
              <label>Notes (optionnel)</label>
              <textarea
                className="inp invoice-textarea"
                rows={2}
                placeholder="IBAN, délai de paiement, merci pour votre confiance…"
                value={invoice.notes}
                onChange={(e) => patch({ notes: e.target.value })}
              />
            </div>
          </section>
        </div>

        <div
          className={`invoice-preview-wrap${isCompact && mobilePane !== 'preview' ? ' invoice-preview-wrap--hidden' : ''}`}
        >
          {!isCompact && <p className="invoice-preview-label no-print">Aperçu en direct</p>}
          <article className="invoice-sheet invoice-print-root" ref={printRef}>
            <div className="invoice-sheet__accent" aria-hidden />
            <header className="invoice-sheet__head">
              <div className="invoice-sheet__brand">
                {company?.logo ? (
                  <img src={company.logo} alt="" className="invoice-sheet__logo" crossOrigin="anonymous" />
                ) : (
                  <div className="invoice-sheet__logo-fallback">{(company?.name || 'ME').slice(0, 2)}</div>
                )}
                <div>
                  <h1 className="invoice-sheet__company">{company?.name}</h1>
                  {company?.address && <div className="invoice-sheet__meta">{formatAddress(company.address)}</div>}
                  {company?.email && <div className="invoice-sheet__meta">{company.email}</div>}
                  {company?.phone && <div className="invoice-sheet__meta">{company.phone}</div>}
                </div>
              </div>
              <div className="invoice-sheet__title-block">
                <div className="invoice-sheet__doc-title">Facture</div>
                {invoice.number && <div className="invoice-sheet__ref">N° {invoice.number}</div>}
                {invoice.date && (
                  <div className="invoice-sheet__ref">
                    {new Date(`${invoice.date}T12:00:00`).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                )}
              </div>
            </header>

            <div className="invoice-sheet__client">
              <div className="invoice-sheet__client-label">Facturé à</div>
              <div className="invoice-sheet__client-name">{invoice.clientName || '—'}</div>
              {invoice.clientAddress && (
                <div className="invoice-sheet__client-addr">{formatAddress(invoice.clientAddress)}</div>
              )}
            </div>

            <div className="invoice-sheet__table-wrap">
              <table className="invoice-sheet__table">
                <thead>
                  <tr>
                    <th>Désignation</th>
                    <th>Qté</th>
                    <th>Prix unit. HT</th>
                    <th>Total HT</th>
                  </tr>
                </thead>
                <tbody>
                  {totals.lines.map((line) => (
                    <tr key={line.id}>
                      <td>{line.label || '—'}</td>
                      <td>{line.qty}</td>
                      <td>{eur(line.unitPrice)}</td>
                      <td>{eur(line.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="invoice-sheet__totals">
              <div className="invoice-sheet__total-row">
                <span>Sous-total HT</span>
                <span>{eur(totals.subtotal)}</span>
              </div>
              {invoice.vatEnabled && (
                <div className="invoice-sheet__total-row">
                  <span>TVA ({totals.vatRate} %)</span>
                  <span>{eur(totals.vatAmount)}</span>
                </div>
              )}
              <div className="invoice-sheet__total-row invoice-sheet__total-row--grand">
                <span>Total {invoice.vatEnabled ? 'TTC' : 'HT'}</span>
                <span>{eur(totals.total)}</span>
              </div>
            </div>

            {invoice.notes && <footer className="invoice-sheet__notes">{invoice.notes}</footer>}
          </article>

          {isCompact && mobilePane === 'preview' && (
            <div className="invoice-mobile-export">
              <button type="button" className="btn btn-ghost" disabled={exporting} onClick={handleSavePdf}>
                Enregistrer PDF
              </button>
              <button type="button" className="btn btn-primary" disabled={exporting} onClick={handlePrint}>
                Imprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {showNewCo && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowNewCo(false)}>
          <div className="modal invoice-modal" role="dialog" aria-modal="true">
            <div className="modal-head">
              <div className="title serif">Enregistrer une entreprise</div>
            </div>
            <div className="modal-body">
              <p className="invoice-form__hint">Réutilisable dans « Entreprise perso » pour vos prochaines factures.</p>
              <CompanyFields value={newCo} onChange={setNewCo} idPrefix="new-co" />
            </div>
            <div className="modal-foot">
              <button type="button" className="btn btn-ghost" onClick={() => setShowNewCo(false)}>
                Annuler
              </button>
              <button type="button" className="btn btn-primary" onClick={saveNewCompany}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
