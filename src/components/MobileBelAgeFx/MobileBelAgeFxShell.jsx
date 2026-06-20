import MobileRouteEntryFx from './MobileRouteEntryFx'
import MobileTapFx from './MobileTapFx'

/** FX Bel Âge — mobile responsive uniquement (<1024px), toutes les pages */
export default function MobileBelAgeFxShell() {
  return (
    <>
      <MobileRouteEntryFx />
      <MobileTapFx />
    </>
  )
}
