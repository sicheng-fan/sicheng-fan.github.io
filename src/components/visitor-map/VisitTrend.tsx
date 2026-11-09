'use client'

import { useId, useState } from 'react'
import { number } from './WorldMap'
import styles from './VisitorAtlas.module.css'

export function VisitTrend({ rows }: { rows: { date: string; views: number }[] }) {
  const [cursor, setCursor] = useState<number | null>(null)
  const gradient = useId()
  const index = Math.min(cursor ?? rows.length - 1, rows.length - 1)
  const point = rows[index]
  const peak = Math.max(...rows.map(r => r.views), 0)
  const w = 600, h = 104, pad = 6
  const x = (i: number) => pad + i / Math.max(1, rows.length - 1) * (w - 2 * pad)
  const y = (count: number) => h - pad - count / Math.max(1, peak) * (h - 2 * pad)
  const stroke = rows.map((row, i) => (i ? 'L' : 'M') + x(i) + ' ' + y(row.views)).join(' ')
  return <section className={styles.panel} aria-label="每日首页浏览量趋势">
    <div className={styles.panelHeader}><div><p className={styles.kicker}>DAILY ACTIVITY</p><h2>浏览趋势</h2></div>
      {point && <span className={styles.trendReading}>{point.date.slice(5).replace('-', '/')} <b>{number(point.views)} 次</b></span>}</div>
    <div className={styles.trendBody}>
      {point && peak > 0 ? <>
        <div className={styles.chartGrid}>
          <div className={styles.ticks}><span>{number(peak)}</span><span>0</span></div>
          <div className={styles.trendControl} role="slider" tabIndex={0} aria-label="按日期查看浏览量"
            aria-valuemin={1} aria-valuemax={rows.length} aria-valuenow={index + 1} aria-valuetext={point.date + '，' + point.views + ' 次'}
            onKeyDown={e => {
              const next = e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? index - 1 : e.key === 'ArrowRight' || e.key === 'ArrowUp' ? index + 1 : e.key === 'Home' ? 0 : e.key === 'End' ? rows.length - 1 : null
              if (next !== null) {e.preventDefault(); setCursor(Math.min(rows.length - 1, Math.max(0, next)))}
            }}
            onPointerMove={e => {
              const box = e.currentTarget.getBoundingClientRect()
              if (box.width) setCursor(Math.max(0,Math.min(rows.length-1,Math.round((e.clientX-box.left)/box.width*(rows.length-1)))))
            }}>
            <svg viewBox={'0 0 ' + w + ' ' + h} preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#69ad9e" stopOpacity=".35"/><stop offset="1" stopColor="#69ad9e" stopOpacity=".04"/></linearGradient></defs>
              {[0, .5, 1].map(f => <line key={f} x1={0} x2={w} y1={y(peak*f)} y2={y(peak*f)} stroke="#dfebe8" strokeDasharray="3 5" vectorEffect="non-scaling-stroke"/>)}
              <path d={stroke + ' L' + x(rows.length-1) + ' ' + y(0) + ' L' + x(0) + ' ' + y(0) + ' Z'} fill={'url(#' + gradient + ')'}/>
              <path d={stroke} fill="none" stroke="#26766a" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
              <line x1={x(index)} x2={x(index)} y1={pad} y2={h-pad} stroke="#669b91" strokeDasharray="3 4" vectorEffect="non-scaling-stroke"/>
              <circle cx={x(index)} cy={y(point.views)} r="3.5" fill="#17685e" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>
        <div className={styles.xTicks}><span>{rows[0].date}</span><span>{rows[rows.length-1].date}</span></div>
      </> : <div className={styles.emptyBlock}>所选时段暂无首页浏览。</div>}
    </div>
  </section>
}
