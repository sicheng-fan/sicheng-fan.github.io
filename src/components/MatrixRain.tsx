'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
}

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const colors = [
      'rgba(0, 240, 255,',   // cyan
      'rgba(255, 45, 117,',  // pink
      'rgba(57, 255, 20,',   // green
    ]

    function initParticles() {
      const count = Math.min(Math.floor((canvas!.width * canvas!.height) / 15000), 120)
      particlesRef.current = []
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.2,
        })
      }
    }

    function draw() {
      ctx!.fillStyle = 'rgba(5, 10, 21, 0.15)'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      const particles = particlesRef.current
      const mouse = mouseRef.current
      const connectionDist = 150

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Mouse interaction
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.02
          p.vx -= dx * force
          p.vy -= dy * force
        }

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Damping
        p.vx *= 0.99
        p.vy *= 0.99

        // Wrap around edges
        if (p.x < 0) p.x = canvas!.width
        if (p.x > canvas!.width) p.x = 0
        if (p.y < 0) p.y = canvas!.height
        if (p.y > canvas!.height) p.y = 0

        // Draw particle
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `${p.color} ${p.alpha})`
        ctx!.fill()

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const cdx = p.x - p2.x
          const cdy = p.y - p2.y
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy)

          if (cdist < connectionDist) {
            const lineAlpha = (1 - cdist / connectionDist) * 0.15
            ctx!.beginPath()
            ctx!.moveTo(p.x, p.y)
            ctx!.lineTo(p2.x, p2.y)
            ctx!.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    resizeCanvas()
    draw()

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ opacity: 0.6 }}
    />
  )
}
