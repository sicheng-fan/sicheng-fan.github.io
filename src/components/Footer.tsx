'use client'

import Link from 'next/link'
import { Github, Twitter, Mail, Linkedin, Heart, BookOpen } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

const socialLinks = [
  { icon: Github, href: 'https://github.com/franskey-0112', label: 'GitHub' },
  { icon: Twitter, href: 'https://x.com/fan_si_cheng', label: 'X' },
  { icon: Linkedin, href: 'https://linkedin.com/in/fansicheng', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:sicheng_fan@foxmail.com', label: 'Email' },
  { icon: BookOpen, href: 'https://www.xiaohongshu.com/user/profile/64e08b3b000000000100461c', label: '小红书' },
]

const quickLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/about', label: 'About' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useLanguage()

  return (
    <footer className="relative mt-20">
      {/* Gradient separator */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <span className="font-display text-lg font-bold text-gradient-static">FSC</span>
            <span className="text-cyber-gray text-sm font-mono">|</span>
            <span className="text-cyber-gray text-sm">{t.footer.description}</span>
          </div>

          {/* Quick Links */}
          <nav className="flex items-center gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-cyber-gray hover:text-cyber-cyan transition-colors text-sm font-mono"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-cyber-gray hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all"
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-cyber-gray/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-cyber-gray text-sm font-mono">
            <span className="text-cyber-cyan">©</span> {currentYear} Fan Sicheng
            <span className="mx-2 text-cyber-gray/50">·</span>
            <span className="text-cyber-gray/70">{t.footer.copyright}</span>
          </div>
          <div className="flex items-center gap-2 text-cyber-gray text-sm font-mono">
            <span>{t.footer.builtWith}</span>
            <Heart className="w-3.5 h-3.5 text-cyber-pink" />
            <span>&amp;</span>
            <span className="text-cyber-cyan">Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
