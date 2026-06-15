'use client'

import { useState, useEffect } from 'react'

interface GlitchTextProps {
  text: string
  className?: string
  enableHover?: boolean
}

export function GlitchText({ text, className = '', enableHover = true }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [displayText, setDisplayText] = useState(text)

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`αβγδεζηθ01'

  useEffect(() => {
    if (!isGlitching) {
      setDisplayText(text)
      return
    }

    let iteration = 0
    const originalLength = text.length

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) return text[index]
            if (char === ' ') return ' '
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          })
          .join('')
      )

      if (iteration >= originalLength) {
        clearInterval(interval)
        setIsGlitching(false)
      }

      iteration += 1 / 2
    }, 25)

    return () => clearInterval(interval)
  }, [isGlitching, text])

  useEffect(() => {
    const randomGlitch = () => {
      if (Math.random() > 0.6) {
        setIsGlitching(true)
      }
    }

    const interval = setInterval(randomGlitch, 4000)
    setTimeout(() => setIsGlitching(true), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className={`glitch-text ${className}`}
      data-text={text}
      onMouseEnter={() => enableHover && setIsGlitching(true)}
    >
      {displayText}
    </span>
  )
}
