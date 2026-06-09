import { useState } from "react"
import { ru, computeView } from "../helpers.js"
import { RESP_LABELS, RESP_COLORS, SCORE_COLORS, SUSP_RATINGS, SUSP_PER } from "../data.js"

export default function ResponseTime({ centers, periodFactor }) {
  const [tab, setTab] = useState("chart")
  const [suspPage, setSuspPage] = useState(1)
  const f = periodFactor

  const v = computeView(centers, f)
  const tot = v.resp.reduce((a, r) => a + r.c, 0) || 1
  const maxc = Math.max(...v.resp.map((r) => r.c), 1)

  // suspicious table pagination
  const n = SUSP_RATINGS.length
  const pages = Math.max(1, Math.ceil(n / SUSP_PER))
  const page = Math.min(suspPage, pages)
  const start = (page - 1) * SUSP_PER
  const slice = SUSP_RATINGS.slice(start, start + SUSP_PER)

  const goto = (pg) => {
    if (pg === "prev") setSuspPage((p) => Math.max(1, p - 1))
    else if (pg === "next") setSuspPage((p) => Math.min(pages, p + 1))
    else setSuspPage(pg)
  }

  return (
    <div className="card card-pad resp-card">
      <div className="block-head">
        <div>
          <div className="block-title" style={{ fontSize: 15, fontWeight: 500 }}>
            Интервал между созданием QR-ссылки сотрудником
          </div>
          <div className="block-sub" style={{ fontSize: 12, fontWeight: 400, color: "var(--muted)" }}>
            и моментом выставления оценки
          </div>
        </div>
        <div className="dist-tabs">
          <button className={`dist-tab ${tab === "chart" ? "active" : ""}`} onClick={() => setTab("chart")}>
            График
          </button>
          <button className={`dist-tab ${tab === "susp" ? "active" : ""}`} onClick={() => setTab("susp")}>
            До 1 часа
          </button>
        </div>
      </div>

      <div id="respRows" style={{ display: tab === "susp" ? "none" : "" }}>
        {v.resp.map((r, i) => {
          const pct = (r.c / maxc) * 100
          const share = Math.round((r.c / tot) * 100)
          const inside = pct >= 22
          return (
            <div className="rt-row" key={i}>
              <div className="rt-top">
                <div className="rt-name">
                  {RESP_LABELS[i]}
                  {i === 0 ? <span className="rt-selfbadge">возможная самооценка</span> : ""}
                </div>
              </div>
              <div className="rt-bar">
                <i style={{ width: `${pct}%`, background: RESP_COLORS[i] }}>
                  {inside ? (
                    <span>
                      {ru(r.c)} <span className="pc">· {share}%</span>
                    </span>
                  ) : (
                    ""
                  )}
                </i>
                {inside ? (
                  ""
                ) : (
                  <span className="rt-out" style={{ left: `calc(${pct}% + 6px)`, color: RESP_COLORS[i] }}>
                    {ru(r.c)} · {share}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div id="respSusp" style={{ display: tab === "susp" ? "" : "none" }}>
        <div className="susp-thead susp-gridcols">
          <span>Регион</span>
          <span>№ обращения</span>
          <span>Дата</span>
          <span>Интервал</span>
          <span>Оценки</span>
        </div>
        <div id="respSuspRows">
          {slice.map((r, i) => (
            <div className="susp-row susp-gridcols" key={i}>
              <span className="susp-reg">{r.reg}</span>
              <span className="susp-num">{r.num}</span>
              <span className="susp-date">{r.date}</span>
              <span>
                <span className="susp-int">{r.min} мин</span>
              </span>
              <div className="susp-scores">
                <span className="susp-sc">
                  <span className="lbl">Кач.</span>
                  <span className="susp-badge" style={{ background: SCORE_COLORS[r.q] }}>
                    {r.q}
                  </span>
                </span>
                <span className="susp-sc">
                  <span className="lbl">Ск.</span>
                  <span className="susp-badge" style={{ background: SCORE_COLORS[r.s] }}>
                    {r.s}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="cmt-pager">
          <div className="cmt-shown">
            Показано {start + 1}–{start + slice.length} из {n}
          </div>
          <div className="cmt-pages">
            <button className="cmt-pg" disabled={page === 1} onClick={() => goto("prev")}>
              ← Назад
            </button>
            {Array.from({ length: pages }, (_, idx) => idx + 1).map((p) => (
              <button key={p} className={`cmt-pg ${p === page ? "active" : ""}`} onClick={() => goto(p)}>
                {p}
              </button>
            ))}
            <button className="cmt-pg" disabled={page === pages} onClick={() => goto("next")}>
              Вперёд →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
