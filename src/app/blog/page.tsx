import { getAllPostsBilingual, getAllTags } from '@/lib/mdx'
import { BlogPageClient } from '@/components/BlogPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Fan Sicheng',
  description: 'Research notes and essays on GUI agents, reinforcement learning, and AI, in Chinese and English.',
  alternates: { canonical: 'https://sicheng-fan.github.io/blog/' },
  openGraph: {
    title: 'Blog | Fan Sicheng',
    description: 'Research notes and essays in Chinese and English.',
    url: 'https://sicheng-fan.github.io/blog/',
  },
}

export default function BlogPage() {
  // 在服务端获取两种语言的博客数据
  const { zh: zhPosts, en: enPosts } = getAllPostsBilingual()
  const allTags = getAllTags()
  
  return (
    <BlogPageClient 
      zhPosts={zhPosts} 
      enPosts={enPosts} 
      allTags={allTags} 
    />
  )
}
