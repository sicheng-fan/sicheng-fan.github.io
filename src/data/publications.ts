export interface Publication {
  id: string
  title: string
  titleZh: string
  authors: string[]
  venue: string
  venueShort: string
  year: number
  arxivId: string
  arxivUrl: string
  abstract: string
  abstractZh: string
  tags: string[]
  github?: string
  website?: string
  featured: boolean
  venueColor: string
  venueBg: string
}

export const publications: Publication[] = [
  {
    id: 'webchain',
    title: 'WebChain: A Large-Scale Human-Annotated Dataset of Real-World Web Interaction Traces',
    titleZh: 'WebChain：大规模人工标注真实网页交互轨迹数据集',
    authors: ['Sicheng Fan', 'Rui Wan', 'Yifei Leng', 'Gaoning Liang', 'Li Ling', 'Yanyi Shang', 'Dehan Kong'],
    venue: 'IEEE/CVF Conference on Computer Vision and Pattern Recognition',
    venueShort: 'CVPR 2026',
    year: 2026,
    arxivId: '2603.05295',
    arxivUrl: 'https://arxiv.org/abs/2603.05295',
    abstract:
      'We present WebChain, the largest open-source dataset of human-annotated trajectories on real-world websites, comprising 31,725 trajectories with 318,000 steps total. WebChain introduces triple alignment of visual, structural, and action data for multi-modal supervision, and separates spatial grounding from planning tasks in its training methodology. Experiments demonstrate improved performance on WebChainBench and other GUI evaluation benchmarks, supporting the development of next-generation web agents.',
    abstractZh:
      '我们提出 WebChain，迄今为止最大的真实网站人工标注轨迹开源数据集，包含 31,725 条轨迹和 318,000 个步骤。WebChain 引入视觉、结构和动作数据的三重对齐用于多模态监督，并在训练方法论中将空间定位与规划任务分离。实验表明在 WebChainBench 和其他 GUI 评估基准上性能显著提升，为下一代网页智能体的开发提供支持。',
    tags: ['GUI Agent', 'Dataset', 'Web Agent', 'Multi-modal'],
    github: 'https://github.com/franskey-0112/WebChain',
    featured: true,
    venueColor: '#dc2626',
    venueBg: '#fef2f2',
  },
  {
    id: 'webfactory',
    title: 'WebFactory: Automated Compression of Foundational Language Intelligence into Grounded Web Agents',
    titleZh: 'WebFactory：自动化压缩基础语言智能为落地网页智能体',
    authors: [
      'Sicheng Fan',
      'Qingyun Shi',
      'Shengze Xu',
      'Shengbo Cai',
      'Tieyong Zeng',
      'Li Ling',
      'Yanyi Shang',
      'Dehan Kong',
    ],
    venue: 'International Conference on Learning Representations',
    venueShort: 'ICLR 2026',
    year: 2026,
    arxivId: '2603.05044',
    arxivUrl: 'https://arxiv.org/abs/2603.05044',
    abstract:
      'We propose WebFactory, an automated reinforcement learning pipeline for training GUI web agents without requiring unsafe live web interactions or expensive human-annotated datasets. WebFactory automates environment synthesis, task generation, LLM trajectory collection, decomposed reward RL, and agent evaluation. Agents trained on only 10 synthetic websites match the performance of agents trained on significantly larger human-annotated datasets, demonstrating the efficacy of the proposed "embodiment potential" framework.',
    abstractZh:
      '我们提出 WebFactory，一种自动化强化学习流程，无需不安全的实时网络交互或昂贵的人工标注数据集即可训练 GUI 网页智能体。WebFactory 自动化环境合成、任务生成、LLM 轨迹收集、分解奖励 RL 和智能体评估。仅在 10 个合成网站上训练的智能体与在更大规模人工标注数据集上训练的智能体性能相当，验证了所提出"具身潜力"框架的有效性。',
    tags: ['GUI Agent', 'Reinforcement Learning', 'LLM', 'Synthetic Data'],
    github: 'https://github.com/franskey-0112/WebFactory',
    featured: true,
    venueColor: '#7c3aed',
    venueBg: '#f5f3ff',
  },
]

export function generateBibtex(pub: Publication): string {
  const authorStr = pub.authors
    .map((a) => {
      const parts = a.trim().split(' ')
      return `${parts[parts.length - 1]}, ${parts.slice(0, -1).join(' ')}`
    })
    .join(' and ')

  return `@inproceedings{${pub.id}${pub.year},
  title     = {${pub.title}},
  author    = {${authorStr}},
  booktitle = {${pub.venue}},
  year      = {${pub.year}},
  url       = {${pub.arxivUrl}},
}`
}
