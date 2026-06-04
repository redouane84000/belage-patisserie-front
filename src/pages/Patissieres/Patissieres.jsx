import { useMobileLayout } from '../../hooks/useMediaQuery'
import PatissieresDesktop from './desktop/PatissieresDesktop'
import PatissieresMobile from './mobile/PatissieresMobile'

/**
 * Route /patissieres — aiguille vers deux implémentations isolées :
 * - desktop/  : grille 3 col, fiches complètes (≥768px)
 * - mobile/   : liste iOS, bottom sheet (<768px)
 */
export default function Patissieres() {
  const isMobile = useMobileLayout()
  return isMobile ? <PatissieresMobile /> : <PatissieresDesktop />
}
