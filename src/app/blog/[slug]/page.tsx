import { notFound } from 'next/navigation'
import { getPostBySlugBilingual, getAllPosts } from '@/lib/mdx'
import { BlogPostClient } from '@/components/BlogPostClient'
import type { Metadata } from 'next'

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const { zh, en } = getPostBySlugBilingual(params.slug)
  const post = en || zh
  if (!post) return { title: 'Post not found | Fan Sicheng' }
  const url = `https://sicheng-fan.github.io/blog/${params.slug}/`
  return {
    title: `${post.meta.title} | Fan Sicheng`,
    description: post.meta.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.meta.title,
      description: post.meta.excerpt,
      url,
      type: 'article',
      publishedTime: post.meta.date,
    },
  }
}

// 获取所有文章 slug 用于静态生成
export async function generateStaticParams() {
  const posts = getAllPosts('zh')
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // 获取两种语言的文章版本
  const { zh: zhPost, en: enPost, exists } = getPostBySlugBilingual(params.slug)

  if (!exists) {
    notFound()
  }

  return (
    <BlogPostClient 
      slug={params.slug}
      zhPost={zhPost}
      enPost={enPost}
    />
  )
}
