import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { PROJECTS } from './data'
import { STRINGS, type Lang } from './i18n'
import { useGrowingTree } from './useGrowingTree'

// Autorise les variables CSS (`--accent`) dans les styles inline typés.
type WithVars = CSSProperties & { [key: `--${string}`]: string }

const HERO_CHIPS = ['Kubernetes', 'ArgoCD', 'Python', 'Azure']

function readInitialLang(): Lang {
  try {
    const s = localStorage.getItem('lang')
    if (s === 'fr' || s === 'en') return s
  } catch {
    /* localStorage indisponible */
  }
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('fr')) return 'fr'
  return 'en'
}

// Toggle FR/EN : pill « liquid glass » avec indicateur qui glisse.
function LangToggle({ lang, onChange, label }: { lang: Lang; onChange: (l: Lang) => void; label: string }) {
  return (
    <div className="lang" role="group" aria-label={label}>
      <span className="lang__slider" data-lang={lang} aria-hidden="true" />
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          className={`lang__btn ${lang === l ? 'is-active' : ''}`}
          aria-pressed={lang === l}
          onClick={() => onChange(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState<Lang>(readInitialLang)
  const t = STRINGS[lang]

  const root = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const front = useRef<HTMLDivElement>(null)
  const prog = useRef<HTMLDivElement>(null)
  const bg = useRef<HTMLCanvasElement>(null)

  const rebuildTree = useGrowingTree({ root, svg, front, prog, bg })

  // Au changement de langue : persiste, met à jour <html lang> et re-mesure
  // l'arbre (le texte traduit change la hauteur des cartes → positions des nœuds).
  useEffect(() => {
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang
    const id = window.setTimeout(() => rebuildTree(), 70)
    return () => window.clearTimeout(id)
  }, [lang, rebuildTree])

  // Spotlight « verre » qui suit le curseur sur chaque carte (sans re-render React).
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.card'))
    const onMove = (e: Event) => {
      const me = e as MouseEvent
      const el = e.currentTarget as HTMLElement
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${me.clientX - r.left}px`)
      el.style.setProperty('--my', `${me.clientY - r.top}px`)
    }
    cards.forEach((c) => c.addEventListener('mousemove', onMove))
    return () => cards.forEach((c) => c.removeEventListener('mousemove', onMove))
  }, [])

  return (
    <>
      {/* barre de progression du scroll */}
      <div className="progress">
        <div ref={prog} className="progress__fill" />
      </div>

      <nav className="nav">
        <div className="nav__brand glass">
          <div className="nav__logo">LJ</div>
          <div>
            <div className="nav__name">Loïc Jiraud</div>
            <div className="nav__role">{t.role}</div>
          </div>
        </div>

        <div className="nav__cluster glass">
          <LangToggle lang={lang} onChange={setLang} label={t.langLabel} />
          <span className="nav__divider" aria-hidden="true" />
          <a className="nav__link" href="https://github.com/akaloic" target="_blank" rel="noopener">
            GitHub ↗
          </a>
          <a
            className="nav__link"
            href="https://www.linkedin.com/in/loic-jiraud-528710274/"
            target="_blank"
            rel="noopener"
          >
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
          <div className="hero__eyebrow">{t.heroEyebrow}</div>
          <h1 className="hero__title">Loïc Jiraud</h1>
          <p className="hero__lede">{t.heroLede}</p>
          <div className="hero__chips">
            {HERO_CHIPS.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
          <div className="hero__scroll">
            <span className="hero__scroll-label">{t.selectedProjects}</span>
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
              <p className="card__desc">{p.desc[lang]}</p>
              <div className="card__tags">
                {p.stack.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
              <div className="card__actions">
                {p.live && (
                  <a className="card__cta" href={p.live} target="_blank" rel="noopener">
                    {t.liveDemo} ↗
                  </a>
                )}
                <a className="card__link" href={p.href} target="_blank" rel="noopener">
                  {p.live ? t.source : t.viewSource} ↗
                </a>
              </div>
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
          <div className="contact__eyebrow">{t.contactEyebrow}</div>
          <h2 className="contact__title">
            {t.contactTitle[0]}
            <br />
            {t.contactTitle[1]}
          </h2>
          <p className="contact__sub">{t.contactSub}</p>
          <div className="contact__actions">
            <a className="btn btn--primary" href="https://github.com/akaloic" target="_blank" rel="noopener">
              GitHub ↗
            </a>
            <a
              className="btn btn--ghost"
              href="https://www.linkedin.com/in/loic-jiraud-528710274/"
              target="_blank"
              rel="noopener"
            >
              LinkedIn ↗
            </a>
          </div>
        </section>
      </div>
    </>
  )
}
