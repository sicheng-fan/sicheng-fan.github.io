'use client'

import { useId } from 'react'
import { honors } from '@/data/honors'

interface HonorsProps {
  language: 'zh' | 'en'
  variant?: 'academic' | 'cyber'
}

export function Honors({ language, variant = 'academic' }: HonorsProps) {
  const headingId = useId()
  const isAcademic = variant === 'academic'

  return (
    <section aria-labelledby={headingId} className="min-w-0">
      <h2
        id={headingId}
        className={isAcademic
          ? 'text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200'
          : 'mb-3 text-sm font-medium text-cyber-gray'}
      >
        {language === 'zh' ? '荣誉与奖励' : 'Honors & Awards'}
      </h2>

      <ul className={`space-y-2 text-sm leading-relaxed ${isAcademic ? 'text-slate-700' : 'text-cyber-gray'}`}>
        {honors.map((honor) => (
          <li
            key={honor.id}
            className="break-words"
          >
            {language === 'zh' ? honor.titleZh : honor.title}
            {language === 'en' && honor.institution && (
              <span>, {honor.institution}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
