# Images Inspirations (export)

Toutes les visuels de la galerie **Inspirations** sont stockés localement pour export et réutilisation.

## Dossier

`public/inspirations/`

Servis sur le site via : `https://votre-domaine/inspirations/nom-du-fichier.png`

## Fichiers enregistrés

| Fichier | Usage |
|---------|--------|
| `wedding-lace-fruits-3-etages.png` | Wedding — dentelle, fruits, 3 étages |
| `wedding-prune-figues-automne.png` | Wedding / Italian — prune, figues |
| `wedding-tour-macarons-floral.png` | Wedding / Italian — tour macarons |
| `wedding-botanique-3-etages.png` | Wedding / Italian — botanique |
| `italian-millefoglie-mariage-baies.png` | Italian — millefoglie mariage |
| `wedding-coeur-framboises-noeuds.png` | Wedding — cœur framboises |
| `wedding-lambeth-framboises-2-etages.png` | Wedding — lambeth 2 étages |
| `wedding-coeur-framboises-classique.png` | Wedding — cœur classique |
| `italian-lambeth-vintage-pastel.png` | Italian — lambeth vintage |

## Image « À la une » (spotlight)

Les fichiers locaux (~512 px de large) sont trop petits pour le grand bandeau sans flou.

Une **photo wedding cake HD** (Unsplash 1600 px) est utilisée uniquement pour ce bandeau : `INSPIRATION_SPOTLIGHT` dans `src/data/inspirations.js`.

La galerie en dessous continue d’utiliser vos images dans `public/inspirations/`.

## Code

- Données : `src/data/inspirations.js`
- Constantes export : `INSPIRATION_ASSETS`, `INSPIRATION_ITEMS`
- Composant image : `src/components/InspirationImage/InspirationImage.jsx`

## Ajouter une image

1. Déposer le fichier dans `public/inspirations/` (nom en minuscules, tirets).
2. Ajouter une entrée dans `INSPIRATION_ASSETS` puis dans `INSPIRATION_ITEMS`.
