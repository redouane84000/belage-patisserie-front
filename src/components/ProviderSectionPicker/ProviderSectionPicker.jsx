import { PROVIDER_SECTIONS } from '../../data/providerSections'
import './ProviderSectionPicker.css'

export default function ProviderSectionPicker({
  activeId,
  onChange,
  className = '',
  ariaLabel = 'Catégorie de prestataire',
}) {
  return (
    <div
      className={`provider-sections ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel}
    >
      {PROVIDER_SECTIONS.map((section) => (
        <button
          key={section.id}
          type="button"
          role="tab"
          aria-selected={activeId === section.id}
          className={`provider-sections__btn ${activeId === section.id ? 'is-active' : ''}`}
          onClick={() => onChange(section.id)}
        >
          {section.shortLabel}
        </button>
      ))}
    </div>
  )
}
