import 'server-only'
import 'server-only'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')
const projectsDirectory = path.join(process.cwd(), 'content/projects')

export type Language = 'zh' | 'en'

export interface PostMeta {
  slug: string
  title: string
  excerpt: string
  date: string
  readingTime: string
  tags: string[]
  featured?: boolean
  coverImage?: string
  author?: string
  // 新增：标记是否有对应语言版本
  hasZh?: boolean
  hasEn?: boolean
}

export interface ProjectMeta {
  slug: string
  title: string
  description: string
  tags: string[]
  github?: string
  demo?: string
  stars?: number
  forks?: number
  status: 'active' | 'archived' | 'wip'
  category: string
  coverImage?: string
}

// 计算阅读时间（支持中英文混合内容）
function calculateReadingTime(content: string): string {
  // 中文字符（每分钟约 300 字）
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
  const chineseReadingTime = chineseChars / 300

  // 英文单词（每分钟约 200 词）
  const englishWords = content.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(word => word.length > 0).length
  const englishReadingTime = englishWords / 200

  // 总阅读时间，至少 1 分钟
  const totalMinutes = Math.max(1, Math.ceil(chineseReadingTime + englishReadingTime))
  return `${totalMinutes} min`
}

// 从文件名中提取 slug 和语言
function parseFileName(fileName: string): { slug: string; lang: Language } {
  // 匹配 .en.mdx 或 .en.md 结尾的文件（英文版本）
  if (fileName.match(/\.en\.mdx?$/)) {
    const slug = fileName.replace(/\.en\.mdx?$/, '')
    return { slug, lang: 'en' }
  }
  // 中文版本（默认）
  const slug = fileName.replace(/\.mdx?$/, '')
  return { slug, lang: 'zh' }
}

// 获取文章文件路径
function getPostFilePath(slug: string, lang: Language): string | null {
  const extensions = ['.mdx', '.md']
  
  for (const ext of extensions) {
    // 尝试获取指定语言的文件
    const langPath = lang === 'en' 
      ? path.join(postsDirectory, `${slug}.en${ext}`)
      : path.join(postsDirectory, `${slug}${ext}`)
    
    if (fs.existsSync(langPath)) {
      return langPath
    }
  }
  
  return null
}

// 检查某个 slug 是否有对应语言版本
function hasLanguageVersion(slug: string, lang: Language): boolean {
  return getPostFilePath(slug, lang) !== null
}

// 获取所有博客文章（按语言）
export function getAllPosts(lang: Language = 'zh'): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const postMap = new Map<string, PostMeta>()

  // 首先收集所有文章的 slug
  const slugs = new Set<string>()
  fileNames
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))
    .forEach((fileName) => {
      const { slug } = parseFileName(fileName)
      slugs.add(slug)
    })

  // 为每个 slug 获取指定语言的版本
  slugs.forEach((slug) => {
    // 检查语言版本可用性
    const hasZh = hasLanguageVersion(slug, 'zh')
    const hasEn = hasLanguageVersion(slug, 'en')

    // 尝试获取请求语言的文件，如果不存在则回退
    let filePath = getPostFilePath(slug, lang)
    if (!filePath) {
      // 回退到另一语言
      filePath = getPostFilePath(slug, lang === 'zh' ? 'en' : 'zh')
    }

    if (filePath) {
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      postMap.set(slug, {
        slug,
        title: data.title || 'Untitled',
        excerpt: data.excerpt || '',
        date: data.date || new Date().toISOString().split('T')[0],
        readingTime: calculateReadingTime(content),
        tags: data.tags || [],
        featured: data.featured || false,
        coverImage: data.coverImage,
        author: data.author || 'Fan Sicheng',
        hasZh,
        hasEn,
      })
      }
    })

  // 转换为数组并按日期降序排序
  return Array.from(postMap.values()).sort((a, b) => (a.date > b.date ? -1 : 1))
}

// 获取两种语言的所有文章（用于服务端预取）
export function getAllPostsBilingual(): { zh: PostMeta[]; en: PostMeta[] } {
  return {
    zh: getAllPosts('zh'),
    en: getAllPosts('en'),
  }
}

// 获取单篇文章（按语言）
export function getPostBySlug(slug: string, lang: Language = 'zh') {
  // 尝试获取指定语言版本
  let filePath = getPostFilePath(slug, lang)
  let actualLang = lang

  // 如果指定语言不存在，尝试回退
  if (!filePath) {
    const fallbackLang = lang === 'zh' ? 'en' : 'zh'
    filePath = getPostFilePath(slug, fallbackLang)
    actualLang = fallbackLang
  }

  if (!filePath) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    lang: actualLang,
    hasZh: hasLanguageVersion(slug, 'zh'),
    hasEn: hasLanguageVersion(slug, 'en'),
    meta: {
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      date: data.date || new Date().toISOString().split('T')[0],
      readingTime: calculateReadingTime(content),
      tags: data.tags || [],
      featured: data.featured || false,
      coverImage: data.coverImage,
      author: data.author || 'Fan Sicheng',
    },
    content,
  }
}

// 获取单篇文章的双语版本（用于服务端预取）
export function getPostBySlugBilingual(slug: string) {
  const zhPost = getPostBySlug(slug, 'zh')
  const enPost = getPostBySlug(slug, 'en')
  
  return {
    zh: zhPost,
    en: enPost,
    // 如果两个语言都没有，返回 null
    exists: zhPost !== null || enPost !== null,
  }
}

// 获取所有标签（合并两种语言）
export function getAllTags(): string[] {
  const zhPosts = getAllPosts('zh')
  const enPosts = getAllPosts('en')
  const tags = new Set<string>()
  
  zhPosts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)))
  enPosts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)))
  
  return Array.from(tags).sort()
}

// 获取所有项目
export function getAllProjects(): ProjectMeta[] {
  if (!fs.existsSync(projectsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(projectsDirectory)
  const allProjects = fileNames
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '')
      const fullPath = path.join(projectsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        tags: data.tags || [],
        github: data.github,
        demo: data.demo,
        stars: data.stars,
        forks: data.forks,
        status: data.status || 'active',
        category: data.category || 'Other',
        coverImage: data.coverImage,
      }
    })

  return allProjects
}

// 获取单个项目
export function getProjectBySlug(slug: string) {
  const mdxPath = path.join(projectsDirectory, `${slug}.mdx`)
  const mdPath = path.join(projectsDirectory, `${slug}.md`)
  
  let fullPath = ''
  if (fs.existsSync(mdxPath)) {
    fullPath = mdxPath
  } else if (fs.existsSync(mdPath)) {
    fullPath = mdPath
  } else {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    meta: {
      title: data.title || 'Untitled',
      description: data.description || '',
      tags: data.tags || [],
      github: data.github,
      demo: data.demo,
      stars: data.stars,
      forks: data.forks,
      status: data.status || 'active',
      category: data.category || 'Other',
      coverImage: data.coverImage,
    },
    content,
  }
}
