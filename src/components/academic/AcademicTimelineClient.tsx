'use client'

import { useState } from 'react'
import { Briefcase, GraduationCap, Code, Award, Star, Filter } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

type EventType = 'work' | 'education' | 'project' | 'achievement' | 'milestone'

interface TimelineEvent {
  title: { zh: string; en: string }
  description: { zh: string; en: string }
  date: { zh: string; en: string }
  type: EventType
  organization?: string
  location?: string
  tags: string[]
  link?: string
}

const typeConfig: Record<EventType, { icon: typeof Briefcase; color: string; bg: string }> = {
  work:        { icon: Briefcase,      color: 'text-blue-600',   bg: 'bg-blue-100' },
  education:   { icon: GraduationCap,  color: 'text-violet-600', bg: 'bg-violet-100' },
  project:     { icon: Code,           color: 'text-emerald-600',bg: 'bg-emerald-100' },
  achievement: { icon: Award,          color: 'text-amber-600',  bg: 'bg-amber-100' },
  milestone:   { icon: Star,           color: 'text-slate-600',  bg: 'bg-slate-100' },
}

const timelineEvents: TimelineEvent[] = [
  {
    title: { zh: '加入美团 LongCat 基座大模型组', en: 'Joined Meituan LongCat Group' },
    description: {
      zh: '担任 AI Research Intern，负责 Computer-Use Agent 方向研究。',
      en: 'Serving as AI Research Intern, focusing on Computer-Use Agent research.',
    },
    date: { zh: '2026年4月', en: 'Apr 2026' },
    type: 'work',
    organization: '美团 / Meituan',
    tags: ['AI Research', 'Computer-Use Agent', 'LLM'],
  },
  {
    title: { zh: 'CVPR 2026 一作论文发表（WebChain）', en: 'CVPR 2026 First-Author Paper (WebChain)' },
    description: {
      zh: 'WebChain 被 CVPR 2026 接收，迄今最大开源人工标注网页交互轨迹数据集，包含 31,725 条轨迹。',
      en: 'WebChain accepted at CVPR 2026. The largest open-source human-annotated web interaction trajectory dataset with 31,725 trajectories.',
    },
    date: { zh: '2026年2月', en: 'Feb 2026' },
    type: 'achievement',
    tags: ['CVPR', 'First Author', 'GUI Agent', 'Dataset'],
    link: 'https://arxiv.org/abs/2603.05295',
  },
  {
    title: { zh: 'ICLR 2026 一作论文发表（WebFactory）', en: 'ICLR 2026 First-Author Paper (WebFactory)' },
    description: {
      zh: 'WebFactory 被 ICLR 2026 接收，自动化 GUI Agent 强化学习训练框架，无需昂贵人工标注数据集。',
      en: 'WebFactory accepted at ICLR 2026. Automated RL training pipeline for GUI agents without expensive human-annotated datasets.',
    },
    date: { zh: '2026年1月', en: 'Jan 2026' },
    type: 'achievement',
    tags: ['ICLR', 'First Author', 'GUI Agent', 'RL'],
    link: 'https://arxiv.org/abs/2603.05044',
  },
  {
    title: { zh: '个人学术主页上线', en: 'Personal Academic Website' },
    description: { zh: '搭建本学术主页，记录研究成果与学习历程。', en: 'Launched this academic website to document research and growth.' },
    date: { zh: '2025年12月', en: 'Dec 2025' },
    type: 'milestone',
    tags: ['Next.js', 'React'],
  },
  {
    title: { zh: '担任 WebAgentLab 技术负责人', en: 'Technical Lead at WebAgentLab' },
    description: { zh: '负责 WebAgentLab 社区技术方向，推动 GUI Agent 开源生态建设。', en: 'Leading technical direction at WebAgentLab community, building the GUI agent open-source ecosystem.' },
    date: { zh: '2025年', en: '2025' },
    type: 'work',
    organization: 'WebAgentLab',
    tags: ['GUI Agent', 'Open Source', 'Community'],
  },
  {
    title: { zh: 'WebChain 项目启动', en: 'WebChain Project Launch' },
    description: { zh: '开启 WebChain 数据集采集与标注工程，建立大规模网页交互轨迹数据基础。', en: 'Started WebChain dataset collection and annotation, building large-scale web interaction trajectory data.' },
    date: { zh: '2024年11月', en: 'Nov 2024' },
    type: 'project',
    tags: ['Dataset', 'GUI Agent', 'Open Source'],
    link: 'https://github.com/franskey-0112/WebChain',
  },
  {
    title: { zh: '入职 iMeanAI', en: 'Joined iMeanAI' },
    description: { zh: '加入 iMeanAI 团队，参与前沿 GUI Agent 研究，主导 WebChain 和 WebFactory 项目开发。', en: 'Joined iMeanAI team, conducting GUI agent research, leading WebChain and WebFactory projects.' },
    date: { zh: '2024年6月', en: 'Jun 2024' },
    type: 'work',
    organization: 'iMeanAI',
    tags: ['AI Agent', 'LLM', 'Research'],
  },
  {
    title: { zh: '复旦大学硕士入学', en: "Master's Enrollment at Fudan University" },
    description: { zh: '入读复旦大学计算机科学与技术硕士，研究方向为 GUI Agent 与强化学习。', en: "Enrolled in M.S. program in Computer Science at Fudan University, focusing on GUI Agents and RL." },
    date: { zh: '2024年9月', en: 'Sep 2024' },
    type: 'education',
    organization: '复旦大学 / Fudan University',
    location: '上海 / Shanghai',
    tags: ['Master\'s', 'GUI Agent', 'RL'],
  },
  {
    title: { zh: '复旦大学本科毕业', en: "Bachelor's Graduation from Fudan University" },
    description: { zh: '完成复旦大学计算机科学与技术本科学习，顺利毕业。', en: 'Completed B.S. in Computer Science and Technology at Fudan University.' },
    date: { zh: '2024年6月', en: 'Jun 2024' },
    type: 'education',
    organization: '复旦大学 / Fudan University',
    tags: ['B.S.', 'Graduation'],
  },
  {
    title: { zh: '开始多智能体强化学习研究', en: 'Started Multi-Agent RL Research' },
    description: { zh: '开始系统学习和研究多智能体强化学习，接触 MARL 相关论文与实现。', en: 'Began systematic study of Multi-Agent Reinforcement Learning, diving into MARL papers and implementations.' },
    date: { zh: '2023年9月', en: 'Sep 2023' },
    type: 'milestone',
    tags: ['RL', 'Multi-Agent', 'Research'],
  },
  {
    title: { zh: '学习 PyTorch & TensorFlow', en: 'Learned PyTorch & TensorFlow' },
    description: { zh: '系统学习深度学习框架，开始独立实现神经网络模型。', en: 'Systematically learned deep learning frameworks and began independently implementing neural network models.' },
    date: { zh: '2022年', en: '2022' },
    type: 'milestone',
    tags: ['PyTorch', 'TensorFlow', 'Deep Learning'],
  },
  {
    title: { zh: '敲下第一行 Python 代码', en: 'Wrote First Line of Python' },
    description: { zh: 'print("Hello, World!") — 编程之旅的起点。', en: 'print("Hello, World!") — The start of the coding journey.' },
    date: { zh: '2020年', en: '2020' },
    type: 'milestone',
    tags: ['Python', 'Beginner'],
  },
  {
    title: { zh: '复旦大学本科入学', en: 'Enrolled at Fudan University' },
    description: { zh: '踏入复旦校园，开始本科学习生涯。', en: 'Entered Fudan University, beginning the undergraduate journey.' },
    date: { zh: '2020年9月', en: 'Sep 2020' },
    type: 'education',
    organization: '复旦大学 / Fudan University',
    location: '上海 / Shanghai',
    tags: ['Undergraduate', 'CS'],
  },
]

