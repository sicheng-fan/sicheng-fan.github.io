import { getAllPostsBilingual } from '@/lib/mdx'
import { HomePageClient } from '@/components/HomePageClient'

export default function HomePage() {
  // 在服务端获取两种语言的博客数据
  const { zh: zhPosts, en: enPosts } = getAllPostsBilingual()
  
  return <HomePageClient zhPosts={zhPosts} enPosts={enPosts} />
}
