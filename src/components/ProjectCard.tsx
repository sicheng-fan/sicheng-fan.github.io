'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Star, GitFork, Code2 } from 'lucide-react'

interface ProjectCardProps {
  title: string
  description: string
  slug?: string
  image?: string
  tags: string[]
  github?: string
  demo?: string
  stars?: number
  forks?: number
  status?: 'active' | 'archived' | 'wip'
}

export function ProjectCard({
  title,
  description,
  slug,
  image,
  tags,
  github,
  demo,
  stars,
  forks,
  status = 'active',
}: ProjectCardProps) {
  const statusConfig = {
    active: { label: 'ACTIVE', color: 'text-cyber-green', dot: 'bg-cyber-green', border: 'border-cyber-green/30' },
    archived: { label: 'ARCHIVED', color: 'text-cyber-gray', dot: 'bg-cyber-gray', border: 'border-cyber-gray/30' },
    wip: { label: 'WIP', color: 'text-cyber-orange', dot: 'bg-cyber-orange', border: 'border-cyber-orange/30' },
  }

  const s = statusConfig[status]

  const CardContent = (
    <div className="group relative h-full">
      <div className="relative h-full rounded-xl overflow-hidden transition-all duration-500 group-hover:translate-y-[-4px]"
        style={{
          background: 'rgba(10, 22, 40, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 240, 255, 0.1)',
        }}
      >
        {/* Top edge glow */}
        <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Image or placeholder */}
        <div className="relative h-40 overflow-hidden" style={{ background: 'rgba(5, 10, 21, 0.8)' }}>
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Code2 className="w-12 h-12 text-cyber-cyan/20" />
              <div className="absolute inset-0 grid-bg opacity-30" />
            </div>
          )}

          {/* Hover overlay with links */}
          <div className="absolute inset-0 bg-cyber-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-cyber-dark/80 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-black transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {demo && (
              <a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-cyber-dark/80 border border-cyber-pink/30 text-cyber-pink hover:bg-cyber-pink hover:text-cyber-black transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Status badge */}
          <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium ${s.color} ${s.border} border`}
            style={{ background: 'rgba(5, 10, 21, 0.8)', backdropFilter: 'blur(4px)' }}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
            {s.label}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display text-lg font-bold text-cyber-white group-hover:text-cyber-cyan transition-colors duration-300 mb-2">
            {title}
          </h3>

          <p className="text-cyber-gray text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="cyber-tag text-[10px] py-0.5 px-2">
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="text-cyber-gray text-xs font-mono">+{tags.length - 4}</span>
            )}
          </div>

          {/* Stats */}
          {(stars !== undefined || forks !== undefined) && (
            <div className="flex items-center gap-4 pt-3 border-t border-cyber-cyan/10 text-sm font-mono">
              {stars !== undefined && (
                <span className="flex items-center gap-1.5 text-cyber-yellow">
                  <Star className="w-3.5 h-3.5" />
                  {stars}
                </span>
              )}
              {forks !== undefined && (
                <span className="flex items-center gap-1.5 text-cyber-cyan">
                  <GitFork className="w-3.5 h-3.5" />
                  {forks}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (slug) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Link href={`/projects/${slug}`}>{CardContent}</Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {CardContent}
    </motion.div>
  )
}
