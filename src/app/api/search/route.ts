import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { corsJson } from '@/lib/cors'

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

interface PostMeta {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
}

// 获取所有博客文章（用于搜索）
function getPostsForSearch(): PostMeta[] {
  const postsDirectory = path.join(process.cwd(), 'content/blog')
  
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title || 'Untitled',
        excerpt: data.excerpt || '',
        date: data.date || new Date().toISOString().split('T')[0],
        tags: data.tags || [],
      }
    })

  return allPosts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export interface SearchResult {
  type: 'post' | 'project'
  title: string
  description: string
  url: string
  tags: string[]
  date?: string
}

export async function GET() {
  const results: SearchResult[] = []

  // 搜索博客文章
  try {
    const posts = getPostsForSearch()
    posts.forEach((post) => {
      results.push({
        type: 'post',
        title: post.title,
        description: post.excerpt.slice(0, 100) + (post.excerpt.length > 100 ? '...' : ''),
        url: `/blog/${post.slug}`,
        tags: post.tags,
        date: post.date,
      })
    })
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
