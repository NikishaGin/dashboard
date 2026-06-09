import { CONV_CRIT, CONV_TARGET } from "./data.js"

// ============ HELPERS ============
export const ru = (n) => Math.round(n).toLocaleString("ru-RU")
export const ratingsOf = (c) => c.dist.reduce((a, b) => a + b, 0)
export const scoreSum = (c) => c.dist.reduce((a, b, i) => a + b * (i + 1), 0)

export function scaleCount(n, f) {
  return Math.max(0, Math.round(n * f))
}

export function regKey(c) {
  return "cop" + c.code.split(" ")[1]
}

export function plural(n, a, b, c) {
  n = Math.abs(n) % 100
  const n1 = n % 10
  if (n > 10 && n < 20) return c
  if (n1 > 1 && n1 < 5) return b
  if (n1 === 1) return a
  return c
}

// Build a computed view for a center (or aggregate) under a period factor
export function computeView(centers, f) {
  const dist = [0, 0, 0, 0, 0]
  let links = 0,
    susp = 0
  const respAgg = [
    { c: 0, s: 0 },
    { c: 0, s: 0 },
    { c: 0, s: 0 },
    { c: 0, s: 0 },
  ]
  let fr2 = 0,
    fcomment = 0
  centers.forEach((c) => {
    links += scaleCount(c.links, f)
    susp += scaleCount(c.susp, f)
    c.dist.forEach((d, i) => (dist[i] += scaleCount(d, f)))
    c.resp.forEach((r, i) => {
      const cc = scaleCount(r.c, f)
      respAgg[i].c += cc
      respAgg[i].s += cc * r.avg
    })
    fr2 += scaleCount(c.funnel.r2, f)
    fcomment += scaleCount(c.funnel.comment, f)
  })
  const ratings = dist.reduce((a, b) => a + b, 0)
  const ss = dist.reduce((a, b, i) => a + b * (i + 1), 0)
  const avg = ratings ? ss / ratings : 0
  const neg = dist[0] + dist[1]
  const pos = dist[3] + dist[4]
  const conv = links ? (ratings / links) * 100 : 0
  const resp = respAgg.map((r) => ({ c: r.c, avg: r.c ? r.s / r.c : 0 }))
  return {
    links,
    ratings,
    susp,
    dist,
    avg,
    neg,
    pos,
    negShare: ratings ? (neg / ratings) * 100 : 0,
    posShare: ratings ? (pos / ratings) * 100 : 0,
    neuShare: ratings ? (dist[2] / ratings) * 100 : 0,
    conv,
    resp,
    funnel: { links, r1: ratings, r2: fr2, comment: fcomment },
  }
}

export { CONV_CRIT, CONV_TARGET }
