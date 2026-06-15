'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'success' | 'info'
  content: string
  delay?: number
}

interface TerminalProps {
  lines: TerminalLine[]
  title?: string
  autoPlay?: boolean
  showCursor?: boolean
  className?: string
}

export function Terminal({
  lines,
  title = 'terminal',
  autoPlay = true,
  showCursor = true,
  className = '',
}: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!autoPlay || currentLineIndex >= lines.length) return

    const currentLine = lines[currentLineIndex]
    const delay = currentLine.delay || 50

    if (currentLine.type === 'command') {
      setIsTyping(true)
      let charIndex = 0

      const typeInterval = setInterval(() => {
        if (charIndex <= currentLine.content.length) {
          setCurrentText(currentLine.content.slice(0, charIndex))
          charIndex++
        } else {
          clearInterval(typeInterval)
          setIsTyping(false)
          setVisibleLines((prev) => [...prev, currentLine])
          setCurrentText('')
          setCurrentLineIndex((prev) => prev + 1)
        }
      }, delay)

      return () => clearInterval(typeInterval)
    } else {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => [...prev, currentLine])
        setCurrentLineIndex((prev) => prev + 1)
      }, 300)

      return () => clearTimeout(timeout)
    }
  }, [currentLineIndex, lines, autoPlay])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [visibleLines, currentText])

  const getLinePrefix = (type: string) => {
    switch (type) {
      case 'command':
        return <span className="text-cyber-cyan">❯</span>
      case 'error':
        return <span className="text-cyber-red">[ERROR]</span>
      case 'success':
        return <span className="text-cyber-green">[OK]</span>
      case 'info':
        return <span className="text-cyber-pink">[INFO]</span>
      default:
        return null
    }
  }

  const getLineColor = (type: string) => {
    switch (type) {
      case 'command':
        return 'text-cyber-white'
      case 'error':
        return 'text-cyber-red'
      case 'success':
        return 'text-cyber-green'
      case 'info':
        return 'text-cyber-pink'
      default:
        return 'text-cyber-gray'
    }
  }

  return (
    <div className={`terminal-window ${className}`}>
      <div className="terminal-header">
        <div className="terminal-dot red" />
        <div className="terminal-dot yellow" />
        <div className="terminal-dot green" />
        <span className="ml-4 font-mono text-sm text-cyber-gray">{title}</span>
      </div>
      <div
        ref={terminalRef}
        className="terminal-body max-h-[400px] overflow-y-auto"
      >
        {visibleLines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-2 ${getLineColor(line.type)}`}
          >
            {getLinePrefix(line.type)}
            <span className="whitespace-pre-wrap">{line.content}</span>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex gap-2 text-cyber-white">
            <span className="text-cyber-cyan">❯</span>
            <span>{currentText}</span>
            {showCursor && <span className="inline-block w-2 h-5 bg-cyber-cyan animate-blink" />}
          </div>
        )}

        {!isTyping && currentLineIndex >= lines.length && showCursor && (
          <div className="flex gap-2 text-cyber-white">
            <span className="text-cyber-cyan">❯</span>
            <span className="inline-block w-2 h-5 bg-cyber-cyan animate-blink" />
          </div>
        )}
      </div>
    </div>
  )
}
