import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import type { Root as MarkdownRoot } from 'mdast'
import type { Root as HtmlRoot, Element, Nodes } from 'hast'

export interface TocEntry {
  id: string
  text: string
  level: number
}

function visibleText(node: Nodes): string {
  if (node.type === 'text') return node.value
  return 'children' in node ? node.children.map(visibleText).join('') : ''
}

// Both themes consume the same HTML, compiled once on the server.
export function renderMarkdown(content: string, title: string) {
  const toc: TocEntry[] = []
  const normalize = (text: string) => text.replace(/<[^>]*>/g, '').replace(/\s+/g, '').normalize('NFKC')
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(() => (tree: MarkdownRoot) => {
      const first = tree.children[0]
      if (first?.type === 'heading' && first.depth === 1 && normalize(toString(first)) === normalize(title)) {
        tree.children.shift()
      }
      // The page header owns the only h1; preserve other body headings.
      visit(tree, 'heading', (node) => {
        if (node.depth === 1) node.depth = 2
      })
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeKatex)
    .use(rehypeSlug, { prefix: 'section-' })
    .use(() => (tree: HtmlRoot) => {
      visit(tree, 'element', (node: Element) => {
        if (/^h[23]$/.test(node.tagName)) {
          toc.push({ id: String(node.properties.id), text: visibleText(node), level: Number(node.tagName[1]) })
        }
        if (node.tagName === 'a' && /^https?:\/\//.test(String(node.properties.href))) {
          node.properties.target = '_blank'
          node.properties.rel = ['noopener', 'noreferrer']
        }
        if (node.tagName === 'table') node.properties.className = ['blog-table']
      })
    })
    .use(rehypeStringify)
    .processSync(content)

  return { html: String(file), toc }
}
