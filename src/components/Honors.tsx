'use client'

import { useId } from 'react'
import { Award } from 'lucide-react'
import { honors } from '@/data/honors'

interface HonorsProps {
  language: 'zh' | 'en'
  variant?: 'academic' | 'cyber'
}

export function Honors({ language, variant = 'academic' }: HonorsProps) {
  const headingId = useId()
  const isAcademic = variant === 'academic'

  return (
    <section
      aria-labelledby={headingId}
      className={`min-w-0 rounded-xl border p-4 sm:p-5 ${
        isAcademic
          ? 'border-slate-200 bg-slate-50/70'
          : 'border-cyber-cyan/20 bg-cyber-dark/70'
      }`}
    >
      <h2
        id={headingId}
        className={`mb-3 flex items-center gap-2 text-sm font-semibold ${
          isAcademic ? 'text-slate-700' : 'text-cyber-cyan'
        }`}
      >
        <Award
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 ${isAcademic ? 'text-amber-600' : 'text-amber-300'}`}
        />
        {language === 'zh' ? '荣誉与奖励' : 'Honors & Awards'}
      </h2>

      <ul
        className={`grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 ${
          isAcademic ? 'lg:grid-cols-4' : ''
        }`}
      >
        {honors.map((honor) => (
          <li
            key={honor.id}
            className={`min-w-0 rounded-md border border-l-2 px-3 py-3 text-[13px] leading-relaxed ${
              isAcademic
                ? 'border-slate-200 border-l-amber-400 bg-white text-slate-800'
                : 'border-cyber-cyan/10 border-l-amber-300/70 bg-cyber-cyan/5 text-cyber-white'
            }`}
          >
            <span className="block break-words font-medium">
              {language === 'zh' ? honor.titleZh : honor.title}
            </span>
            {language === 'en' && honor.institution && (
              <span className={`mt-0.5 block text-xs ${isAcademic ? 'text-slate-500' : 'text-cyber-gray'}`}>
                {honor.institution}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
