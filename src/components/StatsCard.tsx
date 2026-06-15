'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon
  value: number
  label: string
  suffix?: string
  prefix?: string
  color?: 'green' | 'cyan' | 'orange' | 'yellow'
}

export function StatsCard({
  icon: Icon,
  value,
  label,
  suffix = '',
  prefix = '',
  color = 'green',
}: StatsCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [displayValue, setDisplayValue] = useState(0)

  const colorClasses = {
    green: 'text-cyber-green border-cyber-green/30 hover:border-cyber-green',
    cyan: 'text-cyber-cyan border-cyber-cyan/30 hover:border-cyber-cyan',
    orange: 'text-cyber-orange border-cyber-orange/30 hover:border-cyber-orange',
    yellow: 'text-cyber-yellow border-cyber-yellow/30 hover:border-cyber-yellow',
  }

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = value
    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      
      setDisplayValue(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`cyber-card text-center border ${colorClasses[color]} transition-all`}
    >
      <Icon className={`w-8 h-8 mx-auto mb-3 ${colorClasses[color].split(' ')[0]}`} />
      <div className={`font-display text-3xl font-bold mb-1 ${colorClasses[color].split(' ')[0]}`}>
        {prefix}{displayValue.toLocaleString()}{suffix}
      </div>
      <div className="text-cyber-gray font-mono text-sm uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  )
}

