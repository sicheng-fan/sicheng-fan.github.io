'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'

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
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`group relative ${featured ? 'md:col-span-2' : ''}`}
    >
      <Link href={`/blog/${slug}`}>
        <div className={`cyber-card h-full ${featured ? 'p-8' : 'p-6'}`}>
          {/* 装饰角 */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-green/50 group-hover:border-cyber-green transition-colors" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-green/50 group-hover:border-cyber-green transition-colors" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-green/50 group-hover:border-cyber-green transition-colors" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-green/50 group-hover:border-cyber-green transition-colors" />

          {/* Featured badge */}
          {featured && (
            <div className="absolute -top-px left-6 px-3 py-1 bg-cyber-orange text-cyber-black text-xs font-mono font-bold uppercase tracking-wider">
              Featured
            </div>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-mono">
            <span className="flex items-center gap-1.5 text-cyber-gray">
              <Calendar className="w-4 h-4" />
              {date}
            </span>
            <span className="flex items-center gap-1.5 text-cyber-gray">
              <Clock className="w-4 h-4" />
              {readingTime}
            </span>
          </div>

          {/* Title */}
          <h3 className={`font-display font-bold text-cyber-white group-hover:text-cyber-green transition-colors mb-3 ${featured ? 'text-2xl' : 'text-xl'}`}>
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-cyber-gray leading-relaxed mb-4 line-clamp-3">
            {excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span key={tag} className="cyber-tag">
                {tag}
              </span>
            ))}
          </div>

          {/* Read more */}
          <div className="flex items-center gap-2 text-cyber-cyan font-mono text-sm group-hover:text-cyber-green transition-colors">
            <span>{'>'} READ_MORE</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
          </div>

          {/* Scan line effect on hover */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden">
            <div className="absolute w-full h-1 bg-cyber-green/20 animate-scan" />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

