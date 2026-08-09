export interface ProjectData {
  title: string
  description: { zh: string; en: string }
  tags: string[]
  github: string
  paper?: string
  stars: number
  forks: number
  status: 'active' | 'wip' | 'archived'
  category: string
  featured: boolean
}

export const GITHUB_USERNAME = 'sicheng-fan'

export const projects: ProjectData[] = [
  {
    title: 'WebChain',
    description: {
      zh: 'WebChain 是迄今为止最大的开源人工标注真实网页交互轨迹数据集，包含 31,725 条轨迹和 318,000 个步骤，为 GUI Agent 研究提供高质量的数据基础。CVPR 2026 一作。',
      en: 'WebChain is the largest open-source dataset of human-annotated trajectories on real-world websites, comprising 31,725 trajectories with 318,000 steps. First-author paper at CVPR 2026.',
    },
    tags: ['Python', 'Dataset', 'GUI Agent', 'CVPR 2026'],
    github: `https://github.com/${GITHUB_USERNAME}/WebChain`,
    paper: 'https://arxiv.org/abs/2603.05295',
    stars: 17,
    forks: 0,
    status: 'active',
    category: 'Research',
    featured: true,
  },
  {
    title: 'WebFactory',
    description: {
      zh: 'WebFactory 是自动化强化学习训练流程，在无需不安全实时网络交互或昂贵人工标注的情况下训练 GUI 网页智能体。ICLR 2026 一作。',
      en: 'WebFactory is an automated RL training pipeline for GUI web agents, eliminating unsafe live web interactions and expensive human-annotated datasets. First-author paper at ICLR 2026.',
    },
    tags: ['Python', 'RL', 'GUI Agent', 'ICLR 2026'],
    github: `https://github.com/${GITHUB_USERNAME}/WebFactory`,
    paper: 'https://arxiv.org/abs/2603.05044',
    stars: 12,
    forks: 1,
    status: 'active',
    category: 'Research',
    featured: true,
  },
  {
    title: 'WebClone',
    description: {
      zh: 'Web Agent 评测环境。提供离线可控的网站克隆用于 AI Agent 可复现测试，支持批量数据生成与标准化评估流程。',
      en: 'Web Agent evaluation environment. Provides offline controllable website cloning for reproducible AI Agent testing, supporting batch data generation and standardized evaluation.',
    },
    tags: ['JavaScript', 'Web Agent', 'Evaluation'],
    github: `https://github.com/${GITHUB_USERNAME}/WebClone`,
    stars: 7,
    forks: 5,
    status: 'active',
    category: 'Tools',
    featured: false,
  },
  {
    title: 'CafeMeet',
    description: {
      zh: '智能会面地点推荐系统。基于 AI 和地图数据分析，为多人会面智能推荐最佳咖啡馆，综合考量评分、距离、环境、交通等多维因素，让社交活动规划变得轻松愉快。',
      en: 'Smart meeting spot recommendation system. Using AI and map data analysis to intelligently recommend the best cafés for group meetings, considering ratings, distance, ambiance, and transportation.',
    },
    tags: ['Python', 'FastAPI', 'AI', 'Map', 'OpenManus'],
    github: `https://github.com/${GITHUB_USERNAME}/CafeMeet`,
    stars: 21,
    forks: 5,
    status: 'active',
    category: 'AI & ML',
    featured: true,
  },
]

export function getRepoName(githubUrl: string): string {
  return githubUrl.split('/').pop() || ''
}
