'use client'

import { Github, Twitter, Linkedin, Mail, MapPin, GraduationCap, Briefcase } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { AffiliationLogo } from '@/components/academic/AffiliationLogo'

interface AcademicAboutClientProps {
  blogCount: number
}

export function AcademicAboutClient({ blogCount }: AcademicAboutClientProps) {
  const { language } = useLanguage()

  const content = {
    zh: {
      title: '关于我',
      bio: [
        '我是范思诚，复旦大学计算机科学与技术硕士在读，研究方向为 GUI Agent 与强化学习。同时担任 WebAgentLab 社区技术负责人，并于 2026 年 6 月加入阿里巴巴 Qwen 基础大模型组，担任实习研究员。',
        '我的研究聚焦于构建能够自主操作图形用户界面的智能体系统，利用视觉语言模型（VLM）实现跨平台的通用任务自动化。近期工作包括 WebChain（CVPR 2026，迄今最大规模网页交互轨迹数据集）和 WebFactory（ICLR 2026，自动化 GUI Agent 强化学习训练框架）。',
        '我积极参与开源社区，致力于通过分享研究成果和工具推动 GUI Agent 领域发展。欢迎合作与交流！',
      ],
      education: '教育经历',
      experience: '工作经历',
      research: '研究方向',
      skills: '技术技能',
      contact: '联系我',
    },
    en: {
      title: 'About Me',
      bio: [
        "I'm Sicheng Fan, a Master's student in Computer Science at Fudan University, working on GUI Agents and Reinforcement Learning. I also serve as the Technical Lead at WebAgentLab and joined the Qwen Foundation Model Team at Alibaba Group in June 2026 as a research intern.",
        'My research focuses on building autonomous agents capable of operating graphical user interfaces using Vision-Language Models (VLMs) for cross-platform task automation. Recent work includes WebChain (CVPR 2026, the largest web interaction trajectory dataset) and WebFactory (ICLR 2026, an automated RL training framework for GUI agents).',
        'I actively contribute to open source and aim to advance the GUI agent field through shared research and tools. Feel free to reach out for collaboration!',
      ],
      education: 'Education',
      experience: 'Experience',
      research: 'Research Areas',
      skills: 'Technical Skills',
      contact: 'Contact',
    },
  }

  const education = {
    zh: [
      {
        degree: '计算机科学与技术 硕士',
        school: '复旦大学',
        period: '2024年9月 — 至今',
        desc: '研究方向：GUI Agent、强化学习',
        logoSrc: '/logos/fudan.png',
        logoAlt: '复旦大学',
      },
      {
        degree: '计算机科学与技术 学士',
        school: '复旦大学',
        period: '2020年9月 — 2024年6月',
        desc: '本科毕业',
        logoSrc: '/logos/fudan.png',
        logoAlt: '复旦大学',
      },
    ],
    en: [
      {
        degree: 'M.S. in Computer Science and Technology',
        school: 'Fudan University',
        period: 'Sep 2024 — Present',
        desc: 'Research: GUI Agent, Reinforcement Learning',
        logoSrc: '/logos/fudan.png',
        logoAlt: 'Fudan University',
      },
      {
        degree: 'B.S. in Computer Science and Technology',
        school: 'Fudan University',
        period: 'Sep 2020 — Jun 2024',
        desc: 'Bachelor of Science',
        logoSrc: '/logos/fudan.png',
        logoAlt: 'Fudan University',
      },
    ],
  }

  const experience = {
    zh: [
      {
        title: '实习研究员',
        org: '阿里巴巴 · Qwen 基础大模型组',
        period: '2026年6月 — 至今',
        desc: '参与基础大模型与智能体方向研究，跟进 Qwen 系列模型能力建设。',
        logoSrc: '/logos/qwen.png',
        logoAlt: 'Qwen',
        logoClassName: 'h-10 w-24 rounded-xl',
      },
      {
        title: 'GUI Agent 研究员',
        org: 'iMeanAI',
        period: '2024年6月 — 至今',
        desc: '参与前沿 GUI Agent 研究，主导 WebChain 和 WebFactory 项目开发。',
      },
      {
        title: '技术负责人',
        org: 'WebAgentLab',
        period: '2025年 — 至今',
        desc: '负责社区技术方向，推动 GUI Agent 开源生态建设。',
      },
    ],
    en: [
      {
        title: 'Research Intern',
        org: 'Alibaba Group · Qwen Foundation Model Team',
        period: 'Jun 2026 — Present',
        desc: 'Working on foundation model and agent research, contributing to the Qwen model ecosystem.',
        logoSrc: '/logos/qwen.png',
        logoAlt: 'Qwen',
        logoClassName: 'h-10 w-24 rounded-xl',
      },
      {
        title: 'GUI Agent Researcher',
        org: 'iMeanAI',
        period: 'Jun 2024 — Present',
        desc: 'Conducting GUI agent research, leading WebChain and WebFactory projects.',
      },
      {
        title: 'Technical Lead',
        org: 'WebAgentLab',
        period: '2025 — Present',
        desc: 'Leading technical direction, building the open-source GUI agent ecosystem.',
      },
    ],
  }

  const researchAreas = {
    zh: [
      { name: 'GUI Agent', tags: ['VLM', 'Computer Use', 'Web Automation', 'Screen Understanding'] },
      { name: '强化学习', tags: ['PPO', 'RLHF', 'Reward Modeling', 'Policy Optimization'] },
      { name: '大模型训练与微调', tags: ['SFT', 'DPO', 'Alignment', 'Instruction Tuning'] },
      { name: 'World Model', tags: ['State Prediction', 'Planning', 'Simulation'] },
    ],
    en: [
      { name: 'GUI Agent', tags: ['VLM', 'Computer Use', 'Web Automation', 'Screen Understanding'] },
      { name: 'Reinforcement Learning', tags: ['PPO', 'RLHF', 'Reward Modeling', 'Policy Optimization'] },
      { name: 'LLM Training & Fine-tuning', tags: ['SFT', 'DPO', 'Alignment', 'Instruction Tuning'] },
      { name: 'World Model', tags: ['State Prediction', 'Planning', 'Simulation'] },
    ],
  }

  const skills = ['Python', 'C/C++', 'TypeScript', 'PyTorch', 'TensorFlow', 'React', 'Next.js', 'FastAPI', 'Git', 'Docker']

  const c = content[language]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">{c.title}</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            {/* Bio */}
            <section>
              <div className="space-y-4">
                {c.bio.map((para, i) => (
                  <p key={i} className="text-slate-700 leading-relaxed">{para}</p>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-5 pb-2 border-b border-slate-200 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-slate-400" />
                {c.education}
              </h2>
              <div className="space-y-4">
                {education[language].map((edu, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-1 bg-blue-200 rounded-full mt-1" />
                    <div className="min-w-0">
                      <div className="flex items-start gap-3">
                        {edu.logoSrc && (
                          <AffiliationLogo
                            src={edu.logoSrc}
                            alt={edu.logoAlt}
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-slate-900">{edu.degree}</h3>
                          <p className="text-slate-600 text-sm">{edu.school}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{edu.period}</p>
                          {edu.desc && <p className="text-slate-600 text-sm mt-1">{edu.desc}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-5 pb-2 border-b border-slate-200 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-400" />
                {c.experience}
              </h2>
              <div className="space-y-4">
                {experience[language].map((exp, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-1 bg-slate-200 rounded-full mt-1" />
                    <div className="min-w-0">
                      <div className="flex items-start gap-3">
                        {exp.logoSrc && (
                          <AffiliationLogo
                            src={exp.logoSrc}
                            alt={exp.logoAlt}
                            containerClassName={exp.logoClassName}
                            sizes="96px"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-slate-900">{exp.title}</h3>
                          <p className="text-slate-600 text-sm">{exp.org}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{exp.period}</p>
                          <p className="text-slate-600 text-sm mt-1">{exp.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Research Areas */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-5 pb-2 border-b border-slate-200">
                {c.research}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {researchAreas[language].map((area) => (
                  <div key={area.name} className="border border-slate-200 rounded-lg p-4 hover:border-blue-200 transition-colors">
                    <h3 className="font-medium text-slate-900 mb-2">{area.name}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {area.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            {/* Contact */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                {c.contact}
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{language === 'zh' ? '中国，上海' : 'Shanghai, China'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a href="mailto:sicheng_fan@foxmail.com" className="text-blue-600 hover:underline break-all">
                    sicheng_fan@foxmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a href="https://github.com/franskey-0112" target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline">
                    franskey-0112
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a href="https://x.com/fan_si_cheng" target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline">
                    @fan_si_cheng
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a href="https://linkedin.com/in/fansicheng" target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline">
                    fansicheng
                  </a>
                </div>
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                {c.skills}
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-sm border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Quick stats */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                {language === 'zh' ? '统计' : 'Stats'}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: language === 'zh' ? '论文' : 'Papers', value: '2' },
                  { label: language === 'zh' ? '顶会' : 'Top Venues', value: '2' },
                  { label: language === 'zh' ? '博客' : 'Blog Posts', value: String(blogCount) },
                  { label: language === 'zh' ? '编程年限' : 'Yrs Coding', value: '5+' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 bg-slate-50 rounded border border-slate-100">
                    <div className="text-xl font-bold text-blue-600">{stat.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
