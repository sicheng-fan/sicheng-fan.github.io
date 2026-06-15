'use client'

import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export function AcademicFooter() {
  const { language } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {year} Fan Sicheng.{' '}
            {language === 'zh' ? '保留所有权利。' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/franskey-0112"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/fan_si_cheng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/fansicheng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:sicheng_fan@foxmail.com"
              className="text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
