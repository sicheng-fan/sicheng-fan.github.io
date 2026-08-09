'use client'

import { useTheme } from '@/lib/theme'
import { AcademicAboutClient } from '@/components/academic/AcademicAboutClient'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Github, Twitter, Linkedin, Mail, MapPin,
  ExternalLink, Coffee, Code2, Sparkles,
  Gamepad2, Book, Music, Camera
} from 'lucide-react'
import { Terminal } from '@/components/Terminal'
import { ResearchAreas } from '@/components/SkillBar'
import { SectionHeader } from '@/components/SectionHeader'
import { GlitchText } from '@/components/GlitchText'
import { useLanguage } from '@/lib/i18n'

// 社交链接
const socialLinks = [
  { icon: Github, href: 'https://github.com/sicheng-fan', label: 'GitHub' },
  { icon: Twitter, href: 'https://x.com/fan_si_cheng', label: 'X' },
  { icon: Linkedin, href: 'https://linkedin.com/in/fansicheng', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:sicheng_fan@foxmail.com', label: 'Email' },
]

// 兴趣爱好图标
const hobbyIcons = [Code2, Book, Gamepad2, Music, Camera, Coffee]

interface AboutPageClientProps {
  blogCount: number
}

export function AboutPageClient({ blogCount }: AboutPageClientProps) {
  const { theme } = useTheme()
  const { language, t } = useLanguage()

  if (theme === 'academic') {
    return <AcademicAboutClient blogCount={blogCount} />
  }

  // 个人信息
  const personalInfo = {
    name: 'Fan Sicheng',
    title: 'AI Engineer',
    location: t.about.location,
    email: 'sicheng_fan@foxmail.com',
    bio: t.about.bio,
  }

// 研究领域数据
  const researchAreas = t.about.research.areas.map((area, index) => ({
    ...area,
    tags: [
      ['Computer Use', 'Desktop Automation', 'Long-Horizon Tasks', 'VLA'],
      ['Browser Use', 'Web Navigation', 'Web Automation', 'Evaluation'],
      ['VLM', 'Visual Grounding', 'Action Modeling', 'Screen Understanding'],
      ['Online RL', 'Policy Optimization', 'Reward Modeling', 'RLHF'],
      ['Pre-training', 'SFT', 'Alignment', 'Instruction Tuning'],
    ][index],
    status: index < 4 ? 'active' as const : 'exploring' as const,
  }))

// 兴趣爱好
  const hobbies = t.about.hobbies.items.map((item, index) => ({
    ...item,
    icon: hobbyIcons[index],
  }))

// 终端内容
const terminalLines = [
  { type: 'command' as const, content: 'cat /etc/about.conf', delay: 60 },
  { type: 'output' as const, content: '[User Profile]' },
  { type: 'output' as const, content: 'name     = "Fan Sicheng"' },
  { type: 'output' as const, content: 'role     = "AI Engineer"' },
    { type: 'output' as const, content: `status   = "Open to opportunities"` },
  { type: 'command' as const, content: 'echo $PHILOSOPHY', delay: 60 },
  { type: 'success' as const, content: '"Code with passion, build with purpose."' },
]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <SectionHeader
          title={t.about.title}
          subtitle={t.about.subtitle}
        />

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left: Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="cyber-card">
              {/* Avatar */}
              <div className="flex items-start gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-lg border-2 border-cyber-green overflow-hidden">
                    <Image
                      src="/avatar.png"
                      alt="Fan Sicheng"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyber-green rounded-full border-2 border-cyber-dark" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-cyber-white mb-1">
                    <GlitchText text={personalInfo.name} />
                  </h2>
                  <p className="text-cyber-cyan font-mono mb-3">{personalInfo.title}</p>
                  <div className="flex items-center gap-2 text-cyber-gray text-sm">
                    <MapPin className="w-4 h-4" />
                    {personalInfo.location}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="text-cyber-gray leading-relaxed whitespace-pre-line mb-6">
                {personalInfo.bio}
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-cyber-dark border border-cyber-gray/30 rounded hover:border-cyber-green hover:text-cyber-green transition-all font-mono text-sm"
                    >
                      <Icon className="w-4 h-4" />
                      {social.label}
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Right: Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Terminal
              lines={terminalLines}
              title="about.sh"
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="cyber-card text-center py-4">
                <div className="text-2xl font-display font-bold text-cyber-green">{blogCount}+</div>
                <div className="text-xs font-mono text-cyber-gray">Blog Posts</div>
              </div>
              <div className="cyber-card text-center py-4">
                <div className="text-2xl font-display font-bold text-cyber-cyan">10+</div>
                <div className="text-xs font-mono text-cyber-gray">Projects</div>
              </div>
              <div className="cyber-card text-center py-4">
                <div className="text-2xl font-display font-bold text-cyber-orange">500+</div>
                <div className="text-xs font-mono text-cyber-gray">Cups of Coffee</div>
              </div>
              <div className="cyber-card text-center py-4">
                <div className="text-2xl font-display font-bold text-cyber-yellow">5+</div>
                <div className="text-xs font-mono text-cyber-gray">Years Coding</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Research Areas Section */}
        <section className="mb-20">
          <SectionHeader
            title={t.about.research.title}
            subtitle={t.about.research.subtitle}
          />
          <ResearchAreas areas={researchAreas} />
        </section>

        {/* Hobbies Section */}
        <section className="mb-20">
          <SectionHeader
            title={t.about.hobbies.title}
            subtitle={t.about.hobbies.subtitle}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {hobbies.map((hobby, index) => {
              const Icon = hobby.icon
              return (
                <motion.div
                  key={hobby.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="cyber-card text-center py-6 group"
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-cyber-green group-hover:text-cyber-cyan transition-colors" />
                  <div className="font-mono text-sm text-cyber-white mb-1">{hobby.label}</div>
                  <div className="text-xs text-cyber-gray">{hobby.desc}</div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Contact CTA */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="terminal-window"
          >
            <div className="terminal-header">
              <div className="terminal-dot red" />
              <div className="terminal-dot yellow" />
              <div className="terminal-dot green" />
              <span className="ml-4 font-mono text-sm text-cyber-gray">contact.sh</span>
            </div>
            <div className="p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-cyber-yellow" />
              <h3 className="font-display text-2xl font-bold text-cyber-white mb-4">
                {t.about.contact.title}
              </h3>
              <p className="text-cyber-gray max-w-md mx-auto mb-8">
                {t.about.contact.subtitle}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="cyber-button inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {t.about.contact.sendEmail}
                </a>
                <Link
                  href="/blog"
                  className="px-6 py-3 border border-cyber-cyan/50 text-cyber-cyan font-mono hover:bg-cyber-cyan/10 transition-all inline-flex items-center gap-2"
                >
                  {t.about.contact.readBlog}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
