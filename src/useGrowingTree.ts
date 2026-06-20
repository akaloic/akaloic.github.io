import { useCallback, useEffect, useRef, type RefObject } from 'react'

// Moteur de l'« arbre qui pousse » au scroll. Porté à l'identique depuis la
// logique Claude Design (DCLogic) vers un effet React impératif piloté par refs :
//   • un tronc SVG dessiné de la graine (hero) jusqu'au nœud final (contact),
//   • une branche + un feuillage de particules vers chaque carte projet,
//   • un fond canvas de spores, des « motes » qui remontent la sève,
//   • la croissance révélée par le scroll (stroke-dashoffset + opacité des cartes).
// Tout le dessin reste hors de React (nœuds DOM/SVG créés à la main) ; le composant
// ne se re-rend jamais, donc React ne touche pas à ces nœuds.

const NS = 'http://www.w3.org/2000/svg'

type Foliage = { el: HTMLDivElement; x: number; y: number; ph: number; dr: number }
type Branch = { path: SVGPathElement; len: number; y: number; card: HTMLElement; fol: Foliage[]; f: number }
type Mote = { el: HTMLDivElement; off: number; spd: number }
type Spore = { x: number; y: number; r: number; vy: number; a: number; tw: number; ph: number; depth: number; sp: number }

export interface TreeRefs {
  root: RefObject<HTMLDivElement>
  svg: RefObject<SVGSVGElement>
  front: RefObject<HTMLDivElement>
  prog: RefObject<HTMLDivElement>
  bg: RefObject<HTMLCanvasElement>
}

