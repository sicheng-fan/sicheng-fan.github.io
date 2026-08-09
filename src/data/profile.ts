export interface ProfileEntry {
  title: string
  organization: string
  period: string
  description: string
}

export const education: Record<'zh' | 'en', ProfileEntry[]> = {
  zh: [
    {
      title: '硕士研究生',
      organization: '复旦大学',
      period: '2024年9月 — 至今',
      description: '研究方向：Computer-Use Agent、强化学习',
    },
    {
      title: '计算机科学与技术学士',
      organization: '复旦大学',
      period: '2020年9月 — 2024年6月',
      description: '上海市优秀毕业生、复旦大学望道学者',
    },
  ],
  en: [
    {
      title: "Master's Student",
      organization: 'Fudan University',
      period: 'Sep 2024 — Present',
      description: 'Research: Computer-Use Agent and Reinforcement Learning',
    },
    {
      title: "B.S. in Computer Science and Technology",
      organization: 'Fudan University',
      period: 'Sep 2020 — Jun 2024',
      description: 'Outstanding Graduate of Shanghai and Wangdao Scholar at Fudan University',
    },
  ],
}

export const experience: Record<'zh' | 'en', ProfileEntry[]> = {
  zh: [
    {
      title: '算法研究员',
      organization: '阿里巴巴 Qwen 基础大模型组',
      period: '2026年6月 — 至今',
      description: '从事基础大模型与 Computer-Use Agent 方向研究',
    },
    {
      title: '技术负责人',
      organization: 'WebAgentLab',
      period: '2025年 — 至今',
      description: '负责社区技术方向，推动 GUI Agent 开源生态建设',
    },
    {
      title: 'AI Research Intern',
      organization: '美团 LongCat 基础大模型组',
      period: '2026年4月 — 2026年6月',
      description: '参与 Computer-Use Agent 与 EvoCUA-1.5 研究',
    },
    {
      title: 'GUI Agent 研究员',
      organization: 'iMeanAI',
      period: '2024年6月 — 2026年2月',
      description: '主导 WebChain 和 WebFactory 项目开发',
    },
  ],
  en: [
    {
      title: 'Algorithm Researcher',
      organization: 'Qwen Foundation Model Team, Alibaba',
      period: 'Jun 2026 — Present',
      description: 'Researching foundation models and Computer-Use Agents',
    },
    {
      title: 'Technical Lead',
      organization: 'WebAgentLab',
      period: '2025 — Present',
      description: 'Leading technical direction and advancing the open-source GUI agent ecosystem',
    },
    {
      title: 'AI Research Intern',
      organization: 'LongCat Foundation Model Team, Meituan',
      period: 'Apr 2026 — Jun 2026',
      description: 'Worked on Computer-Use Agents and EvoCUA-1.5',
    },
    {
      title: 'GUI Agent Researcher',
      organization: 'iMeanAI',
      period: 'Jun 2024 — Feb 2026',
      description: 'Led the development of WebChain and WebFactory',
    },
  ],
}
