import { useRef, type CSSProperties } from 'react'
import { PROJECTS } from './data'
import { useGrowingTree } from './useGrowingTree'

// Autorise les variables CSS (`--accent`) dans les styles inline typés.
type WithVars = CSSProperties & { [key: `--${string}`]: string }

const HERO_CHIPS = ['Kubernetes', 'ArgoCD', 'Python', 'Azure']

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const front = useRef<HTMLDivElement>(null)
  const prog = useRef<HTMLDivElement>(null)
  const bg = useRef<HTMLCanvasElement>(null)

  useGrowingTree({ root, svg, front, prog, bg })

  return (
    <>
      {/* barre de progression du scroll */}
      <div className="progress">
        <div ref={prog} className="progress__fill" />
      </div>

      <nav className="nav">
        <div className="nav__brand">
          <div className="nav__logo">LJ</div>
          <div>
            <div className="nav__name">Loïc Jiraud</div>
            <div className="nav__role">Platform · MLOps</div>
          </div>
        </div>
        <div className="nav__links">
          <a className="nav__link" href="https://github.com/akaloic" target="_blank" rel="noopener">
            GitHub ↗
          </a>
          <a className="nav__link" href="https://www.linkedin.com/in/loic-jiraud" target="_blank" rel="noopener">
            LinkedIn ↗
          </a>
        </div>
      </nav>

      <div ref={root} className="root">
        <canvas ref={bg} className="bg-canvas" />
        <div className="vignette" />
        <div className="noise" />

        {/* overlay de l'arbre génératif */}
        <svg ref={svg} className="tree-svg" />
        <div ref={front} className="front-node">
          <span className="front-node__ring" />
        </div>

        {/* HERO */}
        <section className="section hero" data-screen-label="Hero">
          <div className="hero__glow" />
          <div className="hero__eyebrow">Platform &amp; MLOps Engineer</div>
          <h1 className="hero__title">Loïc Jiraud</h1>
          <p className="hero__lede">
            I build the platforms that ship machine learning to production — Kubernetes, GitOps and data pipelines.
            Scroll to grow the tree of everything I&apos;ve built.
          </p>
          <div className="hero__chips">
            {HERO_CHIPS.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
          <div className="hero__scroll">
            <span className="hero__scroll-label">06 selected projects</span>
            <span className="hero__arrow">↓</span>
          </div>
          <span data-seed className="seed" />
        </section>

        {/* PROJETS */}
        {PROJECTS.map((p) => (
          <section key={p.num} className={`section project project--${p.side}`} data-screen-label={p.num}>
            <article
              data-card
              data-side={p.side}
              className={`card card--${p.side}`}
              style={{ '--accent': p.accent } as WithVars}
            >
              <div className="card__head">
                <span className="card__num">{p.num}</span>
                <span className="card__tag">{p.tag}</span>
              </div>
              <h2 className="card__title">{p.title}</h2>
              <p className="card__desc">{p.desc}</p>
              <div className="card__tags">
                {p.stack.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
              <a className="card__link" href={p.href} target="_blank" rel="noopener">
                View source ↗
              </a>
              <span data-dot className="dot" />
            </article>
          </section>
        ))}

        {/* CONTACT */}
        <section className="section contact" data-screen-label="Contact">
          <span data-end className="end" />
          <img
            className="contact__avatar"
            src="https://avatars.githubusercontent.com/u/104280676?v=4"
            alt="Loïc Jiraud"
          />
          <div className="contact__eyebrow">Let&apos;s grow something together</div>
          <h2 className="contact__title">
            Open to Platform, DevOps
            <br />
            &amp; MLOps opportunities
          </h2>
          <p className="contact__sub">
            Apprentice Engineer @ Crédit Agricole CIB · Master MIAGE, Paris-Saclay · Based in Paris, France.
          </p>
          <div className="contact__actions">
            <a className="btn btn--primary" href="https://github.com/akaloic" target="_blank" rel="noopener">
              GitHub ↗
            </a>
            <a className="btn btn--ghost" href="https://www.linkedin.com/in/loic-jiraud" target="_blank" rel="noopener">
              LinkedIn ↗
            </a>
          </div>
        </section>
      </div>
    </>
  )
}
