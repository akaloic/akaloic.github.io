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

export const PROJECTS: Project[] = [
  {
    num: '01',
    tag: 'Python · MLOps',
    title: 'Asset Management MLOps',
    desc: 'End-to-end MLOps pipeline for asset management — risk scoring, portfolio optimization and a BI dashboard, deployed on Azure.',
    stack: ['MLflow', 'XGBoost', 'Streamlit', 'Azure'],
    href: 'https://github.com/akaloic/asset-management-mlops',
    accent: '#f0c674',
    side: 'left',
  },
  {
    num: '02',
    tag: 'C',
    title: 'Order Manager',
    desc: 'An order management system in C, built on binary trees with careful data-structure design and manual memory management.',
    stack: ['Binary Trees', 'Data Structures', 'Memory'],
    href: 'https://github.com/akaloic/projet_gestionnaire_commande',
    accent: '#6fc9ff',
    side: 'right',
  },
  {
    num: '03',
    tag: 'C',
    title: 'Process Manager',
    desc: 'A Unix process manager and mini-shell in C — job control, pipes and signal handling implemented from the ground up.',
    stack: ['Unix', 'Pipes', 'Signals', 'Shell'],
    href: 'https://github.com/akaloic/projet_gestionnaire_processus',
    accent: '#4fe0b0',
    side: 'left',
  },
  {
    num: '04',
    tag: 'Java',
    title: 'Peggle Clone',
    desc: 'A Java clone of Peggle — physics-based ball shooting with real collision detection and a custom game loop.',
    stack: ['Physics', 'Collision', 'Game Loop'],
    href: 'https://github.com/akaloic/projet_peggle',
    accent: '#ff9b7a',
    side: 'right',
  },
  {
    num: '05',
    tag: 'Java',
    title: 'Slither Online',
    desc: 'A multiplayer Slither.io-style game in Java with a client/server architecture running over raw sockets.',
    stack: ['Sockets', 'Client/Server', 'Multiplayer'],
    href: 'https://github.com/akaloic/projet_slither_online',
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
