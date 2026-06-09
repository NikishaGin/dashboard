import { useState } from "react"
import { CENTERS, PERIODS, TARGET_SCORE, COMMENTS } from "./data.js"
import { computeView, regKey } from "./helpers.js"
import KpiRow from "./components/KpiRow.jsx"
import FunnelTable from "./components/FunnelTable.jsx"
import Distribution from "./components/Distribution.jsx"
import ResponseTime from "./components/ResponseTime.jsx"
import Comments from "./components/Comments.jsx"

export default function App() {
  // state mirrors the original: { region:'all', period:'30d' }
  const [region] = useState("all")
  const [period] = useState("30d")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const periodFactor = PERIODS.find((p) => p.id === period).f
  const currentCenters = region === "all" ? CENTERS : CENTERS.filter((c) => regKey(c) === region)
  const kpiView = computeView(currentCenters, periodFactor)

  return (
    <div className="app">
      <div className="main">
        <header className="topbar">
          <h1>Удовлетворённость граждан</h1>
          <div className="sp"></div>
          <div className="tb-tools">
            <div className="daterange">
              <input
                type={dateFrom ? "date" : "text"}
                className="dr-input"
                placeholder="Период с"
                value={dateFrom}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text"
                }}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <input
                type={dateTo ? "date" : "text"}
                className="dr-input"
                placeholder="Период по"
                value={dateTo}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text"
                }}
                onChange={(e) => setDateTo(e.target.value)}
              />
              <button className="dr-apply">Применить</button>
              <button
                className="dr-reset"
                onClick={() => {
                  setDateFrom("")
                  setDateTo("")
                }}
              >
                Сбросить
              </button>
            </div>
          </div>
        </header>

        <div className="content">
          <KpiRow view={kpiView} targetScore={TARGET_SCORE} />

          <FunnelTable centers={CENTERS} periodFactor={periodFactor} region={region} />

          <section className="second">
            <Distribution centers={CENTERS} periodFactor={periodFactor} />
            <ResponseTime centers={currentCenters} periodFactor={periodFactor} />
          </section>

          <Comments comments={COMMENTS} />
        </div>
      </div>
    </div>
  )
}
