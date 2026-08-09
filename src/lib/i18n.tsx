'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export type Language = 'zh' | 'en'

// 翻译内容
const translations = {
  zh: {
    // Navigation
    nav: {
      home: 'HOME',
      blog: 'BLOG',
      projects: 'PROJECTS',
      timeline: 'TIMELINE',
      about: 'ABOUT',
      search: 'Search',
      searchPlaceholder: 'Search posts, projects, tags...',
      searchTip: 'Enter keywords to search blog posts and projects',
      found: 'Found',
      results: 'results',
      noResults: 'No results for',
      relatedResults: 'related results',
      post: 'Post',
      project: 'Project',
    },
    // Home page
    home: {
      systemOnline: 'SYSTEM_ONLINE',
      greeting: "Hello, I'm",
      roles: [
        'Technical Lead @ WebAgentLab',
        'Researcher @ Qwen, Alibaba',
        'Computer-Use Agent',
        'Reinforcement Learning',
      ],
      description: '复旦大学硕士在读，研究方向为 Computer-Use Agent 与强化学习。同时担任 WebAgentLab 社区技术负责人，阿里巴巴 Qwen 基模组研究员。',
      exploreBlog: '探索文章',
      viewProjects: '查看项目',
      scrollDown: 'SCROLL_DOWN',
      quickLinks: {
        blog: { label: 'Blog', desc: '技术文章与思考' },
        projects: { label: 'Projects', desc: '开源项目展示' },
        timeline: { label: 'Timeline', desc: '成长历程记录' },
        about: { label: 'About', desc: '关于我' },
      },
      stats: {
        title: 'BY THE NUMBERS',
        subtitle: '一些数字，记录成长的轨迹',
        blogPosts: 'Blog Posts',
        projects: 'Projects',
        coffee: 'Cups of Coffee',
        yearsCoding: 'Years Coding',
      },
      recentPosts: {
        title: 'RECENT POSTS',
        subtitle: '最新的技术文章与思考',
        viewAll: '查看全部',
        viewAllPosts: '查看全部文章',
      },
      featuredProjects: {
        title: 'FEATURED PROJECTS',
        subtitle: '开源项目与作品，正在建设中...',
        viewAll: '查看全部',
        viewAllProjects: '查看全部项目',
      },
      tech: {
        title: 'TECH & RESEARCH',
        subtitle: '技术栈与研究领域',
        languages: '// 编程语言 & 技术',
        research: '// 研究领域',
      },
      contact: {
        title: "Let's Connect",
        subtitle: '有项目想要讨论？或者只是想打个招呼？欢迎随时联系我！',
        sendEmail: '发送邮件',
        githubProfile: 'GitHub Profile',
      },
    },
    // About page
    about: {
      title: 'ABOUT ME',
      subtitle: '了解更多关于我的信息、技能和背景。',
      bio: `你好！我是范思诚，复旦大学硕士在读，研究方向为 GUI Agent 与强化学习。同时担任 WebAgentLab 社区技术负责人，阿里巴巴 Qwen 基模组研究员。致力于构建能够自主操作图形界面的智能体系统，研究成果发表于 CVPR、ICLR 等顶级会议。

参与开源社区，致力于通过分享研究成果和工具推动 GUI Agent 领域发展。欢迎合作与交流！`,
      location: '中国',
      research: {
        title: 'RESEARCH FOCUS',
        subtitle: '当前研究方向与探索领域。',
        areas: [
          {
            title: 'Computer-Use Agent',
            description: '构建能够通过视觉理解、键盘与鼠标自主完成长程桌面任务的通用智能体。',
          },
          {
            title: 'Web Agent',
            description: '研究网页环境中的自主导航、交互决策、任务执行与可验证评测。',
          },
          {
            title: 'GUI Agent',
            description: '研究基于视觉语言模型的界面感知、视觉定位与动作生成。',
          },
          {
            title: '强化学习',
            description: '探索强化学习在 Computer-Use Agent 决策中的应用，包括策略优化、奖励建模与在线学习。',
          },
          {
            title: '大模型训练与微调',
            description: '研究大规模语言模型的预训练、指令微调与对齐技术。',
          },
        ],
      },
      hobbies: {
        title: 'BEYOND CODE',
        subtitle: '工作之外，生活不只是写代码。',
        items: [
          { label: '编程', desc: '构建有趣的项目' },
          { label: '阅读', desc: '技术书籍和哲学书籍' },
          { label: '游戏', desc: '完全不会玩' },
          { label: '音乐', desc: '民谣和摇滚' },
          { label: '摄影', desc: '学习中...' },
          { label: '咖啡', desc: '一天两杯的爱好者' },
        ],
      },
      contact: {
        title: "Let's Build Something Amazing",
        subtitle: '有项目想要讨论？或者只是想打个招呼？欢迎随时联系我！',
        sendEmail: 'Send Email',
        readBlog: 'Read Blog',
      },
    },
    // Timeline page
    timeline: {
      title: 'TIMELINE',
      subtitle: '成长的轨迹，记录每一个重要的时刻，希望是一段持续学习和创造的旅程。',
      filters: {
        all: 'All',
        work: 'Work',
        education: 'Education',
        project: 'Project',
        achievement: 'Achievement',
        milestone: 'Milestone',
      },
      noItems: 'No items found',
      tryFilter: 'Try selecting a different filter',
      future: {
        title: 'To Be Continued...',
        description: '这个时间线将持续更新。每一天都是新的开始，每一行代码都是新的故事。',
      },
      events: {
        qwen38Release: {
          title: 'Qwen 3.8 发布',
          description: '参与 Qwen 3.8 的研发与发布。',
        },
        qwenCuaReport: {
          title: 'Qwen-CUA 技术报告发布',
          description: '发布原生 Computer-Use Agent 技术报告《Qwen-CUA: Native Computer Use for (almost) Everything》。',
        },
        evocuaReport: {
          title: 'EvoCUA-1.5 技术报告发布',
          description: '发布面向多轮 Computer-Use Agent 的在线强化学习技术报告 EvoCUA-1.5。',
        },
        qwenJoin: {
          title: '担任阿里巴巴 Qwen 基础大模型组算法研究员',
          description: '从事基础大模型与 Computer-Use Agent 方向研究。',
        },
        meituanJoin: {
          title: '加入美团 LongCat 基座大模型组',
          description: '参与 Computer-Use Agent 方向研究及 EvoCUA-1.5。',
        },
        iclrFirstAuthor: {
          title: 'ICLR 一作论文发表（WebFactory）',
          description: 'WebFactory 于 2026 年 1 月 5 日完成发表，聚焦自动化 GUI Agent 强化学习训练工厂。',
        },
        cvprFirstAuthor: {
          title: 'CVPR 一作论文发表（WebChain）',
          description: 'WebChain 于 2026 年 2 月 18 日完成发表，聚焦大规模真实网页交互轨迹数据集与训练范式。',
        },
        digitalSpace: {
          title: '搭建自己的数字空间',
          description: '拥有了属于自己的一片赛博空间，搭建了这个个人网站，开始记录技术探索与人生思考。',
        },
        webAgentLab: {
          title: '加入 WebAgentLab',
          description: 'WebAgentLab 社区负责人，专注于 GUI Agent 技术研究与开源项目开发。',
        },
        webChain: {
          title: 'WebChain 项目启动',
          description: '开启 WebChain 项目，建立迄今为止最大的开源人工标注 Web 端轨迹数据集，为 GUI Agent 研究提供高质量数据基础。',
        },
        imeanai: {
          title: '加入 iMeanAI',
          description: '正式加入 iMeanAI 团队，参与前沿技术研发。',
        },
        masterEnroll: {
          title: '复旦大学硕士入学',
          description: '继续在复旦攻读硕士学位，研究方向为 GUI Agent 与强化学习。',
        },
        bachelorGrad: {
          title: '复旦大学本科毕业',
          description: '非常美好的四年本科时光',
        },
        marl: {
          title: '开始多智能体强化学习研究',
          description: 'Multi-Agent RL 开始流行',
        },
        pytorch: {
          title: '开始学习 PyTorch 和 TensorFlow',
          description: '',
        },
        firstCode: {
          title: '敲下第一行 Python 代码',
          description: 'print("Hello, World!")',
        },
        bachelorEnroll: {
          title: '复旦大学本科入学',
          description: '踏入复旦校园，结束了痛苦的高中生活',
        },
        born: {
          title: '来到这个世界',
          description: '魔童降世',
        },
      },
    },
    // Projects page
    projects: {
      title: 'PROJECTS',
      subtitle: '开源项目与作品展示。正在建设中...',
      stats: {
        projects: 'Projects',
        stars: 'Stars',
        forks: 'Forks',
        active: 'Active',
      },
      search: 'Search projects by name, description or tags...',
      status: 'Status:',
      showing: 'Showing',
      of: 'of',
      noProjects: 'No projects found',
      tryAdjust: 'Try adjusting your search or filters',
      github: {
        title: 'More on GitHub',
        description: '探索更多开源项目、贡献和活动记录',
        viewProfile: 'View GitHub Profile',
      },
      items: {
        cafemeet: {
          title: 'CafeMeet',
          description: '智能会面地点推荐系统。基于 AI 和地图数据分析，为多人会面智能推荐最佳咖啡馆，综合考量评分、距离、环境、交通等多维因素，让社交活动规划变得轻松愉快。',
        },
      },
    },
    // Footer
    footer: {
      description: '个人数字空间，记录技术探索、项目开发与生活感悟。在这里分享代码、思考与成长的点滴。',
      status: 'SYSTEM_STATUS:',
      online: 'ONLINE',
      quickLinks: 'Quick_Links',
      connect: 'Connect',
      copyright: 'All rights reserved',
      builtWith: 'Built with',
    },
    // Common
    common: {
      readMore: '阅读更多',
      viewAll: '查看全部',
      loading: '加载中...',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'HOME',
      blog: 'BLOG',
      projects: 'PROJECTS',
      timeline: 'TIMELINE',
      about: 'ABOUT',
      search: 'Search',
      searchPlaceholder: 'Search posts, projects, tags...',
      searchTip: 'Enter keywords to search blog posts and projects',
      found: 'Found',
      results: 'results',
      noResults: 'No results for',
      relatedResults: 'related results',
      post: 'Post',
      project: 'Project',
    },
    // Home page
    home: {
      systemOnline: 'SYSTEM_ONLINE',
      greeting: "Hello, I'm",
      roles: [
        'Technical Lead @ WebAgentLab',
        'Researcher @ Qwen, Alibaba',
        'Computer-Use Agent',
        'Reinforcement Learning',
      ],
      description: "Master's student at Fudan University, researching Computer-Use Agents and Reinforcement Learning. Technical Lead at WebAgentLab and Researcher at Qwen, Alibaba.",
      exploreBlog: 'Explore Blog',
      viewProjects: 'View Projects',
      scrollDown: 'SCROLL_DOWN',
      quickLinks: {
        blog: { label: 'Blog', desc: 'Tech articles & thoughts' },
        projects: { label: 'Projects', desc: 'Open source showcase' },
        timeline: { label: 'Timeline', desc: 'Growth journey' },
        about: { label: 'About', desc: 'About me' },
      },
      stats: {
        title: 'BY THE NUMBERS',
        subtitle: 'Some numbers tracking the journey of growth',
        blogPosts: 'Blog Posts',
        projects: 'Projects',
        coffee: 'Cups of Coffee',
        yearsCoding: 'Years Coding',
      },
      recentPosts: {
        title: 'RECENT POSTS',
        subtitle: 'Latest technical articles and thoughts',
        viewAll: 'View All',
        viewAllPosts: 'View All Posts',
      },
      featuredProjects: {
        title: 'FEATURED PROJECTS',
        subtitle: 'Open source projects and works, under construction...',
        viewAll: 'View All',
        viewAllProjects: 'View All Projects',
      },
      tech: {
        title: 'TECH & RESEARCH',
        subtitle: 'Tech stack and research areas',
        languages: '// Languages & Tech',
        research: '// Research Areas',
      },
      contact: {
        title: "Let's Connect",
        subtitle: 'Have a project to discuss? Or just want to say hi? Feel free to reach out!',
        sendEmail: 'Send Email',
        githubProfile: 'GitHub Profile',
      },
    },
    // About page
    about: {
      title: 'ABOUT ME',
      subtitle: 'Learn more about me, my skills, and background.',
      bio: `Hi! I'm Sicheng Fan, a Master's student at Fudan University, researching GUI Agents and Reinforcement Learning. I serve as Technical Lead at WebAgentLab and Researcher at Qwen, Alibaba. I am dedicated to building intelligent agent systems capable of autonomously operating graphical interfaces, with research published at top-tier conferences including CVPR and ICLR.

I actively contribute to open source and aim to advance the GUI agent field through shared research and tools. Feel free to reach out for collaboration!`,
      location: 'China',
      research: {
        title: 'RESEARCH FOCUS',
        subtitle: 'Current research directions and exploration areas.',
        areas: [
          {
            title: 'Computer-Use Agent',
            description: 'Building general agents that use visual understanding, keyboards, and mice to complete long-horizon desktop tasks.',
          },
          {
            title: 'Web Agent',
            description: 'Researching autonomous web navigation, interactive decision-making, task execution, and verifiable evaluation.',
          },
          {
            title: 'GUI Agent',
            description: 'Researching interface perception, visual grounding, and action generation with vision-language models.',
          },
          {
            title: 'Reinforcement Learning',
            description: 'Exploring reinforcement learning for computer-use agent decision-making, including policy optimization, reward modeling, and online learning.',
          },
          {
            title: 'LLM Training & Fine-tuning',
            description: 'Researching pre-training, instruction tuning, and alignment techniques for large language models.',
          },
        ],
      },
      hobbies: {
        title: 'BEYOND CODE',
        subtitle: "Life isn't just about writing code.",
        items: [
          { label: 'Coding', desc: 'Building interesting projects' },
          { label: 'Reading', desc: 'Tech & philosophy books' },
          { label: 'Gaming', desc: "Not good at it" },
          { label: 'Music', desc: 'Folk and rock' },
          { label: 'Photography', desc: 'Learning...' },
          { label: 'Coffee', desc: 'Two cups a day lover' },
        ],
      },
      contact: {
        title: "Let's Build Something Amazing",
        subtitle: 'Have a project to discuss? Or just want to say hi? Feel free to reach out!',
        sendEmail: 'Send Email',
        readBlog: 'Read Blog',
      },
    },
    // Timeline page
    timeline: {
      title: 'TIMELINE',
      subtitle: 'Tracking my growth, recording every important moment. A journey of continuous learning and creating.',
      filters: {
        all: 'All',
        work: 'Work',
        education: 'Education',
        project: 'Project',
        achievement: 'Achievement',
        milestone: 'Milestone',
      },
      noItems: 'No items found',
      tryFilter: 'Try selecting a different filter',
      future: {
        title: 'To Be Continued...',
        description: 'This timeline will keep updating. Every day is a new beginning, every line of code is a new story.',
      },
      events: {
        qwen38Release: {
          title: 'Qwen 3.8 Released',
          description: 'Contributed to the development and release of Qwen 3.8.',
        },
        qwenCuaReport: {
          title: 'Qwen-CUA Technical Report Released',
          description: 'Released “Qwen-CUA: Native Computer Use for (almost) Everything,” a technical report on native computer-use agents.',
        },
        evocuaReport: {
          title: 'EvoCUA-1.5 Technical Report Released',
          description: 'Released EvoCUA-1.5, a technical report on online reinforcement learning for multi-turn computer-use agents.',
        },
        qwenJoin: {
          title: 'Algorithm Researcher in the Qwen Foundation Model Team at Alibaba',
          description: 'Researching foundation models and computer-use agents.',
        },
        meituanJoin: {
          title: 'Joined Meituan LongCat Group',
          description: 'Worked on computer-use agents and EvoCUA-1.5.',
        },
        iclrFirstAuthor: {
          title: 'ICLR First-Author Paper Published (WebFactory)',
          description: 'WebFactory was published on January 5, 2026 as first-author work, focusing on automated RL training pipelines for GUI agents.',
        },
        cvprFirstAuthor: {
          title: 'CVPR First-Author Paper Published (WebChain)',
          description: 'WebChain was published on February 18, 2026 as first-author work, focusing on large-scale real-world web interaction trajectories and training paradigms.',
        },
        digitalSpace: {
          title: 'Built My Digital Space',
          description: 'Created my own cyber space, built this personal website to document tech explorations and life reflections.',
        },
        webAgentLab: {
          title: 'Joined WebAgentLab',
          description: 'Community lead at WebAgentLab, focusing on GUI Agent research and open source development.',
        },
        webChain: {
          title: 'WebChain Project Launch',
          description: 'Started WebChain project, building the largest open-source human-annotated web trajectory dataset for GUI Agent research.',
        },
        imeanai: {
          title: 'Joined iMeanAI',
          description: 'Officially joined iMeanAI team, participating in cutting-edge technology R&D.',
        },
        masterEnroll: {
          title: "Master's Enrollment at Fudan",
          description: "Continuing Master's studies at Fudan, researching GUI Agent and Reinforcement Learning.",
        },
        bachelorGrad: {
          title: "Bachelor's Graduation from Fudan",
          description: 'Wonderful four years of undergraduate life.',
        },
        marl: {
          title: 'Started Multi-Agent RL Research',
          description: 'Multi-Agent RL gaining popularity.',
        },
        pytorch: {
          title: 'Started Learning PyTorch & TensorFlow',
          description: '',
        },
        firstCode: {
          title: 'Wrote First Line of Python',
          description: 'print("Hello, World!")',
        },
        bachelorEnroll: {
          title: 'Bachelor Enrollment at Fudan',
          description: 'Entered Fudan campus, ending the tough high school years.',
        },
        born: {
          title: 'Born into This World',
          description: 'The beginning',
        },
      },
    },
    // Projects page
    projects: {
      title: 'PROJECTS',
      subtitle: 'Open source projects and works showcase. Under construction...',
      stats: {
        projects: 'Projects',
        stars: 'Stars',
        forks: 'Forks',
        active: 'Active',
      },
      search: 'Search projects by name, description or tags...',
      status: 'Status:',
      showing: 'Showing',
      of: 'of',
      noProjects: 'No projects found',
      tryAdjust: 'Try adjusting your search or filters',
      github: {
        title: 'More on GitHub',
        description: 'Explore more open source projects, contributions, and activity',
        viewProfile: 'View GitHub Profile',
      },
      items: {
        cafemeet: {
          title: 'CafeMeet',
          description: 'Smart meeting spot recommendation system. Using AI and map data analysis to intelligently recommend the best cafés for group meetings, considering ratings, distance, ambiance, and transportation.',
        },
      },
    },
    // Footer
    footer: {
      description: 'Personal digital space documenting tech exploration, project development, and life reflections. Sharing code, thoughts, and growth here.',
      status: 'SYSTEM_STATUS:',
      online: 'ONLINE',
      quickLinks: 'Quick_Links',
      connect: 'Connect',
      copyright: 'All rights reserved',
      builtWith: 'Built with',
    },
    // Common
    common: {
      readMore: 'Read More',
      viewAll: 'View All',
      loading: 'Loading...',
    },
  },
}

// 定义翻译的基础类型（不使用 as const，使类型更灵活）
type TranslationsType = typeof translations
type TranslationType = TranslationsType[Language]

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: TranslationType
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    // 更新 html lang 属性
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'zh' ? 'en' : 'zh')
  }, [language, setLanguage])

  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// 导出翻译类型以便类型检查
export type { TranslationsType }
