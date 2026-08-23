export const WEDDING_CAKE_CHAPTERS = [
  ['01','Introduction & préparation de la pièce montée',0,61,'Présentation de la formation, structure générale, dimensions des trois étages et organisation.'],
  ['02','Réalisation des génoises',61,427,'Calcul des quantités, montée des œufs, incorporation de la farine, chemisage, remplissage et cuisson.'],
  ['03','Crème au beurre russe : stabilité et préparation',427,655,'Choix de la crème, foisonnement du beurre, lait concentré sucré et texture finale stable.'],
  ['04','Chantilly mascarpone au chocolat',655,802,'Mascarpone, crème, sucre glace, chocolat et texture ferme pour la garniture.'],
  ['05','Montage, garniture & boudins de sécurité',802,1216,'Démoulage, découpe, imbibage, garniture, boudins de sécurité et première couche anti-miettes.'],
  ['06','Supports & technique de montage renforcé',1216,1640,'Cake boards, dimensions, découpe, passage central et préparation de la tige/dowel.'],
  ['07','Montage des différents étages & garnitures',1640,2365,'Montage des niveaux, garnitures, boudins, astuce Kinder croustillant, crumb coat et froid.'],
  ['08','Lissage professionnel & angles droits',2365,2788,'Crème au beurre, spatule, lisseur inox, plateau tournant, correction et angles droits.'],
  ['09','Dowels, renforts & assemblage des trois étages',2788,2946,'Mesure, découpe, placement des dowels et empilage autour de la tige centrale.'],
  ['10','Décoration Vintage Cake & techniques de pochage',2946,3273,'Douilles, pochage entre étages, guirlandes, repères, double pochage et finitions.'],
  ['11','Résultat final & conseils de fin',3273,3301,'Présentation de la pièce montée terminée et conseils pour réutiliser les techniques.'],
  ['12','Bonus — Recette de la crème BBC',3301,3354,'Beurre, margarine, vanille, foisonnement, lait concentré sucré et texture blanche satinée.'],
].map(([number, title, startTime, endTime, objective]) => ({ id: Number(number), number, title, startTime, endTime, objective, ingredients: [], steps: [objective], warning: '', takeaway: '' }))

export const formatWeddingTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
