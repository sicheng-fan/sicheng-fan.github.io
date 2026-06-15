'use client'

import { useEffect, useRef } from 'react'

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 字符集 - 使用各种符号和数字
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]|/\\+=_-*&^%$#@!?'
    const charArray = chars.split('')

    // 列设置
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    
    // 每列的 y 坐标
    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    // 每列的速度（不同列速度不同，更有层次感）
    const speeds: number[] = []
    for (let i = 0; i < columns; i++) {
      speeds[i] = 0.5 + Math.random() * 1
    }

    // 每列的颜色强度
    const intensities: number[] = []
    for (let i = 0; i < columns; i++) {
      intensities[i] = 0.3 + Math.random() * 0.7
    }

    // 绘制函数
    function draw() {
      // 半透明黑色覆盖，产生尾迹效果
      ctx!.fillStyle = 'rgba(10, 10, 10, 0.05)'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      ctx!.font = `${fontSize}px 'JetBrains Mono', monospace`

      for (let i = 0; i < drops.length; i++) {
        // 随机选择字符
        const char = charArray[Math.floor(Math.random() * charArray.length)]
        
        // 计算颜色 - 头部更亮
        const y = drops[i] * fontSize
        const intensity = intensities[i]
        
        // 头部字符（白色）
        if (Math.random() > 0.98) {
          ctx!.fillStyle = `rgba(255, 255, 255, ${intensity})`
        } else {
          // 主体字符（绿色，带变化）
          const green = Math.floor(200 + Math.random() * 55)
          ctx!.fillStyle = `rgba(0, ${green}, ${Math.floor(green * 0.6)}, ${intensity * 0.8})`
        }
        
        // 绘制字符
        ctx!.fillText(char, i * fontSize, y)

        // 重置到顶部
        if (y > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0
          intensities[i] = 0.3 + Math.random() * 0.7
        }

        // 向下移动
        drops[i] += speeds[i]
      }
    }

    // 动画循环
    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-20"
      style={{ filter: 'blur(0.5px)' }}
    />
  )
}

