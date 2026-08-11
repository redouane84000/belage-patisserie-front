export const TRAINING_COURSES = [
  {
    id: 'layer-cake',
    title: 'Layer Cake',
    eyebrow: 'Les bases professionnelles',
    description: 'Construire, garnir et lisser un layer cake stable et élégant.',
    videoOrientation: 'portrait',
    modules: [
      { id: 'bases', title: 'Les fondations', lessons: [
        { id: 'equipment', title: 'Préparer son plan de travail', duration: '08 min', description: 'Organisez votre matériel pour travailler avec précision et sérénité.', materials: ['Plateau tournant', 'Spatule coudée', 'Lisseur', 'Niveau à gâteau'], ingredients: ['Génoises refroidies', 'Crème adaptée au montage'], tips: ['Travaillez toujours sur un support stable.'], commonMistakes: ['Commencer le montage avec une crème trop souple.'] },
        { id: 'assembly', title: 'Monter un layer cake droit', duration: '18 min', description: 'Les gestes clés pour des étages réguliers et une structure solide.', materials: ['Plateau tournant', 'Spatule coudée'], ingredients: ['Génoises', 'Crème de garniture'], tips: ['Contrôlez l’alignement à chaque couche.'], commonMistakes: ['Trop charger la garniture au centre.'] },
      ] },
      { id: 'finish', title: 'Lissage & finitions', lessons: [
        { id: 'smoothing', title: 'Le lissage net', duration: '14 min', description: 'Obtenez une surface régulière et prête à décorer.', materials: ['Lisseur haut', 'Spatule coudée'], ingredients: ['Crème de couverture'], tips: ['Refroidissez entre chaque étape de lissage.'], commonMistakes: ['Insister sur une crème déjà trop chaude.'] },
      ] },
    ],
  },
  {
    id: 'flower-cupcake',
    title: 'Flower Cupcake',
    eyebrow: 'Le bouquet qui se vend',
    description: 'Pochage floral, harmonie des couleurs et composition d’un bouquet gourmand.',
    videoOrientation: 'portrait',
    modules: [{ id: 'flowers', title: 'Pochage floral', lessons: [
      { id: 'petals', title: 'Réaliser des pétales réguliers', duration: '12 min', description: 'Maîtrisez la pression et l’angle de poche pour des fleurs délicates.', materials: ['Poches', 'Douilles pétales', 'Clou à fleur'], ingredients: ['Crème au beurre ferme', 'Colorants gel'], tips: ['Testez votre pression sur une assiette avant chaque fleur.'], commonMistakes: ['Utiliser une crème trop tiède.'] },
    ] }],
  },
  {
    id: 'wedding-cake',
    title: 'Wedding Cake',
    eyebrow: 'Pièces montées événementielles',
    description: 'Préparer une pièce élégante, stable et prête pour le transport.',
    videoOrientation: 'landscape',
    modules: [{ id: 'structure', title: 'Structure & sécurité', lessons: [
      { id: 'supports', title: 'Choisir les supports adaptés', duration: '10 min', description: 'Préparez une structure sûre avant de monter les étages.', materials: ['Semelles', 'Tiges de soutien', 'Niveau'], ingredients: ['Gâteaux refroidis', 'Ganache de couverture'], tips: ['Préparez une marge de sécurité pour le transport.'], commonMistakes: ['Sous-estimer le poids de l’étage supérieur.'] },
    ] }],
  },
]

export const courseById = (id) => TRAINING_COURSES.find((course) => course.id === id)
