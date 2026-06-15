'use client'

import Link from 'next/link'
import { Github, Twitter, Mail, Linkedin, Heart, Code2, BookOpen } from 'lucide-react'
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
    <footer className="relative mt-20 border-t border-cyber-green/20 bg-cyber-darker/50">
      {/* 装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-green/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-6 h-6 text-cyber-green" />
              <span className="font-display text-xl font-bold text-cyber-green tracking-wider">
                FAN.SICHENG
              </span>
            </div>
            <p className="text-cyber-gray text-sm leading-relaxed mb-4 max-w-md">
              {t.footer.description}
            </p>
            {/* Terminal-style status */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyber-dark border border-cyber-green/30 rounded font-mono text-xs">
              <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
              <span className="text-cyber-green">{t.footer.status}</span>
              <span className="text-cyber-white">{t.footer.online}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-bold text-cyber-cyan uppercase tracking-wider mb-4">
              &gt; {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cyber-gray hover:text-cyber-green transition-colors text-sm font-mono flex items-center gap-2 group"
                  >
                    <span className="text-cyber-green/50 group-hover:text-cyber-green transition-colors">
                      {'>>'}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-display text-sm font-bold text-cyber-cyan uppercase tracking-wider mb-4">
              &gt; {t.footer.connect}
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-cyber-dark border border-cyber-green/30 rounded hover:border-cyber-green hover:bg-cyber-green/10 transition-all group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-cyber-gray group-hover:text-cyber-green transition-colors" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-cyber-green/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-cyber-gray text-sm font-mono">
              <span className="text-cyber-green">©</span> {currentYear}{' '}
              <span className="text-cyber-white">Fan Sicheng</span>
              <span className="mx-2">|</span>
              <span className="text-cyber-gray">{t.footer.copyright}</span>
            </div>

            {/* Made with */}
            <div className="flex items-center gap-2 text-cyber-gray text-sm font-mono">
              <span>{t.footer.builtWith}</span>
              <Heart className="w-4 h-4 text-cyber-red animate-pulse" />
              <span>&amp;</span>
              <span className="text-cyber-cyan">Next.js</span>
            </div>
          </div>

          {/* Tech decoration */}
          <div className="mt-4 flex justify-center">
            <div className="text-[10px] font-mono text-cyber-gray/50 tracking-widest">
              {'// END_OF_FILE'}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
