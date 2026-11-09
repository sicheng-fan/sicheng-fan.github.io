'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowRight, LockKeyhole, LogOut, RefreshCw } from 'lucide-react'
import type { VisitorReport } from '@/lib/visitor-analytics-types'
import { VisitorDashboard, type VisitorFilter } from '@/components/visitor-map/VisitorDashboard'

const endpoint = '/api/owner/visitors'
const options = { credentials: 'same-origin' as const, cache: 'no-store' as const }

export function OwnerVisitorPage() {
  const [filter, setFilter] = useState<VisitorFilter>({ site: 'all', days: 30 })
  const [report, setReport] = useState<VisitorReport | null>(null)
  const [phase, setPhase] = useState<'loading' | 'locked' | 'ready' | 'error'>('loading')
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')
  const [version, setVersion] = useState(0)
  const password = useRef<HTMLInputElement>(null)
  const pending = useRef<AbortController | null>(null)
  const refresh = () => { setMessage(''); setPhase('loading'); setVersion(v => v + 1) }

  useEffect(() => {
    const controller = new AbortController(); pending.current = controller
    const load = async () => {
      try {
        const r = await fetch(`${endpoint}?site=${filter.site}&days=${filter.days}`, { ...options, signal: controller.signal })
        if (controller.signal.aborted) return
        if (r.status === 401) { setReport(null); setPhase('locked'); return }
        if (!r.ok) throw new Error()
        const nextReport: VisitorReport = await r.json()
        if (controller.signal.aborted) return
        setReport(nextReport); setPhase('ready')
      } catch {
        if (!controller.signal.aborted) { setReport(null); setPhase('error'); setMessage('暂时无法读取访客统计，请稍后重试。') }
      }
    }
    void load()
    return () => controller.abort()
  }, [filter, version])

  useEffect(() => {
    const restore = (e: PageTransitionEvent) => { if (e.persisted) { setReport(null); setPhase('loading'); setVersion(v => v + 1) } }
    window.addEventListener('pageshow', restore)
    return () => window.removeEventListener('pageshow', restore)
  }, [])

  async function login(e: FormEvent) {
    e.preventDefault()
    if (working || !password.current) return
    setWorking(true); setMessage('')
    try {
      const r = await fetch(endpoint, { ...options, method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: password.current.value }) })
      if (r.ok) { if (password.current) password.current.value = ''; refresh() }
      else setMessage(r.status === 401 ? '访问密码不正确。' : r.status === 429 ? '尝试次数过多，请在十分钟后重试。' : '暂时无法登录，请稍后重试。')
    } catch { setMessage('连接失败，请重试。') }
    finally { setWorking(false) }
  }

  async function logout() {
    setWorking(true); setMessage(''); pending.current?.abort()
    try {
      const r = await fetch(endpoint, { ...options, method: 'DELETE' })
      if (!r.ok) throw new Error()
      setReport(null); setPhase('locked')
    } catch { setMessage('退出未完成，请重试。') }
    finally { setWorking(false) }
  }

  return <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <a href="/" className="font-semibold tracking-tight text-slate-800">Fan Sicheng</a>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5"><LockKeyhole size={14} aria-hidden />站主空间</span>
          {report && <><button disabled={working || phase === 'loading'} onClick={refresh} className="inline-flex items-center gap-1 disabled:opacity-50"><RefreshCw size={14} aria-hidden />刷新</button><button disabled={working} onClick={logout} className="inline-flex items-center gap-1"><LogOut size={14} aria-hidden />退出</button></>}
        </div>
      </div>
    </header>
    {report ? <div aria-busy={phase === 'loading'}>
      {message && <p role="alert" className="mx-auto max-w-6xl px-6 pt-4 text-sm text-red-700">{message}</p>}
      <VisitorDashboard report={report} filter={{site: report.site, days: report.days}} onFilterChange={f => { setPhase('loading'); setFilter({...f}) }} />
    </div> : <div className="mx-auto max-w-md px-5 py-16 sm:py-24">
      <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">访客地图</h1>
        {phase === 'locked' ? <form onSubmit={login} className="mt-3">
          <p className="mb-6 text-sm leading-6 text-slate-600">使用站主访问密码查看两个首页的访客统计。</p>
          <label htmlFor="owner-pass" className="text-sm font-medium">访问密码</label>
          <input id="owner-pass" ref={password} name="password" type="password" autoComplete="current-password" required maxLength={256} className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-base focus:outline-blue-600" />
          {message && <p role="alert" className="mt-3 text-sm text-red-700">{message}</p>}
          <button disabled={working} className="mt-5 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{working ? '正在登录…' : '查看访客地图'}<ArrowRight size={15} aria-hidden /></button>
        </form> : phase === 'error' ? <div className="mt-4 text-sm"><p role="alert">{message}</p><button onClick={refresh} className="mt-4 underline">重新加载</button></div> : <p className="mt-3 text-sm text-slate-500" role="status">正在验证访问权限…</p>}
      </div>
    </div>}
  </div>
}
