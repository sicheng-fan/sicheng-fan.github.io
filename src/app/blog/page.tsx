import { getAllPostsBilingual, getAllTags } from '@/lib/mdx'
import { BlogPageClient } from '@/components/BlogPageClient'

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
