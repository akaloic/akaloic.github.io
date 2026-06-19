# akaloic.github.io — Portfolio

Portfolio vitrine de **Loïc Jiraud** — Platform & MLOps Engineer.
Une page unique, scroll-driven : un **arbre génératif** pousse au défilement et
relie chaque projet, avec un fond de spores en canvas et un tronc/branches en SVG.

> Implémenté à partir du design Claude Design `Portfolio.dc.html`, porté sur la
> même stack que [house-opportunity-searcher](https://github.com/akaloic/house-opportunity-searcher) :
> **Vite + React 18 + TypeScript**, déployé sur **GitHub Pages**.

## Stack

- **Vite 5** + **React 18** + **TypeScript** (strict)
- Aucune dépendance lourde : l'arbre (SVG + canvas) est écrit à la main
  dans [`src/useGrowingTree.ts`](src/useGrowingTree.ts)
- Typographies : Sora + JetBrains Mono (Google Fonts)

## Structure

```
src/
  main.tsx            # point d'entrée React
  App.tsx             # markup (hero, 6 projets, contact)
  data.ts             # contenu des projets
  useGrowingTree.ts   # moteur de l'arbre qui pousse (scroll/rAF, impératif)
  index.css           # design system (thème sombre teal)
.github/workflows/
  deploy-pages.yml    # build + déploiement GitHub Pages
```

## Développement

```bash
npm install
npm run dev        # http://localhost:5175
```

## Build

```bash
npm run build      # tsc (typecheck) + vite build → dist/
npm run preview    # sert le build de production en local
```

## Déploiement

Push sur `main` → le workflow GitHub Actions build le site et le déploie sur
**https://akaloic.github.io**. La source Pages est réglée sur « GitHub Actions ».
