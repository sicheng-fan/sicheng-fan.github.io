'use client'

import { useState } from 'react'
import { Activity, Archive, CalendarDays, ChevronDown, Globe2, Layers3, MousePointer2, ScanLine } from 'lucide-react'
import type { VisitorFilter, VisitorReport, VisitorSite } from '@/lib/visitor-analytics-types'
import { WorldMap, number, regionName } from './WorldMap'
import { VisitTrend } from './VisitTrend'
import styles from './VisitorAtlas.module.css'

export type { VisitorFilter } from '@/lib/visitor-analytics-types'
interface DashboardProps {
  report: VisitorReport
  filter: VisitorFilter
  onFilterChange: (filter: VisitorFilter) => void
}
const sites = { all: '全部站点', main: 'fansicheng.online', pages: 'sicheng-fan.github.io' } as const
const trackingDate = new Intl.DateTimeFormat('zh-CN', {timeZone:'Asia/Shanghai', year:'numeric', month:'2-digit', day:'2-digit'})
function localTime(at: string) {
  // Some archived sources use a local, minute-resolution timestamp without an offset.
  if (/^\d{4}-\d\d-\d\d[T ]\d\d:\d\d$/.test(at)) return at.replace('T', ' ').slice(5)
  const dt = new Date(at)
  return Number.isNaN(dt.valueOf()) ? '—' : new Intl.DateTimeFormat('zh-CN', {
    timeZone:'Asia/Shanghai', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23',
  }).format(dt)
}

export function VisitorDashboard({ report, filter, onFilterChange }: DashboardProps) {
  const [mode, setMode] = useState<'live' | 'history' | null>(null)
  const historical = mode === 'history' || (mode === null && report.totalViews === 0 && report.legacyHome.totalViews > 0)
  const geo = historical ? report.legacyHome : report
  const count = geo.countries.filter(row => row.views > 0).length
  const unknownRate = geo.totalViews ? Math.round(geo.unknownViews / geo.totalViews * 100) : 0
  return <div className={styles.atlas} lang="zh-CN">
    <div className={styles.shell}>
      <header className={styles.hero}>
        <div><p className={styles.wordmark}><i/> VISITOR ATLAS</p>
          <h1>访客地图</h1><p className={styles.subtitle}>查看个人主页的访问来源与浏览趋势。</p></div>
        <div className={styles.modeSwitch} role="group" aria-label="数据视图">
          <button type="button" aria-pressed={!historical} onClick={() => setMode('live')}><Activity size={15} aria-hidden="true"/>近期访问</button>
          <button type="button" aria-pressed={historical} onClick={() => setMode('history')}><Archive size={15} aria-hidden="true"/>历史足迹</button>
        </div>
      </header>
      {historical ? <div className={styles.historyNote}><Archive size={17} aria-hidden="true"/><p><b>历史足迹</b><span>仅统计旧记录中访问过首页的不同网络，无法按日期或站点拆分，也不计入新的浏览量。</span></p></div> :
        <div className={styles.toolbar}>
          <label className={styles.siteSelect}><Globe2 size={15} aria-hidden="true"/><span className="sr-only">筛选站点</span>
            <select value={filter.site} onChange={e => {setMode('live'); onFilterChange({...filter, site:e.target.value as VisitorSite})}}>
              {(Object.keys(sites) as VisitorSite[]).map(s => <option key={s} value={s}>{sites[s]}</option>)}</select><ChevronDown size={14} aria-hidden="true"/></label>
          <div className={styles.rangeGroup}><CalendarDays size={15} aria-hidden="true"/><div className={styles.periods} role="group" aria-label="选择时间范围">
            {([7, 30, 90] as const).map(days => <button key={days} type="button" aria-pressed={filter.days === days}
              onClick={() => {setMode('live'); onFilterChange({...filter, days})}}>近 {days} 天</button>)}</div></div>
        </div>}
      <div className={styles.metrics}>
        <div><p><MousePointer2 size={15} aria-hidden="true"/>{historical ? '历史访问网络' : '首页浏览量'}</p><strong>{number(geo.totalViews)}</strong>
          <small>{historical ? '按不同网络计数，不代表人数' : '所选站点和时段内的浏览次数'}</small></div>
        <div><p><Globe2 size={15} aria-hidden="true"/>国家和地区</p><strong>{number(count)}</strong><small>有定位记录的地区数</small></div>
        <div><p><ScanLine size={15} aria-hidden="true"/>{historical ? '未定位网络' : '未定位浏览'}</p><strong>{number(geo.unknownViews)}</strong><small>占{historical ? '历史网络' : '本期浏览量'}的 {unknownRate}%</small></div>
      </div>
      <WorldMap key={(historical ? 'history' : report.site + report.days)} places={geo.countries} total={geo.totalViews} unknown={geo.unknownViews} historic={historical}/>
      {!historical && <>
        <div className={styles.detailGrid}>
          <VisitTrend key={report.site + report.days} rows={report.daily}/>
          <section className={styles.panel} aria-label="站点浏览量">
            <div className={styles.panelHeader}><div><p className={styles.kicker}>SITES</p><h2>站点浏览量</h2></div><Layers3 size={16} aria-hidden="true" color="#74847f"/></div>
            <div className={styles.sitesList}>{(['main','pages'] as const).filter(site => report.site === 'all' || report.site === site).map(site => (
              <div key={site}><div><span>{sites[site]}</span><b>{number(report.sites[site])} <small>次</small></b></div>
                <div className={styles.meter}><i style={{width: (report.totalViews ? report.sites[site]/report.totalViews*100 : 0) + '%'}}/></div></div>
            ))}</div>
          </section>
        </div>
        <section className={styles.panel} aria-label="最近首页访问">
          <div className={styles.panelHeader}><div><p className={styles.kicker}>RECENT ACTIVITY</p><h2>最近访问</h2></div><span className={styles.smallMuted}>北京时间</span></div>
          {report.recent.length ? <div className={styles.recentScroll}><table className={styles.recentTable}>
            <thead><tr><th scope="col">时间</th><th scope="col">国家 / 地区</th><th scope="col">站点</th></tr></thead>
            <tbody>{report.recent.map((visit, i) => <tr key={visit.at + i}><td>{localTime(visit.at)}</td>
              <td>{visit.country ? regionName(visit.country) : '未定位'}</td><td>{sites[visit.site]}</td></tr>)}</tbody></table></div> :
            <div className={styles.emptyBlock}>所选范围内暂无访问记录。</div>}
        </section>
      </>}
      <footer className={styles.footnote}><span>地图按国家或地区汇总，不显示个人位置。{!historical && report.trackingSince ? '新统计始于 ' + trackingDate.format(new Date(report.trackingSince)) + '。' : ''}</span>
        <span>底图：<a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth</a> · <a href="https://db-ip.com/" target="_blank" rel="noreferrer">IP Geolocation by DB-IP</a></span></footer>
    </div>
  </div>
}
