import { useState } from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { ru, scaleCount, plural } from "../helpers.js"
import { COP_LABELS, DIST_TABS, SCORE_COLORS } from "../data.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Distribution({ centers, periodFactor }) {
  const [distTab, setDistTab] = useState("all")
  const f = periodFactor
  const tab = DIST_TABS[distTab] || DIST_TABS.all
  const fld = tab.field

  // per-score totals + per-region breakdown (score 5..1), scaled by period
  const scores = [5, 4, 3, 2, 1].map((score) => {
    const idx = score - 1
    const regions = centers.map((c) => ({ label: COP_LABELS[c.code] || c.code, count: scaleCount(c[fld][idx], f) }))
    const total = regions.reduce((a, r) => a + r.count, 0)
    return { score, color: SCORE_COLORS[score], regions, total }
  })
  const grand = scores.reduce((a, s) => a + s.total, 0)

  const segData = scores.map((s) => s.total)
  const segColors = scores.map((s) => s.color)
  const segLabels = scores.map((s) => String(s.score))

  const data = {
    labels: segLabels,
    datasets: [{ data: segData, backgroundColor: segColors, borderWidth: 2, borderColor: "#fff" }],
  }
  const options = {
    cutout: "72%",
    animation: false,
    responsive: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label} балл — ${ru(ctx.parsed)} ${plural(ctx.parsed, "оценка", "оценки", "оценок")}`,
        },
      },
    },
  }

  // footer: column sums (+ avg for quality/speed)
  const nReg = scores[0].regions.length
  const regTotals = [],
    regAvgs = []
  for (let i = 0; i < nReg; i++) {
    let sum = 0,
      ss = 0
    scores.forEach((s) => {
      sum += s.regions[i].count
      ss += s.regions[i].count * s.score
    })
    regTotals.push(sum)
    regAvgs.push(sum ? ss / sum : 0)
  }

  const tabs = [
    { tab: "all", label: "Общее" },
    { tab: "q", label: "Качество" },
    { tab: "s", label: "Скорость" },
  ]

  return (
    <div className="card card-pad">
      <div className="block-head">
        <div>
          <div className="block-title">Оценки граждан по регионам</div>
          <div className="block-sub">{tab.sub}</div>
        </div>
        <div className="dist-tabs">
          {tabs.map((t) => (
            <button
              key={t.tab}
              className={`dist-tab ${distTab === t.tab ? "active" : ""}`}
              onClick={() => setDistTab(t.tab)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="dist-grid">
        <div className="dist-left">
          <div className="dist-donut">
            <Doughnut data={data} options={options} width={220} height={220} />
            <div className="dist-center">
              <div className="dist-center-v">{ru(grand)}</div>
              <div className="dist-center-l">{tab.label}</div>
            </div>
          </div>
        </div>
        <div className="dist-right">
          <div className="dist-thead dist-gridcols">
            <span></span>
            <span className="h">7000</span>
            <span className="h">1100</span>
            <span className="h">2542</span>
            <span className="h">2654</span>
          </div>
          {scores.map((s) => (
            <div className="dist-srow dist-gridcols" key={s.score}>
              <div className="dist-badge" style={{ background: s.color, color: "#fff" }}>
                {s.score}
              </div>
              {s.regions.map((r, i) => (
                <span className="dist-rv" style={{ color: r.count ? s.color : "#ccc" }} key={i}>
                  {r.count ? ru(r.count) : "—"}
                </span>
              ))}
            </div>
          ))}
          <div className="dist-tfoot dist-gridcols">
            <span className="ft lbl">Итого</span>
            {regTotals.map((n, i) => (
              <span className="ft" key={i}>
                {ru(n)}
                {n ? <span className="dist-tfavg"> ({regAvgs[i].toFixed(2)})</span> : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
