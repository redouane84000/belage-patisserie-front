export const FLOWER_CUPCAKE_CHAPTERS = [
  ['01','Introduction à la formation Flower Cupcake','00:00','00:47','Présentation du Flower Cupcake, des techniques enseignées et du bouquet final.'],
  ['02','Préparation de la pâte à cupcakes','00:47','03:48','Appareil vanillé, œufs, lait, farine tamisée et texture homogène sans grumeaux.'],
  ['03','Mise en caissettes & cuisson des cupcakes','03:48','07:00','Moules, caissettes, dosage régulier et cuisson de cupcakes bien formés.'],
  ['04','Préparation de la crème au beurre','07:00','15:00','Beurre blanchi, sucre glace tamisé, blanc d’œuf en poudre et crème adaptée au pochage.'],
  ['05','Coloration des crèmes pour le pochage','15:00','18:00','Séparation de la crème, associations de teintes et préparation des poches.'],
  ['06','Pochage de l’hortensia trois couleurs','18:00','20:00','Technique multicolore, positionnement et régularité du pochage Hortensia.'],
  ['07','Dahlia & techniques de pétales','20:00','≈ 30:00','Dahlia, orientation de la poche, pression, superposition et volumes floraux.'],
  ['08','Roses, tulipes & variations florales','≈ 30:00','39:00','Roses, tulipes, variations de pétales et diversification du bouquet.'],
  ['09','Composition de l’ensemble floral','≈ 39:00','45:00','Équilibre des couleurs, disposition et préparation des cupcakes pour le bouquet.'],
  ['10','Montage & emballage du bouquet Flower Cupcake','≈ 45:00','Fin','Support, feuilles de soie, installation, équilibre visuel et présentation finale.'],
].map(([number, title, startTime, endTime, objective]) => ({ id: Number(number), number, title, startTime, endTime, objective, ingredients: [], steps: [objective], warning: '', takeaway: '' }))
