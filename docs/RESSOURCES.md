# Ressources Bel Âge (référence projet)

Enregistrées pour intégration future (CTA, pages Rejoindre, Contact, etc.).

| Ressource | Détail |
|-----------|--------|
| **Calendly — nouvelle réunion** | https://calendly.com/redouanektm/nouvelle-reunion |
| **Ebook premium (PDF)** | `public/documents/ebook-bel-age-patisserie-premium.pdf` |
| **Constantes JS** | `src/data/resources.js` |

### Usage dans le code

```js
import { CALENDLY_NOUVELLE_REUNION, EBOOK_PREMIUM } from '../data/resources'

// Lien RDV
window.open(CALENDLY_NOUVELLE_REUNION, '_blank')

// Téléchargement ebook
<a href={EBOOK_PREMIUM.url} download>Télécharger l'ebook</a>
```
