// TODO: remplacer les timestamps et contenus provisoires par ceux de la vidéo finale.
export const LAYER_CAKE_CHAPTERS = [
  { id: 1, number: '01', title: 'Préparation', startTime: 0, endTime: 300, objective: '', steps: [], warning: '', takeaway: '' },
  { id: 2, number: '02', title: 'Préparation du gâteau', startTime: 300, endTime: 900, objective: '', steps: [], warning: '', takeaway: '' },
  { id: 3, number: '03', title: 'Garnissage & montage', startTime: 900, endTime: 1620, objective: '', steps: [], warning: '', takeaway: '' },
  { id: 4, number: '04', title: 'Lissage', startTime: 1620, endTime: 2220, objective: '', steps: [], warning: '', takeaway: '' },
  { id: 5, number: '05', title: 'Finitions / décoration', startTime: 2220, endTime: 2640, objective: '', steps: [], warning: '', takeaway: '' },
]

export const formatChapterTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
