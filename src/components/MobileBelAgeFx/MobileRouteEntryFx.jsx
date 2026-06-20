import { useLocation } from 'react-router-dom'
import { useBelAgeMobileFx } from '../../hooks/useMediaQuery'
import MobileHeroFx from './MobileHeroFx'

/** Pages avec hero FX intégré — évite le doublon à l’entrée */
const SKIP_ROUTE_PREFIXES = ['/packs']

export default function MobileRouteEntryFx() {
  const isMobile = useBelAgeMobileFx()
  const { pathname } = useLocation()

  if (!isMobile) return null
  if (SKIP_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null

  return <MobileHeroFx key={pathname} variant="route" />
}
