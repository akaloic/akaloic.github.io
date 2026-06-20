// Les 6 projets sélectionnés, du tronc (haut) vers les feuilles (bas).
// `side` place la carte à gauche/droite ; `accent` colore le nœud, la branche
// et le feuillage générés autour de la carte par le moteur de l'arbre.
export type Project = {
  num: string
  tag: string
  title: string
  desc: string
  stack: string[]
  href: string
  accent: string
  side: 'left' | 'right'
}

// Ordre calé sur les dépôts épinglés de github.com/akaloic.
// num / side (alternance) / accent (palette) restent positionnels pour garder
// le rythme visuel de l'arbre ; seul le contenu suit l'ordre des épinglés.
export const PROJECTS: Project[] = [
  {
    num: '01',
    tag: 'TypeScript · Data',
    title: 'Financial Dashboard',
    desc: 'A full-stack financial data dashboard — a FastAPI API feeding a React/Vite SPA, with PostgreSQL and a SQLite fallback, deployed on GitHub Pages + Render.',
    stack: ['React', 'Vite', 'FastAPI', 'PostgreSQL'],
    href: 'https://github.com/akaloic/Financial_dashboard',
    accent: '#f0c674',
    side: 'left',
  },
  {
    num: '02',
    tag: 'Python · React',
    title: 'Pépite',
    desc: 'A real-estate watch for the Paris region — a stealth scraper and an "expert-eye" scoring engine surface undervalued listings on the La Défense axis, served through an interactive React dashboard.',
    stack: ['Python', 'React', 'Leaflet', 'Scoring'],
    href: 'https://github.com/akaloic/house-opportunity-searcher',
    accent: '#6fc9ff',
    side: 'right',
  },
  {
    num: '03',
    tag: 'Python · MLOps',
    title: 'Asset Management MLOps',
    desc: 'End-to-end MLOps pipeline for asset management — risk scoring, portfolio optimization and a BI dashboard, deployed on Azure.',
    stack: ['MLflow', 'XGBoost', 'Streamlit', 'Azure'],
    href: 'https://github.com/akaloic/asset-management-mlops',
    accent: '#4fe0b0',
    side: 'left',
  },
  {
    num: '04',
    tag: 'C',
    title: 'Order Manager',
    desc: 'An order management system in C, built on binary trees with careful data-structure design and manual memory management.',
    stack: ['Binary Trees', 'Data Structures', 'Memory'],
    href: 'https://github.com/akaloic/projet_gestionnaire_commande',
    accent: '#ff9b7a',
    side: 'right',
  },
  {
    num: '05',
    tag: 'C',
    title: 'Process Manager',
    desc: 'A Unix process manager and mini-shell in C — job control, pipes and signal handling implemented from the ground up.',
    stack: ['Unix', 'Pipes', 'Signals', 'Shell'],
    href: 'https://github.com/akaloic/projet_gestionnaire_processus',
    accent: '#b69bff',
    side: 'left',
  },
  {
    num: '06',
    tag: 'OCaml',
    title: 'DNA Analysis',
    desc: 'DNA sequence analysis built in OCaml — a functional-programming exploration of bioinformatics algorithms.',
    stack: ['Functional', 'Algorithms', 'Bioinformatics'],
    href: 'https://github.com/akaloic/projets_adn',
    accent: '#cfe06a',
    side: 'right',
  },
]
