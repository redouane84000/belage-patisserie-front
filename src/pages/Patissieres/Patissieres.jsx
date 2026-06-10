import { useSearchParams } from 'react-router-dom'
import { useMobileLayout } from '../../hooks/useMediaQuery'
import {
  DEFAULT_SECTION_ID,
  getProviderSection,
  resolveSectionId,
} from '../../data/providerSections'
import PatissieresDesktop from './desktop/PatissieresDesktop'
import PatissieresMobile from './mobile/PatissieresMobile'

/**
 * Route /patissieres — aiguille vers deux implémentations isolées :
 * - desktop/  : grille 3 col, fiches complètes (≥768px)
 * - mobile/   : liste iOS, bottom sheet (<768px)
 */
export default function Patissieres() {
  const isMobile = useMobileLayout()
  const [searchParams, setSearchParams] = useSearchParams()

  const sectionId = resolveSectionId(searchParams.get('section') || DEFAULT_SECTION_ID)
  const section = getProviderSection(sectionId)

  function handleSectionChange(nextId) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (nextId === DEFAULT_SECTION_ID) next.delete('section')
      else next.set('section', nextId)
      next.delete('id')
      return next
    })
  }

  const sectionProps = {
    section,
    sectionId,
    onSectionChange: handleSectionChange,
  }

  return isMobile ? (
    <PatissieresMobile {...sectionProps} />
  ) : (
    <PatissieresDesktop {...sectionProps} />
  )
}
