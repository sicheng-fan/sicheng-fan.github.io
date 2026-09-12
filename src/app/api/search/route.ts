import { corsJson } from '@/lib/cors'
import { getAllPostsBilingual } from '@/lib/mdx'
import { blogPostPath } from '@/lib/blog-display'

// 项目数据（与 projects/page.tsx 保持同步）
const allProjects = [
  {
    title: 'CafeMeet',
    description: '智能会面地点推荐系统。基于 AI 和地图数据分析，为多人会面智能推荐最佳咖啡馆，综合考量评分、距离、环境、交通等多维因素，让社交活动规划变得轻松愉快。',
    tags: ['Python', 'FastAPI', 'AI', 'Map', 'OpenManus'],
    github: 'https://github.com/sicheng-fan/CafeMeet',
    status: 'active' as const,
    category: 'AI & ML',
  },
]

export interface SearchResult {
  type: 'post' | 'project'
  title: string
  description: string
  url: string
  tags: string[]
  date?: string
  lang?: 'zh' | 'en'
}

export async function GET() {
  const results: SearchResult[] = []

  // 搜索博客文章
  try {
    const bilingual = getAllPostsBilingual()
    for (const lang of ['zh', 'en'] as const) {
      bilingual[lang].forEach((post) => {
        results.push({
          type: 'post',
          title: post.title,
          description: post.excerpt.slice(0, 100) + (post.excerpt.length > 100 ? '...' : ''),
          url: blogPostPath(post.slug, lang),
          tags: post.tags,
          date: post.date,
          lang,
        })
      })
    }
  } catch (error) {
    console.error('Error searching posts:', error)
  }

  // 搜索项目
  allProjects.forEach((project) => {
    results.push({
      type: 'project',
      title: project.title,
      description: project.description.slice(0, 100) + (project.description.length > 100 ? '...' : ''),
      url: project.github || '/projects',
      tags: [...project.tags, project.category],
    })
  })

  return corsJson({ results })
}
