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
  const statusColors = {
    active: 'bg-cyber-green text-cyber-black',
    archived: 'bg-cyber-gray text-cyber-black',
    wip: 'bg-cyber-orange text-cyber-black',
  }

  const statusLabels = {
    active: 'ACTIVE',
    archived: 'ARCHIVED',
    wip: 'IN PROGRESS',
  }

  const CardContent = (
    <div className="group relative h-full">
      <div className="cyber-card h-full flex flex-col overflow-hidden">
        {/* Project Image or Placeholder */}
        <div className="relative h-48 bg-cyber-dark overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Code2 className="w-16 h-16 text-cyber-green/30" />
              {/* Grid pattern */}
              <div className="absolute inset-0 grid-bg opacity-50" />
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-cyber-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-cyber-dark border border-cyber-green/50 rounded hover:bg-cyber-green hover:text-cyber-black transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {demo && (
              <a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-cyber-dark border border-cyber-cyan/50 rounded hover:bg-cyber-cyan hover:text-cyber-black transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Status badge */}
          <div className={`absolute top-3 right-3 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider ${statusColors[status]}`}>
            {statusLabels[status]}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          <h3 className="font-display text-lg font-bold text-cyber-white group-hover:text-cyber-green transition-colors mb-2">
            {title}
          </h3>
          
          <p className="text-cyber-gray text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
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
            <div className="flex items-center gap-4 pt-4 border-t border-cyber-green/10 text-sm font-mono">
              {stars !== undefined && (
                <span className="flex items-center gap-1.5 text-cyber-yellow">
                  <Star className="w-4 h-4" />
                  {stars}
                </span>
              )}
              {forks !== undefined && (
                <span className="flex items-center gap-1.5 text-cyber-cyan">
                  <GitFork className="w-4 h-4" />
                  {forks}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom border animation */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
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

