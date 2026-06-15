/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 赛博朋克/数码风格配色 - 无紫色无渐变
        cyber: {
          black: '#0a0a0a',
          dark: '#0d1117',
          darker: '#010409',
          green: '#00ff9f',
          'green-dim': '#00cc7f',
          cyan: '#00d4ff',
          'cyan-dim': '#00a8cc',
          orange: '#ff6b35',
          'orange-dim': '#cc5529',
          yellow: '#ffd93d',
          'yellow-dim': '#ccad31',
          red: '#ff3e3e',
          'red-dim': '#cc3131',
          white: '#e6edf3',
          gray: '#7d8590',
          'gray-dark': '#21262d',
          'gray-darker': '#161b22',
        },
      },
      fontFamily: {
        // 独特的字体组合
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
        body: ['Space Grotesk', 'system-ui', 'sans-serif'],
        tech: ['Share Tech Mono', 'monospace'],
      },
      animation: {
        'matrix-fall': 'matrixFall 20s linear infinite',
        'glitch': 'glitch 1s infinite',
        'glitch-2': 'glitch2 1.5s infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 0.75s step-end infinite',
        'scan': 'scan 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'border-flow': 'borderFlow 3s linear infinite',
      },
      keyframes: {
        matrixFall: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        glitch2: {
          '0%, 100%': { opacity: 1, transform: 'translate(0)' },
          '10%': { opacity: 0.8, transform: 'translate(-3px, 0)' },
          '20%': { opacity: 1, transform: 'translate(3px, 0)' },
          '30%': { opacity: 0.8, transform: 'translate(0, -3px)' },
          '40%': { opacity: 1, transform: 'translate(0, 3px)' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        slideUp: {
          'from': { transform: 'translateY(20px)', opacity: 0 },
          'to': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          'from': { transform: 'translateY(-20px)', opacity: 0 },
          'to': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          'from': { opacity: 0 },
          'to': { opacity: 1 },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: 0 },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        rotateSlow: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        borderFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(rgba(0, 255, 159, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 159, 0.03) 1px, transparent 1px)
        `,
        'circuit-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2300ff9f' stroke-width='0.5' stroke-opacity='0.1'%3E%3Cpath d='M30 0v60M0 30h60M15 15h30v30H15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      boxShadow: {
        'cyber-green': '0 0 10px rgba(0, 255, 159, 0.5), 0 0 20px rgba(0, 255, 159, 0.3)',
        'cyber-cyan': '0 0 10px rgba(0, 212, 255, 0.5), 0 0 20px rgba(0, 212, 255, 0.3)',
        'cyber-orange': '0 0 10px rgba(255, 107, 53, 0.5), 0 0 20px rgba(255, 107, 53, 0.3)',
        'cyber-inset': 'inset 0 0 20px rgba(0, 255, 159, 0.1)',
        'terminal': '0 0 0 1px rgba(0, 255, 159, 0.3), 0 10px 40px -10px rgba(0, 0, 0, 0.8)',
      },
      typography: {
        cyber: {
          css: {
            '--tw-prose-body': '#e6edf3',
            '--tw-prose-headings': '#00ff9f',
            '--tw-prose-links': '#00d4ff',
            '--tw-prose-code': '#ff6b35',
            '--tw-prose-quotes': '#7d8590',
          },
        },
      },
    },
  },
  plugins: [],
}

