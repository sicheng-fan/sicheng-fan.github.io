import { getAllPosts } from '@/lib/mdx'
import { AboutPageClient } from '@/components/AboutPageClient'

export default function AboutPage() {
  // 在服务端动态读取博客数量
  const allPosts = getAllPosts()
  
  return <AboutPageClient blogCount={allPosts.length} />
}
