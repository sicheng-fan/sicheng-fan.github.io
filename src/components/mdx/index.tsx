'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { ExternalLink, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

// 自定义图片组件 - 支持各种图片展示方式
interface ImageProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
  priority?: boolean
}

export function MDXImage({ src, alt, caption, width, height, priority }: ImageProps) {
  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-lg border border-cyber-green/20">
        <Image
          src={src}
          alt={alt}
          width={width || 800}
          height={height || 450}
          priority={priority}
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-cyber-gray font-mono">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// 视频组件 - 支持本地视频和嵌入
interface VideoProps {
  src?: string
  youtube?: string
  bilibili?: string
  title?: string
}

export function MDXVideo({ src, youtube, bilibili, title }: VideoProps) {
  if (youtube) {
    return (
      <div className="my-8">
        <div className="relative pb-[56.25%] overflow-hidden rounded-lg border border-cyber-green/20">
          <iframe
            src={`https://www.youtube.com/embed/${youtube}`}
            title={title || 'YouTube video'}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {title && (
          <p className="mt-2 text-center text-sm text-cyber-gray font-mono">{title}</p>
        )}
      </div>
    )
  }

  if (bilibili) {
    return (
      <div className="my-8">
        <div className="relative pb-[56.25%] overflow-hidden rounded-lg border border-cyber-green/20">
          <iframe
            src={`//player.bilibili.com/player.html?bvid=${bilibili}&high_quality=1`}
            title={title || 'Bilibili video'}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
          />
        </div>
        {title && (
          <p className="mt-2 text-center text-sm text-cyber-gray font-mono">{title}</p>
        )}
      </div>
    )
  }

  if (src) {
    return (
      <div className="my-8">
        <video
          src={src}
          controls
          className="w-full rounded-lg border border-cyber-green/20"
        >
          Your browser does not support the video tag.
        </video>
        {title && (
          <p className="mt-2 text-center text-sm text-cyber-gray font-mono">{title}</p>
        )}
      </div>
    )
  }

  return null
}

// 提示框组件
interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error'
  title?: string
  children: ReactNode
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const styles = {
    info: {
      bg: 'bg-cyber-cyan/5',
      border: 'border-cyber-cyan/30',
      icon: Info,
      iconColor: 'text-cyber-cyan',
      titleColor: 'text-cyber-cyan',
    },
    warning: {
      bg: 'bg-cyber-orange/5',
      border: 'border-cyber-orange/30',
      icon: AlertTriangle,
      iconColor: 'text-cyber-orange',
      titleColor: 'text-cyber-orange',
    },
    success: {
      bg: 'bg-cyber-green/5',
      border: 'border-cyber-green/30',
      icon: CheckCircle,
      iconColor: 'text-cyber-green',
      titleColor: 'text-cyber-green',
    },
    error: {
      bg: 'bg-cyber-red/5',
      border: 'border-cyber-red/30',
      icon: XCircle,
      iconColor: 'text-cyber-red',
      titleColor: 'text-cyber-red',
    },
  }

  const style = styles[type]
  const Icon = style.icon

  return (
    <div className={`my-6 p-4 rounded-lg border ${style.bg} ${style.border}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.iconColor}`} />
        <div className="flex-1">
          {title && (
            <h4 className={`font-display font-bold mb-1 ${style.titleColor}`}>
              {title}
            </h4>
          )}
          <div className="text-cyber-gray text-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}

// 代码块标题组件
interface CodeTitleProps {
  title: string
  language?: string
}

export function CodeTitle({ title, language }: CodeTitleProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-cyber-dark border border-b-0 border-cyber-green/20 rounded-t-lg">
      <span className="font-mono text-sm text-cyber-gray">{title}</span>
      {language && (
        <span className="text-xs font-mono text-cyber-green uppercase">{language}</span>
      )}
    </div>
  )
}

// 外部链接组件
interface ExternalLinkProps {
  href: string
  children: ReactNode
}

export function ExtLink({ href, children }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-cyber-cyan hover:text-cyber-green transition-colors"
    >
      {children}
      <ExternalLink className="w-3 h-3" />
    </a>
  )
}

// 内部链接组件
interface InternalLinkProps {
  href: string
  children: ReactNode
}

export function IntLink({ href, children }: InternalLinkProps) {
  return (
    <Link href={href} className="text-cyber-cyan hover:text-cyber-green transition-colors">
      {children}
    </Link>
  )
}

// 数据表格组件
interface TableProps {
  headers: string[]
  rows: string[][]
  caption?: string
}

export function DataTable({ headers, rows, caption }: TableProps) {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-mono text-sm font-bold text-cyber-green bg-cyber-green/10 border border-cyber-green/20"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-cyber-green/5 transition-colors">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-3 text-sm text-cyber-gray border border-cyber-green/10"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <p className="mt-2 text-center text-sm text-cyber-gray font-mono">{caption}</p>
      )}
    </div>
  )
}

// 步骤列表组件
interface StepProps {
  number: number
  title: string
  children: ReactNode
}

export function Step({ number, title, children }: StepProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-cyber-green/10 border-2 border-cyber-green font-display font-bold text-cyber-green">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="font-display font-bold text-cyber-white mb-2">{title}</h4>
        <div className="text-cyber-gray text-sm">{children}</div>
      </div>
    </div>
  )
}

// 文件树组件
interface FileTreeItem {
  name: string
  type: 'file' | 'folder'
  children?: FileTreeItem[]
}

interface FileTreeProps {
  items: FileTreeItem[]
}

function FileTreeNode({ item, depth = 0 }: { item: FileTreeItem; depth?: number }) {
  const indent = depth * 20

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1 font-mono text-sm"
        style={{ paddingLeft: `${indent}px` }}
      >
        <span className="text-cyber-gray">
          {item.type === 'folder' ? '📁' : '📄'}
        </span>
        <span className={item.type === 'folder' ? 'text-cyber-cyan' : 'text-cyber-gray'}>
          {item.name}
        </span>
      </div>
      {item.children?.map((child, i) => (
        <FileTreeNode key={i} item={child} depth={depth + 1} />
      ))}
    </div>
  )
}

export function FileTree({ items }: FileTreeProps) {
  return (
    <div className="my-6 p-4 bg-cyber-dark border border-cyber-green/20 rounded-lg">
      {items.map((item, i) => (
        <FileTreeNode key={i} item={item} />
      ))}
    </div>
  )
}

// 对比组件
interface CompareProps {
  before: ReactNode
  after: ReactNode
  beforeLabel?: string
  afterLabel?: string
}

export function Compare({ before, after, beforeLabel = 'Before', afterLabel = 'After' }: CompareProps) {
  return (
    <div className="my-8 grid md:grid-cols-2 gap-4">
      <div className="p-4 bg-cyber-red/5 border border-cyber-red/30 rounded-lg">
        <div className="font-mono text-xs text-cyber-red uppercase tracking-wider mb-3">
          ❌ {beforeLabel}
        </div>
        <div className="text-cyber-gray text-sm">{before}</div>
      </div>
      <div className="p-4 bg-cyber-green/5 border border-cyber-green/30 rounded-lg">
        <div className="font-mono text-xs text-cyber-green uppercase tracking-wider mb-3">
          ✅ {afterLabel}
        </div>
        <div className="text-cyber-gray text-sm">{after}</div>
      </div>
    </div>
  )
}

// 导出所有 MDX 组件
export const mdxComponents = {
  Image: MDXImage,
  Video: MDXVideo,
  Callout,
  CodeTitle,
  ExtLink,
  IntLink,
  DataTable,
  Step,
  FileTree,
  Compare,
}

