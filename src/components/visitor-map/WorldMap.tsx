'use client'

import { useId, useState } from 'react'
import { Globe2, X } from 'lucide-react'
import world from './world.json'
import styles from './VisitorAtlas.module.css'

export type Place = { country: string; views: number }
const names = new Intl.DisplayNames(['zh-CN'], { type: 'region' })
export const regionName = (code: string) => /^[A-Z]{2}$/.test(code) ? (names.of(code) || code) : code
export const number = (value: number) => value.toLocaleString('zh-CN')
const LAND = '#d7e1df'
const palette = ['#a1d7c9', '#75bbad', '#49988d', '#277970', '#115c55']
const mapped = new Set(world.regions.map(region => region.code))

interface MapProps {
  places: Place[]
  unknown: number
  total: number
  historic: boolean
}

export function WorldMap({ places, unknown, total, historic }: MapProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const titleId = useId()
  const descriptionId = useId()
  const unit = historic ? '个网络' : '次浏览'
  const ordered = [...places].filter(p => p.views > 0).sort((a, b) => b.views - a.views || a.country.localeCompare(b.country))
  const counts = new Map(ordered.map(p => [p.country, p.views]))
  const peak = ordered[0]?.views ?? 0
  const active = [hovered, selected].find(code => code != null && counts.has(code)) ?? null
  const shade = (n: number) => n ? palette[peak <= 1 ? 2 : Math.round(Math.log(n) / Math.log(peak) * 4)] : LAND
  const selectedRegion = (code: string) => setSelected(previous => previous === code ? null : code)
  const percent = (n: number) => total > 0 ? (n / total * 100).toLocaleString('zh-CN', {maximumFractionDigits: 1}) + '%' : '0%'
  const shown = showAll ? ordered : ordered.slice(0, 7)
  return (
    <div className={styles.geoGrid}>
      <section className={styles.panel} aria-label="世界地图">
        <div className={styles.panelHeader}>
          <div><p className={styles.kicker}>WORLD MAP</p><h2>地理分布</h2></div>
          <span className={styles.tag}><Globe2 size={13} aria-hidden="true" />国家 / 地区</span>
        </div>
        <div className={styles.mapScene}>
          <svg viewBox="0 -5 900 431" role="group" aria-labelledby={titleId + ' ' + descriptionId}
            className={styles.world} onMouseLeave={() => setHovered(null)}>
            <title id={titleId}>访客地理分布</title>
            <desc id={descriptionId}>颜色越深表示数量越多。圆点标在国家或地区的代表位置；可点击圆点或右侧列表查看数量。</desc>
            <path d={world.graticule} stroke="#d6e3e0" strokeWidth="0.8" fill="none" strokeDasharray="2 5" aria-hidden="true" />
            {world.regions.map(region => {
              const count = counts.get(region.code) || 0
              return <path key={region.code} d={region.d} fill={active === region.code ? '#27655e' : shade(count)}
                fillRule="evenodd" stroke="#fafcfb" strokeWidth=".65" strokeLinejoin="round" aria-hidden="true"
                style={count ? {cursor: 'pointer'} : undefined}
                onMouseEnter={count ? () => setHovered(region.code) : () => setHovered(null)}
                onClick={count ? () => selectedRegion(region.code) : undefined}/>
            })}
            {world.regions.filter(r => counts.has(r.code)).map(region => {
              const count = counts.get(region.code)!
              return <g key={region.code} transform={'translate(' + region.x + ' ' + region.y + ')'}
                className={styles.pin} tabIndex={0} role="button" aria-label={regionName(region.code) + '，' + number(count) + unit}
                aria-pressed={selected === region.code} onClick={() => selectedRegion(region.code)}
                onMouseEnter={() => setHovered(region.code)} onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(region.code)} onBlur={() => setHovered(null)}
                onKeyDown={event => {if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectedRegion(region.code) }}}>
                <title>{regionName(region.code)} · {number(count)} {unit}</title>
                <circle r="11" fill="transparent" />
                <circle r={active === region.code ? 8.5 : 6.3} fill="#16695c" fillOpacity=".22" />
                <circle r={active === region.code ? 4.6 : 3.4} fill="#135b52" stroke="#fff" strokeWidth="1.5" />
              </g>
            })}
          </svg>
          {peak === 0 && <div className={styles.mapEmpty}>
            <strong>{total ? '暂无可定位的记录' : historic ? '暂无历史足迹' : '这段时间暂无访问'}</strong>
            <span>{total ? '未定位记录已列入地区统计。' : historic ? '尚未找到可确认访问过首页的旧记录。' : '有新的首页浏览时，记录会显示在这里。'}</span>
          </div>}
        </div>
        <div className={styles.mapFoot}>
          <div className={styles.mapStatus} aria-live="polite">
            {active ? <><b>{regionName(active)}</b><span>{number(counts.get(active)!)} {unit} · {percent(counts.get(active)!)}</span>
              {!mapped.has(active) && <span>该地区无单独轮廓</span>}
              {selected && <button type="button" aria-label="清除所选地区" onClick={() => {setSelected(null); setHovered(null)}}><X size={13}/></button>}</>
              : <span>点击地区或圆点查看数量</span>}
          </div>
          <div className={styles.legend} aria-label="颜色由浅至深表示数量由少至多"><span>少</span>
            {palette.map(c => <i key={c} style={{backgroundColor:c}}/>)}<span>多</span></div>
        </div>
      </section>
      <section className={styles.panel} aria-label="国家和地区排行">
        <div className={styles.panelHeader}><div><p className={styles.kicker}>LOCATIONS</p><h2>国家和地区</h2></div>
          <span className={styles.smallMuted}>{historic ? '网络数' : '浏览量'}</span>
        </div>
        <div className={styles.ranking}>
          {ordered.length ? <ol>{shown.map((place, index) => (
            <li key={place.country}><button type="button" className={styles.rankButton} aria-pressed={selected === place.country}
              onClick={() => selectedRegion(place.country)}>
              <span className={styles.rankIndex}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.rankName}>{regionName(place.country)}
                <span className={styles.barTrack}><i style={{width: place.views / peak * 100 + '%'}} /></span>
              </span>
              <span className={styles.rankCount}>{number(place.views)}</span>
            </button></li>
          ))}</ol> : <p className={styles.noRegions}>暂无已定位的地区</p>}
          {ordered.length > 7 && <button type="button" className={styles.expand} onClick={() => setShowAll(!showAll)}>
            {showAll ? '收起列表' : '查看全部 ' + ordered.length + ' 个地区'}</button>}
          <div className={styles.unknown}><span>未定位 <small>不标在地图上</small></span><b>{number(unknown)}</b></div>
        </div>
      </section>
    </div>
  )
}
