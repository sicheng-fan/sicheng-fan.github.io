'use client'

import { useState, useEffect } from 'react'

interface TypeWriterProps {
  texts: readonly string[]
  speed?: number
  deleteSpeed?: number
  pauseTime?: number
  className?: string
  cursorClassName?: string
}

export function TypeWriter({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
  className = '',
  cursorClassName = '',
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseTime)
      return () => clearTimeout(pauseTimeout)
    }

    const currentText = texts[textIndex]
    
    if (isDeleting) {
      if (displayText === '') {
        setIsDeleting(false)
        setTextIndex((prev) => (prev + 1) % texts.length)
        return
      }
      
      const timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1))
      }, deleteSpeed)
      return () => clearTimeout(timeout)
    }

    if (displayText === currentText) {
      setIsPaused(true)
      return
    }

    const timeout = setTimeout(() => {
      setDisplayText(currentText.slice(0, displayText.length + 1))
    }, speed)
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, isPaused, textIndex, texts, speed, deleteSpeed, pauseTime])

  return (
    <span className={className}>
      {displayText}
      <span className={`typing-cursor ${cursorClassName}`} />
    </span>
  )
}