export function useGrowingTree(refs: TreeRefs): () => void {
  const { root, svg, front, prog, bg } = refs
  const rebuildRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x))

    let ready = false
    let raf = 0
    let rebuildTimer: ReturnType<typeof setTimeout> | undefined

    // (re)construits à chaque build()
    let branches: Branch[] = []
    let foliageNodes: HTMLElement[] = []
    let trunk: { path: SVGPathElement; len: number } | null = null
    let seedY = 0
    let endY = 0
    let maxScroll = 1
    let wob: (y: number) => number = (y) => y
    let growthY = 0
    let tf = 0

    // créés une seule fois
    let motes: Mote[] | null = null
    let spores: Spore[] | null = null
    let sprites: HTMLCanvasElement[] = []
    let bgctx: CanvasRenderingContext2D | null = null
    let bgEl: HTMLCanvasElement | null = null

    const sizeBg = () => {
      if (!bgEl || !bgctx) return
      const d = Math.min(window.devicePixelRatio, 2)
      bgEl.width = window.innerWidth * d
      bgEl.height = window.innerHeight * d
      bgEl.style.width = window.innerWidth + 'px'
      bgEl.style.height = window.innerHeight + 'px'
      bgctx.setTransform(d, 0, 0, d, 0, 0)
    }

    const sprite = (color: string) => {
      const s = document.createElement('canvas')
      s.width = s.height = 32
      const g = s.getContext('2d')!
      const grd = g.createRadialGradient(16, 16, 0, 16, 16, 16)
      grd.addColorStop(0, color)
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, 32, 32)
      return s
    }

    const initSpores = () => {
      sprites = [
        sprite('rgba(120,255,225,0.9)'),
        sprite('rgba(154,211,106,0.7)'),
        sprite('rgba(180,235,255,0.85)'),
      ]
      const w = window.innerWidth
      const h = window.innerHeight
      const arr: Spore[] = []
      for (let i = 0; i < 72; i++) {
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 6 + Math.random() * 15,
          vy: 0.08 + Math.random() * 0.26,
          a: 0.12 + Math.random() * 0.4,
          tw: 0.5 + Math.random() * 1.4,
          ph: Math.random() * 6.28,
          depth: 0.02 + Math.random() * 0.13,
          sp: (Math.random() * 3) | 0,
        })
      }
      spores = arr
    }

    const drawSpores = (t: number, sy: number) => {
      if (!bgctx || !spores) return
      const w = window.innerWidth
      const h = window.innerHeight
      bgctx.clearRect(0, 0, w, h)
      bgctx.globalCompositeOperation = 'lighter'
      spores.forEach((p) => {
        p.y -= p.vy
        if (p.y < -20) p.y = h + 20
        const dy = (((p.y - sy * p.depth) % h) + h) % h
        const a = p.a * (0.5 + 0.5 * Math.sin(t * p.tw + p.ph))
        bgctx!.globalAlpha = Math.max(0, a)
        const x = p.x + Math.sin(t * 0.3 + p.ph) * 8
        bgctx!.drawImage(sprites[p.sp], x - p.r, dy - p.r, p.r * 2, p.r * 2)
      })
      bgctx.globalAlpha = 1
      bgctx.globalCompositeOperation = 'source-over'
    }

    const build = () => {
      const rootEl = root.current
      const svgEl = svg.current
      if (!rootEl || !svgEl) return

      const W = rootEl.clientWidth
      const H = rootEl.scrollHeight
      svgEl.setAttribute('width', String(W))
      svgEl.setAttribute('height', String(H))
      svgEl.style.width = W + 'px'
      svgEl.style.height = H + 'px'
      svgEl.innerHTML = ''
      foliageNodes.forEach((n) => n.remove())
      foliageNodes = []

      bgEl = bg.current
      if (bgEl) {
        bgctx = bgEl.getContext('2d')
        sizeBg()
        if (!spores) initSpores()
      }

      const rr = rootEl.getBoundingClientRect()
      const offX = rr.left + window.scrollX
      const offY = rr.top + window.scrollY
      const pt = (el: Element) => {
        const r = el.getBoundingClientRect()
        return {
          x: r.left + window.scrollX - offX + r.width / 2,
          y: r.top + window.scrollY - offY + r.height / 2,
        }
      }

      const seedEl = rootEl.querySelector('[data-seed]')
      const endEl = rootEl.querySelector('[data-end]')
      if (!seedEl || !endEl) return
      const seed = pt(seedEl)
      const end = pt(endEl)
      const amp = W < 760 ? 8 : 18
      const span = Math.max(1, end.y - seed.y)
      // la ligne de base va exactement de la graine au nœud final ; l'ondulation
      // s'annule aux deux extrémités pour que le tronc touche le centre de chaque point.
      wob = (y: number) => {
        const u = clamp((y - seed.y) / span, 0, 1)
        const center = seed.x + (end.x - seed.x) * u
        return center + Math.sin((y - seed.y) / 260) * amp * Math.sin(Math.PI * u)
      }

      let d = 'M ' + seed.x + ' ' + seed.y
      for (let y = seed.y + 14; y < end.y; y += 14) d += ' L ' + wob(y) + ' ' + y
      d += ' L ' + end.x + ' ' + end.y

      const mk = (dStr: string, color: string, w: number, bright: boolean) => {
        const p = document.createElementNS(NS, 'path')
        p.setAttribute('d', dStr)
        p.setAttribute('fill', 'none')
        p.setAttribute('stroke', color)
        p.setAttribute('stroke-width', String(w))
        p.setAttribute('stroke-linecap', 'round')
        if (bright) p.style.filter = 'drop-shadow(0 0 4px ' + color + ') drop-shadow(0 0 10px ' + color + ')'
        svgEl.appendChild(p)
        return p
      }

      // base sombre + tronc lumineux
      mk(d, 'rgba(52,227,192,0.13)', 3, false)
      const trunkPath = mk(d, '#34e3c0', 2.6, true)
      const trunkLen = trunkPath.getTotalLength()
      trunkPath.style.strokeDasharray = String(trunkLen)
      trunkPath.style.strokeDashoffset = String(trunkLen)

      branches = []
      rootEl.querySelectorAll<HTMLElement>('[data-card]').forEach((card) => {
        const dot = card.querySelector('[data-dot]')
        if (!dot) return
        card.style.transform = 'none' // mesurer le nœud à sa position finale, pas en cours de révélation
        const n = pt(dot)
        const tx = wob(n.y)
        const color = getComputedStyle(dot).backgroundColor
        const c1x = tx + (n.x - tx) * 0.42
        const c2x = n.x - (n.x - tx) * 0.42
        const bd =
          'M ' + tx + ' ' + n.y + ' C ' + c1x + ' ' + (n.y - 10) + ', ' + c2x + ' ' + (n.y + 10) + ', ' + n.x + ' ' + n.y
        mk(bd, color.replace('rgb', 'rgba').replace(')', ',0.12)'), 2.4, false)
        const bp = mk(bd, color, 2, true)
        const bl = bp.getTotalLength()
        bp.style.strokeDasharray = String(bl)
        bp.style.strokeDashoffset = String(bl)

        // feuillage autour du nœud projet
        const fol: Foliage[] = []
        for (let i = 0; i < 10; i++) {
          const ang = Math.random() * Math.PI * 2
          const rad = 14 + Math.random() * 66
          const fx = n.x + Math.cos(ang) * rad
          const fy = n.y + Math.sin(ang) * rad * 0.82
          const el = document.createElement('div')
          const sz = (2 + Math.random() * 2.6).toFixed(1)
          el.style.cssText =
            'position:absolute; z-index:2; width:' +
            sz +
            'px; height:' +
            sz +
            'px; border-radius:50%; background:' +
            color +
            '; box-shadow:0 0 7px 1px ' +
            color +
            '; opacity:0; pointer-events:none; transform:translate(-50%,-50%);'
          rootEl.appendChild(el)
          foliageNodes.push(el)
          fol.push({ el, x: fx, y: fy, ph: Math.random() * 6.28, dr: 6 + Math.random() * 9 })
        }
        branches.push({ path: bp, len: bl, y: n.y, card, fol, f: 0 })
      })

      trunk = { path: trunkPath, len: trunkLen }
      seedY = seed.y
      endY = end.y
      maxScroll = document.documentElement.scrollHeight - window.innerHeight

      // motes (sève remontant le tronc)
      if (!motes) {
        const arr: Mote[] = []
        for (let i = 0; i < 6; i++) {
          const m = document.createElement('div')
          m.style.cssText =
            'position:absolute; z-index:2; width:4px; height:4px; border-radius:50%; background:#bdfff0; box-shadow:0 0 8px 2px #34e3c0; opacity:0; pointer-events:none; transform:translate(-50%,-50%);'
          rootEl.appendChild(m)
          arr.push({ el: m, off: Math.random(), spd: 0.04 + Math.random() * 0.05 })
        }
        motes = arr
      }

      ready = true
      update()
    }

    // croissance pilotée par le scroll — tourne à chaque event scroll (jamais throttlé)
    const update = () => {
      if (!ready || !trunk) return
      const sy = window.scrollY
      const max = maxScroll || 1
      const ih = window.innerHeight
      growthY = sy + ih * 0.74 // le front de croissance mène vers le tiers inférieur
      tf = clamp((growthY - seedY) / (endY - seedY), 0, 1)
      trunk.path.style.strokeDashoffset = String(trunk.len * (1 - tf))

      branches.forEach((b) => {
        // une branche ne s'allume que lorsque le front est passé sous sa jonction
        const f = clamp((growthY - b.y) / (ih * 0.26), 0, 1)
        b.f = f
        b.path.style.strokeDashoffset = String(b.len * (1 - f))
        const side = b.card.dataset.side === 'right' ? 1 : -1
        b.card.style.opacity = String(f)
        b.card.style.transform = 'translate(' + side * 44 * (1 - f) + 'px,' + 26 * (1 - f) + 'px)'
      })

      const frontEl = front.current
      if (frontEl) {
        if (tf > 0.001 && tf < 0.999) {
          frontEl.style.opacity = '1'
          frontEl.style.left = wob(growthY) + 'px'
          frontEl.style.top = growthY + 'px'
        } else {
          frontEl.style.opacity = '0'
        }
      }

      const progEl = prog.current
      if (progEl) progEl.style.width = (clamp(sy / max, 0, 1) * 100).toFixed(2) + '%'
    }

    // rAF — mouvement ambiant (spores, scintillement du feuillage, motes)
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!ready) return
      const t = performance.now() * 0.001
      const sy = window.scrollY
      if (spores) drawSpores(t, sy)
      update()

      branches.forEach((b) => {
        const f = b.f || 0
        b.fol.forEach((lf) => {
          const tw = 0.45 + 0.55 * Math.sin(t * 2 + lf.ph)
          lf.el.style.opacity = (f * tw).toFixed(2)
          lf.el.style.left = lf.x + Math.sin(t * 0.6 + lf.ph) * lf.dr + 'px'
          lf.el.style.top = lf.y + Math.cos(t * 0.5 + lf.ph) * lf.dr * 0.55 + 'px'
        })
      })

      if (motes) {
        motes.forEach((m) => {
          const f = (m.off + t * m.spd) % 1
          const y = seedY + (growthY - seedY) * f
          if (y < seedY || y > endY || f > tf) {
            m.el.style.opacity = '0'
            return
          }
          m.el.style.opacity = (0.4 + 0.6 * Math.sin(f * Math.PI)).toFixed(2)
          m.el.style.left = wob(y) + 'px'
          m.el.style.top = y + 'px'
        })
      }
    }

    // rebuild impératif exposé à React (appelé au changement de langue : le
    // texte traduit modifie la hauteur des cartes → il faut re-mesurer l'arbre)
    rebuildRef.current = () => build()

    // montage — on attend la mise en page (et les polices) avant de mesurer
    const kickoff = () => build()
    const t0 = setTimeout(kickoff, 80)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setTimeout(kickoff, 60))
    const onLoad = () => setTimeout(kickoff, 60)
    window.addEventListener('load', onLoad)
    const onResize = () => {
      if (rebuildTimer) clearTimeout(rebuildTimer)
      rebuildTimer = setTimeout(kickoff, 120)
    }
    window.addEventListener('resize', onResize)
    const onScroll = () => update()
    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t0)
      if (rebuildTimer) clearTimeout(rebuildTimer)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      foliageNodes.forEach((n) => n.remove())
      foliageNodes = []
      if (motes) {
        motes.forEach((m) => m.el.remove())
        motes = null
      }
      const svgEl = svg.current
      if (svgEl) svgEl.innerHTML = ''
      rebuildRef.current = null
    }
  }, [root, svg, front, prog, bg])

  return useCallback(() => rebuildRef.current?.(), [])
}
