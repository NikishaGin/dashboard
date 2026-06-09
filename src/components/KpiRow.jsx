import { ru } from "../helpers.js"

const icons = {
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
  arrow: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </>
  ),
  star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />,
}

export default function KpiRow({ view, targetScore }) {
  const v = view

  const scoreClass = v.avg >= targetScore ? "green" : v.avg >= targetScore - 0.3 ? "amb" : "red"

  const cards = [
    {
      l: "Выдано ссылок",
      ic: "link",
      cls: "",
      v: ru(v.links),
      sec: <span className="kpi-note">{ru(v.ratings)} оценок получено</span>,
    },
    {
      l: "Оценок получено",
      ic: "arrow",
      cls: "",
      v: ru(v.ratings),
      sec: (
        <div className="kpi-conv">
          <span className="kpi-conv-v">{v.conv.toFixed(1)}%</span>
          <span className="kpi-conv-l">конверсия в оценку</span>
        </div>
      ),
    },
    {
      l: "Средняя оценка",
      ic: "star",
      cls: "pos",
      vcls: "amb",
      v: (
        <>
          {v.avg.toFixed(2)}
          <small>/5</small>
        </>
      ),
      track: {
        w: (v.avg / 5) * 100,
        color: scoreClass === "green" ? "var(--pos)" : scoreClass === "amb" ? "var(--amber)" : "var(--neg)",
      },
      sec: (
        <span className="kpi-note">
          <span style={{ color: "#3A9E6F", fontWeight: 500 }}>{v.posShare.toFixed(0)}% позитивных</span>{" "}
          <span style={{ color: "var(--muted)" }}>·</span>{" "}
          <span style={{ color: "var(--muted)", fontWeight: 500 }}>{v.neuShare.toFixed(0)}% нейтральных</span>{" "}
          <span style={{ color: "var(--muted)" }}>·</span>{" "}
          <span style={{ color: "#D64045", fontWeight: 500 }}>{v.negShare.toFixed(0)}% негативных</span>
        </span>
      ),
    },
  ]

  return (
    <section className="kpis">
      {cards.map((c, i) => (
        <div className={`kpi ${c.cls.includes("warn") ? "warn" : ""}`} key={i}>
          <div className="kpi-top">
            <div className="kpi-l">{c.l}</div>
            {c.ic && (
              <div className={`kpi-ic ${c.cls.replace("warn", "").trim()}`}>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  {icons[c.ic]}
                </svg>
              </div>
            )}
          </div>
          <div className="kpi-mid">
            <div className={`kpi-v ${c.vcls || ""}`}>{c.v}</div>
          </div>
          <div className="kpi-botgrp">
            {c.track ? (
              <div className="kpi-track">
                <i style={{ width: `${c.track.w}%`, background: c.track.color }} />
              </div>
            ) : (
              <div className="kpi-sep">
                <i />
              </div>
            )}
            <div className="kpi-sec">{c.sec || ""}</div>
          </div>
        </div>
      ))}
    </section>
  )
}
