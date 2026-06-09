import { ru, ratingsOf, scaleCount, regKey, CONV_CRIT, CONV_TARGET } from "../helpers.js"
import { COP_LABELS } from "../data.js"

export default function FunnelTable({ centers, periodFactor, region }) {
  const f = periodFactor

  const rows = centers.map((c) => {
    const tot = ratingsOf(c)
    const ratings = scaleCount(tot, f)
    const links = scaleCount(c.links, f)
    const susp = scaleCount(c.susp, f)
    const ss = c.dist.reduce((a, b, i) => a + b * (i + 1), 0)
    const avg = tot ? ss / tot : 0
    const conv = links ? (ratings / links) * 100 : 0
    const r2pct = c.links ? (c.funnel.r2 / c.links) * 100 : 0
    const commPct = c.links ? (c.funnel.comment / c.links) * 100 : 0
    const posS = Math.round(tot ? ((c.dist[3] + c.dist[4]) / tot) * 100 : 0)
    const negS = Math.round(tot ? ((c.dist[0] + c.dist[1]) / tot) * 100 : 0)
    const neuS = Math.max(0, 100 - posS - negS)
    const insuf = tot < 5
    const dim = region !== "all" && regKey(c) !== region
    const convCls = conv < CONV_CRIT ? "conv-crit" : conv < CONV_TARGET ? "conv-warn" : ""
    const scoreColor = avg >= 4.5 ? "#3A9E6F" : avg >= 3.5 ? "#F0A500" : "#D64045"
    return {
      c,
      label: COP_LABELS[c.code] || c.code,
      ratings,
      links,
      susp,
      avg,
      conv,
      r2pct,
      commPct,
      posS,
      neuS,
      negS,
      insuf,
      dim,
      convCls,
      scoreColor,
    }
  })

  // Итого — summary footer
  const T = { links: 0, susp: 0, linksRaw: 0, ratingsRaw: 0, r2Raw: 0, commRaw: 0, ssRaw: 0, negRaw: 0, posRaw: 0 }
  centers.forEach((c) => {
    T.links += scaleCount(c.links, f)
    T.susp += scaleCount(c.susp, f)
    T.linksRaw += c.links
    T.ratingsRaw += ratingsOf(c)
    T.r2Raw += c.funnel.r2
    T.commRaw += c.funnel.comment
    T.ssRaw += c.dist.reduce((a, b, i) => a + b * (i + 1), 0)
    T.negRaw += c.dist[0] + c.dist[1]
    T.posRaw += c.dist[3] + c.dist[4]
  })
  const tConv = T.linksRaw ? (T.ratingsRaw / T.linksRaw) * 100 : 0
  const tR2 = T.linksRaw ? (T.r2Raw / T.linksRaw) * 100 : 0
  const tComm = T.linksRaw ? (T.commRaw / T.linksRaw) * 100 : 0
  const tAvg = T.ratingsRaw ? T.ssRaw / T.ratingsRaw : 0
  const tPos = Math.round(T.ratingsRaw ? (T.posRaw / T.ratingsRaw) * 100 : 0)
  const tNegS = Math.round(T.ratingsRaw ? (T.negRaw / T.ratingsRaw) * 100 : 0)
  const tNeu = Math.max(0, 100 - tPos - tNegS)
  const tScoreColor = tAvg >= 4.5 ? "#3A9E6F" : tAvg >= 3.5 ? "#F0A500" : "#D64045"

  return (
    <section className="main-zone">
      <div className="card card-pad">
        <div className="block-head">
          <div>
            <div className="block-title">Воронка и качество по каждому ЦОП</div>
            <div className="block-sub">От выпуска ссылки до комментария · оценка качества и тональность</div>
          </div>
        </div>
        <table className="rtbl">
          <thead>
            <tr>
              <th className="l">Центр обработки</th>
              <th>Ссылок</th>
              <th>До 1-й оценки</th>
              <th>До 2-й оценки</th>
              <th>Комментарий</th>
              <th>Средняя оценка</th>
              <th>Позитив</th>
              <th>Нейтральные</th>
              <th>Негатив</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr className={r.dim ? "dim" : ""} key={i}>
                <td className="l">
                  <div className="r-cop">
                    <div className="r-cop-txt">
                      <span className="code">{r.label}</span>
                    </div>
                  </div>
                </td>
                <td>{ru(r.links)}</td>
                <td className={r.convCls}>{r.conv.toFixed(1)}%</td>
                <td>{r.r2pct.toFixed(1)}%</td>
                <td>{r.commPct.toFixed(1)}%</td>
                <td>
                  <span style={{ color: r.scoreColor, fontWeight: 500 }}>{r.avg.toFixed(2)}</span>
                </td>
                <td>
                  <span style={{ color: "#3A9E6F", fontWeight: 500 }}>{r.posS}%</span>
                </td>
                <td>
                  <span style={{ color: "var(--muted)", fontWeight: 500 }}>{r.neuS}%</span>
                </td>
                <td>
                  <span style={{ color: "#D64045", fontWeight: 500 }}>{r.negS}%</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="rtbl-total">
              <td className="l">Итого</td>
              <td>{ru(T.links)}</td>
              <td>{tConv.toFixed(1)}%</td>
              <td>{tR2.toFixed(1)}%</td>
              <td>{tComm.toFixed(1)}%</td>
              <td>
                <span style={{ color: tScoreColor, fontWeight: 500 }}>{tAvg.toFixed(2)}</span>
              </td>
              <td>
                <span style={{ color: "#3A9E6F", fontWeight: 500 }}>{tPos}%</span>
              </td>
              <td>
                <span style={{ color: "var(--muted)", fontWeight: 500 }}>{tNeu}%</span>
              </td>
              <td>
                <span style={{ color: "#D64045", fontWeight: 500 }}>{tNegS}%</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
