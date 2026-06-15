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
        cyber: {
          black: '#050a15',
          dark: '#0a1628',
          darker: '#030810',
          surface: '#0f2040',
          cyan: '#00f0ff',
          'cyan-dim': '#0099aa',
          pink: '#ff2d75',
          'pink-dim': '#cc2460',
          green: '#39ff14',
          'green-dim': '#2dcc10',
          orange: '#ff8c00',
          yellow: '#ffd000',
          red: '#ff3e3e',
          white: '#e0f7ff',
          gray: '#4a6a8a',
          'gray-dark': '#1a2a40',
          'gray-darker': '#0d1a2d',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
        body: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glitch': 'glitch 1s infinite',
        'glitch-2': 'glitch2 1.5s infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 0.75s step-end infinite',
        'scan-sweep': 'scanSweep 3s ease-in-out infinite',
        'border-spin': 'borderSpin 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        'particle-float': 'particleFloat 8s ease-in-out infinite',
      },
      keyframes: {
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
        scanSweep: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateX(100%)', opacity: 0 },
        },
        borderSpin: {
          'from': { '--angle': '0deg' },
          'to': { '--angle': '360deg' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
        slideUp: {
          'from': { transform: 'translateY(20px)', opacity: 0 },
          'to': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          'from': { opacity: 0 },
          'to': { opacity: 1 },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        particleFloat: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(10px, -10px)' },
          '50%': { transform: 'translate(-5px, -20px)' },
          '75%': { transform: 'translate(-10px, -5px)' },
        },
      },
      boxShadow: {
        'cyber-cyan': '0 0 15px rgba(0, 240, 255, 0.4), 0 0 40px rgba(0, 240, 255, 0.1)',
        'cyber-pink': '0 0 15px rgba(255, 45, 117, 0.4), 0 0 40px rgba(255, 45, 117, 0.1)',
        'cyber-green': '0 0 15px rgba(57, 255, 20, 0.4), 0 0 40px rgba(57, 255, 20, 0.1)',
        'cyber-glow': '0 0 20px rgba(0, 240, 255, 0.15), 0 4px 30px rgba(0, 0, 0, 0.5)',
        'cyber-card': '0 4px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(0, 240, 255, 0.05)',
        'cyber-card-hover': '0 8px 50px rgba(0, 240, 255, 0.15), 0 0 0 1px rgba(0, 240, 255, 0.3)',
      },
      typography: {
        cyber: {
          css: {
            '--tw-prose-body': '#e0f7ff',
            '--tw-prose-headings': '#00f0ff',
            '--tw-prose-links': '#ff2d75',
            '--tw-prose-code': '#39ff14',
            '--tw-prose-quotes': '#4a6a8a',
          },
        },
      },
    },
  },
  plugins: [],
}
