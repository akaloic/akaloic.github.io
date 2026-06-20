// Chaînes d'interface FR / EN. Le contenu des projets (descriptions) vit dans
// data.ts (bilingue aussi). La langue est pilotée par App (état + localStorage).
export type Lang = 'fr' | 'en'

export const STRINGS = {
  en: {
    role: 'Platform · MLOps',
    heroEyebrow: 'Platform & MLOps Engineer',
    heroLede:
      "I build the platforms that ship machine learning to production: Kubernetes, GitOps and data pipelines. Scroll to grow the tree of everything I've built.",
    selectedProjects: '06 selected projects',
    liveDemo: 'Live demo',
    source: 'Source',
    viewSource: 'View source',
    contactEyebrow: "Let's grow something together",
    contactTitle: ['Open to Platform, DevOps', '& MLOps opportunities'],
    contactSub:
      'Apprentice Engineer @ Crédit Agricole CIB · Master MIAGE, Paris-Saclay · Based in Paris, France.',
    langLabel: 'Language',
  },
  fr: {
    role: 'Platform · MLOps',
    heroEyebrow: 'Ingénieur Platform & MLOps',
    heroLede:
      "Je construis les plateformes qui amènent le machine learning en production : Kubernetes, GitOps et pipelines de données. Fais défiler pour faire pousser l'arbre de tout ce que j'ai construit.",
    selectedProjects: '06 projets sélectionnés',
    liveDemo: 'Voir le site',
    source: 'Code',
    viewSource: 'Voir le code',
    contactEyebrow: 'Faisons pousser quelque chose ensemble',
    contactTitle: ['Ouvert aux opportunités', 'Platform, DevOps & MLOps'],
    contactSub:
      'Ingénieur en alternance @ Crédit Agricole CIB · Master MIAGE, Paris-Saclay · Basé à Paris, France.',
    langLabel: 'Langue',
  },
} as const

export type UIStrings = (typeof STRINGS)[Lang]
