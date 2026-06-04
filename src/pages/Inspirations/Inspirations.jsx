import InspirationsDesktop from './desktop/InspirationsDesktop'

/**
 * Route /inspirations — markup desktop unique ;
 * le rendu mobile est géré par CSS (@media max-width 767px).
 */
export default function Inspirations() {
  return <InspirationsDesktop />
}
