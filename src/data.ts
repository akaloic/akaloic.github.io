import type { Lang } from './i18n'

// Les 6 projets sélectionnés, du tronc (haut) vers les feuilles (bas).
// Ordre calé sur les dépôts épinglés de github.com/akaloic (épingler quant-engine
// en premier pour refléter ce nouvel ordre).
// `num` / `side` (alternance) / `accent` (palette) restent positionnels pour
// préserver le rythme visuel de l'arbre ; seul le contenu suit l'ordre épinglé.
// `live` (optionnel) = site déployé → fait apparaître un 2ᵉ bouton « Voir le site ».
export type Project = {
  num: string
  tag: string
  title: string
  desc: Record<Lang, string>
  stack: string[]
  href: string
  live?: string
  accent: string
  side: 'left' | 'right'
}

export const PROJECTS: Project[] = [
  {
    num: '01',
    tag: 'Python · Quant',
    title: 'Quant Trading Engine',
    desc: {
      en: 'An event-driven backtesting & paper-trading engine for systematic strategies (momentum, mean-reversion, pairs, an XGBoost signal), fed by an Airflow-orchestrated medallion data pipeline (raw/validated/curated) with enforced data-quality contracts. Realistic execution costs, risk management and full analytics. The same loop powers backtest and live, so research-to-live parity is built in.',
      fr: "Un moteur de backtesting et de paper-trading event-driven pour stratégies systématiques (momentum, mean-reversion, pairs, signal XGBoost), alimenté par un pipeline de données medallion orchestré avec Airflow (raw/validated/curated) et des contrats de qualité de données. Coûts d'exécution réalistes, gestion du risque et analytics complets. La même boucle pilote backtest et live, d'où une parité recherche-vers-live intégrée.",
    },
    stack: ['Python', 'Airflow', 'FastAPI', 'Docker', 'MLflow'],
    href: 'https://github.com/akaloic/quant-engine',
    accent: '#f0c674',
    side: 'left',
  },
  {
    num: '02',
    tag: 'TypeScript · Data',
    title: 'FinSight',
    desc: {
      en: 'A full-stack financial data dashboard: a FastAPI API feeding a React/Vite SPA, with PostgreSQL and a SQLite fallback, deployed on GitHub Pages + Render.',
      fr: "Un tableau de bord de données financières full-stack : une API FastAPI alimente une SPA React/Vite, avec PostgreSQL et un repli SQLite, déployé sur GitHub Pages + Render.",
    },
    stack: ['React', 'Vite', 'FastAPI', 'PostgreSQL'],
    href: 'https://github.com/akaloic/Financial_dashboard',
    live: 'https://akaloic.github.io/Financial_dashboard/',
    accent: '#6fc9ff',
    side: 'right',
  },
  {
    num: '03',
    tag: 'Python · React',
    title: 'Pépite',
    desc: {
      en: 'A real-estate watch for the Paris region: a stealth scraper and an "expert-eye" scoring engine surface undervalued listings on the La Défense axis, served through an interactive React dashboard.',
      fr: "Une veille immobilière pour l'Île-de-France : un scraper furtif et un moteur de scoring « œil de l'expert » font remonter les biens sous-évalués sur l'axe La Défense, servis dans un dashboard React interactif.",
    },
    stack: ['Python', 'React', 'Leaflet', 'Scoring'],
    href: 'https://github.com/akaloic/house-opportunity-searcher',
    live: 'https://akaloic.github.io/house-opportunity-searcher/',
    accent: '#4fe0b0',
    side: 'left',
  },
  {
    num: '04',
    tag: 'Python · MLOps',
    title: 'Asset Management MLOps',
    desc: {
      en: 'End-to-end MLOps pipeline for asset management: risk scoring, portfolio optimization and a BI dashboard, deployed on Azure.',
      fr: "Pipeline MLOps de bout en bout pour la gestion d'actifs : scoring du risque, optimisation de portefeuille et dashboard BI, déployé sur Azure.",
    },
    stack: ['MLflow', 'XGBoost', 'Streamlit', 'Azure'],
    href: 'https://github.com/akaloic/asset-management-mlops',
    accent: '#ff9b7a',
    side: 'right',
  },
  {
    num: '05',
    tag: 'C',
    title: 'Order Manager',
    desc: {
      en: 'An order management system in C, built on binary trees with careful data-structure design and manual memory management.',
      fr: 'Un système de gestion de commandes en C, bâti sur des arbres binaires avec une conception soignée des structures de données et une gestion manuelle de la mémoire.',
    },
    stack: ['Binary Trees', 'Data Structures', 'Memory'],
    href: 'https://github.com/akaloic/projet_gestionnaire_commande',
    accent: '#b69bff',
    side: 'left',
  },
  {
    num: '06',
    tag: 'C',
    title: 'Process Manager',
    desc: {
      en: 'A Unix process manager and mini-shell in C: job control, pipes and signal handling implemented from the ground up.',
      fr: 'Un gestionnaire de processus Unix et un mini-shell en C : contrôle des tâches, pipes et gestion des signaux implémentés de zéro.',
    },
    stack: ['Unix', 'Pipes', 'Signals', 'Shell'],
    href: 'https://github.com/akaloic/projet_gestionnaire_processus',
    accent: '#cfe06a',
    side: 'right',
  },
]
