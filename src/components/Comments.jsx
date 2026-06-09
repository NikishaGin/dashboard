import { useState } from "react"
import { SCORE_COLORS } from "../data"

const FILTERS = [
  { type: "all", val: "all", label: "Все", cls: "" },
  { type: "score", val: "12", label: "1–2", cls: "sc-neg" },
  { type: "score", val: "3", label: "3", cls: "sc-neu" },
  { type: "score", val: "45", label: "4–5", cls: "sc-pos" },
  { type: "region", val: "7000", label: "7000", cls: "" },
  { type: "region", val: "1100", label: "1100", cls: "" },
  { type: "region", val: "2542", label: "2542", cls: "" },
  { type: "region", val: "2654", label: "2654", cls: "" },
]

export default function Comments({ comments }) {
  const [filter, setFilter] = useState({ type: "all", val: "all" })

  let rows = [...comments]
  if (filter.type === "score") {
    const set = filter.val.split("").map(Number)
    rows = rows.filter((r) => set.includes(r.q))
  } else if (filter.type === "region") {
    rows = rows.filter((r) => r.reg === filter.val)
  }
  rows.sort((a, b) => a.q - b.q)

  const n = rows.length

  return (
    <section className="card card-pad cmt-card">
      <div className="block-head">
        <div>
          <div className="block-title">Комментарии граждан</div>
          <div className="block-sub" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <i className="ti ti-message-circle" aria-hidden="true" style={{ fontSize: "14px", color: "var(--muted)" }} />
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>Текстовые отзывы к оценкам</span>
          </div>
        </div>
        <div className="cmt-filters">
          {FILTERS.map((f) => {
            const active = filter.type === f.type && filter.val === f.val
            return (
              <button
                key={`${f.type}-${f.val}`}
                className={`cmt-f ${f.cls} ${active ? "active" : ""}`}
                onClick={() => setFilter({ type: f.type, val: f.val })}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="cmt-thead cmt-gridcols">
        <span>Регион</span>
        <span>№ обращения</span>
        <span>Дата обращения</span>
        <span>Оценки</span>
        <span>Комментарий</span>
      </div>
      <div>
        {n === 0 ? (
          <div className="cmt-empty">Нет комментариев по выбранному фильтру</div>
        ) : (
          rows.map((r, i) => (
            <div className="cmt-row cmt-gridcols" key={i}>
              <div className="cmt-reg">{r.reg}</div>
              <div className="cmt-num">{r.num}</div>
              <div>
                <div className="cmt-date">{r.date}</div>
              </div>
              <div className="cmt-scores">
                <div className="cmt-score">
                  <span className="lbl">Качество</span>
                  <span className="cmt-badge" style={{ background: SCORE_COLORS[r.q] }}>
                    {r.q}
                  </span>
                </div>
                <div className="cmt-score">
                  <span className="lbl">Скорость</span>
                  <span className="cmt-badge" style={{ background: SCORE_COLORS[r.s] }}>
                    {r.s}
                  </span>
                </div>
              </div>
              <div className="cmt-text">{r.txt}</div>
            </div>
          ))
        )}
      </div>
      <div className="cmt-pager">
        <div className="cmt-shown">
          {n === 0 ? "Нет комментариев" : `Показано 1–${n} из ${n} комментариев`}
        </div>
        <div className="cmt-pages">
          <button className="cmt-pg" disabled>← Назад</button>
          <button className="cmt-pg active">1</button>
          <button className="cmt-pg">2</button>
          <button className="cmt-pg">3</button>
          <button className="cmt-pg">Вперёд →</button>
        </div>
      </div>
    </section>
  )
}