const filterOptions: { value: 'all' | EventType; icon: typeof Filter; label: { zh: string; en: string } }[] = [
  { value: 'all', icon: Filter, label: { zh: '全部', en: 'All' } },
  { value: 'work', icon: Briefcase, label: { zh: '工作', en: 'Work' } },
  { value: 'education', icon: GraduationCap, label: { zh: '教育', en: 'Education' } },
  { value: 'project', icon: Code, label: { zh: '项目', en: 'Project' } },
  { value: 'achievement', icon: Award, label: { zh: '成就', en: 'Achievement' } },
  { value: 'milestone', icon: Star, label: { zh: '里程碑', en: 'Milestone' } },
]

export function AcademicTimelineClient() {
  const [selected, setSelected] = useState<'all' | EventType>('all')
  const { language } = useLanguage()

  const filtered = selected === 'all'
    ? timelineEvents
    : timelineEvents.filter((e) => e.type === selected)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {language === 'zh' ? '经历与成长' : 'Timeline'}
        </h1>
        <p className="text-slate-500 mb-8">
          {language === 'zh'
            ? '记录重要时刻，持续学习与探索。'
            : 'Documenting key milestones of continuous learning and exploration.'}
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {filterOptions.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setSelected(value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                selected === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label[language]}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />

          <div className="space-y-8">
            {filtered.map((event, i) => {
              const { icon: Icon, color, bg } = typeConfig[event.type]
              return (
                <div key={i} className="flex gap-5 group">
                  {/* Icon dot */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full ${bg} flex items-center justify-center z-10 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">
                        {event.link ? (
                          <a href={event.link} target="_blank" rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors">
                            {event.title[language]}
                          </a>
                        ) : (
                          event.title[language]
                        )}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">{event.date[language]}</span>
                    </div>

                    {(event.organization || event.location) && (
                      <p className="text-sm text-slate-500 mb-1">
                        {event.organization}
                        {event.organization && event.location && ' · '}
                        {event.location}
                      </p>
                    )}

                    {event.description[language] && (
                      <p className="text-sm text-slate-600 leading-relaxed mb-2">
                        {event.description[language]}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                      {event.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
