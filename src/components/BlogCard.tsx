'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { blogPostPath, formatPostDate, formatReadingTime } from '@/lib/blog-display'

interface BlogCardProps {
  title: string
  excerpt: string
  slug: string
  date: string
  readingTime: string
  tags: string[]
  featured?: boolean
}

export function BlogCard({
  title,
  excerpt,
  slug,
  date,
  readingTime,
  tags,
  featured = false,
}: BlogCardProps) {
  const { language } = useLanguage()
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={featured ? 'md:col-span-2' : ''}
    >
      <Link href={blogPostPath(slug, language)} className="block group">
        <div className="relative overflow-hidden rounded-xl transition-all duration-500 group-hover:translate-y-[-2px]"
          style={{
            background: 'rgba(10, 22, 40, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 240, 255, 0.1)',
          }}
        >
          {/* Left gradient accent */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-cyber-cyan via-cyber-pink to-cyber-cyan opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Hover scan line */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-cyan/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </div>

          <div className={`${featured ? 'p-8' : 'p-6'} pl-7`}>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <span className="flex items-center gap-1.5 text-cyber-gray text-xs font-mono">
                <Calendar className="w-3.5 h-3.5" />
                {formatPostDate(date, language)}
              </span>
              <span className="flex items-center gap-1.5 text-cyber-gray text-xs font-mono">
                <Clock className="w-3.5 h-3.5" />
                {formatReadingTime(readingTime, language)}
              </span>
              {featured && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-pink/10 text-cyber-pink font-mono border border-cyber-pink/30">
                  {language === 'zh' ? '精选' : 'FEATURED'}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className={`font-display font-bold text-cyber-white group-hover:text-cyber-cyan transition-colors duration-300 mb-3 ${featured ? 'text-2xl' : 'text-lg'}`}>
              {title}
            </h2>

            {/* Excerpt */}
            <p className="text-cyber-gray text-sm leading-relaxed mb-4 line-clamp-2">
              {excerpt}
            </p>

            {/* Tags + Read more */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="cyber-tag text-[10px] py-0.5 px-2">
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-cyber-gray text-xs font-mono">+{tags.length - 3}</span>
                )}
              </div>
              <span className="flex items-center gap-1 text-cyber-cyan text-xs font-mono opacity-0 group-hover:opacity-100 transition-all duration-300">
                {language === 'zh' ? '阅读' : 'Read'}
                <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>

          {/* Bottom glow */}
          <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan/0 group-hover:via-cyber-cyan/30 to-transparent transition-all duration-500" />
        </div>
      </Link>
    </motion.article>
  )
}
