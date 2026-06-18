import { useState } from 'react'
import { ChevronDown, Copy, Check, MessageCircle } from 'lucide-react'
import { INSCRIPTION_SECTIONS } from '../../data/inscriptionTemplates'
import { BEL_AGE_WHATSAPP_URL } from '../../data/resources'

function whatsAppUrl(text) {
  return `${BEL_AGE_WHATSAPP_URL}?text=${encodeURIComponent(text)}`
}

export default function InscriptionStack() {
  const [activeId, setActiveId] = useState('patisserie')
  const [copiedId, setCopiedId] = useState(null)

  async function copyTemplate(section) {
    try {
      await navigator.clipboard.writeText(section.template)
      setCopiedId(section.id)
      setTimeout(() => setCopiedId(null), 2500)
    } catch {
      /* sélection manuelle */
    }
  }

  function toggle(id) {
    setActiveId((prev) => (prev === id ? null : id))
  }

  const ordered = [...INSCRIPTION_SECTIONS].sort((a, b) => {
    if (a.id === activeId) return 1
    if (b.id === activeId) return -1
    return INSCRIPTION_SECTIONS.indexOf(a) - INSCRIPTION_SECTIONS.indexOf(b)
  })

  return (
    <div className="rej-stack" role="tablist" aria-label="Modèles d'inscription par activité">
      {ordered.map((section, index) => {
        const isOpen = activeId === section.id
        const isCopied = copiedId === section.id

        return (
          <article
            key={section.id}
            className={`rej-stack__card ${isOpen ? 'is-open' : ''}`}
            style={{
              '--stack-accent': section.accent,
              '--stack-i': index,
              zIndex: isOpen ? 30 : 10 + index,
            }}
            role="tab"
            aria-selected={isOpen}
          >
            <button
              type="button"
              className="rej-stack__head"
              onClick={() => toggle(section.id)}
              aria-expanded={isOpen}
            >
              <span className="rej-stack__badge">{section.shortLabel}</span>
              <span className="rej-stack__title">{section.label}</span>
              <ChevronDown
                size={18}
                strokeWidth={2}
                className="rej-stack__chevron"
                aria-hidden
              />
            </button>

            {isOpen && (
              <div className="rej-stack__body">
                <div className="rej-stack__toolbar">
                  <p className="rej-stack__label">Message à envoyer</p>
                  <div className="rej-stack__actions">
                    <button
                      type="button"
                      className={`rej-stack__copy ${isCopied ? 'is-copied' : ''}`}
                      onClick={() => copyTemplate(section)}
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} strokeWidth={2} />
                          Copié
                        </>
                      ) : (
                        <>
                          <Copy size={14} strokeWidth={2} />
                          Copier
                        </>
                      )}
                    </button>
                    <a
                      href={whatsAppUrl(section.template)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rej-stack__wa"
                    >
                      <MessageCircle size={14} strokeWidth={2} />
                      WhatsApp
                    </a>
                  </div>
                </div>
                <pre className="rej-stack__template">{section.template}</pre>
                <p className="rej-stack__hint">{section.hint}</p>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}
